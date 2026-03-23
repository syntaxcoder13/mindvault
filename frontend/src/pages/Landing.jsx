import { SignInButton } from '@clerk/clerk-react';
import { Database, Zap, Search, Layout } from 'lucide-react';

export default function Landing() {
  return (
    <div className="landing-container" style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      {/* Hero Section */}
      <div style={{ marginBottom: '4rem' }}>
        <h1 style={{ 
          fontSize: '5rem', 
          fontWeight: '900', 
          letterSpacing: '-0.02em', 
          lineHeight: 1, 
          background: 'linear-gradient(135deg, var(--accent-color) 0%, #FFD700 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1.5rem'
        }}>
          MINDVAULT.
        </h1>
        <p style={{ 
          fontSize: '1.5rem', 
          color: 'var(--text-muted)', 
          maxWidth: '700px', 
          margin: '0 auto 3rem',
          lineHeight: 1.6
        }}>
          Not just another bookmark manager. A high-performance personal knowledge engine 
          that understands your thoughts using vector-semantic search.
        </p>
        
        <SignInButton mode="modal">
          <button className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
            GET STARTED FOR FREE
          </button>
        </SignInButton>
      </div>

      {/* Features Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '2rem', 
        maxWidth: '1200px', 
        width: '100%',
        marginTop: '4rem'
      }}>
        <FeatureCard 
          icon={<Zap color="var(--accent-color)" />} 
          title="Instant Recall" 
          desc="AI-powered vector embeddings enable semantic search that finds what you mean, not just what you typed."
        />
        <FeatureCard 
          icon={<Database color="var(--accent-color)" />} 
          title="Knowledge Graph" 
          desc="Visualize connections between your saved items and watch your digital garden grow."
        />
        <FeatureCard 
          icon={<Search color="var(--accent-color)" />} 
          title="Auto-Metadata" 
          desc="Automatically extracts titles, summaries, and descriptions from URLs so you don't have to."
        />
        <FeatureCard 
          icon={<Layout color="var(--accent-color)" />} 
          title="Brutal Minimalism" 
          desc="A high-contrast, distraction-free interface built for speed and clarity."
        />
      </div>

      <footer style={{ marginTop: '8rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        © 2026 MINDVAULT. NO DATA SOLD. NO ADS. EVER.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="brutal-border" style={{ 
      padding: '2rem', 
      textAlign: 'left', 
      background: 'var(--bg-secondary)',
      transition: 'transform 0.2s',
      cursor: 'default'
    }} onMouseEnter={e => e.currentTarget.style.transform = 'translate(-4px, -4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
      <div style={{ marginBottom: '1.5rem' }}>{icon}</div>
      <h3 style={{ marginBottom: '1rem', letterSpacing: '0.05em' }}>{title.toUpperCase()}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>{desc}</p>
    </div>
  );
}
