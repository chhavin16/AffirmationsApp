import React from 'react';
import { useAffirmations } from '../context/AffirmationsContext';
import { Link } from 'react-router-dom';
import './TrackAffirmations.css';

function TrackAffirmations() {
  const { affirmations, tracker, markAffirmationDone, getStreakCount, getTodayProgress } = useAffirmations();
  const progress = getTodayProgress();
  const streak = getStreakCount();
  const today = new Date().toISOString().split('T')[0];
  const todayData = tracker[today] || {};

  // Build last 7 days for the mini calendar
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    last7Days.push({
      date: dateStr,
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: date.getDate(),
      hasActivity: tracker[dateStr] && Object.keys(tracker[dateStr]).length > 0,
      isToday: i === 0,
    });
  }

  return (
    <div className="track-page">
      <header className="page-header">
        <h1>Track Progress</h1>
        <p>Mark your daily affirmation practice</p>
      </header>

      <div className="track-content">
        {/* Stats Overview */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-value">{streak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{progress.percentage}%</span>
            <span className="stat-label">Today</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{affirmations.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>

        {/* Weekly View */}
        <div className="weekly-view">
          <h3>This Week</h3>
          <div className="week-grid">
            {last7Days.map(day => (
              <div
                key={day.date}
                className={`day-cell ${day.hasActivity ? 'active' : ''} ${day.isToday ? 'today' : ''}`}
              >
                <span className="day-label">{day.day}</span>
                <div className="day-circle">
                  {day.hasActivity ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 8L7 11L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span>{day.dayNum}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Affirmations Checklist */}
        <div className="today-checklist">
          <h3>Today's Affirmations</h3>
          {affirmations.length === 0 ? (
            <div className="empty-checklist">
              <p>No affirmations to track yet.</p>
              <Link to="/write" className="btn-primary btn-small">Write your first one</Link>
            </div>
          ) : (
            <div className="checklist-items">
              {affirmations.map(aff => {
                const isDone = todayData[aff.id] && todayData[aff.id].length > 0;
                return (
                  <div
                    key={aff.id}
                    className={`checklist-item ${isDone ? 'done' : ''}`}
                  >
                    <button
                      className={`check-btn ${isDone ? 'checked' : ''}`}
                      onClick={() => !isDone && markAffirmationDone(aff.id)}
                      disabled={isDone}
                    >
                      {isDone ? (
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <circle cx="9" cy="9" r="8" fill="var(--green-primary)"/>
                          <path d="M5.5 9L8 11.5L12.5 6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <circle cx="9" cy="9" r="8" stroke="var(--green-lighter)" strokeWidth="2"/>
                        </svg>
                      )}
                    </button>
                    <p className="checklist-text">{aff.text}</p>
                    {isDone && (
                      <span className="done-time">
                        {new Date(todayData[aff.id][0]).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrackAffirmations;
