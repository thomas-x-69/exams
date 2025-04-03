// Updated components/ResultCard.js
"use client";

import React, { useState } from "react";

const ResultCard = ({ result, onViewAnalysis, onDelete, isSelected }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "تاريخ غير محدد";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (err) {
      console.error("Error formatting date:", err);
      return "تاريخ غير صالح";
    }
  };

  // Get score level and styling based on total score
  const getScoreLevel = (score) => {
    if (score >= 90) {
      return {
        text: "ممتاز",
        textColor: "text-green-600",
        bgColor: "bg-green-100",
        borderColor: "border-green-200",
        gradient: "from-green-500 to-emerald-600",
        progressColor: "bg-gradient-to-r from-green-500 to-emerald-600",
      };
    }
    if (score >= 80) {
      return {
        text: "جيد جداً",
        textColor: "text-blue-600",
        bgColor: "bg-blue-100",
        borderColor: "border-blue-200",
        gradient: "from-blue-500 to-indigo-600",
        progressColor: "bg-gradient-to-r from-blue-500 to-indigo-600",
      };
    }
    if (score >= 70) {
      return {
        text: "جيد",
        textColor: "text-indigo-600",
        bgColor: "bg-indigo-100",
        borderColor: "border-indigo-200",
        gradient: "from-indigo-500 to-purple-600",
        progressColor: "bg-gradient-to-r from-indigo-500 to-purple-600",
      };
    }
    if (score >= 60) {
      return {
        text: "مقبول",
        textColor: "text-amber-600",
        bgColor: "bg-amber-100",
        borderColor: "border-amber-200",
        gradient: "from-amber-500 to-yellow-600",
        progressColor: "bg-gradient-to-r from-amber-500 to-yellow-600",
      };
    }
    return {
      text: "ضعيف",
      textColor: "text-red-600",
      bgColor: "bg-red-100",
      borderColor: "border-red-200",
      gradient: "from-red-500 to-rose-600",
      progressColor: "bg-gradient-to-r from-red-500 to-rose-600",
    };
  };

  // Get subject display name
  const getSubjectName = (subject) => {
    return subject === "mail" ? "البريد المصري" : "التربية";
  };

  // Calculate how many phases were completed
  const getCompletedPhasesCount = () => {
    return Object.keys(result.phaseScores || {}).length;
  };

  const scoreLevel = getScoreLevel(result.totalScore);

  return (
    <div
      className={`glass-card overflow-hidden transition-all duration-300 transform
        ${
          isSelected
            ? "border-blue-400 bg-white/15 scale-[1.01]"
            : "border-white/10 bg-white/10 hover:bg-white/15"
        }`}
    >
      <div className="p-6">
        {/* Header Row with Score and Info - Improved Layout */}
        <div className="flex flex-col md:flex-row gap-5 items-center ">
          {/* Score Circle - Enhanced with gradient */}
          <div className="relative h-24 w-24 flex-shrink-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="10"
              />

              {/* Progress Circle with Gradient */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={`url(#scoreGradient-${result.storageKey})`}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="282.7"
                strokeDashoffset={282.7 - (282.7 * result.totalScore) / 100}
                transform="rotate(-90 50 50)"
              />

              {/* Define Gradient */}
              <defs>
                <linearGradient
                  id={`scoreGradient-${result.storageKey}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    stopColor={scoreLevel.gradient.split(" ")[1]}
                  />
                  <stop
                    offset="100%"
                    stopColor={scoreLevel.gradient.split(" ")[3]}
                  />
                </linearGradient>
              </defs>

              {/* Central Text */}
              <text
                x="50"
                y="50"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="white"
                fontWeight="bold"
                fontSize="24"
              >
                {result.totalScore}
              </text>

              <text
                x="50"
                y="65"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="rgba(255,255,255,0.7)"
                fontSize="14"
              >
                %
              </text>
            </svg>

            {/* Level Badge */}
            <div
              className={`absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3 px-2 py-0.5 rounded-full text-xs font-bold ${scoreLevel.bgColor} ${scoreLevel.textColor} border ${scoreLevel.borderColor} shadow-md`}
            >
              {scoreLevel.text}
            </div>
          </div>

          {/* Info Section - Enhanced with better spacing */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-right">
            <h3 className="text-xl font-bold text-white mb-1">
              {getSubjectName(result.subject)}
            </h3>

            <div className="text-white/60 text-sm mb-2">
              <span className="inline-flex items-center gap-1">
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
                {formatDate(result.completedAt)}
              </span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-1 text-white/70 text-sm">
                <svg
                  className="w-4 h-4 text-white/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{result.userName || "مستخدم"}</span>
              </div>

              <div className="flex items-center gap-1 text-white/70 text-sm">
                <svg
                  className="w-4 h-4 text-white/50"
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
                <span>{getCompletedPhasesCount()} مراحل</span>
              </div>
            </div>
          </div>

          {/* Action Buttons - Better spacing */}
          <div className="flex gap-2 mt-3 md:mt-0 md:mr-auto">
            <button
              onClick={onViewAnalysis}
              className={`px-5 py-2 rounded-lg text-sm flex items-center gap-2 transition-all duration-300 shadow-sm font-medium ${
                isSelected
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span>{isSelected ? "التحليل النشط" : "عرض التحليل"}</span>
            </button>

            {/* Delete Button */}
            {showDeleteConfirm ? (
              <div className="flex gap-1">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-2 bg-gray-600/50 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={onDelete}
                  className="px-3 py-2 bg-red-600/80 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                >
                  حذف
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                aria-label="حذف النتيجة"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
