import React, { useState, useRef, useEffect } from 'react';
import { useAffirmations } from '../context/AffirmationsContext';
import { AudioRecorder } from '../utils/audioRecorder';
import './RecordAffirmations.css';

function RecordAffirmations() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingTitle, setRecordingTitle] = useState('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const { recordings, addRecording, deleteRecording } = useAffirmations();

  const recorderRef = useRef(new AudioRecorder());
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      await recorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Could not access microphone. Please allow microphone access and try again.');
    }
  };

  const stopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const result = await recorderRef.current.stop();
    setIsRecording(false);

    if (result) {
      addRecording({
        title: recordingTitle.trim() || `Recording ${recordings.length + 1}`,
        audioUrl: result.audioUrl,
        duration: recordingTime,
      });
      setRecordingTitle('');
      setRecordingTime(0);
    }
  };

  const playRecording = (recording) => {
    if (currentlyPlaying === recording.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setCurrentlyPlaying(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(recording.audioUrl);
    audio.onended = () => {
      setCurrentlyPlaying(null);
      audioRef.current = null;
    };
    audio.play();
    audioRef.current = audio;
    setCurrentlyPlaying(recording.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this recording?')) {
      if (currentlyPlaying === id && audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        setCurrentlyPlaying(null);
      }
      deleteRecording(id);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="record-page">
      <header className="page-header">
        <h1>Record Affirmations</h1>
        <p>Record your voice and listen anytime</p>
      </header>

      <div className="record-content">
        {/* Recording Studio */}
        <div className="recording-studio">
          <div className={`recording-visualizer ${isRecording ? 'active' : ''}`}>
            <div className="mic-circle">
              {isRecording ? (
                <div className="recording-waves">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
              ) : (
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <rect x="12" y="6" width="12" height="18" rx="6" stroke="var(--green-primary)" strokeWidth="2.5"/>
                  <path d="M8 18C8 23.5228 12.4772 28 18 28C23.5228 28 28 23.5228 28 18" stroke="var(--green-primary)" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M18 28V32" stroke="var(--green-primary)" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              )}
            </div>
            {isRecording && (
              <div className="recording-timer">
                <span className="rec-dot"></span>
                {formatTime(recordingTime)}
              </div>
            )}
          </div>

          {!isRecording && (
            <div className="title-input-group">
              <input
                type="text"
                value={recordingTitle}
                onChange={(e) => setRecordingTitle(e.target.value)}
                placeholder="Give your recording a title (optional)"
                maxLength={100}
              />
            </div>
          )}

          <button
            className={`record-btn ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="4" y="4" width="12" height="12" rx="2" fill="currentColor"/>
                </svg>
                Stop Recording
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7" fill="currentColor"/>
                </svg>
                Start Recording
              </>
            )}
          </button>
        </div>

        {/* Recordings List */}
        <div className="recordings-list">
          <h3>Your Recordings ({recordings.length})</h3>
          {recordings.length === 0 ? (
            <div className="empty-recordings">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="16" y="8" width="16" height="24" rx="8" stroke="var(--green-lighter)" strokeWidth="2"/>
                <path d="M10 24C10 31.732 16.268 38 24 38C31.732 38 38 31.732 38 24" stroke="var(--green-lighter)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>No recordings yet. Tap the record button to get started!</p>
            </div>
          ) : (
            recordings.map(rec => (
              <div key={rec.id} className="recording-item">
                <button
                  className={`play-btn ${currentlyPlaying === rec.id ? 'playing' : ''}`}
                  onClick={() => playRecording(rec)}
                >
                  {currentlyPlaying === rec.id ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="5" y="4" width="3" height="12" rx="1" fill="currentColor"/>
                      <rect x="12" y="4" width="3" height="12" rx="1" fill="currentColor"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <polygon points="6,3 17,10 6,17" fill="currentColor"/>
                    </svg>
                  )}
                </button>
                <div className="recording-info">
                  <span className="recording-title">{rec.title}</span>
                  <span className="recording-details">
                    {formatTime(rec.duration)} &middot; {new Date(rec.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  className="icon-btn delete"
                  onClick={() => handleDelete(rec.id)}
                  title="Delete"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default RecordAffirmations;
