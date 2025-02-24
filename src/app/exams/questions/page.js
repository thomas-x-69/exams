"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTimer } from "react-timer-hook";

// Mock questions bank - replace with your actual data
const questionsBank = {
  behavioral: [
    {
      id: 1,
      text: "عند مواجهة موقف صعب في العمل، ما هو أول إجراء تتخذه؟",
      type: "multiple",
      options: [
        "التواصل مع المشرف المباشر",
        "محاولة حل المشكلة بشكل مستقل",
        "طلب المساعدة من الزملاء",
        "تجنب الموقف وتأجيله",
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      text: "عند مواجهة موقف صعب في العمل، ما هو أول إجراء تتخذه؟",
      type: "multiple",
      options: [
        "التواصل مع المشرف المباشر",
        "محاولة حل المشكلة بشكل مستقل",
        "طلب المساعدة من الزملاء",
        "تجنب الموقف وتأجيله",
      ],
      correctAnswer: 1,
    },
    // Add more behavioral questions
  ],
  language: {
    arabic: [
      {
        id: 1,
        text: "اختر الجملة الصحيحة نحوياً:",
        type: "multiple",
        options: [
          "ذهب الطلاب إلى المدرسةِ",
          "ذهب الطلاب إلى المدرسةُ",
          "ذهب الطلاب إلى المدرسةَ",
          "ذهب الطلاب إلى المدرسة",
        ],
        correctAnswer: 0,
      },
      // Add more Arabic questions
    ],
    english: [
      {
        id: 1,
        text: "Choose the correct sentence:",
        type: "multiple",
        options: [
          "I have been working here since three years",
          "I have been working here for three years",
          "I am working here since three years",
          "I am working here for three years",
        ],
        correctAnswer: 1,
      },
      // Add more English questions
    ],
  },
  knowledge: {
    iq: [
      {
        id: 1,
        text: "أكمل النمط: 2, 4, 8, 16, ...",
        type: "multiple",
        options: ["24", "32", "30", "28"],
        correctAnswer: 1,
      },
      // Add more IQ questions
    ],
    general: [
      {
        id: 1,
        text: "ما هي عاصمة جمهورية مصر العربية؟",
        type: "multiple",
        options: ["القاهرة", "الإسكندرية", "الجيزة", "الأقصر"],
        correctAnswer: 0,
      },
      // Add more general knowledge questions
    ],
    it: [
      {
        id: 1,
        text: "أي من التالي ليس متصفح إنترنت؟",
        type: "multiple",
        options: ["Chrome", "Firefox", "Excel", "Safari"],
        correctAnswer: 2,
      },
      // Add more IT questions
    ],
  },
  specialization: [
    {
      id: 1,
      text: "ما هو البروتوكول المستخدم في نقل البريد الإلكتروني؟",
      type: "multiple",
      options: ["HTTP", "SMTP", "FTP", "TCP"],
      correctAnswer: 1,
    },
    // Add more specialization questions
  ],
  education: [
    {
      id: 1,
      text: "أي من الأساليب التالية يعتبر من أساليب التعلم النشط؟",
      type: "multiple",
      options: [
        "المحاضرة التقليدية",
        "التعلم التعاوني",
        "الحفظ والتلقين",
        "الامتحانات فقط",
      ],
      correctAnswer: 1,
    },
    // Add more education questions
  ],
};

const QuizPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phase = searchParams.get("phase");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questions, setQuestions] = useState([]);

  // Timer setup - 10 minutes (600 seconds)
  const time = new Date();
  time.setSeconds(time.getSeconds() + 200);

  const { seconds, minutes, isRunning, pause } = useTimer({
    expiryTimestamp: time,
    onExpire: () => handleTimeUp(),
  });

  useEffect(() => {
    // Get questions based on the current phase
    const phaseQuestions = getPhaseQuestions(phase);
    setQuestions(phaseQuestions);

    // Initialize empty answers object instead of loading saved answers
    // This ensures questions are not answered initially
    setSelectedAnswers({});
  }, [phase]);

  const getPhaseQuestions = (phaseId) => {
    // Logic to get questions based on phase ID
    // This would need to be adapted based on your actual data structure
    switch (phaseId) {
      case "behavioral":
        return questionsBank.behavioral;
      case "language_arabic":
        return questionsBank.language.arabic;
      case "language_english":
        return questionsBank.language.english;
      case "knowledge_iq":
        return questionsBank.knowledge.iq;
      case "knowledge_general":
        return questionsBank.knowledge.general;
      case "knowledge_it":
        return questionsBank.knowledge.it;
      case "specialization":
        return questionsBank.specialization;
      case "education":
        return questionsBank.education;
      default:
        return [];
    }
  };

  const handleAnswerSelect = (answerId) => {
    const newAnswers = {
      ...selectedAnswers,
      [currentQuestion]: answerId,
    };
    setSelectedAnswers(newAnswers);
    localStorage.setItem(`answers_${phase}`, JSON.stringify(newAnswers));
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  const handleSubmit = () => {
    // Save answers and progress
    const completedPhases = JSON.parse(
      localStorage.getItem("completedPhases") || "[]"
    );
    completedPhases.push(phase);
    localStorage.setItem("completedPhases", JSON.stringify(completedPhases));

    // Navigate back to phases page
    router.push("/exams/phases");
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const getTimerColor = () => {
    if (minutes < 1) return "red";
    return "amber"; // Always amber unless less than 1 minute
  };

  // Check if current question has been answered
  const isCurrentQuestionAnswered =
    selectedAnswers[currentQuestion] !== undefined;

  if (!questions.length) return null;

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Timer and Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-2 bg-${getTimerColor()}-100 px-2 rounded-lg`}
            >
              <svg
                className={`w-5 h-5 text-${getTimerColor()}-600`}
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
                className={`text-lg font-bold text-${getTimerColor()}-600 text-[1rem] bg-${getTimerColor()}  py-1 rounded-lg`}
              >
                {minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-gray-200 text-gray-600 px-3 py-1 rounded-lg">
                سؤال {currentQuestion + 1} من {questions.length}
              </span>
            </div>
          </div>

          {/* Clean Progress Bar - No Animation */}
          <div className="mt-4">
            <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div
                className="absolute top-0 right-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Card */}
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
                  selectedAnswers[currentQuestion] === index
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedAnswers[currentQuestion] === index
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedAnswers[currentQuestion] === index && (
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

      {/* Navigation Button - Centered, Bigger, and Only Active When Question is Answered */}
      <div className="flex justify-center">
        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={!isCurrentQuestionAnswered}
            className={`px-8 py-3 text-white rounded-lg text-base font-medium transition-all duration-300 ${
              isCurrentQuestionAnswered
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            إنهاء
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isCurrentQuestionAnswered}
            className={`px-8 py-3 text-white rounded-lg text-base font-medium transition-all duration-300 ${
              isCurrentQuestionAnswered
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
