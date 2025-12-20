import { useState, useEffect, useRef, useCallback } from "react";
import "./studyTimer.css";

const StudyTimer = ({ onClose }) => {
  // Timer modes
  const MODES = {
    FOCUS: { name: "Focus", duration: 25 * 60, color: "#6366f1" },
    SHORT_BREAK: { name: "Short Break", duration: 5 * 60, color: "#10b981" },
    LONG_BREAK: { name: "Long Break", duration: 15 * 60, color: "#f59e0b" },
  };

  // State
  const [mode, setMode] = useState("FOCUS");
  const [timeLeft, setTimeLeft] = useState(MODES.FOCUS.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Custom durations
  const [customDurations, setCustomDurations] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  // Session history
  const [sessionHistory, setSessionHistory] = useState(() => {
    const saved = localStorage.getItem("pomodoroHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Load saved stats
  useEffect(() => {
    const savedStats = localStorage.getItem("pomodoroStats");
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      setSessionsCompleted(stats.sessions || 0);
      setTotalFocusTime(stats.totalTime || 0);
    }
  }, []);

  // Save stats when they change
  useEffect(() => {
    localStorage.setItem("pomodoroStats", JSON.stringify({
      sessions: sessionsCompleted,
      totalTime: totalFocusTime,
    }));
  }, [sessionsCompleted, totalFocusTime]);

  // Save history
  useEffect(() => {
    localStorage.setItem("pomodoroHistory", JSON.stringify(sessionHistory));
  }, [sessionHistory]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        if (mode === "FOCUS") {
          setTotalFocusTime((prev) => prev + 1);
        }
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, mode]);

  // Play notification sound
  const playNotification = useCallback(() => {
    // Create audio context for notification
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      
      // Play 3 beeps
      setTimeout(() => oscillator.stop(), 200);
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        osc2.connect(gainNode);
        osc2.frequency.value = 800;
        osc2.start();
        setTimeout(() => osc2.stop(), 200);
      }, 300);
      setTimeout(() => {
        const osc3 = audioContext.createOscillator();
        osc3.connect(gainNode);
        osc3.frequency.value = 1000;
        osc3.start();
        setTimeout(() => osc3.stop(), 400);
      }, 600);
    } catch (e) {
      console.log("Audio notification not supported");
    }
  }, []);

  // Handle timer completion
  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    playNotification();
    
    if (mode === "FOCUS") {
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);
      
      // Add to history
      setSessionHistory((prev) => [
        {
          date: new Date().toISOString(),
          duration: customDurations.focus,
          type: "focus",
        },
        ...prev.slice(0, 49), // Keep last 50 sessions
      ]);

      // After 4 focus sessions, suggest long break
      if (newSessions % 4 === 0) {
        setMode("LONG_BREAK");
        setTimeLeft(customDurations.longBreak * 60);
      } else {
        setMode("SHORT_BREAK");
        setTimeLeft(customDurations.shortBreak * 60);
      }
    } else {
      setMode("FOCUS");
      setTimeLeft(customDurations.focus * 60);
    }

    // Browser notification
    if (Notification.permission === "granted") {
      new Notification("⏰ Pomodoro Timer", {
        body: mode === "FOCUS" 
          ? "Great work! Time for a break." 
          : "Break's over! Ready to focus?",
        icon: "🍅",
      });
    }
  }, [mode, sessionsCompleted, customDurations, playNotification]);

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Format total time
  const formatTotalTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Calculate progress percentage
  const getProgress = () => {
    const totalDuration = MODES[mode].duration;
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  };

  // Control functions
  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODES[mode].duration);
  };

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === "FOCUS") {
      setTimeLeft(customDurations.focus * 60);
    } else if (newMode === "SHORT_BREAK") {
      setTimeLeft(customDurations.shortBreak * 60);
    } else {
      setTimeLeft(customDurations.longBreak * 60);
    }
  };

  const updateCustomDuration = (type, value) => {
    const numValue = Math.max(1, Math.min(60, parseInt(value) || 1));
    setCustomDurations((prev) => ({ ...prev, [type]: numValue }));
    
    // Update current timer if matching mode
    if (type === "focus" && mode === "FOCUS") {
      setTimeLeft(numValue * 60);
    } else if (type === "shortBreak" && mode === "SHORT_BREAK") {
      setTimeLeft(numValue * 60);
    } else if (type === "longBreak" && mode === "LONG_BREAK") {
      setTimeLeft(numValue * 60);
    }
  };

  const resetStats = () => {
    if (confirm("Reset all statistics? This cannot be undone.")) {
      setSessionsCompleted(0);
      setTotalFocusTime(0);
      setSessionHistory([]);
      localStorage.removeItem("pomodoroStats");
      localStorage.removeItem("pomodoroHistory");
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " " && !showSettings) {
        e.preventDefault();
        toggleTimer();
      } else if (e.key === "r" && !showSettings) {
        resetTimer();
      } else if (e.key === "Escape") {
        if (showSettings) {
          setShowSettings(false);
        } else if (isMinimized) {
          setIsMinimized(false);
        } else {
          onClose();
        }
      } else if (e.key === "m") {
        setIsMinimized(!isMinimized);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning, showSettings, isMinimized]);

  // Minimized view
  if (isMinimized) {
    return (
      <div 
        className={`timerMinimized ${isRunning ? "running" : ""}`}
        onClick={() => setIsMinimized(false)}
        style={{ borderColor: MODES[mode].color }}
      >
        <span className="miniIcon">🍅</span>
        <span className="miniTime">{formatTime(timeLeft)}</span>
        <span className="miniMode">{MODES[mode].name}</span>
      </div>
    );
  }

  return (
    <div className="timerOverlay">
      <div className="timerModal">
        {/* Header */}
        <div className="timerHeader">
          <h3>🍅 Pomodoro Timer</h3>
          <div className="timerHeaderActions">
            <button 
              className="headerBtn" 
              onClick={() => setShowSettings(!showSettings)}
              title="Settings"
            >
              ⚙️
            </button>
            <button 
              className="headerBtn" 
              onClick={() => setIsMinimized(true)}
              title="Minimize (M)"
            >
              ➖
            </button>
            <button 
              className="headerBtn closeBtn" 
              onClick={onClose}
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {showSettings ? (
          /* Settings Panel */
          <div className="settingsPanel">
            <h4>⚙️ Timer Settings</h4>
            
            <div className="settingGroup">
              <label>Focus Duration (minutes)</label>
              <input
                type="number"
                value={customDurations.focus}
                onChange={(e) => updateCustomDuration("focus", e.target.value)}
                min="1"
                max="60"
              />
            </div>
            
            <div className="settingGroup">
              <label>Short Break (minutes)</label>
              <input
                type="number"
                value={customDurations.shortBreak}
                onChange={(e) => updateCustomDuration("shortBreak", e.target.value)}
                min="1"
                max="30"
              />
            </div>
            
            <div className="settingGroup">
              <label>Long Break (minutes)</label>
              <input
                type="number"
                value={customDurations.longBreak}
                onChange={(e) => updateCustomDuration("longBreak", e.target.value)}
                min="1"
                max="60"
              />
            </div>

            <div className="settingInfo">
              <p>💡 Long break triggers after every 4 focus sessions</p>
            </div>

            <button className="resetStatsBtn" onClick={resetStats}>
              🗑️ Reset All Statistics
            </button>

            <button 
              className="closeSettingsBtn"
              onClick={() => setShowSettings(false)}
            >
              ✓ Done
            </button>
          </div>
        ) : (
          <>
            {/* Mode Tabs */}
            <div className="modeTabs">
              {Object.entries(MODES).map(([key, value]) => (
                <button
                  key={key}
                  className={`modeTab ${mode === key ? "active" : ""}`}
                  onClick={() => switchMode(key)}
                  style={mode === key ? { background: value.color } : {}}
                >
                  {value.name}
                </button>
              ))}
            </div>

            {/* Timer Display */}
            <div className="timerDisplay">
              <svg className="progressRing" viewBox="0 0 200 200">
                <circle
                  className="progressBg"
                  cx="100"
                  cy="100"
                  r="90"
                />
                <circle
                  className="progressFill"
                  cx="100"
                  cy="100"
                  r="90"
                  style={{
                    stroke: MODES[mode].color,
                    strokeDasharray: `${getProgress() * 5.65} 565`,
                  }}
                />
              </svg>
              <div className="timeText">
                <span className="time">{formatTime(timeLeft)}</span>
                <span className="modeLabel">{MODES[mode].name}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="timerControls">
              <button 
                className="controlBtn reset" 
                onClick={resetTimer}
                title="Reset (R)"
              >
                ↺
              </button>
              <button
                className={`controlBtn main ${isRunning ? "pause" : "play"}`}
                onClick={toggleTimer}
                style={{ background: MODES[mode].color }}
                title="Start/Pause (Space)"
              >
                {isRunning ? "⏸" : "▶"}
              </button>
              <button 
                className="controlBtn skip" 
                onClick={handleTimerComplete}
                title="Skip to next"
              >
                ⏭
              </button>
            </div>

            {/* Stats */}
            <div className="timerStats">
              <div className="stat">
                <span className="statValue">{sessionsCompleted}</span>
                <span className="statLabel">Sessions</span>
              </div>
              <div className="stat">
                <span className="statValue">{formatTotalTime(totalFocusTime)}</span>
                <span className="statLabel">Focus Time</span>
              </div>
              <div className="stat">
                <span className="statValue">{Math.floor(sessionsCompleted / 4)}</span>
                <span className="statLabel">Cycles</span>
              </div>
            </div>

            {/* Today's Sessions */}
            {sessionHistory.length > 0 && (
              <div className="todaySessions">
                <h4>Recent Sessions</h4>
                <div className="sessionDots">
                  {sessionHistory.slice(0, 12).map((session, i) => (
                    <div 
                      key={i} 
                      className="sessionDot"
                      title={new Date(session.date).toLocaleTimeString()}
                    >
                      🍅
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shortcuts */}
            <div className="shortcuts">
              <span>Space: Start/Pause</span>
              <span>R: Reset</span>
              <span>M: Minimize</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudyTimer;
