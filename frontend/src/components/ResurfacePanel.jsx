import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import ItemCard from './ItemCard';
import { Clock } from 'lucide-react';

export default function ResurfacePanel() {
  const [items, setItems] = useState([]);
  const { fetchResurface } = useApi();

  useEffect(() => {
    fetchResurface().then(setItems).catch(console.error);
  }, []);

  return (
    <div>
      <h3 className="meta-text" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Clock size={16} /> FROM THE VAULT
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {items.length === 0 ? (
          <div className="meta-text" style={{ color: 'var(--text-muted)' }}>No memories to resurface yet.</div>
        ) : items.map(item => (
          <div key={item.id} style={{ position: 'relative' }}>
            {/* Subtle amber glow effect for highlighted resurface */}
            <div style={{
              position: 'absolute',
              top: '-3px', left: '-3px', right: '-3px', bottom: '-3px',
              border: '1px solid var(--accent-color)',
              opacity: 0.25,
              zIndex: 0,
              filter: 'blur(4px)',
              pointerEvents: 'none'
            }} />
            <ItemCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
