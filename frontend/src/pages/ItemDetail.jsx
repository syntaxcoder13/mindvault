import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import ItemCard from '../components/ItemCard';
import EditModal from '../components/EditModal';
import { ExternalLink, Hash, Trash2, Edit3, MessageSquare, ChevronLeft, Calendar, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [highlightText, setHighlightText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { fetchItem, fetchRelated, addHighlight, deleteItem } = useApi();

  useEffect(() => {
    fetchItem(id).then(setItem).catch(console.error);
    fetchRelated(id).then(setRelated).catch(console.error);
    window.scrollTo(0,0);
  }, [id]);

  const handleAddHighlight = async (e) => {
    e.preventDefault();
    if (!highlightText.trim()) return;
    try {
      const res = await addHighlight(id, highlightText);
      setItem(prev => ({ ...prev, highlights: res.highlights }));
      setHighlightText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to permanently delete this knowledge?");
    if (confirm) {
      try {
        await deleteItem(id);
        navigate('/');
      } catch (err) {
        console.error(err);
        alert("Failed to delete.");
      }
    }
  };

  if (!item) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
       <Loader2 size={40} className="spin" color="var(--accent)" />
       <div className="meta-text">Accessing Vault...</div>
       <style>{`.spin { animation: rotate 1s linear infinite; } @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Back Link */}
      <button onClick={() => navigate(-1)} className="btn-outline" style={{ width: 'fit-content', border: 'none', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 1rem' }}>
        <ChevronLeft size={16} /> Back to Vault
      </button>

      <div className="detail-grid" style={{ gridTemplateColumns: '1fr 340px' }}>
        {/* Left: Content */}
        <article className="glass-card" style={{ padding: '3.5rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <span className="tag-badge" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.type}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <Calendar size={14} />
              {new Date(item.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
            </div>
          </div>
          
          <h1 style={{ fontSize: '3rem', marginBottom: '2rem', lineHeight: 1.1, fontWeight: 700, letterSpacing: '-0.03em' }}>
            {item.title}
          </h1>
          
          {item.url && (
            <a href={item.url} target="_blank" rel="noreferrer" className="btn-primary" style={{ width: 'fit-content', marginBottom: '3rem', borderRadius: '50px', padding: '0.8rem 1.5rem', textDecoration: 'none' }}>
              View Source <ExternalLink size={16} />
            </a>
          )}
          
          <div className="markdown-body" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8 }}>
            {item.content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {item.content}
              </ReactMarkdown>
            ) : (
              <div style={{ padding: '2rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No textual content was captured for this item.
              </div>
            )}
          </div>
        </article>

        {/* Right: Sidebar Metadata */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '20px' }}>
            <h3 className="meta-text" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              <Hash size={16} color="var(--accent)" /> TAGS
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {item.tags?.length === 0 && <span className="meta-text" style={{ fontSize: '0.7rem' }}>No tags assigned.</span>}
              {item.tags?.map(t => (
                <span key={t} className="tag-badge">#{t}</span>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '20px' }}>
            <h3 className="meta-text" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              <MessageSquare size={16} color="var(--accent)" /> HIGHLIGHTS
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {item.highlights?.length === 0 && <span className="meta-text" style={{ fontSize: '0.7rem' }}>No highlights saved.</span>}
              {item.highlights?.map((h, i) => (
                 <div key={i} style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(124, 58, 237, 0.05)', borderLeft: '3px solid var(--accent)', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                   "{h}"
                 </div>
              ))}
            </div>
            
            <form onSubmit={handleAddHighlight}>
              <textarea 
                placeholder="Capture a thought..." 
                rows="3" 
                value={highlightText}
                onChange={e => setHighlightText(e.target.value)}
                style={{ width: '100%', marginBottom: '0.75rem', fontSize: '0.85rem' }}
              />
              <button className="btn-primary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', justifyContent: 'center' }}>+ SAVE</button>
            </form>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setIsEditing(true)} className="btn-outline" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '8px', padding: '0.8rem' }}>
               <Edit3 size={16} /> Edit
            </button>
            <button onClick={handleDelete} className="btn-outline" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '8px', padding: '0.8rem', color: '#ff4444', borderColor: 'rgba(255, 68, 68, 0.2)' }}>
               <Trash2 size={16} /> Delete
            </button>
          </div>
        </aside>
      </div>

      {isEditing && <EditModal item={item} onClose={() => setIsEditing(false)} />}

      {/* Related items row */}
      <div style={{ marginTop: '2rem' }}>
        <h3 className="meta-text" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="var(--accent)" /> RELATED KNOWLEDGE
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {related.length === 0 ? (
            <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', width: '100%', gridColumn: '1 / -1', borderStyle: 'dashed' }}>
               No related items found yet.
            </div>
          ) : related.map(rel => (
            <ItemCard key={rel.id} item={rel} />
          ))}
        </div>
      </div>
    </div>
  );
}
