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

interface GroupedResponse {
  userId: string;
  date: string;
  answers: Answer[];
  user: User;
}

const ViewResponses: React.FC = () => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questions, setQuestions] = useState<{ [key: string]: Question }>({});
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [groupedResponses, setGroupedResponses] = useState<GroupedResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<GroupedResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (answers.length > 0 && Object.keys(users).length > 0) {
      groupResponsesByUserAndDate();
    }
  }, [answers, users]);

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

  const groupResponsesByUserAndDate = () => {
    // Group answers by userId and date
    const grouped: { [key: string]: GroupedResponse } = {};

    answers.forEach(answer => {
      const dateStr = new Date(answer.answerDate).toLocaleDateString();
      const key = `${answer.userId}-${dateStr}`;

      if (!grouped[key]) {
        grouped[key] = {
          userId: answer.userId,
          date: dateStr,
          answers: [],
          user: users[answer.userId] || { username: 'Unknown' }
        };
      }

      grouped[key].answers.push(answer);
    });

    // Convert to array and sort
    let groupedArray = Object.values(grouped);

    // Sort by date (newest first), then alphabetically by username
    groupedArray.sort((a, b) => {
      const dateA = new Date(a.answers[0].answerDate);
      const dateB = new Date(b.answers[0].answerDate);
      
      // Primary sort: by date (newest first)
      if (dateB.getTime() !== dateA.getTime()) {
        return dateB.getTime() - dateA.getTime();
      }
      
      // Secondary sort: alphabetically by username
      const usernameA = a.user.username.toLowerCase();
      const usernameB = b.user.username.toLowerCase();
      return usernameA.localeCompare(usernameB);
    });

    setGroupedResponses(groupedArray);
  };

  const handleViewDetails = (group: GroupedResponse) => {
    // Sort answers alphabetically by question text
    const sortedAnswers = [...group.answers].sort((a, b) => {
      const questionA = questions[a.questionId]?.questionText || '';
      const questionB = questions[b.questionId]?.questionText || '';
      return questionA.localeCompare(questionB);
    });

    setSelectedGroup({
      ...group,
      answers: sortedAnswers
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedGroup(null);
    setShowModal(false);
  };

  // Filter grouped responses based on search
  const filteredGroups = groupedResponses.filter(group => {
    const username = group.user.username.toLowerCase();
    const firstName = group.user.firstName?.toLowerCase() || '';
    const lastName = group.user.lastName?.toLowerCase() || '';
    const date = group.date.toLowerCase();
    
    const searchLower = searchTerm.toLowerCase();
    
    return username.includes(searchLower) ||
           firstName.includes(searchLower) ||
           lastName.includes(searchLower) ||
           date.includes(searchLower);
  });

  const getUserDisplayName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username;
  };

  return (
    <div className="view-responses">
      <div className="management-header">
        <h1>User Responses</h1>
        <p>View all user responses grouped by date</p>
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>
      </div>

      {/* Search */}
      <div className="filters-section">
        <input
          type="text"
          placeholder="Search by username or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Grouped Responses List */}
      <div className="responses-grid">
        {loading ? (
          <div className="loading">Loading responses...</div>
        ) : (
          <>
            {filteredGroups.map((group, index) => (
              <div key={`${group.userId}-${group.date}-${index}`} className="response-card">
                <div className="question-content">
                  <h3 className="response-question">
                    {getUserDisplayName(group.user)}
                  </h3>
                  
                  <p style={{ 
                    color: '#6B7280', 
                    fontSize: '16px',
                    marginBottom: '12px',
                    fontWeight: 500
                  }}>
                    Responses for {group.date}
                  </p>

                  <p style={{ 
                    color: '#9CA3AF', 
                    fontSize: '14px',
                    fontWeight: 600
                  }}>
                    {group.answers.length} {group.answers.length === 1 ? 'question' : 'questions'} answered
                  </p>
                </div>

                <div className="response-actions">
                  <button 
                    onClick={() => handleViewDetails(group)} 
                    className="btn-view-details"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {!loading && filteredGroups.length === 0 && (
          <div className="no-questions">
            <p>No responses found.</p>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {showModal && selectedGroup && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{getUserDisplayName(selectedGroup.user)} - {selectedGroup.date}</h2>
              <button onClick={closeModal} className="btn-close">×</button>
            </div>
            
            <div className="modal-content">
              <p style={{ 
                color: '#6B7280', 
                marginBottom: '24px',
                fontSize: '16px'
              }}>
                Total responses: {selectedGroup.answers.length}
              </p>

              {selectedGroup.answers.map((answer, index) => (
                <div 
                  key={answer.id || index} 
                  style={{ 
                    marginBottom: '28px',
                    paddingBottom: '28px',
                    borderBottom: index < selectedGroup.answers.length - 1 ? '1px solid #FFE5F1' : 'none'
                  }}
                >
                  <div className="view-question-text">
                    <h3 style={{ color: '#FF69B4' }}>Question {index + 1}:</h3>
                    <p style={{ fontWeight: 600, color: '#1a202c', marginBottom: '12px' }}>
                      {questions[answer.questionId]?.questionText || 'Question not found'}
                    </p>
                  </div>

                  <div className="view-question-text">
                    <h3>Response:</h3>
                    <div className="response-answer">
                      {answer.answerText || 'No response text'}
                    </div>
                  </div>

                  <p style={{ 
                    fontSize: '14px', 
                    color: '#9CA3AF',
                    marginTop: '12px'
                  }}>
                    Answered at: {answer.answerTime || 'Unknown time'}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="modal-actions">
              <button onClick={closeModal} className="btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewResponses;