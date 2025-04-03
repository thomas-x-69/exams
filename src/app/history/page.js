// src/app/history/page.js
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import ResultCard from "../../../components/ResultCard";
import PerformanceChart from "../../../components/PerformanceChart";
import SkillsRadarChart from "../../../components/SkillsRadarChart";

export default function HistoryPage() {
  const router = useRouter();
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, mail, education
  const [sortBy, setSortBy] = useState("date"); // date, score
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc
  const [selectedResult, setSelectedResult] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [showScoreInfo, setShowScoreInfo] = useState(false);

  // Activate entrance animation after mounting
  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  // Load exam results from localStorage
  useEffect(() => {
    setLoading(true);
    try {
      // Get all localStorage keys
      const allKeys = Object.keys(localStorage);

      // Filter for exam result keys (we'll use a prefix pattern)
      const resultKeys = allKeys.filter((key) => key.startsWith("examResult_"));

      // Load and parse all results
      const results = resultKeys
        .map((key) => {
          try {
            const rawData = localStorage.getItem(key);
            const data = JSON.parse(rawData);

            // Add the storage key to the data for reference
            return {
              ...data,
              storageKey: key,
              // Extract date from key if completedAt is missing
              completedAt:
                data.completedAt ||
                new Date(parseInt(key.split("_")[1])).toISOString(),
            };
          } catch (err) {
            console.error(`Error parsing result ${key}:`, err);
            return null;
          }
        })
        .filter(Boolean); // Remove any null results

      setExamResults(results);
    } catch (err) {
      console.error("Failed to load exam results:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...examResults];

    // Apply subject filter
    if (filter !== "all") {
      filtered = filtered.filter((result) =>
        filter === "mail"
          ? result.subject === "mail"
          : result.subject !== "mail"
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "desc"
          ? new Date(b.completedAt) - new Date(a.completedAt)
          : new Date(a.completedAt) - new Date(b.completedAt);
      } else if (sortBy === "score") {
        return sortOrder === "desc"
          ? b.totalScore - a.totalScore
          : a.totalScore - b.totalScore;
      }
      return 0;
    });

    return filtered;
  }, [examResults, filter, sortBy, sortOrder]);

  // Get statistics
  const stats = useMemo(() => {
    if (examResults.length === 0) return null;

    const total = examResults.length;
    const averageScore =
      examResults.reduce((sum, result) => sum + result.totalScore, 0) / total;
    const highestScore = Math.max(
      ...examResults.map((result) => result.totalScore)
    );
    const recentTrend =
      examResults.length > 1
        ? examResults.sort(
            (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
          )[0].totalScore -
          examResults.sort(
            (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
          )[1].totalScore
        : 0;

    return {
      total,
      averageScore: Math.round(averageScore),
      highestScore,
      recentTrend,
    };
  }, [examResults]);

  // Handle viewing detailed analysis
  const handleViewAnalysis = (result) => {
    setSelectedResult(result);
  };

  // Handle deleting a result
  const handleDeleteResult = (storageKey) => {
    try {
      // Remove from localStorage
      localStorage.removeItem(storageKey);

      // Update state
      setExamResults((prev) =>
        prev.filter((result) => result.storageKey !== storageKey)
      );

      // If this was the selected result, clear selection
      if (selectedResult?.storageKey === storageKey) {
        setSelectedResult(null);
      }
    } catch (err) {
      console.error("Failed to delete result:", err);
    }
  };

  // Handle clearing all history
  const handleClearAllHistory = () => {
    if (window.confirm("هل أنت متأكد من حذف جميع النتائج السابقة؟")) {
      try {
        // Get all localStorage keys related to exam results
        const allKeys = Object.keys(localStorage);
        const resultKeys = allKeys.filter((key) =>
          key.startsWith("examResult_")
        );

        // Remove all results
        resultKeys.forEach((key) => localStorage.removeItem(key));

        // Update state
        setExamResults([]);
        setSelectedResult(null);
      } catch (err) {
        console.error("Failed to clear history:", err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-28">
      {/* Header */}
      <Header />

      <div
        className={`transition-all duration-500 ${
          animateIn
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            سجل نتائج الاختبارات السابقة
          </h1>
          <p className="text-xl text-white/70">
            تابع تقدمك وحلل أدائك في الاختبارات السابقة
          </p>
        </div>

        {/* Score Calculation Info */}
        <div className="relative mb-6">
          <button
            onClick={() => setShowScoreInfo(!showScoreInfo)}
            className="text-white flex items-center gap-2 bg-gradient-to-r from-blue-600/70 to-indigo-600/70 px-4 py-2 rounded-lg shadow-md hover:from-blue-700/70 hover:to-indigo-700/70 transition-all duration-300 mx-auto"
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>كيف يتم حساب الدرجات؟</span>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                showScoreInfo ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showScoreInfo && (
            <div className="glass-card bg-white/10 p-6 mt-3 animate-in slide-in-from-top-4 duration-300 border-2 border-blue-500/30">
              <h3 className="text-lg font-bold text-white mb-4">
                طريقة حساب الدرجات
              </h3>
              <div className="space-y-3 text-white/80">
                <p>
                  يتم حساب الدرجة الكلية بناءً على متوسط مرجح من درجات المراحل
                  المختلفة، مع مراعاة أهمية كل مرحلة:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <h4 className="font-bold text-white mb-2">
                      حساب درجة كل مرحلة
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <svg
                          className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5"
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
                        <span>
                          <strong>الكفايات السلوكية</strong>: تُحسب بناءً على
                          عدد النقاط المكتسبة مقسومة على العدد الإجمالي للنقاط
                          المتاحة.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <svg
                          className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5"
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
                        <span>
                          <strong>الكفايات الأخرى</strong>: تُحسب بعدد الإجابات
                          الصحيحة مقسومة على العدد الكلي للأسئلة.
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <h4 className="font-bold text-white mb-2">
                      حساب الدرجة الإجمالية
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <svg
                          className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5"
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
                        <span>
                          تُجمع نتائج جميع المراحل مع إعطاء وزن لكل مرحلة حسب
                          عدد الأسئلة.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <svg
                          className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5"
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
                        <span>
                          الدرجة النهائية = (مجموع (درجة المرحلة × عدد أسئلة
                          المرحلة)) ÷ العدد الكلي للأسئلة
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        {stats && (
          <div className="glass-card bg-white/10 p-6 mb-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
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
                <div>
                  <div className="text-white/70 text-sm">عدد الاختبارات</div>
                  <div className="text-white text-2xl font-bold">
                    {stats.total}
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-600/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-white/70 text-sm">متوسط الدرجات</div>
                  <div className="text-white text-2xl font-bold">
                    {stats.averageScore}%
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-white/70 text-sm">أعلى درجة</div>
                  <div className="text-white text-2xl font-bold">
                    {stats.highestScore}%
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-600/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-white/70 text-sm">آخر تقدم</div>
                  <div
                    className={`text-white text-2xl font-bold flex items-center ${
                      stats.recentTrend > 0
                        ? "text-green-400"
                        : stats.recentTrend < 0
                        ? "text-red-400"
                        : ""
                    }`}
                  >
                    {stats.recentTrend > 0 ? "+" : ""}
                    {stats.recentTrend}%
                    {stats.recentTrend !== 0 && (
                      <span className="mr-1">
                        {stats.recentTrend > 0 ? (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Over Time Chart */}
            {examResults.length > 1 && (
              <div className="mt-8">
                <h3 className="text-white font-bold mb-4">
                  تطور الأداء عبر الوقت
                </h3>
                <div className="bg-white/5 rounded-xl p-4 h-60">
                  <PerformanceChart examResults={examResults} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Improved Filters and Actions */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Filters - Redesigned for better UX */}
            <div className="flex flex-wrap gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-white bg-white/10 border border-white/20 rounded-xl px-4 py-2">
                <label className="text-white/70 text-sm">الترتيب:</label>
                <div className="flex">
                  <button
                    onClick={() => setSortBy("score")}
                    className={`px-3 py-1 text-sm rounded-r-lg transition-colors ${
                      sortBy === "score"
                        ? "bg-white/20 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    الدرجة
                  </button>
                  <button
                    onClick={() => setSortBy("date")}
                    className={`px-3 py-1 text-sm rounded-l-lg transition-colors ${
                      sortBy === "date"
                        ? "bg-white/20 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    التاريخ
                  </button>
                </div>

                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                  }
                  className="ml-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label={
                    sortOrder === "desc"
                      ? "تغيير للترتيب التصاعدي"
                      : "تغيير للترتيب التنازلي"
                  }
                >
                  {sortOrder === "desc" ? (
                    <svg
                      className="w-4 h-4 text-white/70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 text-white/70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Actions */}
            {examResults.length > 0 && (
              <button
                onClick={handleClearAllHistory}
                className="px-4 py-2.5 bg-gradient-to-r from-red-600/70 to-rose-600/70 hover:from-red-600 hover:to-rose-600 text-white rounded-lg flex items-center gap-2 transition-colors shadow-md"
              >
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>حذف السجل</span>
              </button>
            )}
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {loading ? (
            <div className="glass-card bg-white/10 p-8 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
              <p className="text-white mt-4">جاري تحميل النتائج السابقة...</p>
            </div>
          ) : filteredAndSortedResults.length === 0 ? (
            <div className="glass-card bg-white/10 p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white/50"
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
                لا توجد نتائج سابقة
              </h3>
              <p className="text-white/70 mb-6">
                ابدأ اختباراً جديداً لرؤية النتائج هنا
              </p>
              <button
                onClick={() => router.push("/")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md shadow-blue-900/20"
              >
                ابدأ اختباراً جديداً
              </button>
            </div>
          ) : (
            filteredAndSortedResults.map((result, index) => (
              <ResultCard
                key={result.storageKey || index}
                result={result}
                onViewAnalysis={() => handleViewAnalysis(result)}
                onDelete={() => handleDeleteResult(result.storageKey)}
                isSelected={selectedResult?.storageKey === result.storageKey}
              />
            ))
          )}
        </div>

        {/* Selected Result Detailed Analysis */}
        {selectedResult && (
          <div className="glass-card bg-white/10 p-6 mt-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                تحليل تفصيلي للنتيجة
              </h3>
              <button
                onClick={() => setSelectedResult(null)}
                className="p-2 text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills Radar Chart */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-white font-bold mb-3">توزيع المهارات</h4>
                <div className="h-60">
                  <SkillsRadarChart phaseScores={selectedResult.phaseScores} />
                </div>
              </div>

              {/* Statistical Analysis */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col">
                <h4 className="text-white font-bold mb-3">تحليل إحصائي</h4>

                <div className="space-y-4 flex-1">
                  {Object.entries(selectedResult.phaseScores || {}).map(
                    ([phaseId, score]) => {
                      const phaseName = getPhaseDisplayName(phaseId);
                      return (
                        <div key={phaseId}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-white/80 text-sm">
                              {phaseName}
                            </span>
                            <span
                              className={`text-sm font-bold ${getScoreColor(
                                score
                              )}`}
                            >
                              {score}%
                            </span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getScoreColorClass(
                                score
                              )}`}
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold">
                      النتيجة الإجمالية
                    </span>
                    <span
                      className={`text-lg font-bold ${getScoreColor(
                        selectedResult.totalScore
                      )}`}
                    >
                      {selectedResult.totalScore}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 md:col-span-2">
                <h4 className="text-white font-bold mb-3">توصيات التحسين</h4>
                <div className="space-y-3">
                  {generateRecommendations(selectedResult).map((rec, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex items-center justify-center text-white border border-white/10 flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-white/80 text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get phase display name
function getPhaseDisplayName(phaseId) {
  const phaseNames = {
    behavioral: "الكفايات السلوكية والنفسية",
    language_arabic: "الكفايات اللغوية - العربية",
    language_english: "الكفايات اللغوية - الإنجليزية",
    knowledge_iq: "الكفايات المعرفية - اختبار الذكاء",
    knowledge_general: "الكفايات المعرفية - معلومات عامة",
    knowledge_it: "الكفايات المعرفية - تكنولوجيا المعلومات",
    specialization: "كفايات التخصص",
    education: "الكفايات التربوية",
  };

  return phaseNames[phaseId] || phaseId;
}

// Helper function to get score color
function getScoreColor(score) {
  if (score >= 90) return "text-green-400";
  if (score >= 80) return "text-blue-400";
  if (score >= 70) return "text-indigo-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

// Helper function to get score color class for progress bars
function getScoreColorClass(score) {
  if (score >= 90) return "bg-gradient-to-r from-green-500 to-emerald-600";
  if (score >= 80) return "bg-gradient-to-r from-blue-500 to-indigo-600";
  if (score >= 70) return "bg-gradient-to-r from-indigo-500 to-purple-600";
  if (score >= 60) return "bg-gradient-to-r from-amber-500 to-yellow-600";
  return "bg-gradient-to-r from-red-500 to-rose-600";
}

// Helper function to generate recommendations based on results
function generateRecommendations(result) {
  const recommendations = [];

  // Get lowest score phase
  const phaseScores = Object.entries(result.phaseScores || {});
  if (phaseScores.length === 0)
    return ["تابع التدريب على الاختبارات المختلفة لتحسين أدائك العام."];

  // Sort by score (ascending)
  phaseScores.sort((a, b) => a[1] - b[1]);

  // Get the two lowest scoring phases
  const lowestPhases = phaseScores.slice(0, 2);

  lowestPhases.forEach(([phaseId, score]) => {
    const phaseName = getPhaseDisplayName(phaseId);

    if (score < 60) {
      recommendations.push(
        `تحتاج لمزيد من التركيز على ${phaseName}. ننصح بمراجعة المواد التعليمية الأساسية في هذا المجال.`
      );
    } else if (score < 75) {
      recommendations.push(
        `يمكن تحسين أدائك في ${phaseName} من خلال حل المزيد من التمارين والاختبارات التجريبية.`
      );
    } else {
      recommendations.push(
        `أداؤك جيد في ${phaseName} ولكن يمكن تعزيزه من خلال الاطلاع على مواد متقدمة.`
      );
    }
  });

  // Add general recommendation based on overall score
  if (result.totalScore < 60) {
    recommendations.push(
      "ننصح بمراجعة الأساسيات في جميع المجالات وزيادة وقت التدريب على الاختبارات."
    );
  } else if (result.totalScore < 75) {
    recommendations.push(
      "يمكنك تحسين نتيجتك العامة من خلال التركيز على نقاط الضعف المحددة وتنويع أساليب الدراسة."
    );
  } else if (result.totalScore < 90) {
    recommendations.push(
      "تقترب من مستوى متميز. واصل التدريب مع التركيز على الأسئلة الأكثر تحدياً."
    );
  } else {
    recommendations.push(
      "أداؤك ممتاز! ننصح بمواصلة التدريب للحفاظ على هذا المستوى المتميز."
    );
  }

  return recommendations;
}
