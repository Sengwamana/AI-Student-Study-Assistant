import { useState, useEffect } from "react";

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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1000] animate-fade-in p-4">
      <div className="bg-surface rounded-3xl w-full max-w-[700px] max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up border border-white/10 dark:border-white/5">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold bg-gradient-to-br from-indigo-500 to-violet-500 bg-clip-text text-transparent m-0">📊 Progress Dashboard</h2>
          <button className="w-9 h-9 rounded-xl border-0 bg-gray-100 dark:bg-gray-800 text-text-muted transition-all hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 cursor-pointer text-lg flex items-center justify-center" onClick={onClose}>✕</button>
        </div>

        {/* Motivational Banner */}
        <div className="mx-7 my-4 p-4 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-900/10 dark:to-violet-900/10 rounded-2xl border-l-4 border-indigo-500">
          <p className="m-0 text-[15px] font-medium text-text-secondary">{getMotivationalMessage()}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-7 mb-5 overflow-x-auto pb-2 scrollbar-none">
          <button 
            className={`py-2.5 px-4.5 border-0 rounded-xl text-sm font-semibold cursor-pointer transition-all whitespace-nowrap ${activeTab === "overview" ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25" : "bg-gray-100 dark:bg-gray-800 text-text-secondary hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:text-indigo-600"}`}
            onClick={() => setActiveTab("overview")}
          >
            📈 Overview
          </button>
          <button 
            className={`py-2.5 px-4.5 border-0 rounded-xl text-sm font-semibold cursor-pointer transition-all whitespace-nowrap ${activeTab === "achievements" ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25" : "bg-gray-100 dark:bg-gray-800 text-text-secondary hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:text-indigo-600"}`}
            onClick={() => setActiveTab("achievements")}
          >
            🏆 Achievements
          </button>
          <button 
            className={`py-2.5 px-4.5 border-0 rounded-xl text-sm font-semibold cursor-pointer transition-all whitespace-nowrap ${activeTab === "history" ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25" : "bg-gray-100 dark:bg-gray-800 text-text-secondary hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:text-indigo-600"}`}
            onClick={() => setActiveTab("history")}
          >
            📅 History
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-7 pb-5 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          {activeTab === "overview" && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
                <div className="flex items-center gap-3.5 p-4.5 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-900/10 dark:to-violet-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-md col-span-1 sm:col-span-2">
                  <span className="text-3xl">⏱️</span>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold bg-gradient-to-br from-indigo-500 to-violet-500 bg-clip-text text-transparent">{formatTime(stats.totalStudyTime)}</span>
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Total Focus Time</span>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 p-4.5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                  <span className="text-3xl">🍅</span>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-text-primary">{stats.sessionsCompleted}</span>
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Sessions</span>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 p-4.5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                  <span className="text-3xl">🔥</span>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-text-primary">{stats.streakDays}</span>
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Day Streak</span>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 p-4.5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                  <span className="text-3xl">💬</span>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-text-primary">{stats.questionsAsked}</span>
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Questions Asked</span>
                  </div>
                </div>
              </div>

              {/* Weekly Chart */}
              <div className="mb-6 bg-gray-50 dark:bg-gray-800/30 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h3 className="text-base font-semibold text-text-secondary mb-4 m-0">📅 This Week's Activity</h3>
                <div className="flex items-end justify-between h-[140px] gap-2">
                  {weeklyData.map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <div className="flex-1 w-full flex items-end justify-center relative">
                        <div 
                          className="w-[80%] max-w-[40px] bg-gradient-to-b from-indigo-500 to-violet-500 rounded-t-lg transition-all duration-500 relative hover:from-indigo-400 hover:to-violet-400 shadow-sm"
                          style={{ 
                            height: `${(day.minutes / getMaxMinutes()) * 100}%`,
                            minHeight: day.minutes > 0 ? "8px" : "0"
                          }}
                        >
                          {day.minutes > 0 && (
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-surface px-1.5 py-0.5 rounded shadow-sm border border-indigo-100 dark:border-indigo-900/30 z-10">{day.minutes}m</span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-medium text-text-muted mt-2">{day.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats Row */}
              <div className="flex justify-center gap-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 sm:flex-row flex-col sm:gap-12 gap-6">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl">🗂️</span>
                  <span className="text-xl font-bold text-text-primary">{stats.flashcardsReviewed}</span>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">Flashcards</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl">📝</span>
                  <span className="text-xl font-bold text-text-primary">{stats.quizzesCompleted}</span>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">Quizzes</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl">💭</span>
                  <span className="text-xl font-bold text-text-primary">{stats.chatsCreated}</span>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">Chats</span>
                </div>
              </div>
            </>
          )}

          {activeTab === "achievements" && (
            <div className="pb-4">
              {getAchievements().length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {getAchievements().map((ach, i) => (
                    <div key={i} className="flex items-center gap-3.5 p-3.5 bg-gradient-to-br from-indigo-50/30 to-violet-50/30 dark:from-indigo-900/10 dark:to-violet-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30 animate-scale-in">
                      <span className="text-3xl">{ach.icon}</span>
                      <div className="flex flex-col">
                        <span className="font-semibold text-text-primary text-sm">{ach.name}</span>
                        <span className="text-xs text-text-secondary">{ach.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 px-5 text-text-muted">
                  <span className="text-5xl block mb-3">🎯</span>
                  <p className="m-0">Complete study sessions to unlock achievements!</p>
                </div>
              )}

              {/* Locked Achievements Preview */}
              <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
                <h4 className="text-sm text-text-secondary mb-3 m-0 font-semibold">🔒 More to Unlock</h4>
                <div className="flex flex-col gap-2">
                  {stats.sessionsCompleted < 50 && (
                    <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg opacity-60 text-sm text-text-muted select-none">
                      <span>🏆</span>
                      <span>Master - 50 sessions</span>
                    </div>
                  )}
                  {stats.streakDays < 7 && (
                    <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg opacity-60 text-sm text-text-muted select-none">
                      <span>🚀</span>
                      <span>Unstoppable - 7 day streak</span>
                    </div>
                  )}
                  {stats.totalStudyTime < 18000 && (
                    <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg opacity-60 text-sm text-text-muted select-none">
                      <span>📚</span>
                      <span>Bookworm - 5 hours focus</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="pb-4">
              <div className="flex flex-col gap-2.5">
                {weeklyData.slice().reverse().map((day, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-800/30 rounded-xl transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/10 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30">
                    <div className="flex flex-col">
                      <span className="font-semibold text-text-primary text-sm">{day.day}</span>
                      <span className="text-xs text-text-muted">{day.date}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-semibold text-indigo-500 text-sm">{day.minutes}m studied</span>
                      <span className="text-xs text-text-muted">{day.sessions} sessions</span>
                    </div>
                    <div className="text-xl">
                      {day.minutes >= 60 ? "🌟" : day.minutes >= 25 ? "✅" : day.minutes > 0 ? "📝" : "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <button className="py-2.5 px-4 bg-red-50 dark:bg-red-900/10 text-red-500 border-0 rounded-xl text-xs font-semibold cursor-pointer transition-all hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600" onClick={resetAllStats}>
            🗑️ Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
