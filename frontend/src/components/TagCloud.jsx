export default function TagCloud({ items, selectedTag, onSelect }) {
  const tagsMap = {};
  items.forEach(item => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach(tag => {
        tagsMap[tag] = (tagsMap[tag] || 0) + 1;
      });
    }
  });

  const sortedTags = Object.entries(tagsMap).sort((a,b) => b[1] - a[1]);

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {sortedTags.length === 0 && <span className="meta-text" style={{ fontSize: '0.7rem' }}>No tags available.</span>}
        {sortedTags.map(([tag, count]) => {
          const isActive = tag === selectedTag;
          return (
            <button 
              key={tag}
              onClick={() => onSelect(isActive ? '' : tag)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '50px',
                fontSize: '0.75rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.03)',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={e => {
                if(!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }
              }}
              onMouseLeave={e => {
                if(!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }
              }}
            >
              #{tag} 
              <span style={{ 
                opacity: 0.5, 
                fontSize: '0.8em', 
                backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                padding: '0.1rem 0.4rem',
                borderRadius: '10px'
              }}>{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
