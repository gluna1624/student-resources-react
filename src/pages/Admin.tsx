import React, { useEffect, useState } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  verified: boolean;
}

interface Resource {
  id: number;
  title: string;
  description: string;
  subject: string;
  user_id: number | null;
  created_at: string;
  file_path: string | null;
  username: string | null;
  tags: string[];
  upvotes: number;
  verified: boolean;
}

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/check-session', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        // Allow 'admin' or 'gvl718' as admin for now
        if (data.isLoggedIn && (data.username === 'admin' || data.username === 'gvl718')) {
          setIsAdmin(true);
          fetchUsers();
        } else {
          setIsAdmin(false);
        }
      })
      .catch(error => console.error('Error checking session:', error));
  }, []);

  const fetchUsers = () => {
    fetch('http://localhost:3000/resources', { credentials: 'include' })
      .then(response => response.json())
      .then((data: Resource[]) => {
        const uniqueUsers = Array.from(
          new Map(
            data
              .filter(r => r.user_id !== null && r.username !== null)  // Filter out nulls first
              .map(r => [r.user_id, { 
                id: r.user_id as number,  // Assert non-null after filter
                username: r.username as string,  // Assert non-null after filter
                email: '', 
                verified: r.verified 
              }])
          ).values()
        );
        setUsers(uniqueUsers);
      })
      .catch(error => console.error('Error fetching users:', error));
  };

  const handleVerify = (userId: number) => {
    fetch(`http://localhost:3000/admin/verify/${userId}`, {
      method: 'PUT',
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to verify');
        return response.json();
      })
      .then(() => {
        setUsers(users.map(u => (u.id === userId ? { ...u, verified: true } : u)));
        alert('User verified successfully!');
      })
      .catch(error => console.error('Error verifying user:', error));
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'Roboto, sans-serif' }}>
        <h1 style={{ color: '#ef4444', fontSize: '2rem', fontWeight: '700' }}>Admin Access Required</h1>
        <p>Please log in as an admin to view this page.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '64rem', margin: '0 auto', fontFamily: 'Roboto, sans-serif' }}>
      <h1 style={{ color: '#2563eb', fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', textAlign: 'center' }}>
        Admin Dashboard
      </h1>
      <h2 style={{ color: '#1f2937', fontSize: '1.5rem', marginBottom: '1rem' }}>User Verification</h2>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {users.map(user => (
          <li
            key={user.id}
            style={{
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#1f2937' }}>
              {user.username} {user.verified ? '(Verified ✅)' : '(Not Verified)'}
            </span>
            {!user.verified && (
              <button
                onClick={() => handleVerify(user.id)}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                Verify
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;