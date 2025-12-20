import { Outlet, useNavigate } from "react-router-dom";
import "./dashboardLayout.css";
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
      <div className="dashboardLayout loading">
        <div className="loadingContainer">
          <div className="loadingSpinner"></div>
          <span>Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboardLayout">
      <div className="menu"><ChatList/></div>
      <div className="content">
        <Outlet />
      </div>

      {/* Study Streak Banner */}
      <div className="streakBanner">
        <span className="streakEmoji">{getStreakEmoji(streak)}</span>
        <div className="streakInfo">
          <span className="streakCount">{streak} day{streak !== 1 ? 's' : ''}</span>
          <span className="streakMessage">{getMotivationalMessage(streak)}</span>
        </div>
      </div>

      {/* Streak Celebration Modal */}
      {showStreakCelebration && (
        <div className="streakCelebration" onClick={() => setShowStreakCelebration(false)}>
          <div className="celebrationContent">
            <div className="celebrationEmoji">🎉</div>
            <h2>Streak Milestone!</h2>
            <div className="streakBigNumber">{streak}</div>
            <p>Day Study Streak! {getMotivationalMessage(streak)}</p>
            <button onClick={() => setShowStreakCelebration(false)}>Keep Going! 💪</button>
          </div>
        </div>
      )}
      
      {/* Floating Action Buttons */}
      <div className="floatingButtons">
        <button 
          className="floatingBtn quizBtn"
          onClick={() => setShowQuiz(true)}
          title="Quiz Generator (Ctrl+Q)"
        >
          📋
        </button>
        <button 
          className="floatingBtn bookmarksBtn"
          onClick={() => setShowBookmarks(true)}
          title="Saved Bookmarks (Ctrl+K)"
        >
          ⭐
        </button>
        <button 
          className="floatingBtn notesBtn"
          onClick={() => setShowNotes(true)}
          title="Study Notes (Ctrl+B)"
        >
          📝
        </button>
        <button 
          className="floatingBtn goalsBtn"
          onClick={() => setShowGoals(true)}
          title="Study Goals (Ctrl+G)"
        >
          🎯
        </button>
        <button 
          className="floatingBtn progressBtn"
          onClick={() => setShowProgress(true)}
          title="View Progress (Ctrl+P)"
        >
          📊
        </button>
        <button 
          className="floatingBtn timerBtn"
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
