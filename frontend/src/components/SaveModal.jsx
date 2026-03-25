import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { X, Wand2 } from 'lucide-react';

export default function SaveModal({ onClose }) {
  const [formData, setFormData] = useState({
    type: 'article',
    title: '',
    url: '',
    content: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { saveItem, extractMetadata } = useApi();
  const [autofilling, setAutofilling] = useState(false);

  const handleAutoFill = async () => {
    if (!formData.url) {
      alert("Please enter a URL first.");
      return;
    }
    setAutofilling(true);
    try {
      const data = await extractMetadata(formData.url);
      if (data) {
        setFormData(prev => ({
          ...prev,
          title: data.title || prev.title,
          content: data.content || prev.content
        }));
      }
    } catch (err) {
      console.error("Auto-fill error:", err);
      alert("Failed to auto-fill metadata. Please enter manually.");
    } finally {
      setAutofilling(false);
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
      await saveItem(payload);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.reload(); 
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Failed to save. Check console.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="modal-overlay">
        <div className="modal-content brutal-border" style={{ textAlign: 'center', borderColor: 'var(--accent-color)', padding: '4rem' }}>
          <h2 style={{ color: 'var(--accent-color)', fontSize: '2rem', letterSpacing: '0.05em' }}>VAULTED.</h2>
          <p className="meta-text" style={{ marginTop: '1.5rem', opacity: 0.7 }}>Processing AI tags & embeddings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content brutal-border" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={24} />
        </button>
        <h2 style={{ marginBottom: '2.5rem', color: 'var(--accent-color)' }}>ADD KNOWLEDGE</h2>
        
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
              <label className="meta-text" style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>SOURCE URL</label>
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
                  disabled={autofilling}
                  title="Auto-fill Metadata"
                  style={{ 
                    padding: '0 1rem', 
                    background: 'var(--bg-accent)', 
                    color: 'var(--accent-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  className="brutal-border"
                >
                  {autofilling ? <span className="loading">...</span> : <Wand2 size={18} />}
                </button>
              </div>
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
              rows="4"
              placeholder="Paste content for vector embeddings..."
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

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '1.5rem', padding: '1rem', fontSize: '1.1rem' }}>
             {loading ? <span className="loading">SAVING...</span> : 'STORE IN VAULT'}
          </button>
        </form>
      </div>
    </div>
  );
}
