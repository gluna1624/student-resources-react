import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/check-session', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        setIsLoggedIn(data.isLoggedIn);
        if (data.isLoggedIn) setCurrentUser(data.username);
      })
      .catch(error => console.error('Error checking session:', error));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username: loginUsername, password: loginPassword }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setIsLoggedIn(true);
          setCurrentUser(data.username);
          setLoginUsername('');
          setLoginPassword('');
          alert('Logged in as ' + data.username);
          navigate('/resources');
        } else {
          alert(data.message || 'Login failed');
        }
      })
      .catch(error => console.error('Error logging in:', error));
  };

  const handleLogout = () => {
    fetch('http://localhost:3000/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setIsLoggedIn(false);
          setCurrentUser(null);
          alert('Logged out');
        }
      })
      .catch(error => console.error('Error logging out:', error));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Registration successful! Please log in.');
          setRegisterUsername('');
          setRegisterEmail('');
          setRegisterPassword('');
        } else {
          alert(data.message || 'Registration failed');
        }
      })
      .catch(error => console.error('Error registering:', error));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '32rem', margin: '0 auto' }}>
      <h1 style={{ color: '#2563eb', fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
        Login / Register
      </h1>
      {isLoggedIn ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#1f2937', marginBottom: '1rem' }}>Logged in as {currentUser}</p>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#2563eb', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Login</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Username"
                required
                style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
              />
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                required
                style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Login
              </button>
            </form>
          </div>
          <div>
            <h2 style={{ color: '#2563eb', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Register</h2>
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                placeholder="Username"
                required
                style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
              />
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="Email"
                required
                style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
              />
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Password"
                required
                style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Register
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;