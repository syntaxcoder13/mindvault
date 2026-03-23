import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import ItemCard from '../components/ItemCard';
import EditModal from '../components/EditModal';
import { ExternalLink, Hash, Trash2, Edit3 } from 'lucide-react';
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

  if (!item) return <div className="loading" style={{ margin: '4rem auto', textAlign: 'center' }}>LOADING KNOWLEDGE...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      <div className="detail-grid">
        {/* Left: Content */}
        <article className="article-content">
          <div className="meta-text" style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
             <span style={{ color: 'var(--accent-color)' }}>{item.type}</span> 
             <span style={{ margin: '0 0.5rem' }}>/</span> 
             {new Date(item.createdAt).toLocaleString()}
          </div>
          
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.15, textWrap: 'balance' }}>
            {item.title}
          </h1>
          
          {item.url && (
            <a href={item.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-color)', marginBottom: '3rem', fontSize: '1.1rem', borderBottom: '1px solid transparent' }} onMouseEnter={e => e.target.style.borderBottomColor='var(--accent-color)'} onMouseLeave={e => e.target.style.borderBottomColor='transparent'}>
              View Original Source <ExternalLink size={16} />
            </a>
          )}
          
          <div className="markdown-body">
            {item.content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {item.content}
              </ReactMarkdown>
            ) : (
              <span style={{ opacity: 0.5, fontStyle: 'italic' }}>No content provided.</span>
            )}
          </div>
        </article>

        {/* Right: Metadata + Highlights */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div className="brutal-border" style={{ padding: '2rem', background: 'var(--bg-secondary)' }}>
            <h3 className="meta-text" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <Hash size={16} /> TAGS
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {item.tags?.length === 0 && <span className="meta-text" style={{ color: 'var(--text-muted)' }}>No tags generated.</span>}
              {item.tags?.map(t => (
                <span key={t} className="tag-badge">#{t}</span>
              ))}
            </div>
          </div>

          <div className="brutal-border" style={{ padding: '2rem', background: 'var(--bg-secondary)' }}>
            <h3 className="meta-text" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>HIGHLIGHTS</h3>
            
            <ul style={{ paddingLeft: '1rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {item.highlights?.length === 0 && <span className="meta-text" style={{ color: 'var(--text-muted)', marginLeft: '-1rem' }}>No highlights saved.</span>}
              {item.highlights?.map((h, i) => (
                 <li key={i} style={{ borderLeft: '2px solid var(--accent-color)', paddingLeft: '1.25rem', listStyle: 'none', marginLeft: '-1rem', color: '#E0E0E0', fontSize: '1.05rem', lineHeight: 1.6 }}>
                   "{h}"
                 </li>
              ))}
            </ul>
            
            <form onSubmit={handleAddHighlight}>
              <textarea 
                placeholder="Add new highlight or thought..." 
                rows="3" 
                value={highlightText}
                onChange={e => setHighlightText(e.target.value)}
                style={{ marginBottom: '1rem', background: 'var(--bg-color)' }}
              />
              <button className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>+ SAVE HIGHLIGHT</button>
            </form>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="brutal-border" style={{ flex: 1, padding: '1rem 0.5rem', background: '#0F1A0F', borderColor: '#1F3A1F', transition: 'background 0.2s', cursor: 'pointer', display: 'flex', justifyContent: 'center' }} onClick={() => setIsEditing(true)} onMouseEnter={e => e.currentTarget.style.background = '#1A2A1A'} onMouseLeave={e => e.currentTarget.style.background = '#0F1A0F'}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#5FE82A', fontSize: '0.95rem', fontWeight: 'bold' }}>
                <Edit3 size={16} /> EDIT
              </button>
            </div>
            <div className="brutal-border" style={{ flex: 1, padding: '1rem 0.5rem', background: '#150606', borderColor: '#4A0505', transition: 'background 0.2s', cursor: 'pointer', display: 'flex', justifyContent: 'center' }} onClick={handleDelete} onMouseEnter={e => e.currentTarget.style.background = '#260606'} onMouseLeave={e => e.currentTarget.style.background = '#150606'}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#E82A2A', fontSize: '0.95rem', fontWeight: 'bold' }}>
                <Trash2 size={16} /> DELETE
              </button>
            </div>
          </div>
        </aside>
      </div>

      {isEditing && <EditModal item={item} onClose={() => setIsEditing(false)} />}

      {/* Related items row */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
        <h3 className="meta-text" style={{ marginBottom: '2rem', fontSize: '1rem', letterSpacing: '0.1em' }}>RELATED KNOWLEDGE</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {related.length === 0 ? (
            <div className="brutal-border" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
               Embeddings calculating or no related items found.
            </div>
          ) : related.map(rel => (
            <ItemCard key={rel.id} item={rel} />
          ))}
        </div>
      </div>
    </div>
  );
}
