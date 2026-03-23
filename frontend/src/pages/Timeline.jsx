import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import ItemCard from '../components/ItemCard';

export default function Timeline() {
  const [items, setItems] = useState([]);
  const { fetchItems } = useApi();
  
  useEffect(() => {
    fetchItems().then(setItems).catch(console.error);
    window.scrollTo(0, 0);
  }, []);

  // Group items by Month & Year
  const grouped = items.reduce((acc, item) => {
    const d = new Date(item.createdAt);
    const key = d.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
      <h2 style={{ fontSize: '3rem', marginBottom: '3rem', color: 'var(--accent-color)' }}>CHRONOLOGY</h2>
      
      {Object.entries(grouped).length === 0 ? (
         <div className="meta-text" style={{ color: 'var(--text-muted)' }}>No history recorded yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', position: 'relative' }}>
          {/* Vertical line through timeline */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '2rem', width: '2px', background: 'var(--border-color)', zIndex: 0 }} />
          
          {Object.entries(grouped).map(([monthYear, monthItems]) => (
            <div key={monthYear} style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ width: '1rem', height: '1rem', borderRadius: '50%', background: 'var(--accent-color)', marginLeft: '1.5rem', border: '3px solid var(--bg-color)' }} />
                <h3 className="meta-text" style={{ fontSize: '1.2rem', color: 'var(--text-color)', letterSpacing: '0.15em' }}>{monthYear}</h3>
              </div>
              
              <div style={{ paddingLeft: '4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {monthItems.map(item => (
                   <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
