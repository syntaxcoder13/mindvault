import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Plus, Search, Layers, Clock } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import SaveModal from './SaveModal';

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const prevSearch = useRef(search);

  useEffect(() => {
    if (prevSearch.current === search) {
      if (location.pathname === '/' && !location.search.includes('?q=') && search) {
         setSearch('');
         prevSearch.current = '';
      }
      return;
    }
    prevSearch.current = search;

    const delay = setTimeout(() => {
      if(search.trim()) {
        navigate(`/?q=${encodeURIComponent(search)}`);
      } else if (location.pathname === '/' && location.search.includes('?q=')) {
         navigate(`/`);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [search, navigate, location]);

  return (
    <>
      <nav className="glass">
        <Link to="/" style={{ letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 'bold', textDecoration: 'none', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 14, height: 14, backgroundColor: 'var(--accent)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-glow)', flexShrink: 0 }} />
          <span className="hide-on-mobile" style={{ fontSize: '1.2rem' }}>MINDVAULT</span>
        </Link>
        
        <SignedIn>
          <div className="search-wrapper" style={{ flex: 1, maxWidth: '450px', margin: '0 2rem' }}>
            <Search size={18} className="icon" />
            <input 
              type="text" 
              placeholder="Search library..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </SignedIn>

        <SignedOut>
          <div style={{ flex: 1 }} />
        </SignedOut>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <SignedIn>
            <Link to="/timeline" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 0.75rem' }}>
              <Clock size={16} /> <span className="hide-on-mobile">Timeline</span>
            </Link>
            <Link to="/graph" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 0.75rem' }}>
              <Layers size={16} /> <span className="hide-on-mobile">Graph</span>
            </Link>
            <button onClick={() => setShowModal(true)} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
              <Plus size={18} strokeWidth={2.5} /> <span className="hide-on-mobile">CAPTURE</span>
            </button>
            <div style={{ marginLeft: '0.25rem' }}>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: { width: 36, height: 36, border: '1.5px solid var(--border)' }
                  }
                }}
              />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-primary">Sign In</button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
      {showModal && <SaveModal onClose={() => setShowModal(false)} />}
    </>
  );
}
