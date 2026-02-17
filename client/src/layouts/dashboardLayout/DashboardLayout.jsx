import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import ChatList from "../../components/chatList/ChatList";
import StudyTimer from "../../components/studyTimer/StudyTimer";
import ProgressDashboard from "../../components/progressDashboard/ProgressDashboard";
import StudyGoals from "../../components/studyGoals/StudyGoals";
import StudyNotes from "../../components/studyNotes/StudyNotes";
import Bookmarks from "../../components/bookmarks/Bookmarks";
import QuizGenerator from "../../components/quizGenerator/QuizGenerator";

// Motivational messages based on streak
const getMotivationalMessage = (streak) => {
  if (streak === 0) return "Start your streak today! 🌱";
  if (streak === 1) return "Great start! Keep it going! 🎯";
  if (streak < 3) return "You're building momentum! 💪";
  if (streak < 7) return "Consistency is key! 🔑";
  if (streak < 14) return "You're on fire! 🔥";
  if (streak < 30) return "Amazing dedication! 🌟";
  if (streak < 60) return "You're unstoppable! 🚀";
  if (streak < 100) return "Legendary commitment! 👑";
  return "Master learner! 🏆";
};

// Get streak emoji based on days
const getStreakEmoji = (streak) => {
  if (streak === 0) return "💤";
  if (streak < 3) return "🔥";
  if (streak < 7) return "🔥🔥";
  if (streak < 14) return "🔥🔥🔥";
  if (streak < 30) return "⭐";
  if (streak < 60) return "🌟";
  if (streak < 100) return "💫";
  return "🏆";
};

