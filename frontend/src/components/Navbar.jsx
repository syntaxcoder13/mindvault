import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import SaveModal from './SaveModal';

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const prevSearch = useRef(search);

  useEffect(() => {
    // We only want to auto-navigate if the USER actually modified the search bar, 
    // NOT when the location changes because they clicked an item!
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
      <nav className="brutal-border-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 3rem' }}>
        <Link to="/" style={{ letterSpacing: '0.05em', fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 'bold', textDecoration: 'none', color: 'var(--accent-color)' }}>
          MINDVAULT.
        </Link>
        
        <div className="search-wrapper" style={{ flex: 1, maxWidth: '400px', margin: '0 2rem' }}>
          <Search size={16} className="icon" />
          <input 
            type="text" 
            placeholder="Search your mind..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <SignedIn>
            <Link to="/timeline" className="btn-outline" style={{ display: 'flex', alignItems: 'center', padding: '0.4rem 1rem' }}>
              Timeline
            </Link>
            <Link to="/graph" className="btn-outline" style={{ display: 'flex', alignItems: 'center', padding: '0.4rem 1rem' }}>
              Graph View
            </Link>
            <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus strokeWidth={3} size={16} /> SAVE
            </button>
            <UserButton 
              appearance={{
                elements: {
                  userButtonPopoverActionButton__manageAccount: { display: "flex" },
                },
                userProfile: {
                  elements: {
                    navbarItem__security: { display: "none" },   // Hides "Security" tab in sidebar
                    navbarItem__api_keys: { display: "none" },   // Hides "API keys" tab in sidebar
                    profileSection__security: { display: "none" }, // Hides security section content
                    profileSection__api_keys: { display: "none" }  // Hides api keys section content
                  }
                }
              }}
            />
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
