import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddResource: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/check-session', { credentials: 'include' })
      .then(response => response.json())
      .then(data => setIsLoggedIn(data.isLoggedIn))
      .catch(error => console.error('Error checking session:', error));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('subject', subject);
    if (file) formData.append('file', file);
    formData.append('youtube_url', youtubeUrl);

    fetch('http://localhost:3000/resources', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        Promise.all(tags.map(tagName =>
          fetch(`http://localhost:3000/resources/${data.id}/tags`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ tagName }),
          })
        ))
          .then(() => {
            setTitle('');
            setDescription('');
            setSubject('');
            setFile(null);
            setTags([]);
            setYoutubeUrl('');
            navigate('/resources');
          })
          .catch(error => console.error('Error adding tags:', error));
      })
      .catch(error => console.error('Error adding resource:', error));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '32rem', margin: '0 auto' }}>
      <h1 style={{ color: '#2563eb', fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
        Add a New Resource
      </h1>
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ color: '#1f2937', fontWeight: 'bold' }}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter resource title"
              required
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
            />
          </div>
          <div>
            <label style={{ color: '#1f2937', fontWeight: 'bold' }}>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the resource"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
            />
          </div>
          <div>
            <label style={{ color: '#1f2937', fontWeight: 'bold' }}>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject area"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
            />
          </div>
          <div>
            <label style={{ color: '#1f2937', fontWeight: 'bold' }}>Tags</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              {tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: '#e5e7eb',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  {tag}
                  <button
                    onClick={() => handleTagRemove(tag)}
                    style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
              />
              <button
                type="button"
                onClick={handleTagAdd}
                style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
              >
                Add Tag
              </button>
            </div>
          </div>
          <div>
            <label style={{ color: '#1f2937', fontWeight: 'bold' }}>YouTube Video URL (optional)</label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="e.g., https://www.youtube.com/watch?v=..."
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
            />
          </div>
          <div>
            <label style={{ color: '#1f2937', fontWeight: 'bold' }}>File (PDF, TXT, DOCX, optional)</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.txt,.docx"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
            />
          </div>
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
            Add Resource
          </button>
        </form>
      ) : (
        <p style={{ color: '#ef4444', textAlign: 'center' }}>
          Please <a href="/login" style={{ color: '#3b82f6', textDecoration: 'underline' }}>log in</a> to add a resource.
        </p>
      )}
    </div>
  );
};

export default AddResource;