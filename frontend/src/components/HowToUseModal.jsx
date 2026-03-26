import { X, CheckCircle2, Save, Search, Network, Zap, Hash, Clock, Sparkles, Layers } from 'lucide-react';

export default function HowToUseModal({ onClose }) {
  const steps = [
    {
      icon: <CheckCircle2 size={22} />,
      title: "1. Secure Your Vault",
      desc: "Sign in with Clerk to create your personal encrypted vault where your data is private and secure."
    },
    {
      icon: <Save size={22} />,
      title: "2. Instant Capture",
      desc: "Use the 'CAPTURE' button in the navbar or the Chrome Extension to save URLs and ideas instantly from anywhere."
    },
    {
      icon: <Sparkles size={22} />,
      title: "3. AI Auto-Processing",
      desc: "Sit back as our AI extracts titles, generates summaries, and automatically tags your items so you don't have to."
    },
    {
      icon: <Search size={22} />,
      title: "4. Semantic Search",
      desc: "Find anything using natural language search. Our vector engine understands concepts, even if you don't remember the exact keywords."
    },
    {
      icon: <Layers size={22} />,
      title: "5. Knowledge Graph",
      desc: "Visualize your digital brain. See how different topics and links relate to each other in an interactive graph."
    },
    {
      icon: <Clock size={22} />,
      title: "6. Chronological Timeline",
      desc: "Review your journey through time. See your saved knowledge in a beautiful chronological order via the 'Timeline' view."
    },
    {
      icon: <Hash size={22} />,
      title: "7. Smart Tag Library",
      desc: "Navigate your library easily using auto-generated tags. It's your personal directory categorized by our AI."
    },
    {
      icon: <Zap size={22} />,
      title: "8. Forgotten Gems",
      desc: "Let the AI resurface old but relevant thoughts that match your current focus in the 'Resurface' panel."
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2.5rem', maxWidth: '750px' }}>
        <button 
          onClick={onClose}
          style={{ 
            position: 'absolute', 
            top: '1.25rem', 
            right: '1.25rem', 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid var(--border)', 
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)', 
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          className="close-hover"
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>
              Master Your MindVault
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Everything you need to know to build your second brain.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2.5rem',
            paddingRight: '1rem' 
          }}>
            {steps.map((step, index) => (
              <div key={index} style={{ display: 'flex', gap: '1.25rem' }}>
                <div style={{ 
                  flexShrink: 0, 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '10px', 
                  background: 'rgba(124, 58, 237, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--accent)',
                  border: '1px solid rgba(124, 58, 237, 0.2)'
                }}>
                  {step.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', fontWeight: 600, color: '#fff' }}>{step.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.55' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              MINDVAULT v1.0 • Built for High-Performance Thinkers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
