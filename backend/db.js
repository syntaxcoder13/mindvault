import Database from 'better-sqlite3';

const db = new Database('./mindvault.db');
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS collections (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    userId TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    type TEXT,
    url TEXT,
    userId TEXT,
    title TEXT,
    content TEXT,
    imageUrl TEXT,
    tags TEXT,
    highlights TEXT,
    embedding TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    collectionId TEXT,
    FOREIGN KEY(collectionId) REFERENCES collections(id)
  );
`);

try {
  db.exec(`ALTER TABLE items ADD COLUMN userId TEXT;`);
} catch(e) {}

try {
  db.exec(`ALTER TABLE collections ADD COLUMN userId TEXT;`);
} catch(e) {}

try {
  db.exec(`ALTER TABLE items ADD COLUMN isPinned INTEGER DEFAULT 0;`);
} catch(e) {}

export default db;
