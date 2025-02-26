// src/app/exams/results/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { resetExam, initExam } from "../../../../store/examSlice";

const ResultsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const examState = useSelector((state) => state.exam);
  const { activeExam, currentResult, examCompleted } = examState;
  const [loading, setLoading] = useState(true);
  const [animateChart, setAnimateChart] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);
  useEffect(() => {
    if (!loading && currentResult && activeExam) {
      submitExamResults();
    }
  }, [loading, currentResult, activeExam]);
  useEffect(() => {
    // Redirect if no active exam or not completed
    if (!activeExam || !examCompleted) {
      router.push("/");
      return;
    }

    // Simulate loading results
    const timer = setTimeout(() => {
      setLoading(false);

      // Trigger animations after loading
      setTimeout(() => {
        setAnimateScore(true);

        // Trigger chart animation after score animation
        setTimeout(() => {
          setAnimateChart(true);
        }, 800);
      }, 400);
    }, 1500);

    return () => clearTimeout(timer);
  }, [activeExam, examCompleted, router]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";

    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle restart exam
  const handleRestartExam = () => {
    // Generate a new organization code
    const newOrgCode = "A" + Math.random().toString().slice(2, 8);

    // Reset the exam state
    dispatch(resetExam());

    // Initialize a new exam with the same subject and name but new code
    if (activeExam) {
      dispatch(
        initExam({
          subject: activeExam.subject,
          userName: activeExam.userName,
          organizationCode: newOrgCode,
        })
      );

      // Navigate back to phases page with the same subject
      router.push(`/exams/phases?subject=${activeExam.subject}`);
    } else {
      router.push("/");
    }
  };

  if (loading || !currentResult || !activeExam) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-8 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-8 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 text-xl font-bold">
            %
          </div>
        </div>
        <p className="text-gray-600 mt-6 font-medium">
          جاري تحليل النتائج وإعداد التقرير...
        </p>
      </div>
    );
  }

  const { totalScore, phaseScores = {} } = currentResult;

  // Determine result level based on score
  const getResultLevel = (score) => {
    if (score >= 90)
      return {
        text: "ممتاز",
        color: "text-green-600",
        bg: "bg-green-100",
        borderColor: "border-green-300",
        gradient: "from-green-500 to-emerald-600",
      };
    if (score >= 80)
      return {
        text: "جيد جداً",
        color: "text-blue-600",
        bg: "bg-blue-100",
        borderColor: "border-blue-300",
        gradient: "from-blue-500 to-indigo-600",
      };
    if (score >= 70)
      return {
        text: "جيد",
        color: "text-indigo-600",
        bg: "bg-indigo-100",
        borderColor: "border-indigo-300",
        gradient: "from-indigo-500 to-purple-600",
      };
    if (score >= 60)
      return {
        text: "مقبول",
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        borderColor: "border-yellow-300",
        gradient: "from-yellow-500 to-amber-600",
      };
    return {
      text: "ضعيف",
      color: "text-red-600",
      bg: "bg-red-100",
      borderColor: "border-red-300",
      gradient: "from-red-500 to-rose-600",
    };
  };

  const resultLevel = getResultLevel(totalScore);

  // Function to get certificate type based on score
  const getCertificateType = (score) => {
    if (score >= 90) return "شهادة امتياز";
    if (score >= 80) return "شهادة تقدير";
    if (score >= 70) return "شهادة اجتياز";
    if (score >= 60) return "شهادة حضور";
    return "شهادة مشاركة";
  };

  // Organize phases into categories
  const organizePhaseScores = () => {
    const categories = {
      behavioral: {
        title: "الكفايات السلوكية والنفسية",
        scores: [],
        color: "blue",
      },
      language: { title: "الكفايات اللغوية", scores: [], color: "green" },
      knowledge: {
        title: "الكفايات المعرفية والتكنولوجية",
        scores: [],
        color: "purple",
      },
      specialization: { title: "كفايات التخصص", scores: [], color: "amber" },
      education: { title: "الكفايات التربوية", scores: [], color: "rose" },
    };

    // Sort scores into categories
    Object.entries(phaseScores).forEach(([phaseId, score]) => {
      if (phaseId.includes("_")) {
        const [mainPhase, subPhase] = phaseId.split("_");
        if (categories[mainPhase]) {
          categories[mainPhase].scores.push({
            id: phaseId,
            title: getSubPhaseTitle(subPhase),
            score,
          });
        }
      } else {
        if (categories[phaseId]) {
          categories[phaseId].mainScore = score;
        }
      }
    });

    // Filter out empty categories
    return Object.values(categories).filter(
      (category) => category.scores.length > 0 || category.mainScore
    );
  };

  const categories = organizePhaseScores();
  const submitExamResults = async () => {
    if (!activeExam || !currentResult) return;

    try {
      const response = await fetch("/api/submit-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: activeExam.userName,
          subjectName:
            activeExam.subject === "mail" ? "البريد المصري" : "التربية",
          organizationCode: activeExam.organizationCode,
          totalScore: currentResult.totalScore,
          phaseScores: currentResult.phaseScores,
          subject: activeExam.subject,
        }),
      });

      const data = await response.json();

      if (data.status !== "success") {
        console.error("Error submitting results:", data.message);
      }
    } catch (error) {
      console.error("Failed to submit exam results:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Certificate Card */}
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-3xl shadow-xl overflow-hidden border border-gray-200 mb-8">
        <div className="relative py-8 px-8 border-b border-gray-100">
          {/* Certificate Watermark */}
          <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
            <div className="text-gray-900 text-9xl font-bold rotate-10">
              {activeExam.subject === "mail" ? "البريد" : "التربية"}
            </div>
          </div>

          <div className="relative flex justify-between items-center">
            {/* Left Side - Certificate Type */}
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg font-bold">
                {activeExam.subject === "mail" ? "📬" : "📚"}
              </div>
              <div className="mr-4">
                <h3 className={`text-lg ${resultLevel.color} font-bold`}>
                  {getCertificateType(totalScore)}
                </h3>
                <p className="text-gray-500 text-sm">
                  {formatDate(currentResult.completedAt)}
                </p>
              </div>
            </div>

            {/* Right Side - User Info */}
            <div className="text-left">
              <h2 className="text-xl font-bold text-gray-800">
                {activeExam.userName}
              </h2>
              <p className="text-gray-500">
                كود {activeExam.subject === "mail" ? "البريد" : "التربية"}:{" "}
                {activeExam.organizationCode}
              </p>
            </div>
          </div>

          {/* Main Title */}
          <div className="text-center mt-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">
              نتيجة اختبار{" "}
              {activeExam.subject === "mail" ? "البريد المصري" : "التربية"}
            </h1>
          </div>
        </div>

        {/* Score Display */}
        <div className="p-8 text-center">
          <div className="relative inline-flex">
            {/* Score Circle */}
            <div className="relative w-48 h-48">
              {/* Background Circle */}
              <div className="absolute inset-0 rounded-full bg-gray-100"></div>

              {/* Progress Circle - Animated */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  strokeDashoffset={
                    animateScore ? 251.2 - (251.2 * totalScore) / 100 : 251.2
                  }
                  transform="rotate(-90 50 50)"
                  style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }}
                />
                <defs>
                  <linearGradient
                    id="scoreGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      stopColor={`var(--gradient-from, ${
                        resultLevel.gradient.split(" ")[1]
                      })`}
                    />
                    <stop
                      offset="100%"
                      stopColor={`var(--gradient-to, ${
                        resultLevel.gradient.split(" ")[3]
                      })`}
                    />
                  </linearGradient>
                </defs>
              </svg>

              {/* Score Number */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl font-bold text-gray-800">
                  {animateScore ? totalScore : 0}%
                </div>
              </div>
            </div>

            {/* Level Badge */}
            <div
              className={`absolute -top-2 -right-2 px-4 py-1 rounded-full text-sm font-bold ${resultLevel.bg} ${resultLevel.color} border ${resultLevel.borderColor} shadow-sm`}
            >
              {resultLevel.text}
            </div>
          </div>

          {/* Score Description */}
          <div className="mt-6 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              تقييم الأداء
            </h3>
            <p className="text-gray-600">
              لقد أكملت الاختبار بنجاح. يظهر تقييمك مستوى {resultLevel.text} في
              مهارات {activeExam.subject === "mail" ? "البريد" : "التربية"}{" "}
              الأساسية.
            </p>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="px-6 py-6 bg-gradient-to-b from-gray-50 to-white">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
            تفاصيل الأداء حسب المهارات
          </h3>

          <div className="space-y-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <h4
                  className="text-lg font-bold text-gray-800 mb-4 border-right-4 pr-3"
                  style={{
                    borderRightWidth: "4px",
                    borderRightColor: getBarColor(category.color),
                  }}
                >
                  {category.title}
                </h4>

                {/* Main category score if exists */}
                {category.mainScore && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium text-gray-700">
                        {category.title}
                      </div>
                      <div
                        className="text-sm font-bold"
                        style={{ color: getBarColor(category.color) }}
                      >
                        {category.mainScore}%
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: animateChart ? `${category.mainScore}%` : "0%",
                          backgroundColor: getBarColor(category.color),
                          transition: "width 1s ease-out",
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Sub-category scores */}
                <div className="space-y-3">
                  {category.scores.map((score, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm font-medium text-gray-700">
                          {score.title}
                        </div>
                        <div
                          className="text-sm font-bold"
                          style={{ color: getBarColor(category.color) }}
                        >
                          {score.score}%
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: animateChart ? `${score.score}%` : "0%",
                            backgroundColor: getBarColor(category.color),
                            transition: `width 1s ease-out ${0.2 + idx * 0.1}s`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="p-6 flex flex-col sm:flex-row justify-center gap-4 border-t border-gray-200">
          <button
            onClick={handleRestartExam}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-teal-700 transition-all duration-300 shadow-md shadow-green-200 flex items-center justify-center gap-2"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>اختبار جديد</span>
          </button>

          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md shadow-blue-200 flex items-center justify-center gap-2"
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>العودة للرئيسية</span>
          </button>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          توصيات وملاحظات
        </h3>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-800">نقاط القوة</h4>
              <p className="text-gray-600 text-sm">
                أظهرت أداءً ممتازًا في {getTopCategory()} مما يدل على تمكنك من
                المفاهيم الأساسية في هذا المجال.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-800">فرص التحسين</h4>
              <p className="text-gray-600 text-sm">
                يمكنك التركيز على تطوير مهاراتك في {getLowestCategory()} لتحسين
                أدائك العام في الاختبارات القادمة.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-800">الخطوات التالية</h4>
              <p className="text-gray-600 text-sm">
                ننصحك بمراجعة المواد التعليمية المتعلقة بالمجالات التي حصلت فيها
                على درجات أقل، والتدرب على المزيد من الاختبارات التجريبية.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get top scoring category
function getTopCategory() {
  // This would normally be calculated from actual scores
  // For demo purposes, returning random categories
  const categories = [
    "الكفايات اللغوية",
    "الكفايات المعرفية",
    "كفايات التخصص",
    "الكفايات السلوكية",
  ];
  return categories[Math.floor(Math.random() * categories.length)];
}

// Helper function to get lowest scoring category
function getLowestCategory() {
  // This would normally be calculated from actual scores
  // For demo purposes, returning random categories
  const categories = [
    "مهارات التكنولوجيا",
    "المعلومات العامة",
    "اللغة الإنجليزية",
    "التفكير التحليلي",
  ];
  return categories[Math.floor(Math.random() * categories.length)];
}

// Helper function to get phase title
const getPhaseTitle = (phaseId) => {
  const phaseTitles = {
    behavioral: "الكفايات السلوكية والنفسية",
    language: "الكفايات اللغوية",
    knowledge: "الكفايات المعرفية والتكنولوجية",
    specialization: "كفايات التخصص",
    education: "الكفايات التربوية",
  };

  return phaseTitles[phaseId] || phaseId;
};

// Helper function to get subphase title
const getSubPhaseTitle = (subPhaseId) => {
  const subPhaseTitles = {
    arabic: "اللغة العربية",
    english: "اللغة الإنجليزية",
    iq: "اختبار الذكاء",
    general: "معلومات عامة",
    it: "تكنولوجيا المعلومات",
  };

  return subPhaseTitles[subPhaseId] || subPhaseId;
};

// Helper function to get bar color
const getBarColor = (color) => {
  const colorMap = {
    blue: "#2563eb",
    green: "#16a34a",
    purple: "#9333ea",
    amber: "#d97706",
    rose: "#e11d48",
    cyan: "#0891b2",
    teal: "#0d9488",
  };

  return colorMap[color] || "#2563eb";
};

export default ResultsPage;
