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
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-text-tertiary font-semibold">Question:</span>
            <p className="m-0 text-lg font-medium text-text-primary leading-relaxed">{question.question}</p>
          </div>
          <div className="flex flex-col gap-2.5">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`flex items-center gap-3.5 p-4 bg-surface border-2 rounded-2xl cursor-pointer transition-all text-left ${
                    selectedAnswer === option 
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10'
                } ${
                  showResult 
                    ? option === question.correctAnswer 
                      ? '!border-emerald-500 !bg-emerald-50/50 dark:!bg-emerald-900/20' 
                      : selectedAnswer === option 
                        ? '!border-red-500 !bg-red-50/50 dark:!bg-red-900/20' 
                        : ''
                    : ''
                }`}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
              >
                <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-[13px] font-semibold transition-colors ${
                    selectedAnswer === option
                        ? 'bg-indigo-500 text-white'
                        : showResult && option === question.correctAnswer
                            ? 'bg-emerald-500 text-white'
                            : showResult && selectedAnswer === option
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-text-secondary'
                }`}>
                    {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 text-[15px] text-text-primary">{option}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (question.type === QUESTION_TYPES.TRUE_FALSE) {
      return (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-text-tertiary font-semibold">True or False:</span>
            <p className="m-0 text-lg font-medium text-text-primary leading-relaxed">{question.question}</p>
          </div>
          <div className="flex gap-4 sm:flex-row flex-col">
            <button
              className={`flex-1 p-5 border-2 rounded-2xl bg-surface text-base font-semibold cursor-pointer transition-all ${
                selectedAnswer === true 
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-500'
              } ${
                showResult 
                  ? question.correctAnswer === true 
                    ? '!border-emerald-500 !bg-emerald-50/50 dark:!bg-emerald-900/20 !text-emerald-600' 
                    : selectedAnswer === true 
                      ? '!border-red-500 !bg-red-50/50 dark:!bg-red-900/20 !text-red-600' 
                      : ''
                  : ''
              }`}
              onClick={() => handleAnswer(true)}
              disabled={showResult}
            >
              ✓ True
            </button>
            <button
              className={`flex-1 p-5 border-2 rounded-2xl bg-surface text-base font-semibold cursor-pointer transition-all ${
                selectedAnswer === false 
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-500'
              } ${
                showResult 
                  ? question.correctAnswer === false 
                    ? '!border-emerald-500 !bg-emerald-50/50 dark:!bg-emerald-900/20 !text-emerald-600' 
                    : selectedAnswer === false 
                      ? '!border-red-500 !bg-red-50/50 dark:!bg-red-900/20 !text-red-600' 
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
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl text-sm text-emerald-600 border border-emerald-100 dark:border-emerald-900/30">
              <span className="font-semibold">Correct answer:</span> {question.actualAnswer}
            </div>
          )}
        </div>
      );
    }

    if (question.type === QUESTION_TYPES.FILL_BLANK) {
      return (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-text-tertiary font-semibold">Fill in the blank:</span>
            <p className="m-0 text-lg font-medium text-text-primary leading-relaxed">{question.question}</p>
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder={`Hint: ${question.hint}`}
              value={fillBlankAnswer}
              onChange={(e) => setFillBlankAnswer(e.target.value)}
              disabled={showResult}
              onKeyDown={(e) => e.key === "Enter" && !showResult && fillBlankAnswer && submitAnswer()}
              autoFocus
              className="flex-1 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-surface text-base text-text-primary outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-text-tertiary disabled:opacity-70"
            />
          </div>
          {showResult && (
            <div className={`p-3 rounded-xl text-sm font-medium border ${
                fillBlankAnswer.toLowerCase().trim() === question.correctAnswer 
                    ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 border-emerald-100 dark:border-emerald-900/30' 
                    : 'bg-red-50 dark:bg-red-900/10 text-red-600 border-red-100 dark:border-red-900/30'
            }`}>
              {fillBlankAnswer.toLowerCase().trim() === question.correctAnswer 
                ? '✓ Correct!' 
                : <>✗ Correct answer: <strong className="font-bold">{question.correctAnswer}</strong></>
              }
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[4px] flex items-center justify-center z-[1000] animate-fade-in" onClick={onClose}>
      <div className="bg-surface rounded-3xl w-[90%] max-w-[600px] max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 dark:border-gray-800 animate-slide-up overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-900/10 dark:to-violet-900/10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <h2 className="text-xl font-semibold text-text-primary m-0">Quiz Generator</h2>
          </div>
          <button className="w-9 h-9 rounded-full border-0 bg-surface text-text-secondary text-base cursor-pointer transition-all hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 flex items-center justify-center" onClick={onClose}>✕</button>
        </div>

        {/* Quiz Setup */}
        {!quizStarted && !quizComplete && (
          <div className="p-6 flex flex-col gap-6 overflow-y-auto">
            {flashcards.length < 2 ? (
              <div className="flex flex-col items-center text-center py-10 px-5">
                <span className="text-5xl mb-4 opacity-50">📚</span>
                <h3 className="m-0 mb-2 text-text-primary text-lg font-semibold">Not Enough Flashcards</h3>
                <p className="m-0 mb-6 text-text-secondary text-sm">You need at least 2 flashcards to generate a quiz. Create some flashcards first!</p>
                <button className="py-3 px-6 bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-0 rounded-xl text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg" onClick={onClose}>
                  Create Flashcards
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <span className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 py-2 px-4 rounded-full text-sm font-medium">📚 {flashcards.length} flashcards available</span>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-sm font-semibold text-text-primary">Number of Questions</label>
                  <div className="flex gap-2.5 flex-wrap">
                    {[5, 10, 15, 20].map(count => (
                      <button
                        key={count}
                        className={`flex-1 py-3 px-4 border-2 rounded-xl text-base font-semibold cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                            quizSettings.questionCount === count 
                                ? 'bg-gradient-to-br from-indigo-500 to-violet-600 border-transparent text-white shadow-md' 
                                : 'border-gray-200 dark:border-gray-700 bg-surface text-text-secondary hover:border-indigo-500 hover:text-indigo-500'
                        }`}
                        onClick={() => setQuizSettings({ ...quizSettings, questionCount: count })}
                        disabled={count > flashcards.length}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-sm font-semibold text-text-primary">Question Types</label>
                  <div className="flex flex-col gap-2.5">
                    {[
                        { id: QUESTION_TYPES.MULTIPLE_CHOICE, label: 'Multiple Choice' },
                        { id: QUESTION_TYPES.TRUE_FALSE, label: 'True / False' },
                        { id: QUESTION_TYPES.FILL_BLANK, label: 'Fill in the Blank' }
                    ].map(type => (
                        <label key={type.id} className="flex items-center gap-3 p-3 bg-surface border border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer transition-all hover:border-indigo-500 hover:bg-indigo-50/10">
                            <input
                                type="checkbox"
                                checked={quizSettings.questionTypes.includes(type.id)}
                                onChange={(e) => {
                                    const types = e.target.checked
                                        ? [...quizSettings.questionTypes, type.id]
                                        : quizSettings.questionTypes.filter(t => t !== type.id);
                                    setQuizSettings({ ...quizSettings, questionTypes: types });
                                }}
                                className="w-4.5 h-4.5 accent-indigo-500 cursor-pointer"
                            />
                            <span className="text-sm text-text-primary font-medium">{type.label}</span>
                        </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 p-3 bg-indigo-50/30 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={quizSettings.shuffleQuestions}
                      onChange={(e) => setQuizSettings({ ...quizSettings, shuffleQuestions: e.target.checked })}
                      className="w-4.5 h-4.5 accent-indigo-500 cursor-pointer"
                    />
                    <span className="text-sm text-text-primary font-medium">🔀 Shuffle Questions</span>
                  </label>
                </div>

                <button 
                  className="py-4 px-8 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 rounded-xl text-base font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
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
          <div className="p-6 flex flex-col gap-6 overflow-y-auto">
            {/* Progress Bar */}
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between text-xs font-medium text-text-secondary">
                <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">Score: {score}/{currentQuestion + (showResult ? 1 : 0)}</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + (showResult ? 1 : 0)) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            {renderQuestion()}

            {/* Actions */}
            <div className="flex justify-center pt-2">
              {!showResult ? (
                <button 
                  className="py-3.5 px-8 bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-0 rounded-xl text-[15px] font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none min-w-[160px]"
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
                <button className="py-3.5 px-8 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 rounded-xl text-[15px] font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg min-w-[160px]" onClick={nextQuestion}>
                  {currentQuestion < quizQuestions.length - 1 ? 'Next Question →' : 'See Results 🎯'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quiz Complete */}
        {quizComplete && (
          <div className="p-8 flex flex-col items-center gap-6 overflow-y-auto">
            <div className="text-center">
              <span className="text-6xl mb-3 block animate-bounce-slow">
                {score / quizQuestions.length >= 0.8 ? '🎉' : score / quizQuestions.length >= 0.6 ? '👍' : '💪'}
              </span>
              <h3 className="m-0 text-2xl text-text-primary font-bold">Quiz Complete!</h3>
            </div>

            <div 
              className="w-40 h-40 rounded-full flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-900/10 dark:to-violet-900/10 shadow-inner"
              style={{ border: `6px solid ${getScoreColor(Math.round((score / quizQuestions.length) * 100))}` }}
            >
              <span className="text-4xl font-bold" style={{ color: getScoreColor(Math.round((score / quizQuestions.length) * 100)) }}>{Math.round((score / quizQuestions.length) * 100)}%</span>
              <span className="text-sm text-text-secondary font-medium">{score} / {quizQuestions.length}</span>
            </div>

            <div className="text-base text-text-secondary text-center max-w-[300px] leading-relaxed">
              {score / quizQuestions.length >= 0.8 && "Excellent work! You've mastered this material! 🌟"}
              {score / quizQuestions.length >= 0.6 && score / quizQuestions.length < 0.8 && "Good job! Keep practicing to improve! 📈"}
              {score / quizQuestions.length < 0.6 && "Keep studying! You'll get better with practice! 💪"}
            </div>

            {/* Answer Summary */}
            <div className="w-full">
              <h4 className="m-0 mb-3 text-sm font-semibold text-text-primary text-center uppercase tracking-wider">Answer Summary</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {answers.map((answer, index) => (
                  <div key={index} className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full text-[13px] font-medium border ${
                      answer.isCorrect 
                        ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 border-emerald-100 dark:border-emerald-900/30' 
                        : 'bg-red-50 dark:bg-red-900/10 text-red-600 border-red-100 dark:border-red-900/30'
                  }`}>
                    <span>{answer.isCorrect ? '✓' : '✗'}</span>
                    <span>Q{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-2 sm:flex-row flex-col w-full sm:w-auto">
              <button className="py-3 px-6 bg-surface border-2 border-gray-200 dark:border-gray-700 text-text-primary rounded-xl text-sm font-semibold cursor-pointer transition-all hover:border-indigo-500 hover:text-indigo-500 sm:w-auto w-full" onClick={restartQuiz}>
                🔄 Try Again
              </button>
              <button className="py-3 px-6 bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-0 rounded-xl text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg sm:w-auto w-full" onClick={onClose}>
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
