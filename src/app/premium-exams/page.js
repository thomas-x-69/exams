// src/app/premium-exams/page.js
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import PremiumGuard from "../../../components/PremiumGuard";
import WelcomePremiumModal from "../../../components/WelcomePremiumModal";
import { useClientAuth } from "../../../context/ClientAuthContext";

// Realistic exam mock data
const realExamData = [
  {
    id: "re-mail-2023-1",
    title: "امتحان البريد المصري - 2023 (الدفعة الأولى)",
    category: "mail",
    date: "أكتوبر 2023",
    questions: 165,
    time: 60,
    difficulty: "متوسط",
    takers: 342,
    passRate: 68,
    badge: "حديث",
  },
  {
    id: "re-mail-2023-2",
    title: "امتحان البريد المصري - 2023 (الدفعة الثانية)",
    category: "mail",
    date: "ديسمبر 2023",
    questions: 180,
    time: 60,
    difficulty: "صعب",
    takers: 213,
    passRate: 62,
    badge: "حصري",
  },
  {
    id: "re-mail-2022-1",
    title: "امتحان البريد المصري - 2022 (النموذج الرسمي)",
    category: "mail",
    date: "مارس 2022",
    questions: 150,
    time: 60,
    difficulty: "متوسط",
    takers: 521,
    passRate: 70,
  },
  {
    id: "re-edu-math-2023-1",
    title: "امتحان وزارة التربية (رياضيات) - 2023",
    category: "math",
    date: "سبتمبر 2023",
    questions: 175,
    time: 60,
    difficulty: "صعب",
    takers: 198,
    passRate: 65,
    badge: "حصري",
  },
  {
    id: "re-edu-eng-2023-1",
    title: "امتحان وزارة التربية (لغة إنجليزية) - 2023",
    category: "english",
    date: "أكتوبر 2023",
    questions: 160,
    time: 60,
    difficulty: "متوسط",
    takers: 276,
    passRate: 72,
    badge: "حديث",
  },
  {
    id: "re-edu-science-2023-1",
    title: "امتحان وزارة التربية (علوم) - 2023",
    category: "science",
    date: "نوفمبر 2023",
    questions: 165,
    time: 60,
    difficulty: "متوسط",
    takers: 184,
    passRate: 68,
  },
  {
    id: "re-edu-social-2023-1",
    title: "امتحان وزارة التربية (دراسات اجتماعية) - 2023",
    category: "social",
    date: "سبتمبر 2023",
    questions: 155,
    time: 60,
    difficulty: "سهل",
    takers: 223,
    passRate: 76,
  },
  {
    id: "re-edu-arabic-2023-1",
    title: "امتحان وزارة التربية (لغة عربية) - 2023",
    category: "arabic",
    date: "ديسمبر 2023",
    questions: 170,
    time: 60,
    difficulty: "صعب",
    takers: 244,
    passRate: 64,
    badge: "حصري",
  },
];

// Categories for filtering
const categories = [
  { id: "all", name: "الكل" },
  { id: "mail", name: "البريد" },
  { id: "math", name: "تربية رياضيات" },
  { id: "english", name: "تربية انجليزي" },
  { id: "science", name: "تربية علوم" },
  { id: "social", name: "دراسات اجتماعية" },
  { id: "arabic", name: "تربية لغة عربية" },
];

// Difficulty to color mapping
const difficultyColors = {
  سهل: "bg-green-500",
  متوسط: "bg-blue-500",
  صعب: "bg-red-500",
};

// Category button component
const CategoryButton = ({ category, isSelected, onClick }) => (
  <button
    onClick={() => onClick(category.id)}
    className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
      isSelected
        ? "bg-gradient-to-r from-yellow-600/30 to-amber-600/30 border-yellow-500/40 text-yellow-300"
        : "border-white/5 text-white/70 hover:border-white/10 hover:text-white"
    }`}
  >
    {category.name}
  </button>
);

// Exam Card Component
const ExamCard = ({ exam, handleStartExam }) => (
  <div className="glass-card overflow-hidden border-2 hover:border-yellow-500/30 group transition-all duration-300">
    <div className="flex flex-col h-full">
      {/* Exam Header */}
      <div className="relative p-5 border-b border-white/10">
        {/* Badge */}
        {exam.badge && (
          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg shadow-lg transform rotate-3">
            {exam.badge}
          </div>
        )}

        <h3 className="text-xl font-bold text-white mb-3 pr-4">{exam.title}</h3>

        <div className="flex flex-wrap gap-3 text-sm text-white/60">
          <div className="flex items-center gap-1.5">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {exam.date}
          </div>

          <div className="flex items-center gap-1.5">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            {exam.questions} سؤال
          </div>

          <div className="flex items-center gap-1.5">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {exam.time} دقيقة
          </div>
        </div>
      </div>

      {/* Exam Stats */}
      <div className="flex-1 p-5 flex flex-col">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-yellow-400 text-sm font-bold mb-1">
              مستوى الصعوبة
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  difficultyColors[exam.difficulty]
                }`}
              ></div>
              <span className="text-white">{exam.difficulty}</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-yellow-400 text-sm font-bold mb-1">
              نسبة النجاح
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500"
                  style={{ width: `${exam.passRate}%` }}
                ></div>
              </div>
              <span className="text-white text-sm w-9">{exam.passRate}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span>{exam.takers} متدرب أخذ هذا الاختبار</span>
        </div>

        <div className="mt-auto">
          <button
            onClick={() => handleStartExam(exam.id)}
            className="w-full bg-gradient-to-r from-yellow-500/80 to-amber-600/80 hover:from-yellow-500 hover:to-amber-600 text-white py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-md group-hover:shadow-yellow-600/20"
          >
            <span>ابدأ الاختبار</span>
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Premium Badge Component
const PremiumBadge = () => (
  <div className="relative bg-gradient-to-r from-yellow-500 to-amber-600 p-0.5 rounded-xl shadow-lg animate-pulse">
    <div className="flex items-center gap-2 bg-slate-900 rounded-xl px-4 py-2">
      <svg
        className="w-4 h-4 text-yellow-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
      <span className="text-white text-sm">عضوية مميزة</span>
    </div>
  </div>
);

