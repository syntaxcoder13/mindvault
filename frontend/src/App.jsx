import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ItemDetail from './pages/ItemDetail';
import GraphView from './pages/GraphView';
import Timeline from './pages/Timeline';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content" style={{ marginTop: '2rem' }}>
          <Routes>
            <Route 
              path="/" 
              element={
                <>
                  <SignedIn>
                    <Dashboard />
                  </SignedIn>
                  <SignedOut>
                    <Landing />
                  </SignedOut>
                </>
              } 
            />
            <Route 
              path="/item/:id" 
              element={
                <>
                  <SignedIn><ItemDetail /></SignedIn>
                  <SignedOut><RedirectToSignIn /></SignedOut>
                </>
              } 
            />
            <Route 
              path="/graph" 
              element={
                <>
                  <SignedIn><GraphView /></SignedIn>
                  <SignedOut><RedirectToSignIn /></SignedOut>
                </>
              } 
            />
            <Route 
              path="/timeline" 
              element={
                <>
                  <SignedIn><Timeline /></SignedIn>
                  <SignedOut><RedirectToSignIn /></SignedOut>
                </>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
