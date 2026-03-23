import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { Pin } from 'lucide-react';

const TYPE_ICONS = {
  article: '📄',
  video: '🎬',
  tweet: '🐦',
  pdf: '📕',
  image: '🖼️'
};

export default function ItemCard({ item }) {
  const navigate = useNavigate();
  const { togglePin } = useApi();
  const date = new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const handlePin = async (e) => {
    e.stopPropagation(); // prevent navigating to detail page
    try {
      await togglePin(item.id);
      window.location.reload(); // super easy refresh since state holds in Dashboard
    } catch(err) {
      console.error(err);
    }
  };

  const isPinned = item.isPinned === 1;

  return (
    <div 
      className="item-card brutal-border" 
      onClick={() => navigate(`/item/${item.id}`)}
      style={{ 
         display: 'flex', flexDirection: 'column', gap: '1rem', 
         position: 'relative',
         borderColor: isPinned ? 'var(--accent-color)' : 'var(--border-color)',
         boxShadow: isPinned ? '4px 4px 0 rgba(245, 166, 35, 0.15)' : 'none'
      }}
    >
      {isPinned ? (
         <div style={{ position: 'absolute', top: '-1px', left: '-1px', background: 'var(--accent-color)', color: 'var(--bg-color)', padding: '0.2rem', borderBottomRightRadius: '2px' }}>
           <Pin fill="currentColor" size={12} />
         </div>
      ) : null}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginLeft: isPinned ? '1.5rem' : '0' }}>
          <span style={{ fontSize: '1.2rem'}}>{TYPE_ICONS[item.type] || '📄'}</span>
          <span className="meta-text" style={{ color: 'var(--text-muted)' }}>{item.type}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {item.similarity && (
             <span className="meta-text" style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>
               {(item.similarity * 100).toFixed(0)}% MATCH
             </span>
          )}
          <span className="meta-text" style={{ color: 'var(--text-muted)'}}>{date}</span>
          <button 
             onClick={handlePin} 
             style={{ 
                color: isPinned ? 'var(--accent-color)' : 'var(--text-muted)', 
                opacity: isPinned ? 1 : 0.5, 
                transition: 'all 0.2s', 
                padding: '0.2rem',
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center'
             }} 
             onMouseEnter={e => e.currentTarget.style.opacity = 1} 
             onMouseLeave={e => e.currentTarget.style.opacity = isPinned ? 1 : 0.5}
          >
            <Pin size={16} />
          </button>
        </div>
      </div>

      <h3 style={{ fontSize: '1.25rem', lineHeight: 1.4, margin: '0.5rem 0' }}>{item.title}</h3>

      {item.content && (
        <p style={{ color: '#A0A0A0', fontSize: '0.9rem', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
          {item.content}
        </p>
      )}

      {item.tags && item.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: 'auto' }}>
          {item.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag-badge">#{tag}</span>
          ))}
          {item.tags.length > 3 && <span className="tag-badge">+{item.tags.length - 3}</span>}
        </div>
      )}
    </div>
  );
}
