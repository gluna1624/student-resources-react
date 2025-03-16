import React, { useEffect, useState } from 'react';

interface Resource {
  id: number;
  title: string;
  description: string;
  subject: string;
  user_id: number | null;
  created_at: string;
  file_path: string | null;
  username: string | null;
}

const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/resources', { credentials: 'include' })
      .then(response => response.json())
      .then(data => setResources(data))
      .catch(error => console.error('Error fetching resources:', error));
  }, []);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

  return (
    <div style={{ padding: '2rem', maxWidth: '64rem', margin: '0 auto' }}>
      <h1 style={{ color: '#2563eb', fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
        Student Resources
      </h1>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {resources.map(resource => (
          <li
            key={resource.id}
            style={{
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'}
          >
            <span style={{ color: '#1f2937' }}>
              <strong>{resource.title}</strong> - {resource.description} (Subject: {resource.subject}, Added: {formatDate(resource.created_at)}, By: {resource.username || 'Anonymous'})
              {resource.file_path && (
                <a
                  href={`http://localhost:3000${resource.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#3b82f6', marginLeft: '0.5rem', textDecoration: 'underline' }}
                >
                  Download
                </a>
              )}
            </span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => console.log('Edit:', resource.id)}
                style={{ backgroundColor: '#eab308', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
              >
                Edit
              </button>
              <button
                onClick={() => console.log('Delete:', resource.id)}
                style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Resources;