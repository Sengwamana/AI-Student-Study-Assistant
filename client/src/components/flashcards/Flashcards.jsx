import { useState, useEffect } from "react";
import "./flashcards.css";

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
      <div className="flashcardsOverlay">
        <div className="flashcardsModal results">
          <button className="closeBtn" onClick={onClose}>✕</button>
          
          <div className="resultsContent">
            <h2>📊 Session Complete!</h2>
            
            <div className="scoreCircle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="bgCircle" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  className="progressCircle"
                  style={{ 
                    strokeDasharray: `${percentage * 2.83} 283`,
                  }}
                />
              </svg>
              <div className="scoreText">
                <span className="percentage">{percentage}%</span>
                <span className="label">Mastered</span>
              </div>
            </div>

            <div className="statsGrid">
              <div className="stat known">
                <span className="statIcon">✓</span>
                <span className="statValue">{knownCount}</span>
                <span className="statLabel">Known</span>
              </div>
              <div className="stat review">
                <span className="statIcon">📖</span>
                <span className="statValue">{reviewCount}</span>
                <span className="statLabel">Need Review</span>
              </div>
              <div className="stat skipped">
                <span className="statIcon">⏭️</span>
                <span className="statValue">{skippedCount}</span>
                <span className="statLabel">Skipped</span>
              </div>
            </div>

            <div className="resultActions">
              <button className="actionBtn secondary" onClick={handleRestart}>
                🔄 Start Over
              </button>
              {reviewCount > 0 && (
                <button className="actionBtn primary" onClick={handleStudyReviewOnly}>
                  📖 Study Review Cards ({reviewCount})
                </button>
              )}
              <button className="actionBtn outline" onClick={onClose}>
                ✓ Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcardsOverlay">
      <div className="flashcardsModal">
        <div className="flashcardsHeader">
          <h3>📚 Flashcards</h3>
          <div className="cardCounter">
            {currentIndex + 1} / {cards.length}
          </div>
          <button className="closeBtn" onClick={onClose}>✕</button>
        </div>

        <div className="progressBar">
          <div className="progressFill" style={{ width: `${progress}%` }}></div>
        </div>

        <div 
          className={`flashcard ${isFlipped ? 'flipped' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="cardInner">
            <div className="cardFront">
              <span className="cardLabel">Question</span>
              <p>{currentCard?.front}</p>
              <span className="flipHint">Click or press Space to flip</span>
            </div>
            <div className="cardBack">
              <span className="cardLabel">Answer</span>
              <p>{currentCard?.back}</p>
            </div>
          </div>
        </div>

        <div className="cardActions">
          <button 
            className="navBtn prev" 
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            ← Prev
          </button>
          
          <div className="markButtons">
            <button 
              className={`markBtn known ${knownCards.has(currentIndex) ? 'active' : ''}`}
              onClick={handleMarkKnown}
              title="Press 1"
            >
              ✓ Know It
            </button>
            <button 
              className={`markBtn review ${reviewCards.has(currentIndex) ? 'active' : ''}`}
              onClick={handleMarkReview}
              title="Press 2"
            >
              📖 Review
            </button>
          </div>

          <button 
            className="navBtn next" 
            onClick={handleNext}
          >
            {currentIndex === cards.length - 1 ? 'Finish →' : 'Next →'}
          </button>
        </div>

        <div className="shortcuts">
          <span>Space: Flip</span>
          <span>←/→: Navigate</span>
          <span>1: Know</span>
          <span>2: Review</span>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
