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
  tags: string[];
  upvotes: number;
  verified: boolean;
}

interface Comment {
  id: number;
  resource_id: number;
  user_id: number | null;
  content: string;
  created_at: string;
  username: string | null;
}

const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
  const [newComment, setNewComment] = useState<string>('');
  const [previewResource, setPreviewResource] = useState<{ id: number; preview: string } | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = () => {
    fetch('http://localhost:3000/resources', { credentials: 'include' })
      .then(response => response.json())
      .then(data => setResources(data))
      .catch(error => console.error('Error fetching resources:', error));
  };

  const fetchComments = (resourceId: number) => {
    fetch(`http://localhost:3000/resources/${resourceId}/comments`, { credentials: 'include' })
      .then(response => response.json())
      .then(data => setComments(prev => ({ ...prev, [resourceId]: data })))
      .catch(error => console.error('Error fetching comments:', error));
  };

  const handleAddComment = (resourceId: number) => {
    if (!newComment.trim()) return;
    fetch(`http://localhost:3000/resources/${resourceId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content: newComment }),
    })
      .then(response => response.json())
      .then(newCommentData => {
        setComments(prev => ({
          ...prev,
          [resourceId]: [...(prev[resourceId] || []), newCommentData],
        }));
        setNewComment('');
      })
      .catch(error => console.error('Error adding comment:', error));
  };

  const handleUpvote = (resourceId: number) => {
    fetch(`http://localhost:3000/resources/${resourceId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to upvote');
        return response.json();
      })
      .then(data => {
        setResources(resources.map(r => 
          r.id === resourceId ? { ...r, upvotes: data.upvotes } : r
        ));
      })
      .catch(error => console.error('Error upvoting resource:', error));
  };

  const handlePreview = (resourceId: number) => {
    fetch(`http://localhost:3000/resources/${resourceId}/preview`, { credentials: 'include' })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch preview');
        return response.json();
      })
      .then(data => setPreviewResource({ id: resourceId, preview: data.preview }))
      .catch(error => console.error('Error fetching preview:', error));
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;

    fetch(`http://localhost:3000/resources/${editingResource.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        title: editingResource.title,
        description: editingResource.description,
        subject: editingResource.subject,
      }),
    })
      .then(response => response.json())
      .then(updatedResource => {
        setResources(resources.map(r => (r.id === updatedResource.id ? { ...updatedResource, tags: r.tags, upvotes: r.upvotes, verified: r.verified } : r)));
        setEditingResource(null);
        alert('Resource updated successfully!');
      })
      .catch(error => console.error('Error updating resource:', error));
  };

  const handleDelete = (id: number) => {
    fetch(`http://localhost:3000/resources/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(response => {
        if (response.ok) {
          setResources(resources.filter(r => r.id !== id));
          setComments(prev => {
            const newComments = { ...prev };
            delete newComments[id];
            return newComments;
          });
          alert('Resource deleted successfully!');
        } else {
          return response.json().then(data => {
            throw new Error(data.error || 'Failed to delete resource');
          });
        }
      })
      .catch(error => {
        console.error('Error deleting resource:', error);
        alert('Error deleting resource: ' + error.message);
      });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '64rem', margin: '0 auto', fontFamily: 'Roboto, sans-serif' }}>
      <h1 style={{ color: '#2563eb', fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', textAlign: 'center' }}>
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
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'}
          >
            {editingResource && editingResource.id === resource.id ? (
              <form onSubmit={handleSaveEdit} style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <input
                  value={editingResource.title}
                  onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                />
                <input
                  value={editingResource.description}
                  onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                />
                <input
                  value={editingResource.subject}
                  onChange={(e) => setEditingResource({ ...editingResource, subject: e.target.value })}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                />
                <button
                  type="submit"
                  style={{ backgroundColor: '#10b981', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingResource(null)}
                  style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <div style={{ flex: 1 }}>
                  <span style={{ color: '#1f2937' }}>
                    <strong>{resource.title}</strong> - {resource.description} (Subject: {resource.subject}, Tags: {resource.tags.join(', ') || 'None'}, Upvotes: {resource.upvotes}, Added: {formatDate(resource.created_at)}, By: {resource.username || 'Anonymous'}{resource.verified ? ' ✅' : ''})
                    {resource.file_path && (
                      <>
                        <a
                          href={`http://localhost:3000${resource.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#3b82f6', marginLeft: '0.5rem', textDecoration: 'underline' }}
                        >
                          Download
                        </a>
                        <button
                          onClick={() => handlePreview(resource.id)}
                          style={{
                            backgroundColor: '#eab308',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '0.25rem',
                            border: 'none',
                            cursor: 'pointer',
                            marginLeft: '0.5rem',
                            transition: 'box-shadow 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'}
                          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                        >
                          Preview
                        </button>
                      </>
                    )}
                  </span>
                  <button
                    onClick={() => handleUpvote(resource.id)}
                    style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.25rem',
                      border: 'none',
                      cursor: 'pointer',
                      marginLeft: '0.5rem',
                      transition: 'box-shadow 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                  >
                    Upvote
                  </button>
                  <div style={{ marginTop: '0.5rem' }}>
                    <button
                      onClick={() => fetchComments(resource.id)}
                      style={{ color: '#2563eb', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Show Comments ({(comments[resource.id] || []).length})
                    </button>
                    {comments[resource.id] && (
                      <ul style={{ marginTop: '0.5rem', listStyle: 'none', paddingLeft: '1rem' }}>
                        {comments[resource.id].map(comment => (
                          <li key={comment.id} style={{ color: '#1f2937', marginBottom: '0.5rem' }}>
                            <strong>{comment.username || 'Anonymous'}:</strong> {comment.content} ({formatDate(comment.created_at)})
                          </li>
                        ))}
                      </ul>
                    )}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddComment(resource.id);
                      }}
                      style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}
                    >
                      <input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment"
                        style={{ padding: '0.25rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                      />
                      <button
                        type="submit"
                        style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                      >
                        Post
                      </button>
                    </form>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleEdit(resource)}
                    style={{
                      backgroundColor: '#eab308',
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
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(resource.id)}
                    style={{
                      backgroundColor: '#ef4444',
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
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {previewResource && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          maxWidth: '80%',
          maxHeight: '80%',
          overflow: 'auto',
        }}>
          <h2 style={{ color: '#2563eb', fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            Preview: {resources.find(r => r.id === previewResource.id)?.title}
          </h2>
          <pre style={{ color: '#1f2937', whiteSpace: 'pre-wrap' }}>{previewResource.preview}</pre>
          <button
            onClick={() => setPreviewResource(null)}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              border: 'none',
              cursor: 'pointer',
              marginTop: '1rem',
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Resources;