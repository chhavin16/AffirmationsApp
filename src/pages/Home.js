import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAffirmations } from '../context/AffirmationsContext';
import { setupDailyReminders, requestNotificationPermission } from '../utils/notifications';
import './Home.css';

function Home() {
  const { affirmations, recordings, getStreakCount, getTodayProgress, reminders } = useAffirmations();
  const progress = getTodayProgress();
  const streak = getStreakCount();

  useEffect(() => {
    if (reminders.enabled) {
      requestNotificationPermission().then((granted) => {
        if (granted) {
          setupDailyReminders(reminders.morning, reminders.evening, true);
        }
      });
    }
  }, [reminders]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="greeting-section">
          <h1>{getGreeting()}</h1>
          <p className="date-text">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </header>

      <div className="home-content">
        {/* Progress Card */}
        <div className="progress-card">
          <div className="progress-header">
            <h3>Today's Progress</h3>
            <span className="streak-badge">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L9.5 6H13L10 8.5L11.5 13L8 10.5L4.5 13L6 8.5L3 6H6.5L8 2Z" fill="#f39c12"/>
              </svg>
              {streak} day streak
            </span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress.percentage}%` }} />
          </div>
          <p className="progress-text">
            {progress.completed} of {progress.total} affirmations completed today
          </p>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link to="/write" className="action-card write-action">
            <div className="action-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M5 20L18 7L21 10L8 23H5V20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 10L18 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Write</h3>
            <p>Create new affirmations</p>
          </Link>

          <Link to="/record" className="action-card record-action">
            <div className="action-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="10" y="4" width="8" height="14" rx="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M6 14C6 18.4183 9.58172 22 14 22C18.4183 22 22 18.4183 22 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M14 22V26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Record</h3>
            <p>Record your voice</p>
          </Link>

          <Link to="/track" className="action-card track-action">
            <div className="action-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="4" y="4" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M10 14L13 17L18 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Track</h3>
            <p>Mark today's practice</p>
          </Link>

          <Link to="/reminders" className="action-card reminder-action">
            <div className="action-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 4C9.58172 4 6 7.58172 6 12V18L4 20V21H24V20L22 18V12C22 7.58172 18.4183 4 14 4Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M11 21C11 22.6569 12.3431 24 14 24C15.6569 24 17 22.6569 17 21" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Reminders</h3>
            <p>Set daily reminders</p>
          </Link>
        </div>

        {/* Recent Affirmations */}
        <div className="recent-section">
          <div className="section-header">
            <h3>Recent Affirmations</h3>
            {affirmations.length > 0 && (
              <Link to="/write" className="see-all-link">See all</Link>
            )}
          </div>
          {affirmations.length === 0 ? (
            <div className="empty-state">
              <p>No affirmations yet. Start by writing your first one!</p>
              <Link to="/write" className="btn-primary btn-small">Write your first affirmation</Link>
            </div>
          ) : (
            <div className="affirmation-list-preview">
              {affirmations.slice(0, 3).map(aff => (
                <div key={aff.id} className="affirmation-preview-item">
                  <span className="quote-mark">"</span>
                  <p>{aff.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Recordings */}
        {recordings.length > 0 && (
          <div className="recent-section">
            <div className="section-header">
              <h3>Recent Recordings</h3>
              <Link to="/record" className="see-all-link">See all</Link>
            </div>
            <div className="recordings-preview">
              {recordings.slice(0, 2).map(rec => (
                <div key={rec.id} className="recording-preview-item">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" stroke="var(--green-primary)" strokeWidth="1.5"/>
                    <polygon points="8,6 15,10 8,14" fill="var(--green-primary)"/>
                  </svg>
                  <span>{rec.title || 'Untitled Recording'}</span>
                  <span className="recording-date">
                    {new Date(rec.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
