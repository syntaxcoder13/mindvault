import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { clerkMiddleware, getAuth } from '@clerk/express';
import db from './db.js';
import { getEmbedding, cosineSimilarity } from './embeddings.js';
import { suggestTags } from './tagger.js';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

dotenv.config();

const app = express();
const allowOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL, // 💡 Add this in your Hosting Dashboard
  /^chrome-extension:\/\//
];

app.use(cors({
  origin: "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(clerkMiddleware());

// Middleware to protect all /api routes
app.use('/api', (req, res, next) => {
  const { userId } = getAuth(req);
  console.log(`[AUTH] Request to ${req.path}: userId=${userId}`);
  if (!userId) {
    console.error(`[AUTH] Unauthorized request to ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

const PORT = process.env.PORT || 3001;

// POST /api/items
app.post('/api/items', (req, res) => {
  const { userId } = getAuth(req);
  const { type, url, title, content, imageUrl, collectionId } = req.body;
  const initialTags = req.body.tags || [];

  const id = crypto.randomUUID();

  const stmt = db.prepare(`
    INSERT INTO items (id, userId, type, url, title, content, imageUrl, tags, highlights, embedding, collectionId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id, userId, type, url, title, content, imageUrl,
    JSON.stringify(initialTags), '[]', null, collectionId || null
  );

  // Async Process: Tagging and Embeddings
  processItemAsync(id, title, content, initialTags);

  res.json({ id, message: "Item saved. Processing tags and embeddings in background." });
});

// POST /api/extract
app.post('/api/extract', async (req, res) => {
  const { url } = req.body;
  console.log(`[EXTRACT] Request for URL: ${url}`);
  if (!url) return res.status(400).json({ error: "No URL provided" });

  try {
    const response = await fetch(url);
    const html = await response.text();
    const doc = new JSDOM(html, { url });
    const reader = new Readability(doc.window.document);
    const article = reader.parse();

    if (!article) return res.status(400).json({ error: "Could not read article content" });

    res.json({
      title: article.title || '',
      content: article.textContent ? article.textContent.trim().substring(0, 3000) : ''
    });
  } catch (err) {
    console.error("Extraction error:", err);
    res.status(500).json({ error: "Failed to extract metadata from URL" });
  }
});

async function processItemAsync(id, title, content, existingTags) {
  try {
    // 1. Suggest tags
    const suggested = await suggestTags(title, content);
    let allTags = [...new Set([...existingTags, ...suggested])];

    // 2. Generate embeddings
    const textToEmbed = `${title}. ${content} ${allTags.join(' ')}`;
    const embedding = await getEmbedding(textToEmbed);

    // 3. Update DB
    db.prepare(`UPDATE items SET tags = ?, embedding = ? WHERE id = ?`)
      .run(JSON.stringify(allTags), JSON.stringify(embedding), id);

  } catch (err) {
    console.error("Background task error for item", id, err);
  }
}

// GET /api/items
app.get('/api/items', (req, res) => {
  const { userId } = getAuth(req);
  const { q, tag } = req.query;
  const allItems = db.prepare(`SELECT * FROM items WHERE userId = ? ORDER BY isPinned DESC, createdAt DESC`).all(userId);

  const formattedItems = allItems.map(item => ({
    ...item,
    tags: JSON.parse(item.tags || '[]'),
    highlights: JSON.parse(item.highlights || '[]'),
    embedding: item.embedding ? JSON.parse(item.embedding) : null
  }));

  let results = formattedItems;

  if (tag) {
    results = results.filter(item => item.tags.includes(tag));
  }

  if (q && q.trim() !== '') {
    // Hybrid Search: Vector Embeddings + Exact Text Matching
    getEmbedding(q).then(queryEmbedding => {
      const lowerQ = q.toLowerCase();

      if (queryEmbedding) {
        results.forEach(i => {
          // Basic Text Match (Lexical) Heuristics
          let exactMatchScore = 0;
          if (i.title && i.title.toLowerCase().includes(lowerQ)) exactMatchScore += 0.35;
          if (i.content && i.content.toLowerCase().includes(lowerQ)) exactMatchScore += 0.15;
          const tagsList = Array.isArray(i.tags) ? i.tags.join(' ') : '';
          if (tagsList.toLowerCase().includes(lowerQ)) exactMatchScore += 0.25;

          if (i.embedding) {
            const vectorScore = cosineSimilarity(queryEmbedding, i.embedding);
            // Alpha blend: Hybrid Search equation
            let rawSimilarity = vectorScore + exactMatchScore;
            i.similarity = Math.min(0.99, rawSimilarity); // Cap at 99%
            i.isExactMatch = exactMatchScore > 0;
          } else {
            // Fallback if no embedding
            i.similarity = exactMatchScore > 0 ? Math.min(0.99, 0.4 + exactMatchScore) : 0;
            i.isExactMatch = exactMatchScore > 0;
          }
        });

        // Threshold drops to 0.35 to allow slightly weak semantic matches that have no exact keyword, 
        // OR anything that had an exact keyword match.
        results = results.sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
          .filter(r => r.similarity > 0.35 || r.isExactMatch);
      } else {
        // Absolute Fallback
        results = Object.values(results).filter(i => {
          const tagsList = Array.isArray(i.tags) ? i.tags.join(' ') : '';
          return i.title.toLowerCase().includes(lowerQ) ||
            (i.content && i.content.toLowerCase().includes(lowerQ)) ||
            tagsList.toLowerCase().includes(lowerQ);
        });
        results.forEach(i => i.similarity = 0.95); // Fake similarity
      }

      // strip embeddings from response to save bandwidth
      res.json(results.map(r => ({ ...r, embedding: undefined, isExactMatch: undefined })));
    }).catch(err => {
      res.status(500).json({ error: "Failed to perform semantic search" });
    });
  } else {
    res.json(results.map(r => ({ ...r, embedding: undefined })));
  }
});

// GET /api/items/:id/related
app.get('/api/items/:id/related', (req, res) => {
  const { userId } = getAuth(req);
  const id = req.params.id;
  const item = db.prepare(`SELECT * FROM items WHERE id = ? AND userId = ?`).get(id, userId);
  if (!item || !item.embedding) return res.json([]);

  const targetEmbedding = JSON.parse(item.embedding);
  const allItems = db.prepare(`SELECT * FROM items WHERE id != ? AND userId = ? AND embedding IS NOT NULL`).all(id, userId);

  let related = allItems.map(i => ({
    ...i,
    tags: JSON.parse(i.tags || '[]'),
    similarity: cosineSimilarity(targetEmbedding, JSON.parse(i.embedding))
  }));

  related.sort((a, b) => b.similarity - a.similarity);
  const top3 = related.slice(0, 3).map(r => {
    delete r.embedding;
    return r;
  });

  res.json(top3);
});

// GET /api/graphItems
app.get('/api/graphItems', (req, res) => {
  // used for Graph view
  const allItems = db.prepare(`SELECT * FROM items WHERE embedding IS NOT NULL`).all();
  const nodes = allItems.map(i => ({
    id: i.id,
    title: i.title,
    type: i.type,
    tags: JSON.parse(i.tags || '[]')
  }));
  res.json(nodes); // Edges can be calculated on frontend using full embeddings GET? Or calculate here.
});

// For Graph view we might also need all relations > 0.7
app.get('/api/graph', (req, res) => {
  const { userId } = getAuth(req);
  const allItems = db.prepare(`SELECT id, title, type, tags, embedding, substr(content, 1, 140) as excerpt, createdAt FROM items WHERE userId = ?`).all(userId);
  const nodes = [];
  const itemsWithEmbeddings = [];
  allItems.forEach(i => {
    nodes.push({
      id: i.id,
      title: i.title,
      type: i.type,
      tags: JSON.parse(i.tags || '[]'),
      excerpt: i.excerpt || '',
      createdAt: i.createdAt
    });
    if (i.embedding) {
      itemsWithEmbeddings.push({ id: i.id, embedding: JSON.parse(i.embedding) });
    }
  });

  let links = [];
  for (let i = 0; i < itemsWithEmbeddings.length; i++) {
    for (let j = i + 1; j < itemsWithEmbeddings.length; j++) {
      const sim = cosineSimilarity(itemsWithEmbeddings[i].embedding, itemsWithEmbeddings[j].embedding);
      if (sim > 0.7) {
        links.push({ source: itemsWithEmbeddings[i].id, target: itemsWithEmbeddings[j].id, value: sim });
      }
    }
  }

  res.json({ nodes, links });
});


// GET /api/resurface (3 random items > 14 days old. If none, any 3 random old ones)
app.get('/api/resurface', (req, res) => {
  const { userId } = getAuth(req);
  let oldItems = db.prepare(`SELECT * FROM items WHERE userId = ? AND createdAt <= datetime('now', '-14 days') ORDER BY RANDOM() LIMIT 3`).all(userId);
  if (oldItems.length < 3) {
    // fallback to random items if not enough old
    oldItems = db.prepare(`SELECT * FROM items WHERE userId = ? ORDER BY RANDOM() LIMIT 3`).all(userId);
  }

  res.json(oldItems.map(i => ({
    ...i,
    tags: JSON.parse(i.tags || '[]')
  })));
});

// GET /api/items/:id
app.get('/api/items/:id', (req, res) => {
  const { userId } = getAuth(req);
  const item = db.prepare(`SELECT * FROM items WHERE id = ? AND userId = ?`).get(req.params.id, userId);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({
    ...item,
    tags: JSON.parse(item.tags || '[]'),
    highlights: JSON.parse(item.highlights || '[]')
  });
});

// DELETE /api/items/:id
app.delete('/api/items/:id', (req, res) => {
  const { userId } = getAuth(req);
  const item = db.prepare(`SELECT * FROM items WHERE id = ? AND userId = ?`).get(req.params.id, userId);
  if (!item) return res.status(404).json({ error: "Not found" });

  db.prepare(`DELETE FROM items WHERE id = ? AND userId = ?`).run(req.params.id, userId);
  res.json({ success: true });
});

// PATCH /api/items/:id/highlights
app.patch('/api/items/:id/highlights', (req, res) => {
  const { userId } = getAuth(req);
  const { highlight } = req.body;
  const item = db.prepare(`SELECT highlights FROM items WHERE id = ? AND userId = ?`).get(req.params.id, userId);
  if (!item) return res.status(404).json({ error: "Not found" });

  const highlights = JSON.parse(item.highlights || '[]');
  highlights.push(highlight);

  db.prepare(`UPDATE items SET highlights = ? WHERE id = ? AND userId = ?`).run(JSON.stringify(highlights), req.params.id, userId);
  res.json({ highlights });
});


// PATCH /api/items/:id/pin
app.patch('/api/items/:id/pin', (req, res) => {
  const { userId } = getAuth(req);
  const item = db.prepare(`SELECT isPinned FROM items WHERE id = ? AND userId = ?`).get(req.params.id, userId);
  if (!item) return res.status(404).json({ error: "Not found" });
  const newStatus = item.isPinned ? 0 : 1;
  db.prepare(`UPDATE items SET isPinned = ? WHERE id = ? AND userId = ?`).run(newStatus, req.params.id, userId);
  res.json({ isPinned: newStatus });
});

// PUT /api/items/:id (Edit)
app.put('/api/items/:id', (req, res) => {
  const { userId } = getAuth(req);
  const id = req.params.id;
  const { title, content, type, url } = req.body;
  const initialTags = req.body.tags || [];

  const result = db.prepare(`UPDATE items SET title=?, content=?, type=?, url=?, tags=? WHERE id=? AND userId=?`)
    .run(title, content, type, url, JSON.stringify(initialTags), id, userId);

  if (result.changes > 0) {
    processItemAsync(id, title, content, initialTags);
  }

  res.json({ success: true, message: "Item updated" });
});

// POST /api/collections
app.post('/api/collections', (req, res) => {
  const { userId } = getAuth(req);
  const { name } = req.body;
  const id = crypto.randomUUID();
  db.prepare(`INSERT INTO collections (id, name, userId) VALUES (?, ?, ?)`).run(id, name, userId);
  res.json({ id, name });
});

// GET /api/collections
app.get('/api/collections', (req, res) => {
  const { userId } = getAuth(req);
  const collections = db.prepare(`SELECT * FROM collections WHERE userId = ? ORDER BY createdAt DESC`).all(userId);
  res.json(collections);
});

// POST /api/collections/:id/items
app.post('/api/collections/:id/items', (req, res) => {
  const { itemId } = req.body;
  const collectionId = req.params.id;
  db.prepare(`UPDATE items SET collectionId = ? WHERE id = ?`).run(collectionId, itemId);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
