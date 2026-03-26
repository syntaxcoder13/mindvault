import { SignInButton } from '@clerk/clerk-react';
import { Database, Zap, Search, Layout, Sparkles, Network, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="landing-container" style={{ 
      minHeight: '85vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      padding: '4rem 2rem'
    }}>
      {/* Background Glow */}
      <div style={{ 
        position: 'absolute', 
        top: '20%', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        width: '600px', 
        height: '600px', 
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)', 
        zIndex: -1,
        borderRadius: '50%',
        filter: 'blur(100px)'
      }} />

      <div style={{ marginBottom: '5rem', position: 'relative' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '0.4rem 1.2rem', 
          borderRadius: '50px', 
          background: 'rgba(124,58,237,0.1)', 
          border: '1px solid rgba(124,58,237,0.2)', 
          color: 'var(--accent)', 
          fontSize: '0.85rem', 
          fontWeight: 600,
          marginBottom: '2rem'
        }}>
          <Sparkles size={14} /> NEW: Vector Search Enabled
        </div>

        <h1 style={{ 
          fontSize: 'clamp(3rem, 8vw, 6.5rem)', 
          fontWeight: '700', 
          letterSpacing: '-0.04em', 
          lineHeight: 0.9, 
          background: 'linear-gradient(to bottom right, #fff 40%, #71717a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '2rem',
          maxWidth: '1000px'
        }}>
          Capture Everything. <br /> Find it Instantly.
        </h1>
        
        <p style={{ 
          fontSize: 'clamp(1rem, 2vw, 1.4rem)', 
          color: 'var(--text-secondary)', 
          maxWidth: '750px', 
          margin: '0 auto 3rem',
          lineHeight: 1.6,
          fontWeight: 400
        }}>
          Not just another bookmark manager. A high-performance personal knowledge engine 
          that understands your thoughts using vector-semantic search.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <SignInButton mode="modal">
            <button className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '50px' }}>
              GET STARTED <ArrowRight size={18} />
            </button>
          </SignInButton>
          <button className="btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '50px', backdropFilter: 'blur(10px)' }}>
            WATCH DEMO
          </button>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '2rem', 
        maxWidth: '1200px', 
        width: '100%',
        marginTop: '2rem'
      }}>
        <FeatureCard 
          icon={<Zap size={32} color="var(--accent)" />} 
          title="Instant Recall" 
          desc="AI-powered vector embeddings enable semantic search that finds what you mean, not just what you typed."
        />
        <FeatureCard 
          icon={<Network size={32} color="var(--accent)" />} 
          title="Knowledge Graph" 
          desc="Visualize connections between your saved items and watch your digital garden grow."
        />
        <FeatureCard 
          icon={<Search size={32} color="var(--accent)" />} 
          title="Auto-Metadata" 
          desc="Automatically extracts titles, summaries, and descriptions from URLs so you don't have to."
        />
      </div>

      <footer style={{ marginTop: '8rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        © 2026 MINDVAULT. NO DATA SOLD. NO ADS. EVER.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass-card" style={{ 
      padding: '2.5rem', 
      textAlign: 'left', 
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    }}>
      <div style={{ 
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        background: 'rgba(124,58,237,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>{icon}</div>
      <div>
        <h3 style={{ marginBottom: '0.75rem', fontSize: '1.4rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>{desc}</p>
      </div>
    </div>
  );
}
