import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/common/Layout';

const DashboardPage: React.FC = () => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Welcome back, {user.firstName}!</h1>
          <p className="dashboard-subtitle">
            {isAdmin 
              ? "Manage questions and view user responses." 
              : "Ready to answer some questions and track your thoughts?"
            }
          </p>
        </div>

        <div className="dashboard-content">
          {isAdmin ? (
            <div className="admin-dashboard">
              <div className="dashboard-card">
                <h3>Question Management</h3>
                <p>Create, edit, and manage questions for users to answer.</p>
                <button className="btn-primary">
                  Manage Questions
                </button>
              </div>

              <div className="dashboard-card">
                <h3>User Responses</h3>
                <p>View and analyze user responses to questions.</p>
                <button className="btn-secondary">
                  View Responses
                </button>
              </div>

              <div className="dashboard-card">
                <h3>User Management</h3>
                <p>Manage user accounts and permissions.</p>
                <button className="btn-secondary">
                  Manage Users
                </button>
              </div>
            </div>
          ) : (
            <div className="user-dashboard">
              <div className="dashboard-card">
                <h3>Daily Questions</h3>
                <p>Answer today's reflection questions.</p>
                <button className="btn-primary">
                  Start Answering
                </button>
              </div>

              <div className="dashboard-card">
                <h3>My Responses</h3>
                <p>View your previous answers and track your progress.</p>
                <button className="btn-secondary">
                  View History
                </button>
              </div>

              <div className="dashboard-card">
                <h3>Weekly Review</h3>
                <p>Reflect on your week and set new goals.</p>
                <button className="btn-secondary">
                  Weekly Review
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;