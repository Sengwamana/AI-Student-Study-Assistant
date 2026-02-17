import { useState, useEffect } from "react";

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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1000] animate-fade-in p-4" onClick={onClose}>
      <div className="bg-surface rounded-3xl w-full max-w-[500px] max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-800 animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold bg-gradient-to-br from-indigo-500 to-violet-500 bg-clip-text text-transparent m-0">🎯 Study Goals</h2>
          <div className="flex gap-2.5">
            <button 
              className="w-9 h-9 rounded-xl border-0 bg-gray-100 dark:bg-gray-800 text-text-muted transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:text-indigo-600 cursor-pointer text-base flex items-center justify-center"
              onClick={() => setShowEdit(!showEdit)}
            >
              {showEdit ? "✕" : "✏️"}
            </button>
            <button className="w-9 h-9 rounded-xl border-0 bg-gray-100 dark:bg-gray-800 text-text-muted transition-all hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 cursor-pointer text-base flex items-center justify-center" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Motivation Banner */}
        <div className="mx-6 my-4 p-4 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-900/10 dark:to-violet-900/10 rounded-2xl border-l-4 border-indigo-500 flex items-center gap-3.5">
          <span className="text-3xl">{motivation.emoji}</span>
          <p className="m-0 text-[15px] font-medium text-text-secondary">{motivation.message}</p>
        </div>

        {showEdit ? (
          /* Edit Mode */
          <div className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-5 m-0">Set Your Goals</h3>
            
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Daily Study Time (minutes)</label>
              <input
                type="number"
                value={editGoals.dailyMinutes}
                onChange={(e) => setEditGoals({...editGoals, dailyMinutes: parseInt(e.target.value) || 0})}
                min="5"
                max="480"
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-text-primary outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Daily Sessions</label>
              <input
                type="number"
                value={editGoals.dailySessions}
                onChange={(e) => setEditGoals({...editGoals, dailySessions: parseInt(e.target.value) || 0})}
                min="1"
                max="20"
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-text-primary outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Weekly Study Time (minutes)</label>
              <input
                type="number"
                value={editGoals.weeklyMinutes}
                onChange={(e) => setEditGoals({...editGoals, weeklyMinutes: parseInt(e.target.value) || 0})}
                min="30"
                max="2400"
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-text-primary outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Weekly Sessions</label>
              <input
                type="number"
                value={editGoals.weeklySessions}
                onChange={(e) => setEditGoals({...editGoals, weeklySessions: parseInt(e.target.value) || 0})}
                min="1"
                max="100"
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-text-primary outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div className="my-5 p-4 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-2xl">
              <p className="text-[13px] text-text-muted m-0 mb-2.5">Quick Presets:</p>
              <div className="flex gap-2.5 flex-wrap">
                <button 
                  className="flex-1 py-2.5 px-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-surface text-[13px] font-medium text-text-secondary cursor-pointer transition-all hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10"
                  onClick={() => setEditGoals({dailyMinutes: 30, dailySessions: 1, weeklyMinutes: 150, weeklySessions: 5})}
                >
                  🌱 Light
                </button>
                <button 
                  className="flex-1 py-2.5 px-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-surface text-[13px] font-medium text-text-secondary cursor-pointer transition-all hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10"
                  onClick={() => setEditGoals({dailyMinutes: 60, dailySessions: 2, weeklyMinutes: 300, weeklySessions: 10})}
                >
                  📚 Regular
                </button>
                <button 
                  className="flex-1 py-2.5 px-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-surface text-[13px] font-medium text-text-secondary cursor-pointer transition-all hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10"
                  onClick={() => setEditGoals({dailyMinutes: 120, dailySessions: 4, weeklyMinutes: 600, weeklySessions: 20})}
                >
                  🔥 Intense
                </button>
              </div>
            </div>

            <button className="w-full py-3.5 bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-0 rounded-xl text-base font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg mt-2.5" onClick={saveGoals}>
              ✓ Save Goals
            </button>
          </div>
        ) : (
          /* Progress View */
          <div className="p-6 pt-2">
            {/* Daily Goals */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-text-secondary mb-3.5 m-0">📅 Today's Goals</h3>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-3 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">⏱️</span>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-semibold text-text-primary">Study Time</span>
                    <span className="text-xs text-text-muted">
                      {progress.todayMinutes} / {goals.dailyMinutes} min
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${getPercentage(progress.todayMinutes, goals.dailyMinutes)}%`,
                        background: getProgressColor(getPercentage(progress.todayMinutes, goals.dailyMinutes))
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold min-w-[45px] text-right" style={{color: getProgressColor(getPercentage(progress.todayMinutes, goals.dailyMinutes))}}>
                    {getPercentage(progress.todayMinutes, goals.dailyMinutes)}%
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-3 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🍅</span>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-semibold text-text-primary">Sessions</span>
                    <span className="text-xs text-text-muted">
                      {progress.todaySessions} / {goals.dailySessions} sessions
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${getPercentage(progress.todaySessions, goals.dailySessions)}%`,
                        background: getProgressColor(getPercentage(progress.todaySessions, goals.dailySessions))
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold min-w-[45px] text-right" style={{color: getProgressColor(getPercentage(progress.todaySessions, goals.dailySessions))}}>
                    {getPercentage(progress.todaySessions, goals.dailySessions)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Weekly Goals */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-text-secondary mb-3.5 m-0">📊 This Week's Goals</h3>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-3 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">⏱️</span>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-semibold text-text-primary">Study Time</span>
                    <span className="text-xs text-text-muted">
                      {progress.weekMinutes} / {goals.weeklyMinutes} min
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${getPercentage(progress.weekMinutes, goals.weeklyMinutes)}%`,
                        background: getProgressColor(getPercentage(progress.weekMinutes, goals.weeklyMinutes))
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold min-w-[45px] text-right" style={{color: getProgressColor(getPercentage(progress.weekMinutes, goals.weeklyMinutes))}}>
                    {getPercentage(progress.weekMinutes, goals.weeklyMinutes)}%
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-3 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🍅</span>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-semibold text-text-primary">Sessions</span>
                    <span className="text-xs text-text-muted">
                      {progress.weekSessions} / {goals.weeklySessions} sessions
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${getPercentage(progress.weekSessions, goals.weeklySessions)}%`,
                        background: getProgressColor(getPercentage(progress.weekSessions, goals.weeklySessions))
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold min-w-[45px] text-right" style={{color: getProgressColor(getPercentage(progress.weekSessions, goals.weeklySessions))}}>
                    {getPercentage(progress.weekSessions, goals.weeklySessions)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl mt-2 border border-emerald-100 dark:border-emerald-900/30">
              <h4 className="text-sm font-semibold text-emerald-600 mb-2.5 m-0">💡 Tips</h4>
              <ul className="m-0 pl-5 text-[13px] text-text-secondary space-y-1.5 list-disc">
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
