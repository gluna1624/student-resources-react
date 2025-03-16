import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Resources from './pages/Resources';
import AddResource from './pages/AddResource';
import Login from './pages/Login';
import Admin from './pages/Admin';

const App: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #e5e7eb, #d1d5db)' }}>
      <nav style={{
        background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
        padding: '1rem',
        display: 'flex',
        gap: '1.5rem',
        justifyContent: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Roboto, sans-serif',
      }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
        <Link to="/resources" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Resources</Link>
        <Link to="/add-resource" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Add Resource</Link>
        <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Login/Register</Link>
        <Link to="/admin" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/add-resource" element={<AddResource />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
};

export default App;