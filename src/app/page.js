// src/app/page.js
"use client";

import { useState } from "react";
import Link from "next/link";

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

  return (
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

      {/* Enhanced Subjects Modal */}
      {showSubjects && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
            onClick={() => setShowSubjects(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative w-full max-w-5xl">
            <div className="glass-card bg-slate-900/80 border border-white/20 overflow-hidden">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 sm:p-8 border-b border-white/10 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
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
                    <h2 className="text-2xl font-bold text-white">
                      اختر المادة
                    </h2>
                    <p className="text-white/60 text-sm">
                      اختر المادة التي تريد اختبارها
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSubjects(false)}
                  className="p-2 text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
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

              {/* Subjects Grid */}
              <div className="p-4 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjects.map((subject) => (
                    <Link
                      key={subject.id}
                      href={`/exams/instructions?subject=${subject.id}`}
                      className="block group"
                      onClick={() => setShowSubjects(false)}
                    >
                      <div
                        className={`relative rounded-2xl p-6 transition-all duration-300 bg-gradient-to-br ${subject.gradient} border border-white/20 hover:border-white/30 hover:scale-[1.02] group overflow-hidden`}
                      >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                        {/* Content */}
                        <div className="relative">
                          {/* Icon & Title */}
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <span className="text-3xl">{subject.icon}</span>
                            </div>
                            <div className="flex-1 pt-1">
                              <h3 className="text-xl font-bold text-white mb-1">
                                {subject.title}
                              </h3>
                              <p className="text-white/70 text-sm leading-relaxed">
                                {subject.desc}
                              </p>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="mt-6 pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <svg
                                    className="w-4 h-4 text-white/60"
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
                                <div className="flex items-center gap-2">
                                  <svg
                                    className="w-4 h-4 text-white/60"
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
                                    {subject.time} دقيقة
                                  </span>
                                </div>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <svg
                                  className="w-4 h-4 text-white"
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

              {/* Modal Footer */}
              <div className="mt p-6 border-t border-white/10">
                <div className="flex justify-between items-center text-sm text-white/60">
                  <span>جميع الاختبارات تحت إشراف خبراء متخصصين</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span>محدث بتاريخ اليوم</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
