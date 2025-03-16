import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Resources from './pages/Resources';
import AddResource from './pages/AddResource';
import Login from './pages/Login';

const App: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #e5e7eb, #d1d5db)' }}>
      <nav style={{ backgroundColor: '#2563eb', padding: '1rem', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/resources" style={{ color: 'white', textDecoration: 'none' }}>Resources</Link>
        <Link to="/add-resource" style={{ color: 'white', textDecoration: 'none' }}>Add Resource</Link>
        <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login/Register</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/add-resource" element={<AddResource />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;