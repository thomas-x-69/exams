// src/app/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import PhonePopup from "../../components/PhonePopup";

const subjects = [
  {
    id: "mail",
    title: "البريد",
    icon: "📬",
    desc: "اختبارات البريد المصري",
    gradient: "from-blue-600/40 to-indigo-600/40",
    questions: 150,
    time: 45,
  },
  {
    id: "math",
    title: "تربية رياضيات",
    icon: "➗",
    desc: "اختبارات الرياضيات",
    gradient: "from-green-600/40 to-emerald-600/40",
    questions: 120,
    time: 40,
  },
  {
    id: "english",
    title: "تربية انجليزي",
    icon: "🌎",
    desc: "اختبارات اللغة الإنجليزية",
    gradient: "from-purple-600/40 to-violet-600/40",
    questions: 130,
    time: 50,
  },
  {
    id: "science",
    title: "تربية علوم",
    icon: "🔬",
    desc: "اختبارات العلوم العامة",
    gradient: "from-rose-600/40 to-pink-600/40",
    questions: 140,
    time: 45,
  },
  {
    id: "social",
    title: "تربية دراسات",
    icon: "📚",
    desc: "اختبارات الدراسات الاجتماعية",
    gradient: "from-amber-600/40 to-yellow-600/40",
    questions: 125,
    time: 40,
  },
  {
    id: "arabic",
    title: "تربية عربي",
    icon: "📖",
    desc: "اختبارات اللغة العربية",
    gradient: "from-cyan-600/40 to-sky-600/40",
    questions: 135,
    time: 45,
  },
];

export default function Home() {
  const [showSubjects, setShowSubjects] = useState(false);
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
    <>
      {/* Phone Popup Component - Handled independently */}
      <PhonePopup />

      {/* Custom Header with Tooltips */}
      <header className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4">
        <div className="glass-effect rounded-2xl border border-white/10 p-3">
          <div className="flex items-center justify-between">
            {/* Logo & Title with Tooltip */}
            <div className="flex items-center gap-3 px-2">
              <div className="relative group">
                <div className="w-12 h-12 rounded-2xl glass-effect flex items-center justify-center border border-white/10 overflow-hidden cursor-default">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={60}
                    height={40}
                    className="w-full h-full object-contain p-1"
                    priority
                  />
                </div>
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 right-0 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                  منصة غير رسمية
                </div>
              </div>

              <div className="relative group">
                <h1 className="text-lg font-bold text-white hidden sm:block">
                  منصة الاختبارات المصرية
                </h1>
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 top-full right-0 mt-2 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700 ">
                  منصة تدريبية لاختبارات التوظيف المصرية
                </div>
              </div>
            </div>

            {/* Stats & Actions with Tooltips */}
            <div className="flex items-center gap-3">
              {/* Stats Pills */}
              <div className="hidden md:flex items-center gap-2">
                <div className="relative group">
                  <div className="glass-effect px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 cursor-default">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-white/90 text-sm">3000 سؤال</span>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 right-0 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                    عدد الأسئلة المتاحة بالمنصة
                  </div>
                </div>

                <div className="relative group">
                  <div className="glass-effect px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 cursor-default">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-white/90 text-sm whitespace-nowrap">
                      150 اختبار
                    </span>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 right-0 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                    عدد الاختبارات المتاحة بالمنصة
                  </div>
                </div>
              </div>

              {/* Start Button with Tooltip */}
              <div className="relative group">
                <button
                  onClick={() => setShowSubjects(true)}
                  className="px-5 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl border border-white/10 transition-all duration-300 flex items-center gap-2"
                >
                  <span>ابدأ الآن</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 left-1/2 -translate-x-1/2 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                  ابدأ الاختبار الآن
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center min-h-[75vh] gap-12">
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
        <div className="grid gap-6 w-full max-w-2xl">
          <Link
            href="/pdfs"
            className="glass-card p-6 hover:bg-white/5 transition-all duration-300 group"
          >
            <div className="flex items-center gap-6">
              <div className="rounded-xl p-4 bg-gradient-to-br from-indigo-600/20 to-blue-600/20 border border-white/10">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-white/90">
                  تحميل امتحانات واسئلة
                </h3>
                <p className="text-white/70 group-hover:text-white/80">
                  حمل مجموعة شاملة من الامتحانات السابقة للتدريب
                </p>
              </div>
            </div>
          </Link>

          <button
            onClick={() => setShowSubjects(true)}
            className="glass-card p-6 hover:bg-white/5 transition-all duration-300 w-full text-right group"
          >
            <div className="flex items-center gap-6">
              <div className="rounded-xl p-4 bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-white/10">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-white/90">
                  ابدأ الاختبار الآن
                </h3>
                <p className="text-white/70 group-hover:text-white/80">
                  خوض تجربة اختبار تحاكي الامتحان الحقيقي
                </p>
              </div>
            </div>
          </button>

          <div className="relative">
            <div className="glass-card p-6 opacity-75">
              <div className="flex items-center gap-6">
                <div className="rounded-xl p-4 bg-gradient-to-br from-purple-600/20 to-violet-600/20 border border-white/10">
                  <svg
                    className="w-8 h-8 text-white/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white/90 mb-2">
                    امتحانات مع اسئلة حقيقية
                  </h3>
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

        {/* Enhanced Subjects Modal with Date in Footer */}
        {showSubjects && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
              onClick={() => setShowSubjects(false)}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-4xl my-2">
              <div className="glass-card bg-slate-900/80 border border-white/20 overflow-hidden max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b border-white/10 bg-gradient-to-r from-slate-900/50 to-slate-800/50 sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        اختر المادة
                      </h2>
                      <p className="text-white/60 text-xs sm:text-sm">
                        اختر المادة التي تريد اختبارها
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowSubjects(false)}
                    className="p-2 text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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

                {/* Subjects Grid - Scrollable */}
                <div className="p-4 overflow-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {subjects.map((subject) => (
                      <Link
                        key={subject.id}
                        href={`/exams/instructions?subject=${subject.id}`}
                        className="block group"
                        onClick={() => setShowSubjects(false)}
                      >
                        <div
                          className={`relative rounded-xl p-4 transition-all duration-300 bg-gradient-to-br ${subject.gradient} border border-white/20 hover:border-white/30 hover:scale-[1.02] group overflow-hidden h-full`}
                        >
                          {/* Shimmer Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                          {/* Content */}
                          <div className="relative">
                            {/* Icon & Title */}
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl">{subject.icon}</span>
                              </div>
                              <div className="flex-1 pt-1">
                                <h3 className="text-lg font-bold text-white mb-1">
                                  {subject.title}
                                </h3>
                                <p className="text-white/70 text-xs leading-relaxed">
                                  {subject.desc}
                                </p>
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="mt-3 pt-3 border-t border-white/10">
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <svg
                                      className="w-3 h-3 text-white/60"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                    <span className="text-white/70">
                                      {subject.questions} سؤال
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <svg
                                      className="w-3 h-3 text-white/60"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    <span className="text-white/70">
                                      {subject.time} د
                                    </span>
                                  </div>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Modal Footer with Date - Sticky */}
                <div className="p-4 border-t border-white/10 mt-auto">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/60">
                    <span>جميع الاختبارات تحت إشراف خبراء متخصصين</span>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span>محدث بتاريخ {currentDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
