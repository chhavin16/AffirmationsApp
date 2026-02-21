import React, { useState } from 'react';
import { useAffirmations } from '../context/AffirmationsContext';
import './WriteAffirmations.css';

function WriteAffirmations() {
  const [newAffirmation, setNewAffirmation] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const { affirmations, addAffirmation, deleteAffirmation, editAffirmation } = useAffirmations();

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = newAffirmation.trim();
    if (!text) return;
    addAffirmation(text);
    setNewAffirmation('');
  };

  const handleStartEdit = (affirmation) => {
    setEditingId(affirmation.id);
    setEditText(affirmation.text);
  };

  const handleSaveEdit = (id) => {
    const text = editText.trim();
    if (!text) return;
    editAffirmation(id, text);
    setEditingId(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this affirmation?')) {
      deleteAffirmation(id);
    }
  };

  return (
    <div className="write-page">
      <header className="page-header">
        <h1>Write Affirmations</h1>
        <p>Express your positive thoughts and beliefs</p>
      </header>

      <div className="write-content">
        <form className="affirmation-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="affirmation-input">New Affirmation</label>
            <textarea
              id="affirmation-input"
              value={newAffirmation}
              onChange={(e) => setNewAffirmation(e.target.value)}
              placeholder="I am worthy of love and happiness..."
              rows={3}
              maxLength={500}
            />
            <span className="char-count">{newAffirmation.length}/500</span>
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={!newAffirmation.trim()}
          >
            Add Affirmation
          </button>
        </form>

        <div className="affirmations-list">
          <h3>Your Affirmations ({affirmations.length})</h3>
          {affirmations.length === 0 ? (
            <div className="empty-list">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M8 40C8 40 12 8 40 8C40 8 36 40 8 40Z" fill="var(--green-lighter)" stroke="var(--green-light)" strokeWidth="1.5"/>
              </svg>
              <p>No affirmations yet. Start by writing one above!</p>
            </div>
          ) : (
            affirmations.map(aff => (
              <div key={aff.id} className="affirmation-item">
                {editingId === aff.id ? (
                  <div className="edit-mode">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={2}
                      maxLength={500}
                    />
                    <div className="edit-actions">
                      <button className="btn-save" onClick={() => handleSaveEdit(aff.id)}>
                        Save
                      </button>
                      <button className="btn-cancel" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="affirmation-text">
                      <span className="quote-icon">"</span>
                      <p>{aff.text}</p>
                    </div>
                    <div className="affirmation-meta">
                      <span className="created-date">
                        {new Date(aff.createdAt).toLocaleDateString()}
                      </span>
                      <div className="item-actions">
                        <button
                          className="icon-btn"
                          onClick={() => handleStartEdit(aff)}
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 11.5L11 3.5L12.5 5L4.5 13H3V11.5Z" stroke="currentColor" strokeWidth="1.5"/>
                          </svg>
                        </button>
                        <button
                          className="icon-btn delete"
                          onClick={() => handleDelete(aff.id)}
                          title="Delete"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default WriteAffirmations;
