// components/SubjectsModal.js
"use client";

import React, { memo } from "react";
import Link from "next/link";

// Subject card - memoized for performance
const SubjectCard = memo(({ subject, onClick }) => (
  <Link
    href={`/exams/instructions?subject=${subject.id}`}
    className="block group h-full"
    onClick={onClick}
    aria-label={`اختبار ${subject.title}`}
  >
    <div
      className={`relative rounded-xl p-4 md:p-5 transition-all duration-300 bg-gradient-to-br ${subject.gradient} border border-white/20 hover:border-white/30 hover:scale-[1.02] group overflow-hidden h-full flex flex-col`}
    >
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col">
        {/* Icon & Title */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-xl sm:text-2xl" aria-hidden="true">
              {subject.icon}
            </span>
          </div>
          <div className="flex-1 pt-1">
            <h3 className="text-base sm:text-lg font-bold text-white mb-1">
              {subject.title}
            </h3>
            <p className="text-white/70 text-xs leading-relaxed">
              {subject.desc}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-auto pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <svg
                  className="w-3 h-3 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-white/70">{subject.questions} سؤال</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-3 h-3 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-white/70">{subject.time} د</span>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
));

// Main subjects data
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

const SubjectsModal = ({ isOpen, onClose, currentDate }) => {
  // Don't render anything if not open
  if (!isOpen) return null;

  // Format date if not provided
  const formattedDate =
    currentDate ||
    new Date().toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
      {/* Backdrop - clicking this closes the modal */}
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">اختر المادة</h2>
                <p className="text-white/60 text-xs sm:text-sm">
                  اختر المادة التي تريد اختبارها
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

          {/* Subjects Grid - Scrollable */}
          <div className="p-4 overflow-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onClick={onClose}
                />
              ))}
            </div>
          </div>

          {/* Modal Footer with Date - Sticky */}
          <div className="p-4 border-t border-white/10 mt-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/60">
              <span>جميع الاختبارات تحت إشراف خبراء متخصصين</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>محدث بتاريخ {formattedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectsModal;