export default function PremiumExamsPage() {
  const router = useRouter();
  const { userProfile, checkPremiumStatus } = useClientAuth();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSubjects, setShowSubjects] = useState(false);
  const [premiumInfo, setPremiumInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check premium status on initial load
  useEffect(() => {
    const loadPremiumData = async () => {
      try {
        // Get premium expiry info
        const info = await checkPremiumStatus();
        setPremiumInfo(info);
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking premium status:", error);
        setIsLoading(false);
      }
    };

    loadPremiumData();
  }, [checkPremiumStatus]);

  // Filter exams based on category and search query
  const filteredExams = useMemo(() => {
    return realExamData.filter((exam) => {
      const matchesCategory =
        selectedCategory === "all" || exam.category === selectedCategory;
      const matchesSearch = exam.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Handle starting an exam
  const handleStartExam = (examId) => {
    // Redirect to exam instructions with the selected exam ID
    router.push(
      `/exams/instructions?subject=${examId.split("-")[1]}&examId=${examId}`
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute top-0 left-0 w-full h-full border-8 border-yellow-500/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-8 border-t-yellow-500 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-400 text-xl">
              <svg
                className="w-12 h-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <p className="text-white text-xl font-bold">
            جاري تحميل الامتحانات الحقيقية...
          </p>
        </div>
      </div>
    );
  }

  return (
    <PremiumGuard>
      <div className="max-w-7xl mx-auto px-4 py-8 pt-28">
        {/* Header */}
        <Header showSubjects={showSubjects} setShowSubjects={setShowSubjects} />

        {/* Welcome Modal for new premium users */}
        <WelcomePremiumModal />

        {/* Main Content */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <PremiumBadge />
          </div>

          <h1 className="text-4xl font-bold text-white mb-3">
            امتحانات <span className="text-yellow-400">حقيقية</span> من
            الاختبارات السابقة
          </h1>
          <p className="text-xl text-white/70 mb-4">
            تدرب على أسئلة واقعية من امتحانات رسمية سابقة
          </p>

          <div className="inline-block bg-white/5 rounded-lg px-4 py-2 border border-white/10">
            <span className="text-white/80">
              مرحباً {userProfile?.name || "المستخدم"}! استمتع بالوصول الكامل
              للامتحانات الحقيقية
            </span>
          </div>

          {/* Premium Expiry Info */}
          {premiumInfo && (
            <div className="mt-4 inline-block bg-gradient-to-r from-yellow-600/20 to-amber-600/20 rounded-lg px-4 py-2 border border-yellow-500/20">
              <span className="text-yellow-300">
                عضويتك المميزة سارية حتى: {premiumInfo.expiryFormatted}
                {premiumInfo.daysRemaining > 0 &&
                  ` (${premiumInfo.daysRemaining} يوم متبقي)`}
              </span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="glass-card p-6 mb-8 border-2 border-yellow-500/20">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="ابحث عن امتحان..."
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-yellow-500/20 focus:border-yellow-500/50 text-white placeholder-white/50 focus:outline-none transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  category={category}
                  isSelected={selectedCategory === category.id}
                  onClick={setSelectedCategory}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Premium Exams Grid */}
        {filteredExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                handleStartExam={handleStartExam}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-white/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              لا توجد امتحانات مطابقة
            </h3>
            <p className="text-white/60">
              حاول تغيير معايير البحث أو اختر تصنيفًا آخر
            </p>
          </div>
        )}

        {/* Google AdSense Ad */}
        <div className="mt-12 mb-8 p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="w-full h-32 flex items-center justify-center">
            {/* This is where the AdSense ad code would go */}
            <div className="text-white/50 text-sm">إعلان</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </PremiumGuard>
  );
}
