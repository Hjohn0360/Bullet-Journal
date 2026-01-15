import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionApi } from '../../services/api';

interface Question {
  id?: string;
  questionText: string;
  isActive: boolean;
  createdDate?: string;
  createdBy?: string;
}

const QuestionManagement: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  // Form state for creating/editing questions
  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    isActive: true,
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await questionApi.getAll();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async () => {
    try {
      await questionApi.create({
        questionText: questionForm.questionText,
        isActive: questionForm.isActive,
      });

      await fetchQuestions();
      resetForm();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion?.id) return;

    try {
      await questionApi.update(editingQuestion.id, {
        questionText: questionForm.questionText,
        isActive: questionForm.isActive,
      });

      await fetchQuestions();
      resetForm();
      setEditingQuestion(null);
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      await questionApi.delete(questionId);
      await fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const resetForm = () => {
    setQuestionForm({
      questionText: '',
      isActive: true,
    });
  };

  const startEdit = (question: Question) => {
    setEditingQuestion(question);
    setQuestionForm({
      questionText: question.questionText,
      isActive: question.isActive,
    });
  };

  // Filter questions based on search
  const filteredQuestions = questions.filter(question => {
    const questionText = question.questionText || '';
    return questionText.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="question-management">
      <div className="management-header">
        <h1>Question Management</h1>
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          + Create New Question
        </button>
      </div>

      {/* Search */}
      <div className="filters-section">
        <input
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Questions List */}
      <div className="questions-section">
        {loading ? (
          <div className="loading">Loading questions...</div>
        ) : (
          <div className="questions-grid">
            {filteredQuestions.map((question) => (
              <div key={question.id} className="question-card">
                <div className="question-header">
                  <span className={`status-badge ${question.isActive ? 'active' : 'inactive'}`}>
                    {question.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="question-content">
                  <p className="question-text">{question.questionText || 'No question text'}</p>
                  
                  {question.createdDate && (
                    <p className="question-date">
                      Created: {new Date(question.createdDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="question-actions">
                  <button onClick={() => startEdit(question)} className="btn-edit">
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteQuestion(question.id!)} 
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredQuestions.length === 0 && (
          <div className="no-questions">
            <p>No questions found.</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingQuestion) && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingQuestion ? 'Edit Question' : 'Create New Question'}</h2>
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingQuestion(null);
                  resetForm();
                }}
                className="btn-close"
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              <div className="form-group">
                <label>Question Text:</label>
                <textarea
                  value={questionForm.questionText}
                  onChange={(e) => setQuestionForm({...questionForm, questionText: e.target.value})}
                  placeholder="Enter your question here..."
                  rows={4}
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={questionForm.isActive}
                    onChange={(e) => setQuestionForm({...questionForm, isActive: e.target.checked})}
                  />
                  Active (available for users)
                </label>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingQuestion(null);
                  resetForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}
                className="btn-primary"
                disabled={!questionForm.questionText.trim()}
              >
                {editingQuestion ? 'Update Question' : 'Create Question'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionManagement;