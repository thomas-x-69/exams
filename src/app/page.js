// src/app/page.js
"use client";

import { useState, useEffect, useMemo, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ContactPopup from "../../components/ContactPopup";
import Head from "next/head";

// Memoized subject card component to prevent unnecessary re-renders
const SubjectCard = memo(({ subject, onClick }) => (
  <Link
    href={`/exams/instructions?subject=${subject.id}`}
    className="block group h-full" // Added h-full for consistent height
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

// Memoized subjects modal for better performance
const SubjectsModal = memo(({ isOpen, subjects, currentDate, onClose }) => {
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
                <span>محدث بتاريخ {currentDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Instructions Modal Component
const InstructionsModal = memo(({ isOpen, onClose }) => {
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
              {/* Section 1: Exam Platform Introduction */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 border-blue-400/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-white">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    الهدف من المنصة
                  </h3>
                </div>
                <p className="mr-10 text-white/80 mb-4">
                  هذه المنصة تعرض كل ما يخص من واقع واختبارات تجريبية واختبارات
                  فعلية تحاكي اختبارات التنظيم والإدارة في جميع المجالات
                </p>
              </div>

              {/* Section 2: Exam Phases - Enhanced UI/UX */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 border-green-400/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-green-600/20 border border-green-500/20 flex items-center justify-center text-white">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    مراحل الاختبار
                  </h3>
                </div>

                {/* Main Phases Overview */}
                <div className="bg-white/5 rounded-lg p-3 mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-5 h-5 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <p className="text-white font-medium">المراحل الرئيسية</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mr-7">
                    <span className="bg-blue-600/20 border border-blue-500/20 px-2 py-1 rounded-lg text-white/90 text-sm">
                      كفايات سلوكية ونفسية
                    </span>
                    <span className="bg-emerald-600/20 border border-emerald-500/20 px-2 py-1 rounded-lg text-white/90 text-sm">
                      كفايات لغوية
                    </span>
                    <span className="bg-purple-600/20 border border-purple-500/20 px-2 py-1 rounded-lg text-white/90 text-sm">
                      كفايات معرفية وتكنولوجية
                    </span>
                    <span className="bg-amber-600/20 border border-amber-500/20 px-2 py-1 rounded-lg text-white/90 text-sm">
                      كفايات تخصص
                    </span>
                  </div>
                </div>

                {/* Detailed Phases Structure */}
                <div className="space-y-5">
                  {/* Phase 1 */}
                  <div className="bg-blue-600/10 rounded-lg p-4 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600/30 flex items-center justify-center text-white text-sm font-bold">
                        1
                      </div>
                      <h4 className="text-white font-bold">
                        كفايات سلوكية ونفسية
                      </h4>
                    </div>
                    <div className="mr-8 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-white/90 text-sm font-medium">
                            مهارات سلوكية
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="bg-white/10 px-2 py-0.5 rounded text-white/80 text-xs">
                              130 سؤال
                            </span>
                            <span className="bg-white/10 px-2 py-0.5 rounded text-white/80 text-xs">
                              25 دقيقة
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-white/90 text-sm font-medium">
                            كفايات وظيفية
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="bg-white/10 px-2 py-0.5 rounded text-white/80 text-xs">
                              50 سؤال
                            </span>
                            <span className="bg-white/10 px-2 py-0.5 rounded text-white/80 text-xs">
                              15 دقيقة
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phase 2 */}
                  <div className="bg-emerald-600/10 rounded-lg p-4 border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-600/30 flex items-center justify-center text-white text-sm font-bold">
                        2
                      </div>
                      <h4 className="text-white font-bold">كفايات لغوية</h4>
                    </div>
                    <div className="mr-8 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-emerald-400 font-bold text-sm">
                            ع
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white/90 text-sm font-medium">
                            لغة عربية
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="bg-white/10 px-2 py-0.5 rounded text-white/80 text-xs">
                              20 سؤال
                            </span>
                            <span className="bg-white/10 px-2 py-0.5 rounded text-white/80 text-xs">
                              10 دقائق
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-emerald-400 font-bold text-sm">
                            E
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white/90 text-sm font-medium">
                            لغة إنجليزية
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="bg-white/10 px-2 py-0.5 rounded text-white/80 text-xs">
                              20 سؤال
                            </span>
                            <span className="bg-white/10 px-2 py-0.5 rounded text-white/80 text-xs">
                              10 دقائق
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phase 3 */}
                  <div className="bg-purple-600/10 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-purple-600/30 flex items-center justify-center text-white text-sm font-bold">
                        3
                      </div>
                      <h4 className="text-white font-bold">
                        كفايات معرفية وتكنولوجية
                      </h4>
                    </div>
                    <div className="mr-8 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-purple-400 font-bold text-sm">
                            IQ
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white/90 text-sm font-medium">
                            اختبار الذكاء
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="bg-white/10 px-2 py-0.5 rounded text-white/80 text-xs">
                              20 سؤال
                            </span>
                            <span className="bg-white/10 px-2 py-0.5 rounded text-white/80 text-xs">
                              10 دقائق
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-purple-400 font-bold text-sm">
                            IT
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white/90 text-sm font-medium">
                            تكنولوجيا معلومات
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="bg-white/10 px-2 py-0.5 rounded text-white/80 text-xs">
                              20 سؤال
                            </span>
                            <span className="bg-white/10 px-2 py-0.5 rounded text-white/80 text-xs">
                              10 دقائق
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-purple-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-white/90 text-sm font-medium">
                            معلومات عامة
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="bg-white/10 px-2 py-0.5 rounded text-white/80 text-xs">
                              20 سؤال
                            </span>
                            <span className="bg-white/10 px-2 py-0.5 rounded text-white/80 text-xs">
                              10 دقائق
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phase 4 */}
                  <div className="bg-amber-600/10 rounded-lg p-4 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-amber-600/30 flex items-center justify-center text-white text-sm font-bold">
                        4
                      </div>
                      <h4 className="text-white font-bold">كفايات تخصص</h4>
                    </div>

                    <div className="mr-8 mb-3">
                      <div className="bg-white/5 rounded-lg p-2 mb-3">
                        <p className="text-white/90 text-sm">
                          تختلف هذه المرحلة حسب نوع الاختبار:
                        </p>
                      </div>
                    </div>

                    <div className="mr-8 space-y-4">
                      <div className="bg-amber-700/10 rounded-lg p-3">
                        <p className="text-white/90 text-sm font-bold mb-2">
                          اختبار التربية:
                        </p>
                        <div className="space-y-3 mr-2">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-7 h-7 bg-amber-500/20 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-amber-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-white/90 text-xs font-medium">
                                تربوي
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="bg-white/10 px-1.5 py-0.5 rounded text-white/80 text-xs">
                                  40 سؤال
                                </span>
                                <span className="bg-white/10 px-1.5 py-0.5 rounded text-white/80 text-xs">
                                  20 دقيقة
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-7 h-7 bg-amber-500/20 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-amber-400"
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
                            <div className="flex-1">
                              <p className="text-white/90 text-xs font-medium">
                                تخصص المادة
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="bg-white/10 px-1.5 py-0.5 rounded text-white/80 text-xs">
                                  40 سؤال
                                </span>
                                <span className="bg-white/10 px-1.5 py-0.5 rounded text-white/80 text-xs">
                                  20 دقيقة
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-amber-700/10 rounded-lg p-3">
                        <p className="text-white/90 text-sm font-bold mb-2">
                          اختبار البريد:
                        </p>
                        <div className="flex items-center gap-3 mr-2">
                          <div className="flex-shrink-0 w-7 h-7 bg-amber-500/20 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-amber-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-white/90 text-xs font-medium">
                              تخصص فقط
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="bg-white/10 px-1.5 py-0.5 rounded text-white/80 text-xs">
                                40 سؤال
                              </span>
                              <span className="bg-white/10 px-1.5 py-0.5 rounded text-white/80 text-xs">
                                25 دقيقة
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                <ul className="space-y-2 text-white/80 mr-10">
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
                      عند آخر سؤال، سيتحول زر "التالي" إلى "إنهاء" للانتهاء من
                      المرحلة الحالية
                    </span>
                  </li>
                </ul>
              </div>

              {/* Section 4: Score Calculation */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-white">
                    4
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    طريقة حساب الدرجات
                  </h3>
                </div>
                <ul className="space-y-2 text-white/80 mr-10">
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
                      <strong>حساب درجة كل مرحلة:</strong> تُحسب الكفايات
                      السلوكية بناءً على النقاط المكتسبة، بينما تُحسب باقي
                      الكفايات بعدد الإجابات الصحيحة.
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
                      <strong>حساب الدرجة الإجمالية:</strong> تُجمع نتائج جميع
                      المراحل مع إعطاء وزن لكل مرحلة حسب عدد الأسئلة.
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
                      <strong>الدرجة النهائية:</strong> تُحسب بمعادلة: (مجموع
                      (درجة المرحلة × عدد أسئلة المرحلة)) ÷ العدد الكلي للأسئلة.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Section 5: Results - Adjusted section number */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/20 flex items-center justify-center text-white">
                    5
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    النتائج والتقييم
                  </h3>
                </div>
                <ul className="space-y-2 text-white/80 mr-10">
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
                      ستحصل على تحليل مفصل لمستواك في كل كفاية مع نصائح للتحسين
                    </span>
                  </li>
                </ul>
              </div>

              {/* Section 6: Tips - Adjusted section number */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-600/20 border border-rose-500/20 flex items-center justify-center text-white">
                    6
                  </div>
                  <h3 className="text-lg font-bold text-white">نصائح للنجاح</h3>
                </div>
                <ul className="space-y-2 text-white/80 mr-10">
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-rose-400 mt-1 flex-shrink-0"
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
                      تأكد من وجود اتصال إنترنت مستقر قبل بدء الاختبار
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-rose-400 mt-1 flex-shrink-0"
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
                      لا تقم بتحديث الصفحة أو الضغط على زر الرجوع أثناء الاختبار
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-rose-400 mt-1 flex-shrink-0"
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
                    <span>اختر مكاناً هادئاً للتركيز أثناء الاختبار</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-rose-400 mt-1 flex-shrink-0"
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
                      قم بتجهيز ورقة وقلم لتدوين الملاحظات إذا لزم الأمر
                    </span>
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
});

// Subject data with rich descriptions
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
    title: "تربية لغة عربية",
    icon: "📖",
    desc: "اختبارات اللغة العربية",
    gradient: "from-cyan-600/40 to-sky-600/40",
    questions: 135,
    time: 45,
  },
];

export default function Home() {
  const [showSubjects, setShowSubjects] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

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
      {/* Add essential meta tags directly in the page for SEO */}
      <Head>
        <title>منصة الاختبارات المصرية | تدرب على امتحانات التوظيف ٢٠٢٥</title>
        <meta
          name="description"
          content="منصة تدريبية متكاملة لاختبارات التوظيف المصرية. تدرب على امتحانات البريد المصري والتربية بمختلف تخصصاتها في بيئة محاكية للاختبارات الحقيقية. نماذج اختبارات التوظيف الحكومي والتنظيم والإدارة وكفايات المعلمين."
        />
      </Head>

      {/* Phone Popup Component - Handled independently */}
      <ContactPopup />

      {/* Header Component */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-20">
        <div className="glass-effect rounded-2xl border border-white/10 p-3">
          <div className="flex items-center justify-between">
            {/* Logo & Title with Tooltip */}
            <div className="flex items-center gap-3 px-2">
              <div className="relative group">
                <Link href="/">
                  <div className="w-12 h-12 rounded-2xl glass-effect flex items-center justify-center border border-white/10 overflow-hidden cursor-pointer">
                    <Image
                      src="/logo.png"
                      alt="شعار منصة الاختبارات المصرية"
                      width={60}
                      height={40}
                      className="w-full h-full object-contain p-1"
                      priority
                      quality={90}
                    />
                  </div>
                </Link>
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 right-0 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                  منصة تدريبية للامتحانات المصرية
                </div>
              </div>

              <div className="relative group">
                <Link href="/">
                  <h1 className="text-lg font-bold text-white hidden sm:block">
                    منصة الاختبارات المصرية
                  </h1>
                </Link>
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
                    <span className="text-white/90 text-sm">+8000 سؤال</span>
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
                      +1000 اختبار
                    </span>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 right-0 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                    عدد الاختبارات المتاحة بالمنصة
                  </div>
                </div>
              </div>

              {/* Start Button with Tooltip - Direct approach to open modal */}
              {isLandingPage ? (
                <div className="relative group">
                  <button
                    onClick={() => setShowSubjects(true)}
                    className="px-5 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl border border-white/10 transition-all duration-300 flex items-center gap-2"
                    aria-label="ابدأ الاختبار الآن"
                  >
                    <span>ابدأ الآن</span>
                    <svg
                      className="w-4 h-4"
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
                  </button>
                  {/* Tooltip */}
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 left-1/2 -translate-x-1/2 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                    ابدأ اختبار تدريبي الآن
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <Link
                    href={"/"}
                    className="px-5 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl border border-white/10 transition-all duration-300 flex items-center gap-2"
                    aria-label="ابدأ الاختبار الآن"
                  >
                    <span>ابدأ الآن</span>
                    <svg
                      className="w-4 h-4"
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
                  </Link>
                  {/* Tooltip */}
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 left-1/2 -translate-x-1/2 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                    ابدأ اختبار تدريبي الآن
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[75vh] gap-12 pt-28">
          {/* Hero Section - Enhanced with better SEO keywords */}
          <div className="text-center space-y-6 max-w-3xl mt-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              منصة الاختبارات المصرية الشاملة
            </h1>
            <h2 className="text-2xl text-white/90 mb-2">
              اختبارات البريد - التربية - التنظيم والإدارة ٢٠٢٥
            </h2>
            <p className="text-xl text-white/80">
              تدرب على اختبارات التوظيف المصرية في بيئة محاكية للاختبارات
              الحقيقية. أكثر من 8000 سؤال و1000 اختبار تدريبي
            </p>

            {/* Added Keywords Tags */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <span className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-sm">
                اختبارات البريد المصري
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-sm">
                اختبارات التربية
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-sm">
                التنظيم والإدارة
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-sm">
                كفايات المعلمين
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-sm">
                تدريب اونلاين
              </span>
            </div>
          </div>

          {/* Main Options - Enhanced descriptions for better SEO */}
          <div className="grid gap-6 w-full max-w-2xl px-4 sm:px-0">
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
                    بيئة تدريبية تحاكي الاختبارات الحقيقية مع تقييم فوري لأدائك
                  </p>
                </div>
              </div>
            </button>
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
                    تحميل امتحانات ونماذج أسئلة
                  </h2>
                  <p className="text-white/70 group-hover:text-white/80">
                    حمل مجموعة شاملة من نماذج امتحانات البريد المصري والتربية
                    والتنظيم والإدارة
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/history"
              className="glass-card p-4 sm:p-6 hover:bg-white/5 transition-all duration-300 group"
              aria-label="سجل النتائج السابقة"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="rounded-xl p-4 bg-gradient-to-br from-rose-600/20 to-pink-600/20 border border-white/10 mx-auto sm:mx-0">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="text-center sm:text-right">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-white/90">
                    سجل نتائجك وتحليل أدائك
                  </h2>
                  <p className="text-white/70 group-hover:text-white/80">
                    تتبع تقدمك وحلل نقاط قوتك وضعفك في الاختبارات المختلفة
                  </p>
                </div>
              </div>
            </Link>

            {/* Instructions Card with Enhanced Title */}
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
                    تعليمات استخدام المنصة{" "}
                  </h2>
                  <p className="text-white/70 group-hover:text-white/80">
                    تعرف على نظام الاختبارات وكيفية التحضير المثالي للامتحانات
                    الرسمية
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

            {/* Coming Soon Card */}
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
                      امتحانات حقيقية من الاختبارات السابقة
                    </h2>
                    <p className="text-white/60">
                      تدرب على أسئلة من امتحانات التوظيف الفعلية السابقة
                    </p>
                  </div>
                </div>
              </div>
              <span className="absolute -top-3 -right-3 px-4 py-1 glass-effect rounded-full text-white text-sm border border-white/10">
                قريباً
              </span>
            </div>
          </div>

          {/* SubjectsModal */}
          <SubjectsModal
            isOpen={showSubjects}
            subjects={subjects}
            currentDate={currentDate}
            onClose={() => setShowSubjects(false)}
          />

          {/* InstructionsModal */}
          <InstructionsModal
            isOpen={showInstructions}
            onClose={() => setShowInstructions(false)}
          />

          {/* Additional FAQs Section for SEO */}
          <div className="w-full max-w-2xl mb-4">
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                أسئلة شائعة عن الاختبارات
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    ما هي مراحل اختبار البريد المصري؟
                  </h3>
                  <p className="text-white/70">
                    يتكون اختبار البريد المصري من أربع مراحل رئيسية: الكفايات
                    السلوكية والنفسية، الكفايات اللغوية (عربي وإنجليزي)،
                    الكفايات المعرفية والتكنولوجية، وكفايات التخصص.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    كيف أحضر لاختبارات التربية؟
                  </h3>
                  <p className="text-white/70">
                    للتحضير لاختبارات التربية، ننصح بالتدرب على الكفايات
                    التربوية والتخصصية، ومراجعة المناهج التعليمية، والتدرب على
                    حل نماذج امتحانات سابقة موجودة في قسم التحميلات بالموقع.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    هل اختبارات الموقع محاكية للاختبارات الفعلية؟
                  </h3>
                  <p className="text-white/70">
                    نعم، جميع اختباراتنا مصممة لتحاكي بيئة الاختبارات الرسمية من
                    حيث نوع الأسئلة وتوزيعها والوقت المخصص لكل مرحلة، مما يوفر
                    تجربة تدريبية واقعية تساعدك على الاستعداد الأمثل.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced structured data for the exam platform */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            url: "https://egyptianexams.com/",
            name: "منصة الاختبارات المصرية",
            description:
              "منصة تعليمية متكاملة للتحضير للاختبارات المصرية بطريقة تفاعلية وفعالة",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://egyptianexams.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

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
              url: "https://egyptianexams.com",
            },
            audience: {
              "@type": "Audience",
              audienceType: "باحثي الوظائف الحكومية المصرية",
              geographicArea: {
                "@type": "Country",
                name: "مصر",
              },
            },
            educationalLevel: "متقدم",
            keywords:
              "اختبارات مصرية, امتحان البريد المصري, امتحانات التربية, تدريب على الاختبارات, التنظيم والإدارة",
            teaches: "التحضير للاختبارات المصرية",
            learningResourceType: "امتحانات تدريبية تفاعلية",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EGP",
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />

      {/* FAQ Schema for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "ما هي مراحل اختبار البريد المصري؟",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "يتكون اختبار البريد المصري من أربع مراحل رئيسية: الكفايات السلوكية والنفسية، الكفايات اللغوية (عربي وإنجليزي)، الكفايات المعرفية والتكنولوجية، وكفايات التخصص.",
                },
              },
              {
                "@type": "Question",
                name: "كيف أحضر لاختبارات التربية؟",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "للتحضير لاختبارات التربية، ننصح بالتدرب على الكفايات التربوية والتخصصية، ومراجعة المناهج التعليمية، والتدرب على حل نماذج امتحانات سابقة موجودة في قسم التحميلات بالموقع.",
                },
              },
              {
                "@type": "Question",
                name: "هل اختبارات الموقع محاكية للاختبارات الفعلية؟",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "نعم، جميع اختباراتنا مصممة لتحاكي بيئة الاختبارات الرسمية من حيث نوع الأسئلة وتوزيعها والوقت المخصص لكل مرحلة، مما يوفر تجربة تدريبية واقعية تساعدك على الاستعداد الأمثل.",
                },
              },
              {
                "@type": "Question",
                name: "كيف يتم حساب الدرجات في الاختبارات؟",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "يتم حساب درجة كل مرحلة بناءً على النقاط المكتسبة مقسومة على إجمالي النقاط المتاحة. أما الدرجة النهائية فتحسب كمتوسط مرجح للمراحل المختلفة حسب الأهمية النسبية لكل منها.",
                },
              },
              {
                "@type": "Question",
                name: "كيف أحصل على شهادة بعد إتمام الاختبار؟",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "بعد إتمام جميع مراحل الاختبار، ستظهر لك صفحة النتائج التي تتضمن شهادة إتمام يمكنك تحميلها وطباعتها، بالإضافة إلى تحليل مفصل لأدائك في كل مرحلة من مراحل الاختبار.",
                },
              },
            ],
          }),
        }}
      />

      {/* BreadcrumbList Schema for better navigation visibility */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "الرئيسية",
                item: "https://egyptianexams.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "أنواع الاختبارات",
                item: "https://egyptianexams.com#subjects",
              },
            ],
          }),
        }}
      />
    </>
  );
}
