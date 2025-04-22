// src/app/training/questions/page.js
"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  memo,
  Suspense,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// This component will use useSearchParams and must be wrapped in Suspense
const QuestionContent = memo(() => {
  // Import useSearchParams inside the component that's wrapped in Suspense
  const { useSearchParams } = require("next/navigation");
  const searchParams = useSearchParams();

  const subject = searchParams.get("subject");
  const phase = searchParams.get("phase");
  const name = searchParams.get("name");

  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState("next");
  const [showCompleteButton, setShowCompleteButton] = useState(false);
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    unanswered: 0,
  });

  const questionCardRef = useRef(null);
  const contentRef = useRef(null);

  // Load questions based on the selected phase
  useEffect(() => {
    if (!subject || !phase) return;

    // We need to dynamically import these since they're only used client-side
    const getRandomQuestions =
      require("../../data/questionsUtils").getRandomQuestions;

    // Fetch questions from the question bank
    try {
      setLoading(true);

      // Determine appropriate number of questions based on the phase
      let questionsCount = 10; // Default for training mode - using fewer questions than exam

      if (phase === "behavioral") {
        questionsCount = 20; // 20 questions for behavioral
      } else if (
        phase.startsWith("language_") ||
        phase.startsWith("knowledge_")
      ) {
        questionsCount = 10; // 10 questions for language and knowledge subphases
      } else if (phase === "specialization" || phase === "education") {
        questionsCount = 15; // 15 questions for specialization or education
      }

      // Get the questions
      const phaseQuestions = getRandomQuestions(subject, phase, questionsCount);

      if (!phaseQuestions || !phaseQuestions.length) {
        setError("لا توجد أسئلة متاحة لهذه المرحلة");
        setQuestions([]);
      } else {
        setQuestions(phaseQuestions);

        // Initialize answers array
        setAnswers(new Array(phaseQuestions.length).fill(null));
        setStats({
          correct: 0,
          incorrect: 0,
          unanswered: phaseQuestions.length,
        });
      }
    } catch (error) {
      console.error("Error loading questions:", error);
      setError("حدث خطأ في تحميل الأسئلة");
    } finally {
      setLoading(false);
    }
  }, [subject, phase]);

  // Update stats when answers change
  useEffect(() => {
    if (!questions.length) return;

    const correct = answers.filter((a) => a?.isCorrect).length;
    const incorrect = answers.filter(
      (a) => a?.answered && !a?.isCorrect
    ).length;
    const unanswered = questions.length - correct - incorrect;

    setStats({ correct, incorrect, unanswered });
  }, [answers, questions]);

  // Handle option selection
  const handleOptionSelect = useCallback(
    (optionIndex) => {
      if (isAnswered) return;

      setSelectedOption(optionIndex);

      // In training mode, we immediately show the answer
      const currentQuestion = questions[currentQuestionIndex];
      const isCorrect = currentQuestion?.correctAnswer === optionIndex;

      // Update the answers array
      setAnswers((prevAnswers) => {
        const newAnswers = [...prevAnswers];
        newAnswers[currentQuestionIndex] = {
          questionId: currentQuestion?.id,
          selectedOption: optionIndex,
          isCorrect,
          answered: true,
        };
        return newAnswers;
      });

      setIsAnswered(true);

      // Show the complete button if this is the last question
      if (currentQuestionIndex === questions.length - 1) {
        setShowCompleteButton(true);
      }

      // Scroll to the feedback section
      setTimeout(() => {
        contentRef.current?.scrollTo({
          top: contentRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    },
    [currentQuestionIndex, isAnswered, questions]
  );

  // Handle moving to the next question
  const handleNextQuestion = useCallback(() => {
    if (isTransitioning) return;

    if (currentQuestionIndex < questions.length - 1) {
      // Start transition animation
      setDirection("next");
      setIsTransitioning(true);

      // Wait for animation to complete before changing the question
      setTimeout(() => {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setSelectedOption(null);
        setIsAnswered(false);

        // End transition after question has changed
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    }
  }, [currentQuestionIndex, questions.length, isTransitioning]);

  // Handle moving to the previous question
  const handlePreviousQuestion = useCallback(() => {
    if (isTransitioning || currentQuestionIndex === 0) return;

    // Start transition animation
    setDirection("prev");
    setIsTransitioning(true);

    // Wait for animation to complete before changing the question
    setTimeout(() => {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);

      // Restore previous answer state
      const previousAnswer = answers[currentQuestionIndex - 1];
      setSelectedOption(previousAnswer?.selectedOption || null);
      setIsAnswered(previousAnswer?.answered || false);

      // End transition after question has changed
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  }, [currentQuestionIndex, answers, isTransitioning]);

  // Jump to a specific question
  const handleJumpToQuestion = useCallback(
    (index) => {
      if (isTransitioning || index === currentQuestionIndex) return;

      // Start transition animation
      setDirection(index > currentQuestionIndex ? "next" : "prev");
      setIsTransitioning(true);

      // Wait for animation to complete before changing the question
      setTimeout(() => {
        setCurrentQuestionIndex(index);

        // Restore answer state for the target question
        const targetAnswer = answers[index];
        setSelectedOption(targetAnswer?.selectedOption || null);
        setIsAnswered(targetAnswer?.answered || false);

        // End transition after question has changed
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    },
    [currentQuestionIndex, answers, isTransitioning]
  );

  // Handle completing the training session
  const handleComplete = useCallback(() => {
    // Calculate the scores
    const totalAnswered = answers.filter((a) => a?.answered).length;
    const correctAnswers = answers.filter((a) => a?.isCorrect).length;
    const score =
      totalAnswered > 0
        ? Math.round((correctAnswers / totalAnswered) * 100)
        : 0;

    // Show completion animation
    document.body.style.overflow = "hidden";

    // Create completion animation overlay
    const overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 bg-gradient-to-br from-blue-900/90 to-indigo-900/90 backdrop-blur-md z-50 flex items-center justify-center";

    const content = document.createElement("div");
    content.className = "text-center";
    content.innerHTML = `
      <div class="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
        <svg class="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">تم الانتهاء من التدريب</h2>
      <p class="text-white/70 mb-8">جاري تحضير النتائج...</p>
    `;
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    // Navigate to results page after animation
    setTimeout(() => {
      document.body.style.overflow = "";
      document.body.removeChild(overlay);
      router.push(
        `/training/results?subject=${subject}&phase=${phase}&name=${encodeURIComponent(
          name
        )}&score=${score}&total=${questions.length}&correct=${correctAnswers}`
      );
    }, 1500);
  }, [router, subject, phase, name, answers, questions.length]);

  // Handle exit to dashboard
  const handleExit = useCallback(() => {
    // Create exit confirmation dialog
    const dialog = document.createElement("div");
    dialog.className =
      "fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4";

    dialog.innerHTML = `
      <div class="glass-card max-w-md w-full bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl p-6 shadow-xl border border-white/20">
        <h2 class="text-xl font-bold text-white mb-4">هل تريد الخروج من التدريب؟</h2>
        <p class="text-white/80 mb-6">سيتم فقدان تقدمك الحالي ولن يتم حفظ النتائج.</p>
        <div class="flex justify-end gap-3">
          <button id="cancel-exit" class="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors">إلغاء</button>
          <button id="confirm-exit" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">خروج</button>
        </div>
      </div>
    `;

    document.body.appendChild(dialog);

    // Add event listeners
    document.getElementById("cancel-exit").addEventListener("click", () => {
      document.body.removeChild(dialog);
    });

    document.getElementById("confirm-exit").addEventListener("click", () => {
      document.body.removeChild(dialog);
      router.push("/training");
    });
  }, [router]);

  // Display a loading state while fetching questions
  if (loading) {
    return (
      <>
        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh] pt-28 overflow-hidden">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-6"></div>
          <div className="text-white text-lg font-bold">
            جاري تحميل الأسئلة...
          </div>
          <div className="text-white/60 mt-2 text-center">
            نقوم بإعداد تجربة تدريبية مخصصة لك في{" "}
            {phase === "behavioral"
              ? "الكفايات السلوكية والنفسية"
              : phase === "language_arabic"
              ? "اللغة العربية"
              : phase === "language_english"
              ? "اللغة الإنجليزية"
              : phase === "specialization"
              ? "كفايات التخصص"
              : getPhaseName(phase)}
          </div>
        </div>
      </>
    );
  }

  // If there was an error
  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-indigo-900 pattern-grid">
        {/* Mini header - self-contained */}
        <div className="sticky top-0 z-30 w-full bg-gradient-to-r from-slate-900/90 to-indigo-900/90 backdrop-blur-md shadow-md border-b border-white/10">
          <div className="max-w-4xl mx-auto px-3 py-3">
            <div className="flex items-center justify-between">
              <Link
                href="/training"
                className="flex items-center gap-2 rounded-lg px-2 py-1 bg-white/10 hover:bg-white/20 transition-colors border border-white/20 text-white text-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>العودة</span>
              </Link>
              <div className="text-white font-medium text-sm">وضع التدريب</div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[80vh] pt-16">
          <div className="w-16 h-16 bg-red-500/30 rounded-full flex items-center justify-center mb-6 border border-red-500/60">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="text-red-400 font-bold text-lg mb-4">{error}</div>
          <p className="text-white/70 mb-6 text-center max-w-md">
            لم نتمكن من تحميل الأسئلة لهذه المرحلة. يرجى المحاولة مرة أخرى أو
            اختيار مرحلة مختلفة للتدريب.
          </p>
          <Link
            href="/training"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            العودة لصفحة التدريب
          </Link>
        </div>
      </div>
    );
  }

  // If no questions were loaded after loading completes, show an error
  if (!questions.length) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-indigo-900 pattern-grid">
        {/* Mini header - self-contained */}
        <div className="sticky top-0 z-30 w-full bg-gradient-to-r from-slate-900/90 to-indigo-900/90 backdrop-blur-md shadow-md border-b border-white/10">
          <div className="max-w-4xl mx-auto px-3 py-3">
            <div className="flex items-center justify-between">
              <Link
                href="/training"
                className="flex items-center gap-2 rounded-lg px-2 py-1 bg-white/10 hover:bg-white/20 transition-colors border border-white/20 text-white text-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>العودة</span>
              </Link>
              <div className="text-white font-medium text-sm">وضع التدريب</div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[80vh] pt-16">
          <div className="w-16 h-16 bg-amber-500/30 rounded-full flex items-center justify-center mb-6 border border-amber-500/60">
            <svg
              className="w-8 h-8 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="text-amber-400 font-bold text-lg mb-4">
            لا توجد أسئلة متاحة لهذه المرحلة
          </div>
          <p className="text-white/70 mb-6 text-center max-w-md">
            يرجى اختيار مرحلة أخرى للتدريب حيث لا تتوفر أسئلة لهذه المرحلة
            حالياً.
          </p>
          <Link
            href="/training"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            العودة لصفحة التدريب
          </Link>
        </div>
      </div>
    );
  }

  // Get the current question
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const correctAnswerText =
    currentQuestion?.options[currentQuestion?.correctAnswer];

  // Calculate progress percentage
  const progressPercentage =
    ((currentQuestionIndex + 1) / questions.length) * 100;

  // Memoized question option component with improved visual design and better contrast
  const QuestionOption = memo(
    ({
      option,
      index,
      isSelected,
      isCorrect,
      isAnswered,
      isCorrectAnswer,
      onSelect,
    }) => (
      <button
        onClick={() => !isAnswered && onSelect(index)}
        className={`w-full p-3 sm:p-4 rounded-xl border text-right transition-all duration-300 mb-2 transform ${
          isAnswered
            ? isSelected
              ? isCorrect
                ? "border-green-500 bg-gradient-to-r from-green-500/20 to-green-600/30 text-white shadow-md shadow-green-500/20"
                : "border-red-500 bg-gradient-to-r from-red-500/20 to-red-600/30 text-white shadow-md shadow-red-500/20"
              : isCorrectAnswer
              ? "border-green-500 bg-gradient-to-r from-green-500/15 to-green-600/20 text-white/90"
              : "border-gray-300/50 bg-white/10 text-white/70"
            : isSelected
            ? "border-blue-400 bg-gradient-to-r from-blue-500/20 to-indigo-600/30 text-white shadow-md shadow-blue-500/20 scale-[1.01]"
            : "border-white/30 hover:border-white/50 glass-effect text-white hover:shadow-md hover:scale-[1.01]"
        }`}
        disabled={isAnswered}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              isAnswered
                ? isSelected
                  ? isCorrect
                    ? "bg-green-200 border-2 border-green-500"
                    : "bg-red-200 border-2 border-red-500"
                  : isCorrectAnswer
                  ? "bg-green-200/70 border-2 border-green-500"
                  : "bg-white/20 border border-white/50"
                : isSelected
                ? "bg-blue-200 border-2 border-blue-500"
                : "bg-white/20 border border-white/50"
            }`}
          >
            {isSelected && (
              <div
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full animate-in fade-in duration-300 ${
                  isAnswered
                    ? isCorrect
                      ? "bg-green-600"
                      : "bg-red-600"
                    : "bg-blue-600"
                }`}
              />
            )}
            {isAnswered && isCorrectAnswer && !isSelected && (
              <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-600 rounded-full animate-in fade-in duration-300" />
            )}
          </div>
          <span
            className={`text-sm ${
              isAnswered
                ? isSelected && !isCorrect
                  ? "text-white"
                  : "text-white"
                : "text-white"
            }`}
          >
            {option}
          </span>
        </div>
      </button>
    )
  );

  // Enhanced feedback component with better contrast
  const AnswerFeedback = memo(({ isCorrect, correctAnswer, explanation }) => (
    <div
      className={`p-4 sm:p-5 rounded-xl mb-6 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
        isCorrect
          ? "bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/50"
          : "bg-gradient-to-r from-red-500/20 to-rose-600/20 border border-red-500/50"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {isCorrect ? (
          <div className="mt-1 w-10 h-10 sm:w-12 sm:h-12 bg-green-100/40 rounded-xl flex items-center justify-center flex-shrink-0 border border-green-500/30">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        ) : (
          <div className="mt-1 w-10 h-10 sm:w-12 sm:h-12 bg-red-100/40 rounded-xl flex items-center justify-center flex-shrink-0 border border-red-500/30">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        )}
        <div className="flex-1">
          <h4
            className={`font-bold text-base sm:text-lg ${
              isCorrect ? "text-green-400" : "text-red-400"
            } mb-2`}
          >
            {isCorrect ? "إجابة صحيحة! أحسنت!" : "إجابة خاطئة"}
          </h4>
          {!isCorrect && (
            <p className="text-white/90 text-xs sm:text-sm mb-3 bg-white/10 p-3 rounded-lg border border-white/20">
              الإجابة الصحيحة هي:{" "}
              <span className="font-bold text-green-300">{correctAnswer}</span>
            </p>
          )}
          {explanation && (
            <div className="glass-effect p-3 rounded-xl mt-2 border border-white/30">
              <div className="flex gap-2 items-center mb-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-bold text-blue-300 text-xs sm:text-sm">
                  شرح الإجابة
                </span>
              </div>
              <p className="text-white/90 text-xs sm:text-sm mr-7">
                {explanation}
              </p>
            </div>
          )}

          {/* Quick tip for wrong answers */}
          {!isCorrect && !explanation && (
            <div className="glass-effect p-3 rounded-xl mt-2 border border-white/30">
              <div className="flex gap-2 items-center mb-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="font-bold text-amber-300 text-xs sm:text-sm">
                  نصيحة
                </span>
              </div>
              <p className="text-white/90 text-xs sm:text-sm mr-7">
                راجع هذا النوع من الأسئلة جيداً، وتدرب على المزيد من الأمثلة
                المشابهة
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  ));

  // Improved progress indicator with question status visualization
  const ProgressIndicator = memo(
    ({ currentQuestion, totalQuestions, answers, onJumpToQuestion }) => {
      // Generate an array of progress items
      const progressItems = [...Array(totalQuestions)].map((_, index) => {
        // Determine the status of each question
        let status = "pending"; // not answered yet
        if (index === currentQuestion) status = "current";
        if (answers[index]?.answered) {
          status = answers[index]?.isCorrect ? "correct" : "incorrect";
        }

        return { index, status };
      });

      return (
        <div className="flex items-center gap-1 flex-wrap">
          {progressItems.map((item) => (
            <button
              key={item.index}
              onClick={() => onJumpToQuestion(item.index)}
              className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition-all duration-300 text-xs ${
                item.status === "current"
                  ? "bg-blue-500/50 border-2 border-blue-400 text-white transform scale-110"
                  : item.status === "correct"
                  ? "bg-green-500/40 border border-green-400 text-green-300 hover:bg-green-500/50"
                  : item.status === "incorrect"
                  ? "bg-red-500/40 border border-red-400 text-red-300 hover:bg-red-500/50"
                  : "bg-white/20 border border-white/40 text-white/80 hover:bg-white/30"
              }`}
              title={`سؤال ${item.index + 1}`}
            >
              {item.index + 1}
            </button>
          ))}
        </div>
      );
    }
  );

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* Mini header - self-contained */}
        <div className="sticky top-0 z-30 w-full bg-gradient-to-r from-slate-900/90 to-indigo-900/90 backdrop-blur-md shadow-md border-b border-white/10">
          <div className="max-w-4xl mx-auto px-3 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={handleExit}
                className="flex items-center gap-2 rounded-lg px-2 py-1 bg-white/10 hover:bg-white/20 transition-colors border border-white/20 text-white text-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>إلغاء التدريب</span>
              </button>
              <div className="text-white font-medium text-sm">
                <span className="hidden sm:inline">وضع التدريب - </span>
                {getPhaseName(phase)}
              </div>
              <div className="flex items-center gap-1">
                <span className="bg-green-600/40 text-white px-1.5 py-0.5 rounded-md border border-green-500/50 flex items-center gap-1 text-xs">
                  {stats.correct}
                </span>
                <span className="bg-red-600/40 text-white px-1.5 py-0.5 rounded-md border border-red-500/50 flex items-center gap-1 text-xs">
                  {stats.incorrect}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Container with appropriate max width */}
        <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 flex flex-col flex-1 pt-2 sm:pt-4 pb-16">
          {/* Training info header - additional info */}
          <div className="glass-card border border-white/30 shadow-lg rounded-xl mb-3">
            <div className="p-3 sm:p-4 bg-gradient-to-r from-indigo-600/20 to-blue-700/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <span className="text-lg sm:text-xl text-white">🏋️‍♂️</span>
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-white">
                    {name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    <div className="bg-white/10 px-2 py-1 rounded text-white/90 text-xs border border-white/20">
                      {subject === "mail" && "البريد"}
                      {subject === "math" && "تربية رياضيات"}
                      {subject === "english" && "تربية انجليزي"}
                      {subject === "science" && "تربية علوم"}
                      {subject === "social" && "تربية دراسات"}
                      {subject === "arabic" && "تربية لغة عربية"}
                    </div>

                    <div className="text-blue-300 text-xs flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>وضع التدريب</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 p-2 sm:p-4 overflow-auto" ref={contentRef}>
            {/* Progress bar */}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            {/* Questions Navigator */}
            <div className="glass-card rounded-xl border border-white/30 mb-3 sm:mb-4 overflow-hidden">
              <div className="py-2 px-3">
                <div className="overflow-x-auto no-scrollbar flex items-center justify-start">
                  <ProgressIndicator
                    currentQuestion={currentQuestionIndex}
                    totalQuestions={questions.length}
                    answers={answers}
                    onJumpToQuestion={handleJumpToQuestion}
                  />
                </div>
              </div>
            </div>

            {/* Include this CSS somewhere in your global styles or in a style tag */}
            <style jsx>{`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>

            {/* Question card */}
            <div
              ref={questionCardRef}
              className={`relative transition-all duration-300 ease-out ${
                isTransitioning
                  ? direction === "next"
                    ? "opacity-0 transform -translate-y-4"
                    : "opacity-0 transform translate-y-4"
                  : "opacity-100 transform translate-y-0"
              }`}
            >
              <div className="glass-card rounded-xl border border-white/30 mb-3 sm:mb-4">
                <div className="p-3 sm:p-4 border-b border-white/20 bg-gradient-to-r from-blue-900/50 to-indigo-900/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/30">
                      <span className="text-base sm:text-lg">❓</span>
                    </div>
                    <h2 className="text-sm sm:text-base font-bold text-white">
                      {currentQuestion?.text}
                    </h2>
                  </div>
                </div>

                <div className="p-3 sm:p-4">
                  {/* Options */}
                  <div className="space-y-0 mb-2">
                    {currentQuestion?.options.map((option, index) => (
                      <QuestionOption
                        key={index}
                        option={option}
                        index={index}
                        isSelected={selectedOption === index}
                        isCorrect={currentQuestion?.correctAnswer === index}
                        isAnswered={isAnswered}
                        isCorrectAnswer={
                          currentQuestion?.correctAnswer === index
                        }
                        onSelect={handleOptionSelect}
                      />
                    ))}
                  </div>

                  {!isAnswered && (
                    <div className="bg-blue-600/20 rounded-xl p-3 sm:p-4 border border-blue-500/40 mt-3 sm:mt-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-400/50">
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-300 mb-1 text-xs sm:text-sm">
                            وضع التدريب
                          </h4>
                          <p className="text-white/90 text-xs">
                            اختر إجابتك وستظهر لك النتيجة فوراً مع توضيح الإجابة
                            الصحيحة
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Feedback after answering */}
                  {isAnswered && (
                    <AnswerFeedback
                      isCorrect={currentAnswer?.isCorrect}
                      correctAnswer={correctAnswerText}
                      explanation={currentQuestion?.explanation}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Fixed footer with navigation buttons */}
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900/95 to-indigo-900/95 backdrop-blur-md border-t border-white/10 shadow-lg z-40">
            <div className="max-w-4xl mx-auto p-3 flex justify-between items-center">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0 || isTransitioning}
                className={`px-3 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs ${
                  currentQuestionIndex === 0 || isTransitioning
                    ? "bg-white/10 text-white/40 cursor-not-allowed"
                    : "bg-white/15 text-white hover:bg-white/25 border border-white/30"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden sm:inline">السؤال السابق</span>
                <span className="sm:hidden">السابق</span>
              </button>

              <div className="text-center">
                <div className="text-white/90 text-xs">
                  {currentQuestionIndex + 1} من {questions.length}
                </div>
              </div>

              {showCompleteButton ? (
                <button
                  onClick={handleComplete}
                  className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-colors shadow-md hover:shadow-lg flex items-center gap-2 text-xs border border-green-500/50"
                >
                  <span className="hidden sm:inline">
                    إنهاء التدريب وعرض النتائج
                  </span>
                  <span className="sm:hidden">إنهاء التدريب</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  disabled={
                    !isAnswered ||
                    isTransitioning ||
                    currentQuestionIndex === questions.length - 1
                  }
                  className={`px-3 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs ${
                    !isAnswered ||
                    isTransitioning ||
                    currentQuestionIndex === questions.length - 1
                      ? "bg-white/10 text-white/40 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg border border-blue-500/50"
                  }`}
                >
                  <span className="hidden sm:inline">السؤال التالي</span>
                  <span className="sm:hidden">التالي</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

// Main component
export default function TrainingQuestionsPage() {
  const [mounted, setMounted] = useState(false);

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 pattern-grid">
      {/* Background Elements - Self-contained in this component */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 pattern-dots opacity-30"></div>
        <div className="absolute top-0 -right-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-3xl floating"></div>
        <div
          className="absolute bottom-0 -left-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-3xl floating"
          style={{ animationDelay: "-4s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-[1200px] h-[1200px] bg-purple-600/5 rounded-full blur-3xl floating"
          style={{
            animationDelay: "-2s",
            transform: "translate(-50%, -50%)",
          }}
        ></div>
      </div>

      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
          </div>
        }
      >
        <QuestionContent />
      </Suspense>
    </div>
  );
}

// Helper function to get phase name
function getPhaseName(phaseId) {
  const phaseNames = {
    behavioral: "الكفايات السلوكية والنفسية",
    language_arabic: "الكفايات اللغوية - اللغة العربية",
    language_english: "الكفايات اللغوية - اللغة الإنجليزية",
    knowledge_iq: "الكفايات المعرفية - اختبار الذكاء",
    knowledge_general: "الكفايات المعرفية - معلومات عامة",
    knowledge_it: "الكفايات المعرفية - تكنولوجيا المعلومات",
    education: "الكفايات التربوية",
    specialization: "كفايات التخصص",
  };
  return phaseNames[phaseId] || phaseId;
}
