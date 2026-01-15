import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { answerApi, questionApi, userApi } from '../../services/api';

interface Answer {
  id?: string;
  questionId: string;
  userId: string;
  answerText: string;
  answerDate: string;
  answerTime: string;
}

interface Question {
  id?: string;
  questionText: string;
}

interface User {
  id?: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

const ViewResponses: React.FC = () => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questions, setQuestions] = useState<{ [key: string]: Question }>({});
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all answers
      const answersData = await answerApi.getAll();
      setAnswers(answersData);
      
      // Fetch all questions
      const questionsData = await questionApi.getAll();
      const questionsMap: { [key: string]: Question } = {};
      questionsData.forEach((q: Question) => {
        if (q.id) {
          questionsMap[q.id] = q;
        }
      });
      setQuestions(questionsMap);
      
      // Fetch all users
      const usersData = await userApi.getAll();
      const usersMap: { [key: string]: User } = {};
      usersData.forEach((u: User) => {
        if (u.id) {
          usersMap[u.id] = u;
        }
      });
      setUsers(usersMap);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (answerId: string) => {
    if (!window.confirm('Are you sure you want to delete this response?')) return;
    
    try {
      await answerApi.delete(answerId);
      await fetchData();
    } catch (error) {
      console.error('Error deleting answer:', error);
    }
  };

  // Filter answers based on search
  const filteredAnswers = answers.filter(answer => {
    const question = questions[answer.questionId];
    const user = users[answer.userId];
    const questionText = question?.questionText || '';
    const answerText = answer.answerText || '';
    const username = user?.username || '';
    
    return questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
           answerText.toLowerCase().includes(searchTerm.toLowerCase()) ||
           username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="question-management">
      <div className="management-header">
        <h1>User Responses</h1>
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>
      </div>

      {/* Search */}
      <div className="filters-section">
        <input
          type="text"
          placeholder="Search responses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Responses List */}
      <div className="questions-section">
        {loading ? (
          <div className="loading">Loading responses...</div>
        ) : (
          <div className="questions-grid">
            {filteredAnswers.map((answer) => {
              const question = questions[answer.questionId];
              const user = users[answer.userId];
              
              return (
                <div key={answer.id} className="question-card">
                  <div className="question-content">
                    <h3 className="question-text">
                      {question?.questionText || 'Question not found'}
                    </h3>
                    
                    <div style={{ 
                      background: '#f7fafc', 
                      padding: '15px', 
                      borderRadius: '8px',
                      margin: '10px 0' 
                    }}>
                      <p style={{ 
                        color: '#2d3748', 
                        fontWeight: 500,
                        marginBottom: '5px' 
                      }}>
                        Response:
                      </p>
                      <p style={{ color: '#4a5568' }}>
                        {answer.answerText || 'No response text'}
                      </p>
                    </div>
                    
                    <p className="question-date">
                      Answered: {answer.answerDate ? new Date(answer.answerDate).toLocaleDateString() : 'Unknown date'}
                    </p>
                    
                    <p style={{ color: '#718096', fontSize: '0.9rem' }}>
                      User: {user?.username || 'Unknown user'}
                      {user?.firstName && user?.lastName && ` (${user.firstName} ${user.lastName})`}
                    </p>
                  </div>

                  <div className="question-actions">
                    <button 
                      onClick={() => handleDelete(answer.id!)} 
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredAnswers.length === 0 && (
          <div className="no-questions">
            <p>No responses found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewResponses;