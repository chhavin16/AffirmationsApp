import React, { useState } from 'react';
import { useAffirmations } from '../context/AffirmationsContext';
import { requestNotificationPermission, setupDailyReminders } from '../utils/notifications';
import './Reminders.css';

function Reminders() {
  const { reminders, updateReminders } = useAffirmations();
  const [notificationStatus, setNotificationStatus] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );
  const [saved, setSaved] = useState(false);

  const handleToggle = async () => {
    if (!reminders.enabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        const newReminders = { ...reminders, enabled: true };
        updateReminders(newReminders);
        setupDailyReminders(newReminders.morning, newReminders.evening, true);
        setNotificationStatus('granted');
      } else {
        setNotificationStatus(Notification.permission);
        alert('Please enable notifications in your browser settings to use reminders.');
      }
    } else {
      const newReminders = { ...reminders, enabled: false };
      updateReminders(newReminders);
      setupDailyReminders(newReminders.morning, newReminders.evening, false);
    }
  };

  const handleTimeChange = (field, value) => {
    const newReminders = { ...reminders, [field]: value };
    updateReminders(newReminders);
    if (newReminders.enabled) {
      setupDailyReminders(newReminders.morning, newReminders.evening, true);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTestNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Test Affirmation Reminder', {
        body: 'This is a test! Say your affirmations out loud right now.',
        icon: '/logo192.png',
      });
    }
  };

  return (
    <div className="reminders-page">
      <header className="page-header">
        <h1>Daily Reminders</h1>
        <p>Stay consistent with twice-daily nudges</p>
      </header>

      <div className="reminders-content">
        {/* Enable/Disable Toggle */}
        <div className="reminder-card toggle-card">
          <div className="toggle-info">
            <div className="toggle-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 3C8.13401 3 5 6.13401 5 10V16L3 18V19H21V18L19 16V10C19 6.13401 15.866 3 12 3Z" stroke="var(--green-primary)" strokeWidth="2"/>
                <path d="M9 19C9 20.6569 10.3431 22 12 22C13.6569 22 15 20.6569 15 19" stroke="var(--green-primary)" strokeWidth="2"/>
              </svg>
            </div>
            <div>
              <h3>Enable Reminders</h3>
              <p>Get notified twice a day to say your affirmations</p>
            </div>
          </div>
          <button
            className={`toggle-switch ${reminders.enabled ? 'active' : ''}`}
            onClick={handleToggle}
          >
            <span className="toggle-knob" />
          </button>
        </div>

        {notificationStatus === 'denied' && (
          <div className="notification-warning">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#e67e22" strokeWidth="1.5"/>
              <path d="M10 6V11" stroke="#e67e22" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="10" cy="14" r="1" fill="#e67e22"/>
            </svg>
            <p>
              Notifications are blocked. Please enable them in your browser
              settings to receive reminders.
            </p>
          </div>
        )}

        {/* Time Settings */}
        <div className={`time-settings ${!reminders.enabled ? 'disabled' : ''}`}>
          <div className="reminder-card time-card">
            <div className="time-header">
              <div className="time-icon morning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 2V4M12 20V22M4 12H2M22 12H20M5.64 5.64L4.22 4.22M18.36 5.64L19.78 4.22M5.64 18.36L4.22 19.78M18.36 18.36L19.78 19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h3>Morning Reminder</h3>
                <p>Start your day with positive energy</p>
              </div>
            </div>
            <input
              type="time"
              value={reminders.morning}
              onChange={(e) => handleTimeChange('morning', e.target.value)}
              disabled={!reminders.enabled}
              className="time-input"
            />
          </div>

          <div className="reminder-card time-card">
            <div className="time-header">
              <div className="time-icon evening">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3>Evening Reminder</h3>
                <p>Reflect and reaffirm before rest</p>
              </div>
            </div>
            <input
              type="time"
              value={reminders.evening}
              onChange={(e) => handleTimeChange('evening', e.target.value)}
              disabled={!reminders.enabled}
              className="time-input"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="reminder-actions">
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={!reminders.enabled}
          >
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
          {reminders.enabled && notificationStatus === 'granted' && (
            <button className="btn-outline" onClick={handleTestNotification}>
              Test Notification
            </button>
          )}
        </div>

        {/* Info */}
        <div className="reminder-info">
          <h4>How it works</h4>
          <ul>
            <li>You'll receive a gentle notification at your chosen times</li>
            <li>Open the app and mark your affirmations as complete</li>
            <li>Build a streak by practicing every day</li>
            <li>Consistency leads to a more positive mindset</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Reminders;
