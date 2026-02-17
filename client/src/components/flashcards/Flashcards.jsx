import { useState, useEffect } from "react";

const Flashcards = ({ cards, onClose, onSave }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState(new Set());
  const [reviewCards, setReviewCards] = useState(new Set());
  const [showResults, setShowResults] = useState(false);

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setIsFlipped(!isFlipped);
      } else if (e.key === "ArrowRight" || e.key === "d") {
        handleNext();
      } else if (e.key === "ArrowLeft" || e.key === "a") {
        handlePrev();
      } else if (e.key === "1") {
        handleMarkKnown();
      } else if (e.key === "2") {
        handleMarkReview();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isFlipped, cards.length]);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleMarkKnown = () => {
    const newKnown = new Set(knownCards);
    newKnown.add(currentIndex);
    setKnownCards(newKnown);
    
    // Remove from review if was there
    const newReview = new Set(reviewCards);
    newReview.delete(currentIndex);
    setReviewCards(newReview);
    
    handleNext();
  };

  const handleMarkReview = () => {
    const newReview = new Set(reviewCards);
    newReview.add(currentIndex);
    setReviewCards(newReview);
    
    // Remove from known if was there
    const newKnown = new Set(knownCards);
    newKnown.delete(currentIndex);
    setKnownCards(newKnown);
    
    handleNext();
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setKnownCards(new Set());
    setReviewCards(new Set());
    setShowResults(false);
    setIsFlipped(false);
  };

  const handleStudyReviewOnly = () => {
    // Filter to only review cards
    if (reviewCards.size > 0) {
      setCurrentIndex(Array.from(reviewCards)[0]);
      setShowResults(false);
      setIsFlipped(false);
    }
  };

  if (showResults) {
    const knownCount = knownCards.size;
    const reviewCount = reviewCards.size;
    const skippedCount = cards.length - knownCount - reviewCount;
    const percentage = Math.round((knownCount / cards.length) * 100);

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[1000] animate-fade-in">
        <div className="bg-surface rounded-3xl p-8 w-[90%] max-w-[600px] shadow-2xl animate-fade-in-up border border-white/10 dark:border-white/5 text-center">
          <button className="absolute top-6 right-6 w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-text-muted transition-all hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 cursor-pointer" onClick={onClose}>✕</button>
          
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold bg-gradient-to-br from-indigo-500 to-violet-500 bg-clip-text text-transparent mb-8">📊 Session Complete!</h2>
            
            <div className="relative w-40 h-40 mb-8 self-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="45" className="fill-none stroke-indigo-50 dark:stroke-indigo-900/20 stroke-[10]" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  className="fill-none stroke-indigo-500 stroke-[10] stroke-linecap-round transition-[stroke-dasharray] duration-1000 ease-out"
                  style={{ 
                    strokeDasharray: `${percentage * 2.83} 283`,
                  }}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="text-4xl font-bold bg-gradient-to-br from-indigo-500 to-violet-500 bg-clip-text text-transparent">{percentage}%</span>
                <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Mastered</span>
              </div>
            </div>

            <div className="flex justify-center gap-6 mb-8 w-full">
              <div className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 min-w-[100px]">
                <span className="text-2xl">✓</span>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{knownCount}</span>
                <span className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest">Known</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 min-w-[100px]">
                <span className="text-2xl">📖</span>
                <span className="text-2xl font-bold text-amber-500 dark:text-amber-400">{reviewCount}</span>
                <span className="text-[10px] font-bold text-amber-500/70 dark:text-amber-400/70 uppercase tracking-widest">Review</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 min-w-[100px]">
                <span className="text-2xl">⏭️</span>
                <span className="text-2xl font-bold text-text-secondary">{skippedCount}</span>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Skipped</span>
              </div>
            </div>

            <div className="flex flex-col w-full gap-3">
              <button className="py-3.5 px-6 rounded-xl font-semibold bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400 transition-all hover:bg-indigo-100 dark:hover:bg-indigo-900/30" onClick={handleRestart}>
                🔄 Start Over
              </button>
              {reviewCount > 0 && (
                <button className="py-3.5 px-6 rounded-xl font-semibold bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5" onClick={handleStudyReviewOnly}>
                  📖 Study Review Cards ({reviewCount})
                </button>
              )}
              <button className="py-3.5 px-6 rounded-xl font-semibold bg-transparent border border-gray-200 dark:border-gray-700 text-text-secondary transition-all hover:border-indigo-500 hover:text-indigo-600" onClick={onClose}>
                ✓ Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[1000] animate-fade-in p-4">
      <div className="bg-surface rounded-3xl p-8 w-full max-w-[600px] shadow-2xl animate-fade-in-up border border-white/10 dark:border-white/5 relative">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-2xl font-bold bg-gradient-to-br from-indigo-500 to-violet-500 bg-clip-text text-transparent m-0">📚 Flashcards</h3>
          <div className="text-sm font-semibold text-text-secondary bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            {currentIndex + 1} / {cards.length}
          </div>
          <button className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-text-muted transition-all hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 cursor-pointer" onClick={onClose}>✕</button>
        </div>

        <div className="h-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>

        <div 
          className="relative w-full h-[320px] perspective-[1000px] cursor-pointer mb-6 group"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            {/* Front */}
            <div className="absolute inset-0 backface-hidden rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-lg bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-900/10 dark:to-violet-900/10 border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors">
              <span className="absolute top-5 left-6 text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">Question</span>
              <p className="text-xl font-medium text-text-primary leading-relaxed">{currentCard?.front}</p>
              <span className="absolute bottom-5 text-xs text-text-muted opacity-0 transition-opacity group-hover:opacity-100">Click or press Space to flip</span>
            </div>
            
            {/* Back */}
            <div className="absolute inset-0 backface-hidden rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-lg bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10 border-2 border-emerald-200 dark:border-emerald-800 rotate-y-180">
              <span className="absolute top-5 left-6 text-xs font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-400">Answer</span>
              <p className="text-xl font-medium text-text-primary leading-relaxed">{currentCard?.back}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mb-4">
          <button 
            className="py-2.5 px-5 rounded-xl border border-gray-200 dark:border-gray-700 font-medium text-text-secondary transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-secondary disabled:hover:border-gray-200"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            ← Prev
          </button>
          
          <div className="flex gap-3">
            <button 
              className={`py-3 px-6 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 ${knownCards.has(currentIndex) ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 hover:bg-emerald-500 hover:text-white'}`}
              onClick={handleMarkKnown}
              title="Press 1"
            >
              ✓ Know It
            </button>
            <button 
              className={`py-3 px-6 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 ${reviewCards.has(currentIndex) ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-amber-50 dark:bg-amber-900/10 text-amber-600 hover:bg-amber-500 hover:text-white'}`}
              onClick={handleMarkReview}
              title="Press 2"
            >
              📖 Review
            </button>
          </div>

          <button 
            className="py-2.5 px-5 rounded-xl border border-gray-200 dark:border-gray-700 font-medium text-text-secondary transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:border-indigo-300 hover:text-indigo-600"
            onClick={handleNext}
          >
            {currentIndex === cards.length - 1 ? 'Finish →' : 'Next →'}
          </button>
        </div>

        <div className="flex justify-center gap-5 text-xs text-text-muted mt-6">
          <span className="flex items-center gap-1.5"><kbd className="py-0.5 px-1.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 font-sans">Space</kbd> Flip</span>
          <span className="flex items-center gap-1.5"><kbd className="py-0.5 px-1.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 font-sans">←/→</kbd> Navigate</span>
          <span className="flex items-center gap-1.5"><kbd className="py-0.5 px-1.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 font-sans">1</kbd> Know</span>
          <span className="flex items-center gap-1.5"><kbd className="py-0.5 px-1.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 font-sans">2</kbd> Review</span>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
