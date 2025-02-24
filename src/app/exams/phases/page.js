"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTimer } from "react-timer-hook";

const PhaseStatus = {
  LOCKED: "locked",
  ACTIVE: "active",
  COMPLETED: "completed",
  WAITING: "waiting",
};

const mailPhases = [
  {
    id: "behavioral",
    title: "الكفايات السلوكية والنفسية",
    icon: "🧠",
    gradient: "from-blue-500/20 to-indigo-500/20",
    borderColor: "border-blue-200",
    questions: 40,
    time: 10,
  },
  {
    id: "language",
    title: "الكفايات اللغوية",
    icon: "📝",
    gradient: "from-emerald-500/20 to-green-500/20",
    borderColor: "border-emerald-200",
    questions: 40,
    subPhases: ["arabic", "english"],
    time: 10,
  },
  {
    id: "knowledge",
    title: "الكفايات المعرفية والتكنولوجية",
    icon: "💡",
    gradient: "from-violet-500/20 to-purple-500/20",
    borderColor: "border-violet-200",
    questions: 40,
    subPhases: ["iq", "general", "it"],
    time: 10,
  },
  {
    id: "specialization",
    title: "كفايات التخصص",
    icon: "📚",
    gradient: "from-amber-500/20 to-yellow-500/20",
    borderColor: "border-amber-200",
    questions: 30,
    time: 10,
  },
];

const educationPhases = [
  ...mailPhases.slice(0, 3),
  {
    id: "education",
    title: "الكفايات التربوية",
    icon: "🎓",
    gradient: "from-rose-500/20 to-pink-500/20",
    borderColor: "border-rose-200",
    questions: 30,
    time: 10,
  },
  {
    id: "specialization",
    title: "كفايات التخصص",
    icon: "📚",
    gradient: "from-cyan-500/20 to-sky-500/20",
    borderColor: "border-cyan-200",
    questions: 30,
    time: 10,
  },
];

const ExamPhases = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject");

  const [phases, setPhases] = useState(
    subject === "mail" ? mailPhases : educationPhases
  );
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isBreakTime, setIsBreakTime] = useState(false);

  const breakTime = new Date();
  breakTime.setSeconds(breakTime.getSeconds() + 120);

  const { seconds, minutes, isRunning, restart } = useTimer({
    expiryTimestamp: breakTime,
    onExpire: () => {
      setIsBreakTime(false);
      router.push(`/exams/questions?phase=${phases[currentPhaseIndex].id}`);
    },
    autoStart: false,
  });

  useEffect(() => {
    const completedPhases = JSON.parse(
      localStorage.getItem("completedPhases") || "[]"
    );
    setCurrentPhaseIndex(completedPhases.length);

    if (completedPhases.length > 0 && completedPhases.length < phases.length) {
      setIsBreakTime(true);
      const time = new Date();
      time.setSeconds(time.getSeconds() + 120);
      restart(time);
    }
  }, []);

  const getPhaseStatus = (index) => {
    if (index < currentPhaseIndex) return PhaseStatus.COMPLETED;
    if (index === currentPhaseIndex) return PhaseStatus.ACTIVE;
    if (isBreakTime && index === currentPhaseIndex + 1)
      return PhaseStatus.WAITING;
    return PhaseStatus.LOCKED;
  };

  const handleStartPhase = () => {
    router.push(`/exams/questions?phase=${phases[currentPhaseIndex].id}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm shadow-indigo-200/20 mb-3 sm:mb-4">
        <div className="p-3 sm:p-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center text-xl sm:text-2xl border border-blue-200">
                {subject === "mail" ? "📬" : "📚"}
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900">
                  {subject === "mail"
                    ? "اختبار البريد المصري"
                    : "اختبار التربية"}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  {phases.length} مراحل -{" "}
                  {phases.reduce((acc, phase) => acc + phase.questions, 0)} سؤال
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phases Grid */}
      <div className="space-y-3">
        {phases.map((phase, index) => {
          const status = getPhaseStatus(index);

          return (
            <div
              key={phase.id}
              className={`bg-white rounded-lg shadow-sm border transition-all duration-300 ${
                status === PhaseStatus.ACTIVE
                  ? "border-blue-200 shadow-md shadow-blue-100/50"
                  : status === PhaseStatus.COMPLETED
                  ? "border-green-200 bg-green-50/50"
                  : status === PhaseStatus.WAITING
                  ? "border-amber-200 bg-amber-50/50"
                  : "border-gray-200 opacity-50"
              }`}
            >
              <div className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    {/* Phase Icon */}
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${phase.gradient} flex items-center justify-center text-lg sm:text-xl border ${phase.borderColor}`}
                    >
                      {phase.icon}
                    </div>

                    {/* Phase Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                        {phase.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400"
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
                          <span>{phase.time} دقائق</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400"
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
                          <span>{phase.questions} سؤال</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center mt-2 sm:mt-0">
                    {status === PhaseStatus.COMPLETED && (
                      <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-1 rounded-md w-full sm:w-auto justify-center">
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
                        <span className="text-xs font-medium">تم</span>
                      </div>
                    )}
                    {status === PhaseStatus.ACTIVE && (
                      <button
                        onClick={handleStartPhase}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center flex items-center"
                      >
                        ابدأ المرحلة
                      </button>
                    )}
                    {status === PhaseStatus.WAITING && (
                      <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-1 rounded-md w-full sm:w-auto justify-center">
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin"
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
                        <span className="text-xs font-medium">
                          {minutes}:{seconds.toString().padStart(2, "0")}
                        </span>
                      </div>
                    )}
                    {status === PhaseStatus.LOCKED && (
                      <div className="flex items-center gap-1.5 text-gray-400 justify-center w-full sm:w-auto">
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
                    )}
                  </div>
                </div>

                {/* Sub-phases if any */}
                {phase.subPhases && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {phase.subPhases.map((subPhase) => (
                      <div
                        key={subPhase}
                        className="bg-gray-50 rounded-md p-2 border border-gray-100"
                      >
                        <div className="text-xs font-medium text-gray-700 text-center sm:text-right">
                          {subPhase === "arabic" && "اللغة العربية"}
                          {subPhase === "english" && "اللغة الإنجليزية"}
                          {subPhase === "iq" && "اختبار الذكاء"}
                          {subPhase === "general" && "معلومات عامة"}
                          {subPhase === "it" && "تكنولوجيا المعلومات"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Footer */}
      <div className="mt-4 bg-white rounded-lg p-3 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          <span className="text-xs text-gray-600 text-center sm:text-right">
            اكمل جميع المراحل للحصول على النتيجة النهائية
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">
              {Math.round((currentPhaseIndex / phases.length) * 100)}%
            </span>
            <div className="w-32 sm:w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{
                  width: `${(currentPhaseIndex / phases.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPhases;
