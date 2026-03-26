import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { X, Wand2, CheckCircle2, Loader2 } from 'lucide-react';

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
    if (!formData.url) return;
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
      <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="modal-content" style={{ textAlign: 'center', padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.1)', color: 'var(--accent)' }}>
            <CheckCircle2 size={48} />
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Updated Successfully</h2>
            <p className="meta-text" style={{ color: 'var(--text-secondary)' }}>Recalculating vectors...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: '600px', maxWidth: '95vw', padding: '3rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', padding: '0.5rem', border: 'none', cursor: 'pointer' }}>
          <X size={20} />
        </button>
        
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Edit Knowledge</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Modify or refine your stored knowledge entry.</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label className="meta-text" style={{ display: 'block', marginBottom: '0.5rem' }}>Type</label>
              <select 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value})}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '12px' }}
              >
                <option value="article">📄 Article</option>
                <option value="tweet">🐦 Tweet</option>
                <option value="video">🎬 Video</option>
                <option value="image">🖼️ Image</option>
                <option value="pdf">📕 PDF</option>
                <option value="link">🔗 Link</option>
              </select>
            </div>
            
            <div>
              <label className="meta-text" style={{ display: 'block', marginBottom: '0.5rem' }}>Source URL</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  required
                  type="url" 
                  placeholder="https://..."
                  value={formData.url}
                  onChange={e => setFormData({...formData, url: e.target.value})}
                  style={{ flex: 1 }}
                />
                <button 
                  type="button" 
                  onClick={handleAutoFill} 
                  disabled={extracting || !formData.url}
                  className="btn-outline"
                  style={{ 
                    padding: '0 1rem', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '48px',
                    borderColor: formData.url ? 'var(--accent)' : 'var(--border)',
                    color: formData.url ? 'var(--accent)' : 'var(--text-muted)'
                  }}
                >
                  {extracting ? <Loader2 size={18} className="spin" /> : <Wand2 size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="meta-text" style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
            <input 
              required
              type="text" 
              placeholder="The future of decentralized knowledge..."
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label className="meta-text" style={{ display: 'block', marginBottom: '0.5rem' }}>Content / Notes</label>
            <textarea 
              rows="6"
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              style={{ width: '100%', resize: 'none' }}
            />
          </div>

          <div>
            <label className="meta-text" style={{ display: 'block', marginBottom: '0.5rem' }}>Tags (comma separated)</label>
            <input 
              type="text" 
              placeholder="design, tech, neural-networks..."
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
              style={{ width: '100%' }}
            />
          </div>

          <button type="submit" disabled={loading || extracting} className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center', padding: '1rem' }}>
             {loading ? <Loader2 size={20} className="spin" /> : 'UPDATE KNOWLEDGE'}
          </button>
        </form>
      </div>
      
      <style>{`
        .spin { animation: rotate 1s linear infinite; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
