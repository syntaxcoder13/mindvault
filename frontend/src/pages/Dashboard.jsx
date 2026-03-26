import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import ItemCard from '../components/ItemCard';
import TagCloud from '../components/TagCloud';
import ResurfacePanel from '../components/ResurfacePanel';
import { DatabaseBackup, Hash } from 'lucide-react';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const { fetchItems } = useApi();
  const location = useLocation();

  const searchQuery = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    fetchItems(searchQuery, selectedTag)
      .then(setItems)
      .catch(console.error);
  }, [searchQuery, selectedTag]);

  return (
    <div className="dashboard-grid">
      {/* LEFT SIDEBAR: Tags Only */}
      <aside className="sidebar">
        <div style={{ padding: '0 0.5rem' }}>
          <div style={{ marginTop: '0.5rem' }}>
            <h3 className="meta-text" style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <Hash size={14} color="var(--accent)" /> EXPLORE TAGS
            </h3>
            <TagCloud items={items} selectedTag={selectedTag} onSelect={setSelectedTag} />
          </div>
        </div>
      </aside>

      {/* MID FEED: All Items */}
      <div className="feed-column">
        {searchQuery && (
          <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(124, 58, 237, 0.05)', borderRadius: '16px', border: '1px solid rgba(124, 58, 237, 0.1)' }}>
            <span className="meta-text">SEARCH RESULTS FOR</span>
            <h2 style={{ fontSize: '1.4rem', marginTop: '0.25rem', color: 'var(--accent)' }}>"{searchQuery}"</h2>
          </div>
        )}
        
        {items.length === 0 ? (
          <div className="glass-card" style={{ 
            padding: '6rem 3rem', 
            textAlign: 'center', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            borderStyle: 'dashed',
            borderWidth: '2px'
          }}>
            <div style={{ padding: '1.5rem', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }}>
              <DatabaseBackup size={48} color="var(--text-muted)" />
            </div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.6rem' }}>Your Vault is Empty</h2>
            <p style={{ maxWidth: '300px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>Start building your second brain by saving articles, links, and ideas.</p>
          </div>
        ) : (
          items.map(item => <ItemCard key={item.id} item={item} />)
        )}
      </div>

      {/* RIGHT PANEL: Resurface */}
      <aside className="resurface-panel">
        <ResurfacePanel />
      </aside>
    </div>
  );
}
