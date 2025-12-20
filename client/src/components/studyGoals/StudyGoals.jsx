import { useState, useEffect } from "react";
import "./studyGoals.css";

const StudyGoals = ({ onClose }) => {
  const [goals, setGoals] = useState({
    dailyMinutes: 60,
    weeklyMinutes: 300,
    dailySessions: 3,
    weeklySessions: 15,
  });

  const [progress, setProgress] = useState({
    todayMinutes: 0,
    todaySessions: 0,
    weekMinutes: 0,
    weekSessions: 0,
  });

  const [showEdit, setShowEdit] = useState(false);
  const [editGoals, setEditGoals] = useState(goals);

  // Load goals and calculate progress
  useEffect(() => {
    loadGoals();
    calculateProgress();
  }, []);

  const loadGoals = () => {
    const saved = localStorage.getItem("studyGoals");
    if (saved) {
      setGoals(JSON.parse(saved));
      setEditGoals(JSON.parse(saved));
    }
  };

  const calculateProgress = () => {
    const pomodoroStats = JSON.parse(localStorage.getItem("pomodoroStats") || "{}");
    const pomodoroHistory = JSON.parse(localStorage.getItem("pomodoroHistory") || "[]");
    
    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Calculate today's progress
    const todaySessions = pomodoroHistory.filter(s => 
      s.date && s.date.startsWith(today)
    ).length;

    // Calculate week's progress
    const weekSessions = pomodoroHistory.filter(s => {
      if (!s.date) return false;
      const sessionDate = new Date(s.date);
      return sessionDate >= weekAgo;
    }).length;

    setProgress({
      todayMinutes: todaySessions * 25, // Assuming 25 min per session
      todaySessions: todaySessions,
      weekMinutes: weekSessions * 25,
      weekSessions: weekSessions,
    });
  };

  const saveGoals = () => {
    setGoals(editGoals);
    localStorage.setItem("studyGoals", JSON.stringify(editGoals));
    setShowEdit(false);
  };

  const getPercentage = (current, goal) => {
    return Math.min(100, Math.round((current / goal) * 100));
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "#10b981";
    if (percentage >= 75) return "#22c55e";
    if (percentage >= 50) return "#f59e0b";
    return "#6366f1";
  };

  const getMotivation = () => {
    const dailyPercent = getPercentage(progress.todayMinutes, goals.dailyMinutes);
    const weeklyPercent = getPercentage(progress.weekMinutes, goals.weeklyMinutes);

    if (dailyPercent >= 100 && weeklyPercent >= 100) {
      return { emoji: "🏆", message: "All goals achieved! You're a superstar!" };
    }
    if (dailyPercent >= 100) {
      return { emoji: "⭐", message: "Daily goal complete! Keep the momentum going!" };
    }
    if (dailyPercent >= 75) {
      return { emoji: "🔥", message: "Almost there! Just a bit more today!" };
    }
    if (dailyPercent >= 50) {
      return { emoji: "💪", message: "Halfway through your daily goal!" };
    }
    if (dailyPercent > 0) {
      return { emoji: "📚", message: "Great start! Keep studying!" };
    }
    return { emoji: "🎯", message: "Ready to start? Set your goals and begin!" };
  };

  const motivation = getMotivation();

  return (
    <div className="goalsOverlay">
      <div className="goalsModal">
        {/* Header */}
        <div className="goalsHeader">
          <h2>🎯 Study Goals</h2>
          <div className="headerActions">
            <button 
              className="editBtn"
              onClick={() => setShowEdit(!showEdit)}
            >
              {showEdit ? "✕" : "✏️"}
            </button>
            <button className="closeBtn" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Motivation Banner */}
        <div className="motivationBanner">
          <span className="motivationEmoji">{motivation.emoji}</span>
          <p>{motivation.message}</p>
        </div>

        {showEdit ? (
          /* Edit Mode */
          <div className="editSection">
            <h3>Set Your Goals</h3>
            
            <div className="goalInputGroup">
              <label>Daily Study Time (minutes)</label>
              <input
                type="number"
                value={editGoals.dailyMinutes}
                onChange={(e) => setEditGoals({...editGoals, dailyMinutes: parseInt(e.target.value) || 0})}
                min="5"
                max="480"
              />
            </div>

            <div className="goalInputGroup">
              <label>Daily Sessions</label>
              <input
                type="number"
                value={editGoals.dailySessions}
                onChange={(e) => setEditGoals({...editGoals, dailySessions: parseInt(e.target.value) || 0})}
                min="1"
                max="20"
              />
            </div>

            <div className="goalInputGroup">
              <label>Weekly Study Time (minutes)</label>
              <input
                type="number"
                value={editGoals.weeklyMinutes}
                onChange={(e) => setEditGoals({...editGoals, weeklyMinutes: parseInt(e.target.value) || 0})}
                min="30"
                max="2400"
              />
            </div>

            <div className="goalInputGroup">
              <label>Weekly Sessions</label>
              <input
                type="number"
                value={editGoals.weeklySessions}
                onChange={(e) => setEditGoals({...editGoals, weeklySessions: parseInt(e.target.value) || 0})}
                min="1"
                max="100"
              />
            </div>

            <div className="presetGoals">
              <p>Quick Presets:</p>
              <div className="presetButtons">
                <button onClick={() => setEditGoals({dailyMinutes: 30, dailySessions: 1, weeklyMinutes: 150, weeklySessions: 5})}>
                  🌱 Light
                </button>
                <button onClick={() => setEditGoals({dailyMinutes: 60, dailySessions: 2, weeklyMinutes: 300, weeklySessions: 10})}>
                  📚 Regular
                </button>
                <button onClick={() => setEditGoals({dailyMinutes: 120, dailySessions: 4, weeklyMinutes: 600, weeklySessions: 20})}>
                  🔥 Intense
                </button>
              </div>
            </div>

            <button className="saveBtn" onClick={saveGoals}>
              ✓ Save Goals
            </button>
          </div>
        ) : (
          /* Progress View */
          <div className="progressSection">
            {/* Daily Goals */}
            <div className="goalCategory">
              <h3>📅 Today's Goals</h3>
              
              <div className="goalCard">
                <div className="goalInfo">
                  <span className="goalIcon">⏱️</span>
                  <div className="goalText">
                    <span className="goalTitle">Study Time</span>
                    <span className="goalStats">
                      {progress.todayMinutes} / {goals.dailyMinutes} min
                    </span>
                  </div>
                </div>
                <div className="progressContainer">
                  <div className="progressBar">
                    <div 
                      className="progressFill"
                      style={{
                        width: `${getPercentage(progress.todayMinutes, goals.dailyMinutes)}%`,
                        background: getProgressColor(getPercentage(progress.todayMinutes, goals.dailyMinutes))
                      }}
                    />
                  </div>
                  <span className="percentage" style={{color: getProgressColor(getPercentage(progress.todayMinutes, goals.dailyMinutes))}}>
                    {getPercentage(progress.todayMinutes, goals.dailyMinutes)}%
                  </span>
                </div>
              </div>

              <div className="goalCard">
                <div className="goalInfo">
                  <span className="goalIcon">🍅</span>
                  <div className="goalText">
                    <span className="goalTitle">Sessions</span>
                    <span className="goalStats">
                      {progress.todaySessions} / {goals.dailySessions} sessions
                    </span>
                  </div>
                </div>
                <div className="progressContainer">
                  <div className="progressBar">
                    <div 
                      className="progressFill"
                      style={{
                        width: `${getPercentage(progress.todaySessions, goals.dailySessions)}%`,
                        background: getProgressColor(getPercentage(progress.todaySessions, goals.dailySessions))
                      }}
                    />
                  </div>
                  <span className="percentage" style={{color: getProgressColor(getPercentage(progress.todaySessions, goals.dailySessions))}}>
                    {getPercentage(progress.todaySessions, goals.dailySessions)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Weekly Goals */}
            <div className="goalCategory">
              <h3>📊 This Week's Goals</h3>
              
              <div className="goalCard">
                <div className="goalInfo">
                  <span className="goalIcon">⏱️</span>
                  <div className="goalText">
                    <span className="goalTitle">Study Time</span>
                    <span className="goalStats">
                      {progress.weekMinutes} / {goals.weeklyMinutes} min
                    </span>
                  </div>
                </div>
                <div className="progressContainer">
                  <div className="progressBar">
                    <div 
                      className="progressFill"
                      style={{
                        width: `${getPercentage(progress.weekMinutes, goals.weeklyMinutes)}%`,
                        background: getProgressColor(getPercentage(progress.weekMinutes, goals.weeklyMinutes))
                      }}
                    />
                  </div>
                  <span className="percentage" style={{color: getProgressColor(getPercentage(progress.weekMinutes, goals.weeklyMinutes))}}>
                    {getPercentage(progress.weekMinutes, goals.weeklyMinutes)}%
                  </span>
                </div>
              </div>

              <div className="goalCard">
                <div className="goalInfo">
                  <span className="goalIcon">🍅</span>
                  <div className="goalText">
                    <span className="goalTitle">Sessions</span>
                    <span className="goalStats">
                      {progress.weekSessions} / {goals.weeklySessions} sessions
                    </span>
                  </div>
                </div>
                <div className="progressContainer">
                  <div className="progressBar">
                    <div 
                      className="progressFill"
                      style={{
                        width: `${getPercentage(progress.weekSessions, goals.weeklySessions)}%`,
                        background: getProgressColor(getPercentage(progress.weekSessions, goals.weeklySessions))
                      }}
                    />
                  </div>
                  <span className="percentage" style={{color: getProgressColor(getPercentage(progress.weekSessions, goals.weeklySessions))}}>
                    {getPercentage(progress.weekSessions, goals.weeklySessions)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="tipSection">
              <h4>💡 Tips</h4>
              <ul>
                <li>Start with achievable goals and increase gradually</li>
                <li>Use the Pomodoro timer for focused study sessions</li>
                <li>Consistency beats intensity - study a little every day</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyGoals;
