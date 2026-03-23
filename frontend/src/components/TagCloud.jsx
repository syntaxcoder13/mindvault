export default function TagCloud({ items, selectedTag, onSelect }) {
  // Extract and count tags
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
    <div style={{ padding: '2rem 0' }}>
      <h3 className="meta-text">TAG CLOUD</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
        {sortedTags.length === 0 && <span className="meta-text" style={{ color: 'var(--text-muted)'}}>No tags yet.</span>}
        {sortedTags.map(([tag, count]) => (
          <button 
            key={tag}
            onClick={() => onSelect(tag === selectedTag ? '' : tag)}
            className="tag-badge"
            style={{
              padding: '0.3rem 0.6rem',
              backgroundColor: tag === selectedTag ? 'var(--text-color)' : 'transparent',
              color: tag === selectedTag ? 'var(--bg-color)' : 'var(--text-muted)',
              cursor: 'pointer',
              border: tag === selectedTag ? 'none' : '1px solid var(--border-color)',
            }}
          >
            {tag} <span style={{ opacity: 0.6, fontSize: '0.85em', marginLeft: '0.3rem' }}>{count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
