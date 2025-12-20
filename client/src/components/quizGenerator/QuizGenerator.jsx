import "./quizGenerator.css";
import { useState, useEffect } from "react";

// Question types
const QUESTION_TYPES = {
  MULTIPLE_CHOICE: "multiple_choice",
  TRUE_FALSE: "true_false",
  FILL_BLANK: "fill_blank",
};

const QuizGenerator = ({ onClose }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizSettings, setQuizSettings] = useState({
    questionCount: 5,
    questionTypes: [QUESTION_TYPES.MULTIPLE_CHOICE, QUESTION_TYPES.TRUE_FALSE],
    shuffleQuestions: true,
  });
  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [fillBlankAnswer, setFillBlankAnswer] = useState("");

  // Load flashcards from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("studyFlashcards");
    if (saved) {
      setFlashcards(JSON.parse(saved));
    }
  }, []);

  // Generate quiz questions from flashcards
  const generateQuiz = () => {
    if (flashcards.length < 2) return;

    let questions = [];
    const shuffledCards = [...flashcards].sort(() => Math.random() - 0.5);
    const selectedCards = shuffledCards.slice(0, Math.min(quizSettings.questionCount, flashcards.length));

    selectedCards.forEach((card, index) => {
      // Randomly select question type from enabled types
      const availableTypes = quizSettings.questionTypes;
      const questionType = availableTypes[Math.floor(Math.random() * availableTypes.length)];

      if (questionType === QUESTION_TYPES.MULTIPLE_CHOICE) {
        // Generate multiple choice question
        const wrongAnswers = flashcards
          .filter(f => f.id !== card.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(f => f.back);

        const allAnswers = [card.back, ...wrongAnswers].sort(() => Math.random() - 0.5);

        questions.push({
          id: index,
          type: QUESTION_TYPES.MULTIPLE_CHOICE,
          question: card.front,
          correctAnswer: card.back,
          options: allAnswers,
          cardId: card.id,
        });
      } else if (questionType === QUESTION_TYPES.TRUE_FALSE) {
        // Generate true/false question
        const isTrue = Math.random() > 0.5;
        const displayAnswer = isTrue ? card.back : flashcards.find(f => f.id !== card.id)?.back || card.back;

        questions.push({
          id: index,
          type: QUESTION_TYPES.TRUE_FALSE,
          question: `"${card.front}" means "${displayAnswer}"`,
          correctAnswer: isTrue,
          displayAnswer: displayAnswer,
          actualAnswer: card.back,
          cardId: card.id,
        });
      } else if (questionType === QUESTION_TYPES.FILL_BLANK) {
        // Generate fill in the blank question
        questions.push({
          id: index,
          type: QUESTION_TYPES.FILL_BLANK,
          question: card.front,
          correctAnswer: card.back.toLowerCase().trim(),
          hint: card.back.charAt(0) + "...",
          cardId: card.id,
        });
      }
    });

    if (quizSettings.shuffleQuestions) {
      questions = questions.sort(() => Math.random() - 0.5);
    }

    setQuizQuestions(questions);
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setQuizComplete(false);
  };

  // Handle answer selection
  const handleAnswer = (answer) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  // Submit answer
  const submitAnswer = () => {
    const question = quizQuestions[currentQuestion];
    let isCorrect = false;

    if (question.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
      isCorrect = selectedAnswer === question.correctAnswer;
    } else if (question.type === QUESTION_TYPES.TRUE_FALSE) {
      isCorrect = selectedAnswer === question.correctAnswer;
    } else if (question.type === QUESTION_TYPES.FILL_BLANK) {
      isCorrect = fillBlankAnswer.toLowerCase().trim() === question.correctAnswer;
    }

    if (isCorrect) {
      setScore(score + 1);
    }

    setAnswers([...answers, {
      questionId: question.id,
      userAnswer: question.type === QUESTION_TYPES.FILL_BLANK ? fillBlankAnswer : selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
    }]);

    setShowResult(true);
  };

  // Next question
  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setFillBlankAnswer("");
      setShowResult(false);
    } else {
      setQuizComplete(true);
      saveQuizResult();
    }
  };

  // Save quiz result to stats
  const saveQuizResult = () => {
    const stats = JSON.parse(localStorage.getItem("studyStats") || "{}");
    stats.totalQuizzes = (stats.totalQuizzes || 0) + 1;
    stats.totalQuizQuestions = (stats.totalQuizQuestions || 0) + quizQuestions.length;
    stats.correctAnswers = (stats.correctAnswers || 0) + score;
    
    // Save quiz history
    const quizHistory = JSON.parse(localStorage.getItem("quizHistory") || "[]");
    quizHistory.unshift({
      id: Date.now(),
      date: new Date().toISOString(),
      score: score,
      total: quizQuestions.length,
      percentage: Math.round((score / quizQuestions.length) * 100),
    });
    localStorage.setItem("quizHistory", JSON.stringify(quizHistory.slice(0, 50)));
    localStorage.setItem("studyStats", JSON.stringify(stats));
  };

  // Restart quiz
  const restartQuiz = () => {
    setQuizStarted(false);
    setQuizComplete(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setFillBlankAnswer("");
    setShowResult(false);
    setScore(0);
    setAnswers([]);
  };

  // Get score color
  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "#10b981";
    if (percentage >= 60) return "#f59e0b";
    return "#ef4444";
  };

  // Render question based on type
  const renderQuestion = () => {
    const question = quizQuestions[currentQuestion];

    if (question.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
      return (
        <div className="questionContent">
          <div className="questionText">
            <span className="questionLabel">Question:</span>
            <p>{question.question}</p>
          </div>
          <div className="optionsList">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`optionBtn ${selectedAnswer === option ? 'selected' : ''} ${
                  showResult 
                    ? option === question.correctAnswer 
                      ? 'correct' 
                      : selectedAnswer === option 
                        ? 'incorrect' 
                        : ''
                    : ''
                }`}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
              >
                <span className="optionLetter">{String.fromCharCode(65 + index)}</span>
                <span className="optionText">{option}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (question.type === QUESTION_TYPES.TRUE_FALSE) {
      return (
        <div className="questionContent">
          <div className="questionText">
            <span className="questionLabel">True or False:</span>
            <p>{question.question}</p>
          </div>
          <div className="trueFalseOptions">
            <button
              className={`tfBtn ${selectedAnswer === true ? 'selected' : ''} ${
                showResult 
                  ? question.correctAnswer === true 
                    ? 'correct' 
                    : selectedAnswer === true 
                      ? 'incorrect' 
                      : ''
                  : ''
              }`}
              onClick={() => handleAnswer(true)}
              disabled={showResult}
            >
              ✓ True
            </button>
            <button
              className={`tfBtn ${selectedAnswer === false ? 'selected' : ''} ${
                showResult 
                  ? question.correctAnswer === false 
                    ? 'correct' 
                    : selectedAnswer === false 
                      ? 'incorrect' 
                      : ''
                  : ''
              }`}
              onClick={() => handleAnswer(false)}
              disabled={showResult}
            >
              ✗ False
            </button>
          </div>
          {showResult && !question.correctAnswer && (
            <div className="correctAnswerReveal">
              <span>Correct answer:</span> {question.actualAnswer}
            </div>
          )}
        </div>
      );
    }

    if (question.type === QUESTION_TYPES.FILL_BLANK) {
      return (
        <div className="questionContent">
          <div className="questionText">
            <span className="questionLabel">Fill in the blank:</span>
            <p>{question.question}</p>
          </div>
          <div className="fillBlankInput">
            <input
              type="text"
              placeholder={`Hint: ${question.hint}`}
              value={fillBlankAnswer}
              onChange={(e) => setFillBlankAnswer(e.target.value)}
              disabled={showResult}
              onKeyDown={(e) => e.key === "Enter" && !showResult && fillBlankAnswer && submitAnswer()}
              autoFocus
            />
          </div>
          {showResult && (
            <div className={`fillBlankResult ${fillBlankAnswer.toLowerCase().trim() === question.correctAnswer ? 'correct' : 'incorrect'}`}>
              {fillBlankAnswer.toLowerCase().trim() === question.correctAnswer 
                ? '✓ Correct!' 
                : <>✗ Correct answer: <strong>{question.correctAnswer}</strong></>
              }
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="quizOverlay" onClick={onClose}>
      <div className="quizModal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="quizHeader">
          <div className="headerLeft">
            <span className="quizIcon">📋</span>
            <h2>Quiz Generator</h2>
          </div>
          <button className="closeBtn" onClick={onClose}>✕</button>
        </div>

        {/* Quiz Setup */}
        {!quizStarted && !quizComplete && (
          <div className="quizSetup">
            {flashcards.length < 2 ? (
              <div className="noFlashcards">
                <span className="emptyIcon">📚</span>
                <h3>Not Enough Flashcards</h3>
                <p>You need at least 2 flashcards to generate a quiz. Create some flashcards first!</p>
                <button className="primaryBtn" onClick={onClose}>
                  Create Flashcards
                </button>
              </div>
            ) : (
              <>
                <div className="setupInfo">
                  <span className="cardCount">📚 {flashcards.length} flashcards available</span>
                </div>

                <div className="settingGroup">
                  <label>Number of Questions</label>
                  <div className="questionCountBtns">
                    {[5, 10, 15, 20].map(count => (
                      <button
                        key={count}
                        className={`countBtn ${quizSettings.questionCount === count ? 'active' : ''}`}
                        onClick={() => setQuizSettings({ ...quizSettings, questionCount: count })}
                        disabled={count > flashcards.length}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="settingGroup">
                  <label>Question Types</label>
                  <div className="typeCheckboxes">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={quizSettings.questionTypes.includes(QUESTION_TYPES.MULTIPLE_CHOICE)}
                        onChange={(e) => {
                          const types = e.target.checked
                            ? [...quizSettings.questionTypes, QUESTION_TYPES.MULTIPLE_CHOICE]
                            : quizSettings.questionTypes.filter(t => t !== QUESTION_TYPES.MULTIPLE_CHOICE);
                          setQuizSettings({ ...quizSettings, questionTypes: types });
                        }}
                      />
                      <span>Multiple Choice</span>
                    </label>
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={quizSettings.questionTypes.includes(QUESTION_TYPES.TRUE_FALSE)}
                        onChange={(e) => {
                          const types = e.target.checked
                            ? [...quizSettings.questionTypes, QUESTION_TYPES.TRUE_FALSE]
                            : quizSettings.questionTypes.filter(t => t !== QUESTION_TYPES.TRUE_FALSE);
                          setQuizSettings({ ...quizSettings, questionTypes: types });
                        }}
                      />
                      <span>True / False</span>
                    </label>
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={quizSettings.questionTypes.includes(QUESTION_TYPES.FILL_BLANK)}
                        onChange={(e) => {
                          const types = e.target.checked
                            ? [...quizSettings.questionTypes, QUESTION_TYPES.FILL_BLANK]
                            : quizSettings.questionTypes.filter(t => t !== QUESTION_TYPES.FILL_BLANK);
                          setQuizSettings({ ...quizSettings, questionTypes: types });
                        }}
                      />
                      <span>Fill in the Blank</span>
                    </label>
                  </div>
                </div>

                <div className="settingGroup">
                  <label className="checkbox shuffle">
                    <input
                      type="checkbox"
                      checked={quizSettings.shuffleQuestions}
                      onChange={(e) => setQuizSettings({ ...quizSettings, shuffleQuestions: e.target.checked })}
                    />
                    <span>🔀 Shuffle Questions</span>
                  </label>
                </div>

                <button 
                  className="startQuizBtn"
                  onClick={generateQuiz}
                  disabled={quizSettings.questionTypes.length === 0}
                >
                  🚀 Start Quiz
                </button>
              </>
            )}
          </div>
        )}

        {/* Active Quiz */}
        {quizStarted && !quizComplete && (
          <div className="activeQuiz">
            {/* Progress Bar */}
            <div className="quizProgress">
              <div className="progressInfo">
                <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span className="scoreDisplay">Score: {score}/{currentQuestion + (showResult ? 1 : 0)}</span>
              </div>
              <div className="progressBar">
                <div 
                  className="progressFill"
                  style={{ width: `${((currentQuestion + (showResult ? 1 : 0)) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            {renderQuestion()}

            {/* Actions */}
            <div className="quizActions">
              {!showResult ? (
                <button 
                  className="submitBtn"
                  onClick={submitAnswer}
                  disabled={
                    selectedAnswer === null && 
                    quizQuestions[currentQuestion]?.type !== QUESTION_TYPES.FILL_BLANK ||
                    (quizQuestions[currentQuestion]?.type === QUESTION_TYPES.FILL_BLANK && !fillBlankAnswer)
                  }
                >
                  Submit Answer
                </button>
              ) : (
                <button className="nextBtn" onClick={nextQuestion}>
                  {currentQuestion < quizQuestions.length - 1 ? 'Next Question →' : 'See Results 🎯'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quiz Complete */}
        {quizComplete && (
          <div className="quizResults">
            <div className="resultsHeader">
              <span className="resultsEmoji">
                {score / quizQuestions.length >= 0.8 ? '🎉' : score / quizQuestions.length >= 0.6 ? '👍' : '💪'}
              </span>
              <h3>Quiz Complete!</h3>
            </div>

            <div 
              className="scoreCircle"
              style={{ '--score-color': getScoreColor(Math.round((score / quizQuestions.length) * 100)) }}
            >
              <span className="scorePercentage">{Math.round((score / quizQuestions.length) * 100)}%</span>
              <span className="scoreText">{score} / {quizQuestions.length}</span>
            </div>

            <div className="resultsMessage">
              {score / quizQuestions.length >= 0.8 && "Excellent work! You've mastered this material! 🌟"}
              {score / quizQuestions.length >= 0.6 && score / quizQuestions.length < 0.8 && "Good job! Keep practicing to improve! 📈"}
              {score / quizQuestions.length < 0.6 && "Keep studying! You'll get better with practice! 💪"}
            </div>

            {/* Answer Summary */}
            <div className="answerSummary">
              <h4>Answer Summary</h4>
              <div className="summaryList">
                {answers.map((answer, index) => (
                  <div key={index} className={`summaryItem ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                    <span className="summaryIcon">{answer.isCorrect ? '✓' : '✗'}</span>
                    <span className="summaryQuestion">Q{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="resultsActions">
              <button className="retryBtn" onClick={restartQuiz}>
                🔄 Try Again
              </button>
              <button className="doneBtn" onClick={onClose}>
                ✓ Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGenerator;
