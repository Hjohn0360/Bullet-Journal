import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const HomePage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Bullet Journal</h1>
        <p>Your personal digital journal for tracking thoughts, goals, and daily reflections.</p>
        
        <div className="hero-buttons">
          <button 
            className="btn-primary"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/register')}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;