import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { X, Wand2 } from 'lucide-react';

export default function EditModal({ item, onClose }) {
  const [formData, setFormData] = useState({
    type: item.type || 'article',
    title: item.title || '',
    url: item.url || '',
    content: item.content || '',
    tags: Array.isArray(item.tags) ? item.tags.join(', ') : ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const { updateItem, extractMetadata } = useApi();

  const handleAutoFill = async () => {
    if (!formData.url) return alert('Source URL required for auto-fill!');
    setExtracting(true);
    try {
      const data = await extractMetadata(formData.url);
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        content: data.content || prev.content
      }));
    } catch (err) {
      console.error(err);
      alert('Failed to fetch from URL.');
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      await updateItem(item.id, payload);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.reload(); 
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("Failed to update.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="modal-overlay">
        <div className="modal-content brutal-border" style={{ textAlign: 'center', borderColor: 'var(--accent-color)', padding: '4rem' }}>
          <h2 style={{ color: 'var(--accent-color)', fontSize: '2rem', letterSpacing: '0.05em' }}>UPDATED.</h2>
          <p className="meta-text" style={{ marginTop: '1.5rem', opacity: 0.7 }}>Recalculating vectors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="modal-content brutal-border" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-muted)' }}>
          <X size={24} />
        </button>
        <h2 style={{ marginBottom: '2.5rem', color: 'var(--accent-color)' }}>EDIT KNOWLEDGE</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
            <div>
              <label className="meta-text" style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>FORMAT</label>
              <select 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="article">Article</option>
                <option value="tweet">Tweet</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label className="meta-text" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
                 <span>SOURCE URL</span>
                 <button type="button" onClick={handleAutoFill} disabled={extracting} style={{ color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Wand2 size={12} /> {extracting ? 'Scraping...' : 'Auto-Fill'}
                 </button>
              </label>
              <input 
                required
                type="url" 
                placeholder="https://..."
                value={formData.url}
                onChange={e => setFormData({...formData, url: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="meta-text" style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>TITLE (REQUIRED)</label>
            <input 
              required
              type="text" 
              placeholder="e.g. The Architecture of Tomorrow"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="meta-text" style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>CONTENT / NOTES</label>
            <textarea 
              rows="6"
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div>
            <label className="meta-text" style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>MANUAL TAGS (COMMA SEPARATED)</label>
            <input 
              type="text" 
              placeholder="design, tech, philosophy..."
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
            />
          </div>

          <button type="submit" disabled={loading || extracting} className="btn-primary" style={{ marginTop: '1.5rem', padding: '1rem', fontSize: '1.1rem' }}>
             {loading ? <span className="loading">SAVING...</span> : 'UPDATE RECORD'}
          </button>
        </form>
      </div>
    </div>
  );
}
