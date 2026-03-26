import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { Pin, ExternalLink } from 'lucide-react';

const TYPE_ICONS = {
  article: '📄',
  video: '🎬',
  tweet: '🐦',
  pdf: '📕',
  image: '🖼️',
  link: '🔗'
};

export default function ItemCard({ item }) {
  const navigate = useNavigate();
  const { togglePin } = useApi();
  const date = new Date(item.createdAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  const handlePin = async (e) => {
    e.stopPropagation();
    try {
      await togglePin(item.id);
      window.location.reload(); 
    } catch(err) {
      console.error(err);
    }
  };

  const isPinned = item.isPinned === 1;

  return (
    <div 
      className="item-card glass-card"
      onClick={() => navigate(`/item/${item.id}`)}
      style={{ 
         padding: '1.25rem',
         display: 'flex', 
         flexDirection: 'column', 
         gap: '1rem', 
         position: 'relative',
         borderLeft: isPinned ? '4px solid var(--accent)' : '1px solid var(--border)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <span style={{ fontSize: '1.2rem', padding: '0.4rem', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
            {TYPE_ICONS[item.type] || '📄'}
          </span>
          <span className="meta-text" style={{ fontSize: '0.65rem' }}>{item.type}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {item.similarity && (
             <span className="meta-text" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>
               {(item.similarity * 100).toFixed(0)}% MATCH
             </span>
          )}
          <span className="meta-text" style={{ fontSize: '0.65rem' }}>{date}</span>
          <button 
             onClick={handlePin} 
             style={{ 
                color: isPinned ? 'var(--accent)' : 'var(--text-muted)', 
                opacity: isPinned ? 1 : 0.6, 
                transition: 'all 0.2s', 
                padding: '0.3rem',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                border: 'none',
                display: 'flex',
                alignItems: 'center'
             }} 
          >
            <Pin size={14} fill={isPinned ? 'var(--accent)' : 'none'} />
          </button>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.4, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          {item.title}
        </h3>
        {item.content && (
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '0.85rem', 
            lineHeight: 1.5, 
            overflow: 'hidden', 
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical' 
          }}>
            {item.content}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.4rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {item.tags && item.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag-badge">#{tag}</span>
          ))}
          {item.tags && item.tags.length > 3 && (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
              +{item.tags.length - 3} more
            </span>
          )}
        </div>
        
        <div className="btn-outline" style={{ padding: '0.3rem', borderRadius: '8px', border: 'none', opacity: 0, transition: 'opacity 0.2s' }} id="hover-reveal">
           <ExternalLink size={14} />
        </div>
      </div>
      
      <style>{`
        .item-card:hover #hover-reveal { opacity: 0.8 !important; }
      `}</style>
    </div>
  );
}