const DashboardLayout = () => {
  const { userId, isLoaded } = useAuth();
  const [showTimer, setShowTimer] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]);



  // Streak tracking
  useEffect(() => {
    const today = new Date().toDateString();
    const streakData = JSON.parse(localStorage.getItem("studyStreak") || "{}");
    
    // Check if already logged today
    if (streakData.lastStudyDate === today) {
      setStreak(streakData.currentStreak || 0);
      return;
    }

    // Calculate new streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    let newStreak = 0;
    if (streakData.lastStudyDate === yesterdayString) {
      // Continuing streak from yesterday
      newStreak = (streakData.currentStreak || 0) + 1;
    } else if (!streakData.lastStudyDate) {
      // First time user
      newStreak = 1;
    } else {
      // Streak broken
      newStreak = 1;
    }

    // Update streak data
    const updatedData = {
      currentStreak: newStreak,
      lastStudyDate: today,
      longestStreak: Math.max(newStreak, streakData.longestStreak || 0),
    };
    localStorage.setItem("studyStreak", JSON.stringify(updatedData));
    setStreak(newStreak);

    // Show celebration for milestone streaks
    if ([3, 7, 14, 30, 60, 100].includes(newStreak)) {
      setShowStreakCelebration(true);
      setTimeout(() => setShowStreakCelebration(false), 5000);
    }
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+T to toggle timer
      if (e.ctrlKey && e.key === "t") {
        e.preventDefault();
        setShowTimer((prev) => !prev);
      }
      // Ctrl+P to toggle progress
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        setShowProgress((prev) => !prev);
      }
      // Ctrl+G to toggle goals
      if (e.ctrlKey && e.key === "g") {
        e.preventDefault();
        setShowGoals((prev) => !prev);
      }
      // Ctrl+B to toggle notes (B for notebook)
      if (e.ctrlKey && e.key === "b") {
        e.preventDefault();
        setShowNotes((prev) => !prev);
      }
      // Ctrl+K to toggle bookmarks
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setShowBookmarks((prev) => !prev);
      }
      // Ctrl+Q to toggle quiz
      if (e.ctrlKey && e.key === "q") {
        e.preventDefault();
        setShowQuiz((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4 text-text-muted text-sm animate-fade-in">
          <div className="w-10 h-10 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
          <span>Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-surface gap-0 lg:gap-4">
      <div className="hidden lg:block flex-1 min-w-[240px] max-w-[280px] animate-fade-in-left overflow-visible"><ChatList/></div>
      <div className="flex-[4] bg-surface overflow-hidden animate-fade-in-right transition-all duration-300">
        <Outlet />
      </div>

      {/* Study Streak Banner */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 px-5 py-2 rounded-full z-50 animate-slide-down backdrop-blur-sm">
        <span className="text-xl">{getStreakEmoji(streak)}</span>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-indigo-500">{streak} day{streak !== 1 ? 's' : ''}</span>
          <span className="text-[11px] text-text-secondary">{getMotivationalMessage(streak)}</span>
        </div>
      </div>

      {/* Streak Celebration Modal */}
      {showStreakCelebration && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000] animate-fade-in" 
          onClick={() => setShowStreakCelebration(false)}
        >
          <div className="bg-gradient-to-br from-surface to-white dark:to-slate-900 rounded-3xl p-12 text-center max-w-sm border-2 border-indigo-500/30 shadow-2xl animate-bounce-in" onClick={(e) => e.stopPropagation()}>
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="m-0 mb-3 text-2xl text-indigo-500 font-bold">Streak Milestone!</h2>
            <div className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 leading-none my-2">{streak}</div>
            <p className="text-base text-text-secondary mb-6">Day Study Streak! {getMotivationalMessage(streak)}</p>
            <button 
              className="px-8 py-3.5 text-base font-semibold bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-0 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/40" 
              onClick={() => setShowStreakCelebration(false)}
            >
              Keep Going! 💪
            </button>
          </div>
        </div>
      )}
      
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[900] md:hidden lg:flex">
        <button 
          className="w-[52px] h-[52px] rounded-full border-none text-2xl cursor-pointer shadow-lg transition-all duration-300 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-cyan-700 text-white hover:scale-110 hover:-translate-y-1 hover:shadow-cyan-500/50 active:scale-95"
          onClick={() => setShowQuiz(true)}
          title="Quiz Generator (Ctrl+Q)"
        >
          📋
        </button>
        <button 
          className="w-[52px] h-[52px] rounded-full border-none text-2xl cursor-pointer shadow-lg transition-all duration-300 flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 text-white hover:scale-110 hover:-translate-y-1 hover:shadow-amber-500/50 active:scale-95"
          onClick={() => setShowBookmarks(true)}
          title="Saved Bookmarks (Ctrl+K)"
        >
          ⭐
        </button>
        <button 
          className="w-[52px] h-[52px] rounded-full border-none text-2xl cursor-pointer shadow-lg transition-all duration-300 flex items-center justify-center bg-gradient-to-br from-pink-500 to-pink-700 text-white hover:scale-110 hover:-translate-y-1 hover:shadow-pink-500/50 active:scale-95"
          onClick={() => setShowNotes(true)}
          title="Study Notes (Ctrl+B)"
        >
          📝
        </button>
        <button 
          className="w-[52px] h-[52px] rounded-full border-none text-2xl cursor-pointer shadow-lg transition-all duration-300 flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-700 text-white hover:scale-110 hover:-translate-y-1 hover:shadow-amber-600/50 active:scale-95"
          onClick={() => setShowGoals(true)}
          title="Study Goals (Ctrl+G)"
        >
          🎯
        </button>
        <button 
          className="w-[52px] h-[52px] rounded-full border-none text-2xl cursor-pointer shadow-lg transition-all duration-300 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-700 text-white hover:scale-110 hover:-translate-y-1 hover:shadow-emerald-500/50 active:scale-95"
          onClick={() => setShowProgress(true)}
          title="View Progress (Ctrl+P)"
        >
          📊
        </button>
        <button 
          className="w-[52px] h-[52px] rounded-full border-none text-2xl cursor-pointer shadow-lg transition-all duration-300 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-white hover:scale-110 hover:-translate-y-1 hover:shadow-indigo-500/50 active:scale-95"
          onClick={() => setShowTimer(true)}
          title="Open Pomodoro Timer (Ctrl+T)"
        >
          🍅
        </button>
      </div>

      {/* Study Timer Modal */}
      {showTimer && <StudyTimer onClose={() => setShowTimer(false)} />}

      {/* Progress Dashboard Modal */}
      {showProgress && <ProgressDashboard onClose={() => setShowProgress(false)} />}

      {/* Study Goals Modal */}
      {showGoals && <StudyGoals onClose={() => setShowGoals(false)} />}

      {/* Study Notes Modal */}
      {showNotes && <StudyNotes onClose={() => setShowNotes(false)} />}

      {/* Bookmarks Modal */}
      {showBookmarks && <Bookmarks onClose={() => setShowBookmarks(false)} />}

      {/* Quiz Generator Modal */}
      {showQuiz && <QuizGenerator onClose={() => setShowQuiz(false)} />}
    </div>
  );
};

export default DashboardLayout;
