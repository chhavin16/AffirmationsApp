import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAffirmations } from '../context/AffirmationsContext';
import './GetStarted.css';

function GetStarted() {
  const [showReject, setShowReject] = useState(false);
  const { acceptTerms } = useAffirmations();
  const navigate = useNavigate();

  const handleAccept = () => {
    acceptTerms();
    navigate('/home');
  };

  const handleReject = () => {
    setShowReject(true);
  };

  const handleReconsider = () => {
    setShowReject(false);
  };

  if (showReject) {
    return (
      <div className="get-started-page">
        <div className="get-started-container reject-view">
          <div className="reject-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="30" stroke="var(--green-muted)" strokeWidth="2" />
              <path d="M24 24L40 40M40 24L24 40" stroke="var(--green-muted)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h2>We understand</h2>
          <p className="reject-message">
            That's okay. But remember, positive affirmations can make a real
            difference in your daily life. A few words of kindness to yourself
            each day can transform your mindset.
          </p>
          <p className="reject-submessage">
            Would you like to reconsider and start your journey toward a
            more positive you?
          </p>
          <div className="reject-actions">
            <button className="btn-primary" onClick={handleReconsider}>
              Yes, let me try
            </button>
            <button className="btn-text" onClick={() => setShowReject(true)}>
              Maybe later
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="get-started-page">
      <div className="get-started-container">
        <div className="leaf-decoration top-left">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M8 40C8 40 12 8 40 8C40 8 36 40 8 40Z" fill="var(--green-lighter)" stroke="var(--green-light)" strokeWidth="1.5"/>
            <path d="M8 40C8 40 24 24 40 8" stroke="var(--green-light)" strokeWidth="1" opacity="0.5"/>
          </svg>
        </div>
        <div className="leaf-decoration top-right">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M40 40C40 40 36 8 8 8C8 8 12 40 40 40Z" fill="var(--green-lighter)" stroke="var(--green-light)" strokeWidth="1.5"/>
            <path d="M40 40C40 40 24 24 8 8" stroke="var(--green-light)" strokeWidth="1" opacity="0.5"/>
          </svg>
        </div>

        <div className="get-started-content">
          <div className="app-icon">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="26" fill="var(--green-primary)" />
              <path d="M20 28L26 34L36 22" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1>Welcome to Affirmations</h1>

          <p className="subtitle">
            Your personal space for positive thinking and self-growth
          </p>

          <div className="commitment-card">
            <h3>Your Commitment to Positivity</h3>
            <p>
              By continuing, you agree to embark on a journey of self-improvement
              through daily affirmations. This app will help you:
            </p>
            <ul>
              <li>Write and track your personal affirmations</li>
              <li>Record your voice saying affirmations to replay anytime</li>
              <li>Build a consistent daily practice with reminders</li>
              <li>Track your progress and build positive streaks</li>
            </ul>
            <p className="commitment-note">
              Consistency is key. We'll send you gentle reminders twice a day
              to help you stay on track.
            </p>
          </div>

          <div className="get-started-actions">
            <button className="btn-primary btn-large" onClick={handleAccept}>
              I'm Ready — Let's Begin
            </button>
            <button className="btn-secondary" onClick={handleReject}>
              Not right now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetStarted;
