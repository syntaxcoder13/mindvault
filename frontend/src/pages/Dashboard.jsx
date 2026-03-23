import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import ItemCard from '../components/ItemCard';
import TagCloud from '../components/TagCloud';
import ResurfacePanel from '../components/ResurfacePanel';
import { Plus, DatabaseBackup } from 'lucide-react';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const { fetchItems, fetchCollections, createCollection } = useApi();
  const location = useLocation();

  const searchQuery = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    fetchItems(searchQuery, selectedTag)
      .then(setItems)
      .catch(console.error);
    
    fetchCollections()
      .then(setCollections)
      .catch(console.error);
  }, [searchQuery, selectedTag]);

  const handleAddCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    try {
      await createCollection(newCollectionName);
      setNewCollectionName('');
      const cols = await fetchCollections();
      setCollections(cols);
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-grid">
      {/* LEFT SIDEBAR: Collections + Tags */}
      <aside className="sidebar">
        <h3 className="meta-text">COLLECTIONS</h3>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '2.5rem' }}>
          {collections.map(c => (
            <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-color)', fontSize: '0.9rem' }}>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-color)'} onMouseLeave={e => e.target.style.color = 'var(--text-color)'}>{c.name}</span>
            </li>
          ))}
          {collections.length === 0 && <span className="meta-text" style={{ color: 'var(--text-muted)' }}>No collections</span>}
        </ul>

        <form onSubmit={handleAddCollection} style={{ display: 'flex', gap: '0.5rem', marginBottom: '3rem' }}>
          <input 
            type="text" 
            placeholder="New Collection..." 
            value={newCollectionName}
            onChange={e => setNewCollectionName(e.target.value)}
            style={{ padding: '0.5rem', fontSize: '0.85rem' }}
          />
          <button type="submit" className="btn-outline" style={{ padding: '0.5rem' }}>
            <Plus size={16} />
          </button>
        </form>

        <TagCloud items={items} selectedTag={selectedTag} onSelect={setSelectedTag} />
      </aside>

      {/* MID FEED: All Items */}
      <div className="feed-column">
        {searchQuery && (
          <h2 style={{ fontSize: '1.4rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem', fontWeight: 'normal' }}>
            Results for: <strong style={{ color: 'var(--accent-color)' }}>{searchQuery}</strong>
          </h2>
        )}
        
        {items.length === 0 ? (
          <div className="brutal-border" style={{ 
            padding: '5rem 3rem', 
            textAlign: 'center', 
            color: 'var(--text-muted)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem'
          }}>
            <DatabaseBackup size={48} color="var(--border-highlight)" />
            <h2 style={{ color: 'var(--text-color)', letterSpacing: '0.05em' }}>VAULT IS EMPTY</h2>
            <p style={{ maxWidth: '300px', lineHeight: '1.6' }}>Expand your knowledge base by adding articles, links, and thoughts.</p>
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
