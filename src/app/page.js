// src/app/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PhonePopup from "../../components/PhonePopup";
import SubjectsModal from "../../components/SubjectsModal";
import Head from "next/head";

// Instructions Modal Component
const InstructionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl my-2">
        <div className="glass-card bg-slate-900/80 border border-white/20 overflow-hidden max-h-[90vh] flex flex-col">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-4 border-b border-white/10 bg-gradient-to-r from-slate-900/50 to-slate-800/50 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600/20 to-orange-600/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
                <h2 className="text-xl font-bold text-white">
                  تعليمات استخدام المنصة
                </h2>
                <p className="text-white/60 text-xs sm:text-sm">
                  دليل شامل للاستفادة القصوى من منصة الاختبارات المصرية
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
              aria-label="إغلاق"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Instructions Content - Scrollable */}
          <div className="p-4 overflow-auto">
            <div className="space-y-6">
              {/* Section 1: Getting Started */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-white">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    البدء باستخدام المنصة
                  </h3>
                </div>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      يمكنك الاختيار بين تحميل الامتحانات أو خوض اختبار تفاعلي
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      لبدء اختبار تفاعلي، اضغط على "ابدأ الاختبار الآن" واختر
                      المادة التي تريد اختبارها
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>اقرأ تعليمات الاختبار بعناية قبل البدء</span>
                  </li>
                </ul>
              </div>

              {/* Section 2: Exam Phases */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-green-600/20 border border-green-500/20 flex items-center justify-center text-white">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    مراحل الاختبار
                  </h3>
                </div>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-green-400 mt-1 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      يتكون كل اختبار من عدة مراحل متتالية بناءً على نوع
                      الاختبار
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-green-400 mt-1 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      ستنتقل تلقائياً بين المراحل مع فترة راحة قصيرة (دقيقتين)
                      بين كل مرحلة
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-green-400 mt-1 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      لا يمكنك العودة للمرحلة السابقة بعد الانتهاء منها
                    </span>
                  </li>
                </ul>
              </div>

              {/* Section 3: Answering Questions */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/20 flex items-center justify-center text-white">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    الإجابة على الأسئلة
                  </h3>
                </div>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>لكل سؤال مؤقت زمني، انتبه للوقت المتبقي</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      اختر الإجابة الصحيحة بالضغط على أحد الخيارات ثم انتقل
                      للسؤال التالي
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      يجب الإجابة على السؤال الحالي قبل الانتقال للسؤال التالي
                    </span>
                  </li>
                </ul>
              </div>

              {/* Section 4: Results */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/20 flex items-center justify-center text-white">
                    4
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    النتائج والتقييم
                  </h3>
                </div>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      بعد الانتهاء من جميع المراحل، ستظهر النتيجة النهائية مع
                      تفاصيل أدائك في كل مرحلة
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>يمكنك تحميل شهادة إتمام الاختبار والاحتفاظ بها</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-white/10 mt-auto">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-xs">
                منصة الاختبارات المصرية - دليل استخدام المنصة
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
              >
                فهمت، ابدأ الآن
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [showSubjects, setShowSubjects] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Set current date
    const date = new Date();
    setCurrentDate(
      date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Add essential meta tags directly in the page for SEO */}
      <Head>
        <title>منصة الاختبارات المصرية | تدرب على امتحانات التوظيف</title>
        <meta
          name="description"
          content="منصة تدريبية متكاملة لاختبارات التوظيف المصرية. تدرب على امتحانات البريد المصري والتربية بمختلف تخصصاتها في بيئة محاكية للاختبارات الحقيقية"
        />
      </Head>

      {/* Phone Popup Component - Handled independently */}
      <PhonePopup />

      {/* Header - Passing showSubjects state */}

      {/* Main Content */}
      <Header showSubjects={showSubjects} setShowSubjects={setShowSubjects} />
      <main className="flex-1">
        <div className="flex flex-col items-center justify-center min-h-[75vh] gap-12 pt-28">
          {/* Hero Section */}
          <div className="text-center space-y-6 max-w-3xl">
            <h1 className="text-5xl font-bold text-white leading-tight">
              منصة الاختبارات المصرية
            </h1>
            <p className="text-xl text-white/80">
              نقدم لك تجربة تعليمية متكاملة للتحضير للاختبارات بكل سهولة وكفاءة
            </p>
          </div>

          {/* Main Options */}
          <div className="grid gap-6 w-full max-w-2xl px-4 sm:px-0">
            <Link
              href="/pdfs"
              className="glass-card p-4 sm:p-6 hover:bg-white/5 transition-all duration-300 group"
              aria-label="تحميل امتحانات واسئلة"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="rounded-xl p-4 bg-gradient-to-br from-indigo-600/20 to-blue-600/20 border border-white/10 mx-auto sm:mx-0">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </div>
                <div className="text-center sm:text-right">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-white/90">
                    تحميل امتحانات واسئلة
                  </h2>
                  <p className="text-white/70 group-hover:text-white/80">
                    حمل مجموعة شاملة من الامتحانات السابقة للتدريب
                  </p>
                </div>
              </div>
            </Link>

            <button
              onClick={() => setShowSubjects(true)}
              className="glass-card p-4 sm:p-6 hover:bg-white/5 transition-all duration-300 w-full text-center sm:text-right group"
              aria-label="ابدأ الاختبار الآن"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="rounded-xl p-4 bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-white/10 mx-auto sm:mx-0">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div className="text-center sm:text-right">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-white/90">
                    ابدأ الاختبار الآن
                  </h2>
                  <p className="text-white/70 group-hover:text-white/80">
                    خوض تجربة اختبار تحاكي الامتحان الحقيقي
                  </p>
                </div>
              </div>
            </button>

            {/* New Instructions Card */}
            <div className="glass-card p-4 sm:p-6 hover:bg-white/5 transition-all duration-300 group">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="rounded-xl p-4 bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-white/10 mx-auto sm:mx-0">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-center sm:text-right">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-white/90">
                    تعليمات استخدام المنصة
                  </h2>
                  <p className="text-white/70 group-hover:text-white/80">
                    دليل شامل لاستخدام المنصة والتحضير للاختبارات
                  </p>

                  <button
                    onClick={() => setShowInstructions(true)}
                    className="mt-3 px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-all duration-300"
                  >
                    عرض التعليمات
                  </button>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="glass-card p-4 sm:p-6 opacity-75">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <div className="rounded-xl p-4 bg-gradient-to-br from-purple-600/20 to-violet-600/20 border border-white/10 mx-auto sm:mx-0">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-white/70"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div className="text-center sm:text-right">
                    <h2 className="text-xl sm:text-2xl font-bold text-white/90 mb-2">
                      امتحانات مع اسئلة حقيقية
                    </h2>
                    <p className="text-white/60">
                      تدرب على أسئلة من امتحانات حقيقية سابقة
                    </p>
                  </div>
                </div>
              </div>
              <span className="absolute -top-3 -right-3 px-4 py-1 glass-effect rounded-full text-white text-sm border border-white/10">
                قريباً
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Subjects Modal - Only rendered when shown */}
      <SubjectsModal
        isOpen={showSubjects}
        onClose={() => setShowSubjects(false)}
        currentDate={currentDate}
      />

      {/* Instructions Modal - Only rendered when shown */}
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />

      {/* Schema for the exam platform */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: "منصة الاختبارات المصرية",
            description:
              "منصة تعليمية متكاملة للتحضير للاختبارات المصرية بطريقة تفاعلية وفعالة",
            provider: {
              "@type": "Organization",
              name: "منصة الاختبارات المصرية",
            },
            audience: {
              "@type": "Audience",
              audienceType: "طلاب التوظيف المصريين",
            },
            educationalLevel: "متقدم",
            keywords:
              "اختبارات مصرية, امتحان البريد المصري, امتحانات التربية, تدريب على الاختبارات",
            teaches: "التحضير للاختبارات المصرية",
            learningResourceType: "امتحانات تدريبية تفاعلية",
          }),
        }}
      />
    </div>
  );
}
