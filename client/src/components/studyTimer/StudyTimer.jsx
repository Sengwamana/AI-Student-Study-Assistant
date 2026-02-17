import { useState, useEffect, useRef, useCallback } from "react";

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
      
      setSessionHistory((prev) => [
        {
          date: new Date().toISOString(),
          duration: customDurations.focus,
          type: "focus",
        },
        ...prev.slice(0, 49),
      ]);

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
        className={`fixed bottom-6 right-6 flex items-center gap-2.5 py-3 px-5 bg-surface/95 backdrop-blur rounded-full shadow-xl cursor-pointer z-[1000] border-2 transition-all hover:scale-105 hover:shadow-2xl animate-slide-up ${isRunning ? "animate-pulse" : ""}`}
        onClick={() => setIsMinimized(false)}
        style={{ borderColor: MODES[mode].color }}
      >
        <span className="text-xl">🍅</span>
        <span className="text-xl font-bold text-text-primary tabular-nums">{formatTime(timeLeft)}</span>
        <span className="text-xs text-text-secondary px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">{MODES[mode].name}</span>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1000] animate-fade-in p-4" onClick={onClose}>
      <div className="bg-surface rounded-3xl p-7 w-full max-w-[400px] shadow-2xl border border-white/10 dark:border-white/5 animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-2xl font-bold text-text-primary m-0">🍅 Pomodoro Timer</h3>
          <div className="flex gap-2">
            <button 
              className="w-9 h-9 rounded-xl border-0 bg-gray-100 dark:bg-gray-800 text-base cursor-pointer transition-all flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105" 
              onClick={() => setShowSettings(!showSettings)}
              title="Settings"
            >
              ⚙️
            </button>
            <button 
              className="w-9 h-9 rounded-xl border-0 bg-gray-100 dark:bg-gray-800 text-base cursor-pointer transition-all flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105" 
              onClick={() => setIsMinimized(true)}
              title="Minimize (M)"
            >
              ➖
            </button>
            <button 
              className="w-9 h-9 rounded-xl border-0 bg-gray-100 dark:bg-gray-800 text-base cursor-pointer transition-all flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500" 
              onClick={onClose}
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {showSettings ? (
          /* Settings Panel */
          <div className="py-2">
            <h4 className="text-lg font-semibold mb-5 text-text-primary m-0">⚙️ Timer Settings</h4>
            
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Focus Duration (minutes)</label>
              <input
                type="number"
                value={customDurations.focus}
                onChange={(e) => updateCustomDuration("focus", e.target.value)}
                min="1"
                max="60"
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-text-primary outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Short Break (minutes)</label>
              <input
                type="number"
                value={customDurations.shortBreak}
                onChange={(e) => updateCustomDuration("shortBreak", e.target.value)}
                min="1"
                max="30"
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-text-primary outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Long Break (minutes)</label>
              <input
                type="number"
                value={customDurations.longBreak}
                onChange={(e) => updateCustomDuration("longBreak", e.target.value)}
                min="1"
                max="60"
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-text-primary outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div className="p-3 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl my-5">
              <p className="m-0 text-[13px] text-indigo-600 dark:text-indigo-400">💡 Long break triggers after every 4 focus sessions</p>
            </div>

            <button className="w-full p-3 bg-red-50 dark:bg-red-900/10 text-red-500 border-0 rounded-xl text-sm font-medium cursor-pointer mb-3 transition-all hover:bg-red-100 dark:hover:bg-red-900/20" onClick={resetStats}>
              🗑️ Reset All Statistics
            </button>

            <button 
              className="w-full p-3.5 bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-0 rounded-xl text-base font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
              onClick={() => setShowSettings(false)}
            >
              ✓ Done
            </button>
          </div>
        ) : (
          <>
            {/* Mode Tabs */}
            <div className="flex gap-2 mb-6">
              {Object.entries(MODES).map(([key, value]) => (
                <button
                  key={key}
                  className={`flex-1 py-2.5 px-3 rounded-xl border-0 text-[13px] font-semibold cursor-pointer transition-all ${
                      mode === key 
                        ? "text-white shadow-md transform scale-105" 
                        : "bg-gray-100 dark:bg-gray-800 text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => switchMode(key)}
                  style={mode === key ? { background: value.color } : {}}
                >
                  {value.name}
                </button>
              ))}
            </div>

            {/* Timer Display */}
            <div className="relative w-[200px] h-[200px] mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle
                  className="fill-none stroke-gray-100 dark:stroke-gray-800 stroke-[8]"
                  cx="100"
                  cy="100"
                  r="90"
                />
                <circle
                  className="fill-none stroke-[8] stroke-linecap-round transition-all duration-500"
                  cx="100"
                  cy="100"
                  r="90"
                  style={{
                    stroke: MODES[mode].color,
                    strokeDasharray: `${getProgress() * 5.65} 565`,
                  }}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="block text-5xl font-bold text-text-primary tabular-nums tracking-tight">{formatTime(timeLeft)}</span>
                <span className="block text-sm text-text-secondary mt-1 font-medium">{MODES[mode].name}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button 
                className="w-12 h-12 bg-gray-100 dark:bg-gray-800 text-xl text-text-secondary border-0 rounded-full cursor-pointer transition-all flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-110" 
                onClick={resetTimer}
                title="Reset (R)"
              >
                ↺
              </button>
              <button
                className={`w-[72px] h-[72px] text-3xl text-white border-0 rounded-full cursor-pointer transition-all flex items-center justify-center shadow-lg hover:scale-105 hover:shadow-xl active:scale-95`}
                onClick={toggleTimer}
                style={{ background: MODES[mode].color }}
                title="Start/Pause (Space)"
              >
                {isRunning ? "⏸" : "▶"}
              </button>
              <button 
                className="w-12 h-12 bg-gray-100 dark:bg-gray-800 text-xl text-text-secondary border-0 rounded-full cursor-pointer transition-all flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-110" 
                onClick={handleTimerComplete}
                title="Skip to next"
              >
                ⏭
              </button>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-5 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
              <div className="text-center">
                <span className="block text-2xl font-bold text-text-primary">{sessionsCompleted}</span>
                <span className="text-xs text-text-muted uppercase tracking-wider font-medium">Sessions</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold text-text-primary">{formatTotalTime(totalFocusTime)}</span>
                <span className="text-xs text-text-muted uppercase tracking-wider font-medium">Focus Time</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold text-text-primary">{Math.floor(sessionsCompleted / 4)}</span>
                <span className="text-xs text-text-muted uppercase tracking-wider font-medium">Cycles</span>
              </div>
            </div>

            {/* Today's Sessions */}
            {sessionHistory.length > 0 && (
              <div className="text-center mb-4">
                <h4 className="text-[13px] text-text-secondary mb-2 font-medium m-0">Recent Sessions</h4>
                <div className="flex justify-center gap-1.5 flex-wrap">
                  {sessionHistory.slice(0, 12).map((session, i) => (
                    <div 
                      key={i} 
                      className="text-lg animate-pop-in cursor-help hover:scale-125 transition-transform"
                      title={new Date(session.date).toLocaleTimeString()}
                    >
                      🍅
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shortcuts */}
            <div className="flex justify-center gap-3 text-[11px] text-text-muted flex-wrap">
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">Space: Start/Pause</span>
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">R: Reset</span>
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">M: Minimize</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudyTimer;
