// src/app/exams/questions/page.js
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  startPhase,
  saveAnswers,
  completePhase,
  setCurrentQuestion,
  setQuestions,
  startBreak,
} from "../../../../store/examSlice";
import { getRandomQuestions } from "../../data/questionsUtils";

// Phase durations in minutes
const mailPhases = {
  behavioral: 10,
  language_arabic: 10,
  language_english: 10,
  knowledge_iq: 5,
  knowledge_general: 5,
  knowledge_it: 5,
  specialization: 15,
};

const educationPhases = {
  ...mailPhases,
  education: 15,
};

const QuizPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phase = searchParams.get("phase");
  const dispatch = useDispatch();

  // Get exam state from Redux
  const examState = useSelector((state) => state.exam);
  const phaseState = phase ? examState.phases[phase] : null;
  const activeExam = examState.activeExam;

  // Refs for safe timer management
  const timerRef = useRef(null);
  const navigatingRef = useRef(false);

  const [currentQuestion, setCurrentQuestionState] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questions, setQuestionsState] = useState([]);
  const [remainingTime, setRemainingTime] = useState(600); // Default 10 min
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTimeRunningLow, setIsTimeRunningLow] = useState(false);

  // Parse phase and subphase if present
  const [mainPhase, subPhase] = phase ? phase.split("_") : [phase, null];

  // Function to get phase duration from the phase data
  const getPhaseDuration = useCallback(
    (phaseId) => {
      const phasesData =
        activeExam?.subject === "mail" ? mailPhases : educationPhases;

      // Return duration in seconds (multiply minutes by 60)
      return (phasesData[phaseId] || 10) * 60; // Default to 10 minutes if not found
    },
    [activeExam]
  );

  // Redirect if no active exam
  useEffect(() => {
    if (!activeExam) {
      router.push("/");
    }
  }, [activeExam, router]);

  // The shared submit function used by both the button and timer
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

    // Use setTimeout to ensure state updates complete before navigation
    setTimeout(() => {
      router.replace("/exams/phases");
    }, 50);
  }, [dispatch, phase, router]);

  const getPhaseQuestions = useCallback(
    (phaseId) => {
      try {
        // Use the improved getRandomQuestions from questionsUtils
        const questionsFromUtils = getRandomQuestions(
          activeExam?.subject || "mail",
          phaseId,
          10 // Number of questions to get
        );

        return questionsFromUtils;
      } catch (error) {
        console.error("Error in getPhaseQuestions:", error);
        // Provide fallback questions
        return [
          {
            id: "q1",
            text: "سؤال اختبار رقم 1",
            options: [
              "الخيار الأول",
              "الخيار الثاني",
              "الخيار الثالث",
              "الخيار الرابع",
            ],
            correctAnswer: 0,
          },
          {
            id: "q2",
            text: "سؤال اختبار رقم 2",
            options: [
              "الخيار الأول",
              "الخيار الثاني",
              "الخيار الثالث",
              "الخيار الرابع",
            ],
            correctAnswer: 1,
          },
          {
            id: "q3",
            text: "سؤال اختبار رقم 3",
            options: [
              "الخيار الأول",
              "الخيار الثاني",
              "الخيار الثالث",
              "الخيار الرابع",
            ],
            correctAnswer: 2,
          },
        ];
      }
    },
    [activeExam]
  );

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
      // Calculate the duration for this phase
      const phaseDuration = getPhaseDuration(phase);

      // Start a new phase if not already started
      dispatch(
        startPhase({
          phaseId: mainPhase,
          subPhase: subPhase,
          duration: phaseDuration, // Use the specific phase duration
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
    getPhaseDuration,
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

  const handleAnswerSelect = (answerId) => {
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
  };

  const handleNext = () => {
    if (navigatingRef.current) return;

    if (currentQuestion < questions.length - 1) {
      const nextIndex = currentQuestion + 1;
      setCurrentQuestionState(nextIndex);

      // Update current question in Redux
      dispatch(
        setCurrentQuestion({
          phaseId: phase,
          index: nextIndex,
        })
      );
    } else {
      handleSubmit();
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

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

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-2 mt-0">
      {/* Timer and Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-2 ${
                isTimeRunningLow ? "bg-red-100" : "bg-amber-100"
              } px-2 rounded-lg`}
            >
              <svg
                className={`w-5 h-5 ${
                  isTimeRunningLow ? "text-red-600" : "text-amber-600"
                } ${remainingTime < 10 ? "animate-pulse" : ""}`}
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
                } py-1 rounded-lg`}
              >
                {formatTime(remainingTime)}
              </span>
            </div>
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

          {/* Clean Progress Bar - No Animation */}
          <div className="mt-4">
            <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div
                className="absolute top-0 right-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Card */}
      {questions[currentQuestion] && (
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="p-6">
            {/* Question Text */}
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              {questions[currentQuestion].text}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 rounded-lg border text-right transition-all duration-200 ${
                    selectedAnswers[questions[currentQuestion].id] === index
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                  disabled={navigatingRef.current}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedAnswers[questions[currentQuestion].id] === index
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedAnswers[questions[currentQuestion].id] ===
                        index && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      )}
                    </div>
                    <span className="text-sm">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Button - Centered, Bigger, and Only Active When Question is Answered */}
      <div className="flex justify-center">
        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={!isCurrentQuestionAnswered || navigatingRef.current}
            className={`px-8 py-3 text-white rounded-lg text-base font-medium transition-all duration-300 ${
              isCurrentQuestionAnswered && !navigatingRef.current
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {navigatingRef.current ? "جاري الإنتهاء..." : "إنهاء"}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isCurrentQuestionAnswered || navigatingRef.current}
            className={`px-8 py-3 text-white rounded-lg text-base font-medium transition-all duration-300 ${
              isCurrentQuestionAnswered && !navigatingRef.current
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            التالي
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
