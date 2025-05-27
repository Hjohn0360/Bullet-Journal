import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 onClick={() => navigate('/dashboard')} className="logo">
            Bullet Journal
          </h1>
        </div>
        
        <div className="header-center">
          <nav className="nav">
            <button 
              className="nav-button"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>
            
            {isAdmin && (
              <button 
                className="nav-button admin-nav"
                onClick={() => navigate('/admin/questions')}
              >
                Manage Questions
              </button>
            )}
            
            {!isAdmin && (
              <button 
                className="nav-button"
                onClick={() => navigate('/questions')}
              >
                Answer Questions
              </button>
            )}
          </nav>
        </div>

        <div className="header-right">
          <div className="user-info">
            <span className="user-name">
              {user.firstName} {user.lastName}
            </span>
            {isAdmin && <span className="admin-badge">Admin</span>}
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;