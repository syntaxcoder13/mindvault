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
      padding: '2rem 1rem'
    }}>
      {/* Background Glow */}
      <div style={{ 
        position: 'absolute', 
        top: '15%', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        width: 'min(90vw, 600px)', 
        height: 'min(90vw, 600px)', 
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%)', 
        zIndex: -1,
        borderRadius: '50%',
        filter: 'blur(80px)'
      }} />

      <div style={{ marginBottom: '4rem', position: 'relative', width: '100%', maxWidth: '1100px' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '0.5rem 1.25rem', 
          borderRadius: '50px', 
          background: 'rgba(124,58,237,0.08)', 
          border: '1px solid rgba(124,58,237,0.15)', 
          color: 'var(--accent)', 
          fontSize: 'min(0.85rem, 3.5vw)', 
          fontWeight: 600,
          marginBottom: '2rem'
        }}>
          <Sparkles size={14} /> NEW: Vector Search Enabled
        </div>

        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 10vw, 6.5rem)', 
          fontWeight: '700', 
          letterSpacing: '-0.04em', 
          lineHeight: 0.95, 
          background: 'linear-gradient(to bottom right, #fff 40%, #71717a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '2rem',
          marginRight: 'auto',
          marginLeft: 'auto'
        }}>
          Capture Everything. <br className="hide-on-mobile" /> Find it Instantly.
        </h1>
        
        <p style={{ 
          fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', 
          color: 'var(--text-secondary)', 
          maxWidth: '800px', 
          margin: '0 auto 3rem',
          lineHeight: 1.6,
          fontWeight: 400,
          padding: '0 1rem'
        }}>
          Not just another bookmark manager. A high-performance personal knowledge engine 
          that understands your thoughts using vector-semantic search.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', padding: '0 1rem' }}>
          <SignInButton mode="modal">
            <button className="btn-primary" style={{ padding: '1.2rem 3.5rem', fontSize: '1.2rem', borderRadius: '50px', minWidth: '280px', boxShadow: '0 20px 40px -10px var(--accent-glow)' }}>
              GET STARTED <ArrowRight size={22} />
            </button>
          </SignInButton>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem', 
        maxWidth: '1200px', 
        width: '100%',
        marginTop: '2rem',
        padding: '0 1rem'
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

      <footer style={{ marginTop: '8rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem', padding: '0 1rem' }}>
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
