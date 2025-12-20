import { useState, useEffect } from "react";
import "./progressDashboard.css";

const ProgressDashboard = ({ onClose }) => {
  // Load stats from localStorage
  const [stats, setStats] = useState({
    totalStudyTime: 0,
    sessionsCompleted: 0,
    flashcardsReviewed: 0,
    quizzesCompleted: 0,
    chatsCreated: 0,
    questionsAsked: 0,
    streakDays: 0,
    lastStudyDate: null,
  });

  const [weeklyData, setWeeklyData] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadStats();
    loadWeeklyData();
  }, []);

  const loadStats = () => {
    // Load pomodoro stats
    const pomodoroStats = JSON.parse(localStorage.getItem("pomodoroStats") || "{}");
    
    // Load study stats
    const studyStats = JSON.parse(localStorage.getItem("studyStats") || "{}");
    
    // Load streak
    const streakData = JSON.parse(localStorage.getItem("studyStreak") || "{}");
    
    setStats({
      totalStudyTime: pomodoroStats.totalTime || 0,
      sessionsCompleted: pomodoroStats.sessions || 0,
      flashcardsReviewed: studyStats.flashcardsReviewed || 0,
      quizzesCompleted: studyStats.quizzesCompleted || 0,
      chatsCreated: studyStats.chatsCreated || 0,
      questionsAsked: studyStats.questionsAsked || 0,
      streakDays: streakData.currentStreak || 0,
      lastStudyDate: streakData.lastDate || null,
    });
  };

  const loadWeeklyData = () => {
    const history = JSON.parse(localStorage.getItem("pomodoroHistory") || "[]");
    const dailyStats = JSON.parse(localStorage.getItem("dailyStudyStats") || "{}");
    
    // Generate last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("en", { weekday: "short" });
      
      // Count sessions for this day
      const sessionsForDay = history.filter(s => 
        s.date && s.date.startsWith(dateStr)
      ).length;
      
      const dailyMinutes = dailyStats[dateStr]?.minutes || sessionsForDay * 25;
      
      days.push({
        day: dayName,
        date: dateStr,
        minutes: dailyMinutes,
        sessions: sessionsForDay,
      });
    }
    
    setWeeklyData(days);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getMaxMinutes = () => {
    const max = Math.max(...weeklyData.map(d => d.minutes), 1);
    return Math.ceil(max / 30) * 30; // Round up to nearest 30
  };

  const getMotivationalMessage = () => {
    const { streakDays, sessionsCompleted, totalStudyTime } = stats;
    
    if (streakDays >= 7) return "🔥 Amazing! You're on fire with a week-long streak!";
    if (streakDays >= 3) return "💪 Great consistency! Keep the momentum going!";
    if (sessionsCompleted >= 10) return "🌟 10+ sessions! You're becoming a study master!";
    if (totalStudyTime >= 3600) return "⏱️ Over an hour of focused study! Impressive!";
    if (sessionsCompleted >= 1) return "✨ Great start! Every session counts!";
    return "🎯 Ready to begin your study journey? Start a focus session!";
  };

  const getAchievements = () => {
    const achievements = [];
    const { sessionsCompleted, streakDays, totalStudyTime, flashcardsReviewed, quizzesCompleted } = stats;

    if (sessionsCompleted >= 1) achievements.push({ icon: "🎯", name: "First Focus", desc: "Completed first session" });
    if (sessionsCompleted >= 5) achievements.push({ icon: "⭐", name: "Getting Started", desc: "5 sessions completed" });
    if (sessionsCompleted >= 10) achievements.push({ icon: "🌟", name: "Dedicated", desc: "10 sessions completed" });
    if (sessionsCompleted >= 25) achievements.push({ icon: "💎", name: "Study Pro", desc: "25 sessions completed" });
    if (sessionsCompleted >= 50) achievements.push({ icon: "🏆", name: "Master", desc: "50 sessions completed" });
    
    if (streakDays >= 3) achievements.push({ icon: "🔥", name: "On Fire", desc: "3 day streak" });
    if (streakDays >= 7) achievements.push({ icon: "🚀", name: "Unstoppable", desc: "7 day streak" });
    
    if (totalStudyTime >= 3600) achievements.push({ icon: "⏰", name: "Hour Hero", desc: "1 hour total focus" });
    if (totalStudyTime >= 18000) achievements.push({ icon: "📚", name: "Bookworm", desc: "5 hours total focus" });
    
    if (flashcardsReviewed >= 50) achievements.push({ icon: "🗂️", name: "Card Collector", desc: "50 flashcards reviewed" });
    if (quizzesCompleted >= 5) achievements.push({ icon: "📝", name: "Quiz Whiz", desc: "5 quizzes completed" });

    return achievements;
  };

  const resetAllStats = () => {
    if (confirm("Reset all progress data? This cannot be undone.")) {
      localStorage.removeItem("pomodoroStats");
      localStorage.removeItem("pomodoroHistory");
      localStorage.removeItem("studyStats");
      localStorage.removeItem("studyStreak");
      localStorage.removeItem("dailyStudyStats");
      loadStats();
      loadWeeklyData();
    }
  };

  return (
    <div className="progressOverlay">
      <div className="progressModal">
        {/* Header */}
        <div className="progressHeader">
          <h2>📊 Progress Dashboard</h2>
          <button className="closeBtn" onClick={onClose}>✕</button>
        </div>

        {/* Motivational Banner */}
        <div className="motivationalBanner">
          <p>{getMotivationalMessage()}</p>
        </div>

        {/* Tabs */}
        <div className="progressTabs">
          <button 
            className={`progressTab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📈 Overview
          </button>
          <button 
            className={`progressTab ${activeTab === "achievements" ? "active" : ""}`}
            onClick={() => setActiveTab("achievements")}
          >
            🏆 Achievements
          </button>
          <button 
            className={`progressTab ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            📅 History
          </button>
        </div>

        {/* Tab Content */}
        <div className="progressContent">
          {activeTab === "overview" && (
            <>
              {/* Stats Grid */}
              <div className="statsGrid">
                <div className="statCard primary">
                  <span className="statIcon">⏱️</span>
                  <div className="statInfo">
                    <span className="statValue">{formatTime(stats.totalStudyTime)}</span>
                    <span className="statLabel">Total Focus Time</span>
                  </div>
                </div>
                <div className="statCard">
                  <span className="statIcon">🍅</span>
                  <div className="statInfo">
                    <span className="statValue">{stats.sessionsCompleted}</span>
                    <span className="statLabel">Sessions</span>
                  </div>
                </div>
                <div className="statCard">
                  <span className="statIcon">🔥</span>
                  <div className="statInfo">
                    <span className="statValue">{stats.streakDays}</span>
                    <span className="statLabel">Day Streak</span>
                  </div>
                </div>
                <div className="statCard">
                  <span className="statIcon">💬</span>
                  <div className="statInfo">
                    <span className="statValue">{stats.questionsAsked}</span>
                    <span className="statLabel">Questions Asked</span>
                  </div>
                </div>
              </div>

              {/* Weekly Chart */}
              <div className="chartSection">
                <h3>📅 This Week's Activity</h3>
                <div className="barChart">
                  {weeklyData.map((day, i) => (
                    <div key={i} className="barContainer">
                      <div className="barWrapper">
                        <div 
                          className="bar"
                          style={{ 
                            height: `${(day.minutes / getMaxMinutes()) * 100}%`,
                            minHeight: day.minutes > 0 ? "8px" : "0"
                          }}
                          title={`${day.minutes} minutes`}
                        >
                          {day.minutes > 0 && (
                            <span className="barValue">{day.minutes}m</span>
                          )}
                        </div>
                      </div>
                      <span className="barLabel">{day.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats Row */}
              <div className="quickStats">
                <div className="quickStat">
                  <span className="quickIcon">🗂️</span>
                  <span className="quickValue">{stats.flashcardsReviewed}</span>
                  <span className="quickLabel">Flashcards</span>
                </div>
                <div className="quickStat">
                  <span className="quickIcon">📝</span>
                  <span className="quickValue">{stats.quizzesCompleted}</span>
                  <span className="quickLabel">Quizzes</span>
                </div>
                <div className="quickStat">
                  <span className="quickIcon">💭</span>
                  <span className="quickValue">{stats.chatsCreated}</span>
                  <span className="quickLabel">Chats</span>
                </div>
              </div>
            </>
          )}

          {activeTab === "achievements" && (
            <div className="achievementsSection">
              {getAchievements().length > 0 ? (
                <div className="achievementsGrid">
                  {getAchievements().map((ach, i) => (
                    <div key={i} className="achievementCard">
                      <span className="achievementIcon">{ach.icon}</span>
                      <div className="achievementInfo">
                        <span className="achievementName">{ach.name}</span>
                        <span className="achievementDesc">{ach.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="emptyState">
                  <span className="emptyIcon">🎯</span>
                  <p>Complete study sessions to unlock achievements!</p>
                </div>
              )}

              {/* Locked Achievements Preview */}
              <div className="lockedSection">
                <h4>🔒 More to Unlock</h4>
                <div className="lockedGrid">
                  {stats.sessionsCompleted < 50 && (
                    <div className="lockedAchievement">
                      <span>🏆</span>
                      <span>Master - 50 sessions</span>
                    </div>
                  )}
                  {stats.streakDays < 7 && (
                    <div className="lockedAchievement">
                      <span>🚀</span>
                      <span>Unstoppable - 7 day streak</span>
                    </div>
                  )}
                  {stats.totalStudyTime < 18000 && (
                    <div className="lockedAchievement">
                      <span>📚</span>
                      <span>Bookworm - 5 hours focus</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="historySection">
              <div className="historyList">
                {weeklyData.slice().reverse().map((day, i) => (
                  <div key={i} className="historyItem">
                    <div className="historyDate">
                      <span className="historyDay">{day.day}</span>
                      <span className="historyFullDate">{day.date}</span>
                    </div>
                    <div className="historyStats">
                      <span className="historyMinutes">{day.minutes}m studied</span>
                      <span className="historySessions">{day.sessions} sessions</span>
                    </div>
                    <div className="historyIndicator">
                      {day.minutes >= 60 ? "🌟" : day.minutes >= 25 ? "✅" : day.minutes > 0 ? "📝" : "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="progressFooter">
          <button className="resetBtn" onClick={resetAllStats}>
            🗑️ Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
