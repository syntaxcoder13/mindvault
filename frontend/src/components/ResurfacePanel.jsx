import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import ItemCard from './ItemCard';
import { Sparkles } from 'lucide-react';

export default function ResurfacePanel() {
  const [items, setItems] = useState([]);
  const { fetchResurface } = useApi();

  useEffect(() => {
    fetchResurface().then(setItems).catch(console.error);
  }, []);

  return (
    <div style={{ position: 'sticky', top: '120px' }}>
      <h3 className="meta-text" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
        <Sparkles size={14} color="var(--accent)" /> FROM THE VAULT
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {items.length === 0 ? (
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            No memories to resurface yet.
          </div>
        ) : items.map(item => (
          <div key={item.id} style={{ position: 'relative' }}>
             <ItemCard item={item} />
          </div>
        ))}
      </div>
      
      {/* Decorative gradient overlay */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        borderRadius: '20px', 
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, transparent 100%)',
        border: '1px solid rgba(124, 58, 237, 0.1)'
      }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Pro Tip: Semantic Search</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.5 }}>
          Try searching for concepts like "Modern Web Design" or "AI Trends" even if those exact words aren't in your titles.
        </p>
      </div>
    </div>
  );
}
