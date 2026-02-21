import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AffirmationsProvider, useAffirmations } from './context/AffirmationsContext';
import BottomNav from './components/BottomNav';
import GetStarted from './pages/GetStarted';
import Home from './pages/Home';
import WriteAffirmations from './pages/WriteAffirmations';
import RecordAffirmations from './pages/RecordAffirmations';
import TrackAffirmations from './pages/TrackAffirmations';
import Reminders from './pages/Reminders';
import './App.css';

function AppRoutes() {
  const { hasAccepted } = useAffirmations();

  if (!hasAccepted) {
    return (
      <Routes>
        <Route path="*" element={<GetStarted />} />
      </Routes>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/write" element={<WriteAffirmations />} />
        <Route path="/record" element={<RecordAffirmations />} />
        <Route path="/track" element={<TrackAffirmations />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <AffirmationsProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AffirmationsProvider>
  );
}

export default App;
