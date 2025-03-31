// src/app/exams/questions/page.js - Enhanced with animations
"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  memo,
  useMemo,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  saveAnswers,
  completePhase,
  setCurrentQuestion,
  setQuestions,
  startBreak,
} from "../../../../store/examSlice";
import { getRandomQuestions } from "../../data/questionsUtils";
import ExitConfirmationDialog from "../../../../components/ExitConfirmationDialog";

// Memoized timer component with improved animation
const ExamTimer = memo(({ remainingTime, isTimeRunningLow }) => (
  <div
    className={`flex items-center gap-2 ${
      isTimeRunningLow ? "bg-red-100" : "bg-amber-100"
    } px-2 rounded-lg transition-colors duration-500`}
  >
    <svg
      className={`w-5 h-5 ${
        isTimeRunningLow ? "text-red-600" : "text-amber-600"
      } ${
        remainingTime < 10 ? "animate-pulse" : ""
      } transition-colors duration-500`}
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
    <span
      className={`text-lg font-bold ${
        isTimeRunningLow ? "text-red-600" : "text-amber-600"
      } py-1 rounded-lg transition-colors duration-500`}
    >
      {formatTime(remainingTime)}
    </span>
  </div>
));

// Memoized question option component with enhanced animation
const QuestionOption = memo(
  ({ option, index, isSelected, onSelect, disabled }) => (
    <button
      onClick={() => onSelect(index)}
      className={`w-full p-4 rounded-lg border text-right transition-all duration-300 transform ${
        isSelected
          ? "border-blue-500 bg-blue-50 text-blue-700 scale-[1.01] shadow-md"
          : "border-gray-200 hover:border-gray-300 hover:shadow-sm text-gray-700"
      } ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
      disabled={disabled}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            isSelected ? "border-blue-500" : "border-gray-300"
          }`}
        >
          {isSelected && (
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-in fade-in duration-300" />
          )}
        </div>
        <span className="text-sm">{option}</span>
      </div>
    </button>
  )
);

