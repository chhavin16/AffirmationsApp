import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AffirmationsContext = createContext();

const STORAGE_KEYS = {
  AFFIRMATIONS: 'affirmations_list',
  RECORDINGS: 'affirmations_recordings',
  TRACKER: 'affirmations_tracker',
  ACCEPTED: 'affirmations_accepted',
  REMINDERS: 'affirmations_reminders',
};

export function AffirmationsProvider({ children }) {
  const [affirmations, setAffirmations] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AFFIRMATIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [recordings, setRecordings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECORDINGS);
    return saved ? JSON.parse(saved) : [];
  });

  const [tracker, setTracker] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRACKER);
    return saved ? JSON.parse(saved) : {};
  });

  const [hasAccepted, setHasAccepted] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.ACCEPTED) === 'true';
  });

  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    return saved ? JSON.parse(saved) : { enabled: false, morning: '08:00', evening: '20:00' };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AFFIRMATIONS, JSON.stringify(affirmations));
  }, [affirmations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(recordings));
  }, [recordings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRACKER, JSON.stringify(tracker));
  }, [tracker]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  }, [reminders]);

  const acceptTerms = useCallback(() => {
    setHasAccepted(true);
    localStorage.setItem(STORAGE_KEYS.ACCEPTED, 'true');
  }, []);

  const addAffirmation = useCallback((text) => {
    const newAffirmation = {
      id: Date.now().toString(),
      text,
      createdAt: new Date().toISOString(),
      category: 'general',
    };
    setAffirmations(prev => [newAffirmation, ...prev]);
    return newAffirmation;
  }, []);

  const deleteAffirmation = useCallback((id) => {
    setAffirmations(prev => prev.filter(a => a.id !== id));
  }, []);

  const editAffirmation = useCallback((id, newText) => {
    setAffirmations(prev =>
      prev.map(a => (a.id === id ? { ...a, text: newText } : a))
    );
  }, []);

  const addRecording = useCallback((recording) => {
    const newRecording = {
      id: Date.now().toString(),
      ...recording,
      createdAt: new Date().toISOString(),
    };
    setRecordings(prev => [newRecording, ...prev]);
    return newRecording;
  }, []);

  const deleteRecording = useCallback((id) => {
    setRecordings(prev => {
      const recording = prev.find(r => r.id === id);
      if (recording && recording.audioUrl) {
        URL.revokeObjectURL(recording.audioUrl);
      }
      return prev.filter(r => r.id !== id);
    });
  }, []);

  const markAffirmationDone = useCallback((affirmationId) => {
    const today = new Date().toISOString().split('T')[0];
    setTracker(prev => {
      const dayData = prev[today] || {};
      const affirmationEntries = dayData[affirmationId] || [];
      return {
        ...prev,
        [today]: {
          ...dayData,
          [affirmationId]: [...affirmationEntries, new Date().toISOString()],
        },
      };
    });
  }, []);

  const getStreakCount = useCallback(() => {
    const dates = Object.keys(tracker).sort().reverse();
    if (dates.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < dates.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      if (tracker[dateStr] && Object.keys(tracker[dateStr]).length > 0) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [tracker]);

  const getTodayProgress = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayData = tracker[today] || {};
    const completedCount = Object.keys(todayData).length;
    const totalCount = affirmations.length;
    return {
      completed: completedCount,
      total: totalCount,
      percentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
    };
  }, [tracker, affirmations]);

  const updateReminders = useCallback((newReminders) => {
    setReminders(newReminders);
  }, []);

  const value = {
    affirmations,
    recordings,
    tracker,
    hasAccepted,
    reminders,
    acceptTerms,
    addAffirmation,
    deleteAffirmation,
    editAffirmation,
    addRecording,
    deleteRecording,
    markAffirmationDone,
    getStreakCount,
    getTodayProgress,
    updateReminders,
  };

  return (
    <AffirmationsContext.Provider value={value}>
      {children}
    </AffirmationsContext.Provider>
  );
}

export function useAffirmations() {
  const context = useContext(AffirmationsContext);
  if (!context) {
    throw new Error('useAffirmations must be used within an AffirmationsProvider');
  }
  return context;
}
