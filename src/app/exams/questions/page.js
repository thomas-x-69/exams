// src/app/exams/questions/page.js
"use client";

import React, { useState, useEffect, useCallback } from "react";
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

const QuizPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phase = searchParams.get("phase");
  const dispatch = useDispatch();

  // Get exam state from Redux
  const examState = useSelector((state) => state.exam);
  const phaseState = phase ? examState.phases[phase] : null;
  const activeExam = examState.activeExam;

  const [currentQuestion, setCurrentQuestionState] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questions, setQuestionsState] = useState([]);
  const [remainingTime, setRemainingTime] = useState(600); // Default 10 min
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Parse phase and subphase if present
  const [mainPhase, subPhase] = phase ? phase.split("_") : [phase, null];

  // Redirect if no active exam
  useEffect(() => {
    if (!activeExam) {
      router.push("/");
    }
  }, [activeExam, router]);

  // The shared submit function used by both the button and timer
  const handleSubmit = useCallback(() => {
    if (isNavigating) return;

    setIsNavigating(true);

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

    // Navigate back to phases page - SAME for button and timer
    router.push("/exams/phases");
  }, [dispatch, phase, router, isNavigating]);

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
    setIsNavigating(false);

    // Get questions for the current phase
    const fetchQuestions = () => {
      try {
        setLoading(true);

        // Check if questions are already in Redux store
        if (examState.examData[phase]?.questions?.length > 0) {
          setQuestionsState(examState.examData[phase].questions);
        } else {
          // If not, get new questions
          console.log("Fetching questions for phase:", phase);
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
      // Start a new phase if not already started
      dispatch(
        startPhase({
          phaseId: mainPhase,
          subPhase: subPhase,
          duration: 600, // 10 minutes
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
      }

      fetchQuestions();
    }
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

  // Timer effect
  useEffect(() => {
    if (loading || isNavigating) return;

    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            clearInterval(timer);
            // When timer hits zero, use the exact same code as the button
            setTimeout(() => {
              handleSubmit();
            }, 0);
            return 0;
          }
          return newValue;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else if (remainingTime <= 0 && !isNavigating) {
      // Check if time is already up after loading
      handleSubmit();
    }
  }, [remainingTime, loading, handleSubmit, isNavigating]);

  const handleAnswerSelect = (answerId) => {
    if (!questions[currentQuestion]) return;

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

  // Determine if time is running low (less than 1 minute)
  const isTimeRunningLow = remainingTime < 60;

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
                  disabled={isNavigating}
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
            disabled={!isCurrentQuestionAnswered || isNavigating}
            className={`px-8 py-3 text-white rounded-lg text-base font-medium transition-all duration-300 ${
              isCurrentQuestionAnswered && !isNavigating
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isNavigating ? "جاري الإنتهاء..." : "إنهاء"}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isCurrentQuestionAnswered || isNavigating}
            className={`px-8 py-3 text-white rounded-lg text-base font-medium transition-all duration-300 ${
              isCurrentQuestionAnswered && !isNavigating
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
