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

const Home: React.FC = () => {
  const [latestResources, setLatestResources] = useState<Resource[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/resources', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        // Sort by created_at descending and take top 3
        const sorted = data.sort((a: Resource, b: Resource) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 3);
        setLatestResources(sorted);
      })
      .catch(error => console.error('Error fetching resources:', error));
  }, []);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

  return (
    <div style={{ padding: '2rem', maxWidth: '64rem', margin: '0 auto', fontFamily: 'Roboto, sans-serif' }}>
      <h1 style={{ color: '#2563eb', fontSize: '2.5rem', fontWeight: '700', textAlign: 'center', marginBottom: '1rem' }}>
        Student Resource Platform
      </h1>
      <p style={{ color: '#1f2937', fontSize: '1.25rem', textAlign: 'center', marginBottom: '2rem' }}>
        Share and explore resources with your peers!
      </p>
      <h2 style={{ color: '#2563eb', fontSize: '1.75rem', fontWeight: '500', textAlign: 'center', marginBottom: '1.5rem' }}>
        Latest Resources
      </h2>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {latestResources.map(resource => (
          <li
            key={resource.id}
            style={{
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;