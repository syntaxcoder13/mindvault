import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { X, Wand2, CheckCircle2, Loader2, Link2 } from 'lucide-react';

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
      <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="modal-content" style={{ textAlign: 'center', padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.1)', color: 'var(--accent)' }}>
            <CheckCircle2 size={48} />
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Stored in Vault.</h2>
            <p className="meta-text" style={{ color: 'var(--text-secondary)' }}>Processing AI tags & embeddings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: '600px', maxWidth: '95vw', padding: '3rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', padding: '0.5rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'}>
          <X size={20} />
        </button>
        
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Add Knowledge</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Capture an article, tweet, or video to your knowledge base.</p>
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
                  disabled={autofilling || !formData.url}
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
                  {autofilling ? <Loader2 size={18} className="spin" /> : <Wand2 size={18} />}
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
              rows="4"
              placeholder="Paste relevant text here for full-text search and AI embeddings..."
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

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center', padding: '1rem' }}>
             {loading ? <Loader2 size={20} className="spin" /> : 'SECURE IN VAULT'}
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
