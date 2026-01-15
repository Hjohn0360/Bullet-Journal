import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../services/api';

interface User {
  id?: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isAdmin?: boolean;
  createdAt?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      // We'll need to add delete to userApi
      await userApi.delete(userId);
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. They may have associated data.');
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(user => {
    const username = user.username || '';
    const email = user.email || '';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    return username.toLowerCase().includes(searchTerm.toLowerCase()) ||
           email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           lastName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="question-management">
      <div className="management-header">
        <h1>User Management</h1>
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>
      </div>

      {/* Search */}
      <div className="filters-section">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Users List */}
      <div className="questions-section">
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <div className="questions-grid">
            {filteredUsers.map((user) => (
              <div key={user.id} className="question-card">
                <div className="question-header">
                  <span className={`status-badge ${user.isAdmin ? 'active' : 'inactive'}`}>
                    {user.isAdmin ? 'Admin' : 'User'}
                  </span>
                </div>
                
                <div className="question-content">
                  <h3 className="question-text">{user.username}</h3>
                  
                  <div style={{ marginTop: '10px' }}>
                    <p style={{ color: '#4a5568', marginBottom: '5px' }}>
                      <strong>Email:</strong> {user.email}
                    </p>
                    
                    {(user.firstName || user.lastName) && (
                      <p style={{ color: '#4a5568', marginBottom: '5px' }}>
                        <strong>Name:</strong> {user.firstName} {user.lastName}
                      </p>
                    )}
                    
                    {user.createdAt && (
                      <p className="question-date">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="question-actions">
                  <button 
                    onClick={() => setEditingUser(user)} 
                    className="btn-edit"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id!)} 
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="no-questions">
            <p>No users found.</p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>User Details</h2>
              <button 
                onClick={() => setEditingUser(null)}
                className="btn-close"
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Username:</strong> {editingUser.username}
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Email:</strong> {editingUser.email}
                </div>
                {editingUser.firstName && (
                  <div style={{ marginBottom: '15px' }}>
                    <strong>First Name:</strong> {editingUser.firstName}
                  </div>
                )}
                {editingUser.lastName && (
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Last Name:</strong> {editingUser.lastName}
                  </div>
                )}
                <div style={{ marginBottom: '15px' }}>
                  <strong>Role:</strong> {editingUser.isAdmin ? 'Administrator' : 'Regular User'}
                </div>
                {editingUser.createdAt && (
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Member Since:</strong> {new Date(editingUser.createdAt).toLocaleDateString()}
                  </div>
                )}
                <div style={{ marginBottom: '15px' }}>
                  <strong>User ID:</strong> <code>{editingUser.id}</code>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                onClick={() => setEditingUser(null)}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;