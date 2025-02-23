"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const subjectInfo = {
  mail: {
    name: "البريد المصري",
    icon: "📬",
    gradient: "from-blue-500/20 to-indigo-500/20",
    color: "text-blue-600",
  },
  math: {
    name: "الرياضيات",
    icon: "➗",
    gradient: "from-green-500/20 to-emerald-500/20",
    color: "text-emerald-600",
  },
  english: {
    name: "اللغة الإنجليزية",
    icon: "🌎",
    gradient: "from-purple-500/20 to-violet-500/20",
    color: "text-purple-600",
  },
  science: {
    name: "العلوم",
    icon: "🔬",
    gradient: "from-rose-500/20 to-pink-500/20",
    color: "text-rose-600",
  },
  social: {
    name: "الدراسات الاجتماعية",
    icon: "📚",
    gradient: "from-amber-500/20 to-yellow-500/20",
    color: "text-amber-600",
  },
  arabic: {
    name: "اللغة العربية",
    icon: "📖",
    gradient: "from-cyan-500/20 to-sky-500/20",
    color: "text-cyan-600",
  },
};

const ExamInstructions = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject");
  const [name, setName] = useState("");
  const organizationCode = "A" + Math.random().toString().slice(2, 8);
  const currentSubject = subjectInfo[subject] || subjectInfo.mail;

  // In your ExamInstructions component
  const handleStartExam = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("برجاء إدخال الاسم");
      return;
    }

    try {
      const response = await fetch("/api/submit-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          subjectName: currentSubject.name,
          organizationCode,
        }),
        cache: "no-store", // Prevent caching
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Save result:", result);

      // Navigate regardless of save success
      router.push(`/exams/phases?subject=${subject}`);
    } catch (error) {
      console.error("Error saving data:", error);
      // Still navigate even if save fails
      router.push(`/exams/phases?subject=${subject}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-indigo-200/20">
        {/* Header with Subject Info */}
        <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
          <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(233,238,255,0.5),transparent)]"></div>
          <div className="relative p-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${currentSubject.gradient} flex items-center justify-center text-3xl shadow-md shadow-indigo-100 border border-white`}
              >
                {currentSubject.icon}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  اختبار {currentSubject.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-gray-400"
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
                    <span>٤٠ دقيقة</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-gray-400"
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
                    <span>٤٠ سؤال</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6">
          {/* Instructions Grid */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            {[
              {
                icon: "⏱️",
                text: "يتكون الاختبار من أربع مراحل، مدة كل مرحلة 10 دقائق",
              },
              {
                icon: "🔄",
                text: "انتقال تلقائي للمرحلة التالية مع فترة راحة دقيقتين",
              },
              {
                icon: "⚠️",
                text: "لا يمكن العودة للمرحلة السابقة بعد انتهاء وقتها",
              },
              {
                icon: "✅",
                text: "يجب الإجابة على جميع الأسئلة للحصول على الدرجة الكاملة",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-gray-50 rounded-xl p-3"
              >
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xl shadow-sm">
                  {item.icon}
                </div>
                <p className="text-gray-700 text-sm pt-1.5">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Form Section */}
          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                الاسم بالكامل
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-sm"
                placeholder="ادخل اسمك كما هو مسجل"
                required
              />
            </div>

            {/* Organization Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                كود التنظيم والإدارة
              </label>
              <input
                type="text"
                value={organizationCode}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 text-sm"
                readOnly
              />
              <p className="mt-1 text-xs text-gray-500">
                كود تعريفي يتم إنشاؤه تلقائياً
              </p>
            </div>

            {/* Warning Alert */}
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
              <div className="flex gap-2">
                <svg
                  className="w-4 h-4 text-amber-600 mt-0.5"
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
                <p className="text-xs text-amber-800">
                  سيبدأ الوقت مباشرة بعد الضغط على زر البدء. تأكد من جاهزيتك
                  واتصال الإنترنت
                </p>
              </div>
            </div>

            {/* Start Button */}
            <button
              type="submit"
              onClick={handleStartExam}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 group text-sm"
            >
              <span>ابدأ الاختبار</span>
              <svg
                className="w-4 h-4 transform transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
};

export default ExamInstructions;