// Helper function for formatting time
const formatTime = (seconds) => {
  if (seconds === undefined || seconds === null) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

// Main component
const QuizPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phase = searchParams.get("phase");

  // Add mounted state to prevent Redux access before hydration
  const [mounted, setMounted] = useState(false);

  // First mount effect - without Redux
  useEffect(() => {
    // Check for reload - without needing Redux
    const wasReloaded = localStorage.getItem("_wasReloaded");
    if (wasReloaded === "true") {
      // Clear the flag
      localStorage.removeItem("_wasReloaded");
      // Redirect immediately to landing page
      router.replace("/");
      return;
    }

    // Set mounted state to true
    setMounted(true);
  }, [router]);

  // Render placeholder while waiting for client-side hydration
  if (!mounted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-center min-h-[60vh] mt-0">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  // This is a component that only runs after the page is mounted
  // and Redux is available
  return <MountedQuizContent phase={phase} />;
};

// Component that renders after mounting - allows safe Redux access
function MountedQuizContent({ phase }) {
  const router = useRouter();
  const dispatch = useDispatch();

  // Get exam state from Redux
  const examState = useSelector((state) => state.exam);
  const phaseState = phase ? examState.phases[phase] : null;
  const activeExam = examState.activeExam;

  // Refs for safe timer management
  const timerRef = useRef(null);
  const navigatingRef = useRef(false);

  // Refs for animated elements
  const questionCardRef = useRef(null);

  const [currentQuestion, setCurrentQuestionState] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questions, setQuestionsState] = useState([]);
  const [remainingTime, setRemainingTime] = useState(600); // Default 10 min
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTimeRunningLow, setIsTimeRunningLow] = useState(false);

  // Animation states
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState("next");

  // Navigation confirmation dialog
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [exitDestination, setExitDestination] = useState("");
  const [exitMessage, setExitMessage] = useState("");

  // Parse phase and subphase if present
  const [mainPhase, subPhase] = useMemo(
    () => (phase ? phase.split("_") : [phase, null]),
    [phase]
  );

  // Handle exit confirmation - memoized
  const handleExit = useCallback(
    (destination = "/", message) => {
      if (navigatingRef.current) return;

      // If exam is in progress, show confirmation dialog
      if (phase && phaseState && !phaseState.completed) {
        setExitDestination(destination);
        setExitMessage(
          message ||
            "سيتم فقدان تقدمك في هذه المرحلة من الاختبار ولا يمكن استعادته."
        );
        setShowExitDialog(true);
        return;
      }

      // Otherwise, navigate directly
      router.push(destination);
    },
    [phase, phaseState, router]
  );

  // Confirm exit - memoized
  const confirmExit = useCallback(() => {
    setShowExitDialog(false);
    navigatingRef.current = true;

    // Clear any running timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Navigate to the intended destination
    router.push(exitDestination || "/");
  }, [exitDestination, router]);

  // Cancel exit - memoized
  const cancelExit = useCallback(() => {
    setShowExitDialog(false);
  }, []);

  // Redirect if no active exam
  useEffect(() => {
    if (!activeExam) {
      router.push("/");
    }
  }, [activeExam, router]);

  // Handle browser navigation events
  useEffect(() => {
    // Handle popstate (back button, etc.)
    const handlePopState = (e) => {
      if (phase && phaseState && !phaseState.completed) {
        // Prevent default navigation
        e.preventDefault();
        window.history.pushState(null, "", window.location.href);

        // Show confirmation dialog
        handleExit(
          "/",
          "سيتم فقدان تقدمك في الاختبار إذا عدت للخلف. هل أنت متأكد؟"
        );
        return;
      }
    };

    // Handle beforeunload (page refresh, close tab)
    const handleBeforeUnload = (e) => {
      if (phase && phaseState && !phaseState.completed) {
        // Standard browser confirmation for reload/close
        const message = "هل أنت متأكد من الخروج؟ سيتم فقدان تقدمك في الاختبار.";
        e.preventDefault();
        e.returnValue = message;

        // Set flag to detect reload - crucial for redirect after reload
        localStorage.setItem("_wasReloaded", "true");

        return message;
      }
    };

    // Prevent navigation through history manipulation
    if (phase && phaseState && !phaseState.completed) {
      window.history.pushState(null, "", window.location.href);
    }

    // Add event listeners
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [phase, phaseState, handleExit]);

  // Function to get phase questions - memoized
  const getPhaseQuestions = useCallback(
    (phaseId) => {
      try {
        // Determine appropriate number of questions based on the phase
        let questionsCount = 20; // Default

        if (phaseId === "behavioral") {
          questionsCount = 4;
        } else if (
          phaseId === "language_arabic" ||
          phaseId === "language_english"
        ) {
          questionsCount = 1;
        } else if (phaseId.startsWith("knowledge_")) {
          questionsCount = 1;
        } else if (phaseId === "specialization" || phaseId === "education") {
          questionsCount = 1;
        }

        // Get the subject
        const currentSubject = activeExam?.subject || "mail";

        // Use the improved getRandomQuestions from questionsUtils
        const questionsFromUtils = getRandomQuestions(
          currentSubject,
          phaseId,
          questionsCount
        );

        return questionsFromUtils;
      } catch (error) {
        console.error("Error in getPhaseQuestions:", error);
        return []; // Return empty array on error
      }
    },
    [activeExam]
  );

  // The shared submit function used by both the button and timer - memoized
  const handleSubmit = useCallback(() => {
    // Prevent multiple submissions/navigations
    if (navigatingRef.current) return;
    navigatingRef.current = true;

    // Clear any running timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Complete the current phase
    dispatch(
      completePhase({
        phaseId: phase,
      })
    );

    // Start the break time
    dispatch(
      startBreak({
        duration: 120, // 2 minutes
      })
    );

    // Apply exit animation
    setDirection("next");
    setIsTransitioning(true);

    // Use setTimeout to ensure state updates complete before navigation
    setTimeout(() => {
      router.replace("/exams/phases");
    }, 300); // Wait for animation to complete
  }, [dispatch, phase, router]);

  // Initialize exam phase
  useEffect(() => {
    if (!phase || !activeExam) return;

    // Reset navigation flag when phase changes
    navigatingRef.current = false;

    // Get questions for the current phase
    const fetchQuestions = () => {
      try {
        setLoading(true);

        // Check if questions are already in Redux store
        if (examState.examData[phase]?.questions?.length > 0) {
          setQuestionsState(examState.examData[phase].questions);
        } else {
          // If not, get new questions
          const phaseQuestions = getPhaseQuestions(phase);

          if (!phaseQuestions || !phaseQuestions.length) {
            setError("لا توجد أسئلة متاحة لهذه المرحلة");
            setQuestionsState([]);
          } else {
            setQuestionsState(phaseQuestions);

            // Save questions to Redux
            dispatch(
              setQuestions({
                phaseId: phase,
                questions: phaseQuestions,
              })
            );
          }
        }
      } catch (error) {
        console.error("Error in fetchQuestions:", error);
        setError("حدث خطأ في تحميل الأسئلة");
      } finally {
        setLoading(false);
      }
    };

    // Initialize or resume phase state
    if (!phaseState) {
      // Determine phase duration based on phase type
      let phaseDuration = 600; // Default to 10 minutes (in seconds)

      // Adjust duration based on phase
      if (phase === "behavioral") {
        phaseDuration = 25 * 60; // 25 minutes
      } else if (phase.startsWith("language_")) {
        phaseDuration = 10 * 60; // 10 minutes
      } else if (phase.startsWith("knowledge_")) {
        phaseDuration = 5 * 60; // 5 minutes
      } else if (phase === "specialization" || phase === "education") {
        phaseDuration = 15 * 60; // 15 minutes
      }

      // Start a new phase if not already started
      dispatch(
        startPhase({
          phaseId: mainPhase,
          subPhase: subPhase,
          duration: phaseDuration,
        })
      );
      fetchQuestions();
    } else {
      // Resume from existing state
      if (phaseState.answers) {
        setSelectedAnswers(phaseState.answers);
      }

      if (phaseState.currentQuestion !== undefined) {
        setCurrentQuestionState(phaseState.currentQuestion);
      }

      // Calculate remaining time
      if (phaseState.startTime && phaseState.duration) {
        const elapsedTime = Math.floor(
          (Date.now() - phaseState.startTime) / 1000
        );
        const timeLeft = Math.max(0, phaseState.duration - elapsedTime);
        setRemainingTime(timeLeft);
        setIsTimeRunningLow(timeLeft < 60);
      }

      fetchQuestions();
    }

    // Clean up any timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    phase,
    dispatch,
    examState.examData,
    phaseState,
    mainPhase,
    subPhase,
    getPhaseQuestions,
    activeExam,
  ]);

  // Timer effect - improved version with ref to prevent memory leaks
  useEffect(() => {
    if (loading || navigatingRef.current || remainingTime <= 0) return;

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Start a new timer
    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 1;

        // Update time running low status
        if (newTime < 60 && !isTimeRunningLow) {
          setIsTimeRunningLow(true);
        }

        // Handle timer completion
        if (newTime <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }

          // Only call handleSubmit if we're not already navigating
          if (!navigatingRef.current) {
            handleSubmit();
          }
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [remainingTime, loading, handleSubmit, isTimeRunningLow]);

  // Handle time expiration on initial load
  useEffect(() => {
    // If time is already expired after loading
    if (!loading && remainingTime <= 0 && !navigatingRef.current) {
      handleSubmit();
    }
  }, [loading, remainingTime, handleSubmit]);

  // Handle answer selection - memoized
  const handleAnswerSelect = useCallback(
    (answerId) => {
      if (!questions[currentQuestion] || navigatingRef.current) return;

      const questionId = questions[currentQuestion].id;
      const newAnswers = {
        ...selectedAnswers,
        [questionId]: answerId,
      };

      setSelectedAnswers(newAnswers);

      // Save to Redux store
      dispatch(
        saveAnswers({
          phaseId: phase,
          questionId,
          answerId,
        })
      );
    },
    [
      questions,
      currentQuestion,
      selectedAnswers,
      dispatch,
      phase,
      navigatingRef,
    ]
  );

  // Handle next question - memoized and enhanced with animation
  const handleNext = useCallback(() => {
    if (navigatingRef.current || isTransitioning) return;

    if (currentQuestion < questions.length - 1) {
      // Start transition animation
      setDirection("next");
      setIsTransitioning(true);

      // Wait for animation to complete before changing the question
      setTimeout(() => {
        const nextIndex = currentQuestion + 1;
        setCurrentQuestionState(nextIndex);

        // Update current question in Redux
        dispatch(
          setCurrentQuestion({
            phaseId: phase,
            index: nextIndex,
          })
        );

        // End transition after question has changed
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 250);
    } else {
      handleSubmit();
    }
  }, [
    currentQuestion,
    questions.length,
    dispatch,
    phase,
    handleSubmit,
    isTransitioning,
  ]);

  // Display a loading state while fetching questions
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-center min-h-[60vh] mt-0">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If there was an error
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-2 flex flex-col items-center justify-center min-h-[60vh] mt-0">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => router.push("/exams/phases")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          العودة إلى المراحل
        </button>
      </div>
    );
  }

  // If no questions were loaded after loading completes, show an error
  if (!questions.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-2 flex flex-col items-center justify-center min-h-[60vh] mt-0">
        <div className="text-red-500 mb-4">
          لا توجد أسئلة متاحة لهذه المرحلة
        </div>
        <button
          onClick={() => router.push("/exams/phases")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          العودة إلى المراحل
        </button>
      </div>
    );
  }

  // Check if current question has been answered
  const isCurrentQuestionAnswered =
    questions[currentQuestion] &&
    selectedAnswers[questions[currentQuestion].id] !== undefined;

  // Calculate progress percentage
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-2 mt-0">
      {/* Exit Confirmation Dialog */}
      <ExitConfirmationDialog
        isOpen={showExitDialog}
        onCancel={cancelExit}
        onConfirm={confirmExit}
        message={exitMessage}
      />

      {/* Timer and Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <ExamTimer
              remainingTime={remainingTime}
              isTimeRunningLow={isTimeRunningLow}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm bg-gray-200 text-gray-600 px-3 py-1 rounded-lg">
                سؤال {currentQuestion + 1} من {questions.length}
              </span>
            </div>
          </div>

          {/* Phase Info */}
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <div>
              {mainPhase === "behavioral" && "الكفايات السلوكية والنفسية"}
              {mainPhase === "language" && "الكفايات اللغوية"}
              {mainPhase === "knowledge" && "الكفايات المعرفية والتكنولوجية"}
              {mainPhase === "specialization" && "كفايات التخصص"}
              {mainPhase === "education" && "الكفايات التربوية"}

              {subPhase &&
                ` - ${
                  subPhase === "arabic"
                    ? "اللغة العربية"
                    : subPhase === "english"
                    ? "اللغة الإنجليزية"
                    : subPhase === "iq"
                    ? "اختبار الذكاء"
                    : subPhase === "general"
                    ? "معلومات عامة"
                    : subPhase === "it"
                    ? "تكنولوجيا المعلومات"
                    : subPhase
                }`}
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="mt-4">
            <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div
                className="absolute top-0 right-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Question Card */}
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
        {questions[currentQuestion] && (
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="p-6">
              {/* Question Text */}
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                {questions[currentQuestion].text}
              </h2>

              {/* Options with Staggered Animation */}
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <div
                    key={index}
                    className="transition-all duration-300 ease-out"
                    style={{
                      transform: isTransitioning
                        ? `translateY(${index * 5}px)`
                        : "translateY(0)",
                      opacity: isTransitioning ? 0 : 1,
                      transitionDelay: `${index * 50}ms`,
                    }}
                  >
                    <QuestionOption
                      option={option}
                      index={index}
                      isSelected={
                        selectedAnswers[questions[currentQuestion].id] === index
                      }
                      onSelect={handleAnswerSelect}
                      disabled={navigatingRef.current || isTransitioning}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Button - With Animation */}
      <div className="flex justify-center">
        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={
              !isCurrentQuestionAnswered ||
              navigatingRef.current ||
              isTransitioning
            }
            className={`px-8 py-3 text-white rounded-lg text-base font-medium transition-all duration-300 ${
              isCurrentQuestionAnswered &&
              !navigatingRef.current &&
              !isTransitioning
                ? "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg hover:scale-105"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {navigatingRef.current ? "جاري الإنتهاء..." : "إنهاء"}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={
              !isCurrentQuestionAnswered ||
              navigatingRef.current ||
              isTransitioning
            }
            className={`px-8 py-3 text-white rounded-lg text-base font-medium transition-all duration-300 ${
              isCurrentQuestionAnswered &&
              !navigatingRef.current &&
              !isTransitioning
                ? "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg hover:scale-105"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            التالي
          </button>
        )}
      </div>
    </div>
  );
}

export default QuizPage;
