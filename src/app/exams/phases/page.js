"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { startBreak, endBreak, startPhase } from "../../../../store/examSlice";

const PhaseStatus = {
  LOCKED: "locked",
  ACTIVE: "active",
  COMPLETED: "completed",
  WAITING: "waiting",
  CURRENT_SUBPHASE: "current_subphase",
  PENDING_SUBPHASE: "pending_subphase",
  COMPLETED_SUBPHASE: "completed_subphase",
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
    subPhases: [
      { id: "arabic", title: "اللغة العربية", questions: 20 },
      { id: "english", title: "اللغة الإنجليزية", questions: 20 },
    ],
    time: 10,
  },
  {
    id: "knowledge",
    title: "الكفايات المعرفية والتكنولوجية",
    icon: "💡",
    gradient: "from-violet-500/20 to-purple-500/20",
    borderColor: "border-violet-200",
    questions: 40,
    subPhases: [
      { id: "iq", title: "اختبار الذكاء", questions: 15 },
      { id: "general", title: "معلومات عامة", questions: 15 },
      { id: "it", title: "تكنولوجيا المعلومات", questions: 10 },
    ],
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
  mailPhases[0],
  mailPhases[1],
  mailPhases[2],
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
  const dispatch = useDispatch();

  // Get exam state from Redux
  const examState = useSelector((state) => state.exam);
  const { completedPhases, completedSubPhases, currentSubPhase, breakTime } =
    examState;

  const [phases, setPhases] = useState(
    subject === "mail" ? mailPhases : educationPhases
  );
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(0);
  const [globalBreakVisible, setGlobalBreakVisible] = useState(false);

  useEffect(() => {
    // Set current phase index based on completed phases
    if (completedPhases && completedPhases.length > 0) {
      setCurrentPhaseIndex(completedPhases.length);

      // Check if in break time
      if (breakTime) {
        const elapsedTime = Math.floor(
          (Date.now() - breakTime.startTime) / 1000
        );
        const timeLeft = Math.max(0, breakTime.duration - elapsedTime);

        if (timeLeft > 0) {
          setIsBreakTime(true);
          setBreakTimeRemaining(timeLeft);
          setGlobalBreakVisible(true);
        } else {
          // Break time is over, auto-start next phase
          dispatch(endBreak());
          router.push(`/exams/questions?phase=${getNextPhaseId()}`);
        }
      }
    }
  }, [completedPhases, breakTime, phases.length, dispatch]);

  // Break timer effect
  useEffect(() => {
    if (isBreakTime && breakTimeRemaining > 0) {
      const timer = setInterval(() => {
        setBreakTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            dispatch(endBreak());
            // Auto-start next phase
            router.push(`/exams/questions?phase=${getNextPhaseId()}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isBreakTime, breakTimeRemaining, dispatch]);

  const getPhaseStatus = (index) => {
    if (index < currentPhaseIndex) return PhaseStatus.COMPLETED;
    if (index === currentPhaseIndex) return PhaseStatus.ACTIVE;
    if (isBreakTime && index === currentPhaseIndex + 1)
      return PhaseStatus.WAITING;
    return PhaseStatus.LOCKED;
  };

  const getSubPhaseStatus = (phaseId, subPhaseId) => {
    // Get completed sub-phases for this phase
    const completedSubs = completedSubPhases[phaseId] || [];

    // Check if sub-phase is completed
    if (completedSubs.includes(subPhaseId)) {
      return PhaseStatus.COMPLETED_SUBPHASE;
    }

    // Check if this is the current active sub-phase
    if (
      getPhaseStatus(phases.findIndex((p) => p.id === phaseId)) ===
        PhaseStatus.ACTIVE &&
      (!completedSubs.length || currentSubPhase === subPhaseId)
    ) {
      return PhaseStatus.CURRENT_SUBPHASE;
    }

    // Check if this is a waiting sub-phase (next in line)
    if (
      getPhaseStatus(phases.findIndex((p) => p.id === phaseId)) ===
        PhaseStatus.ACTIVE &&
      completedSubs.length > 0 &&
      !currentSubPhase
    ) {
      // Find the first uncompleted sub-phase
      const phaseObj = phases.find((p) => p.id === phaseId);
      const nextSubPhase = phaseObj.subPhases.find(
        (sp) => !completedSubs.includes(sp.id)
      );

      if (nextSubPhase && nextSubPhase.id === subPhaseId) {
        return PhaseStatus.WAITING;
      }
    }

    // It's a future sub-phase
    return PhaseStatus.PENDING_SUBPHASE;
  };

  const getNextPhaseId = () => {
    // If all phases are completed, return null
    if (currentPhaseIndex >= phases.length) {
      return null;
    }

    const currentPhase = phases[currentPhaseIndex];

    // Check if this phase has sub-phases
    if (currentPhase.subPhases) {
      const completedSubs = completedSubPhases[currentPhase.id] || [];

      // Find the first uncompleted sub-phase
      const nextSubPhase = currentPhase.subPhases.find(
        (sp) => !completedSubs.includes(sp.id)
      );

      // If there's an uncompleted sub-phase, return it
      if (nextSubPhase) {
        return `${currentPhase.id}_${nextSubPhase.id}`;
      }

      // All sub-phases completed, move to next main phase
      if (currentPhaseIndex + 1 < phases.length) {
        const nextPhase = phases[currentPhaseIndex + 1];

        // If next phase has sub-phases, start with first sub-phase
        if (nextPhase.subPhases) {
          return `${nextPhase.id}_${nextPhase.subPhases[0].id}`;
        }

        // Otherwise return the phase itself
        return nextPhase.id;
      }
    } else {
      // Current phase doesn't have sub-phases
      return currentPhase.id;
    }

    return null;
  };

  const handleStartPhase = () => {
    const nextPhaseId = getNextPhaseId();

    if (nextPhaseId) {
      // Check if it's a sub-phase
      if (nextPhaseId.includes("_")) {
        const [mainPhase, subPhase] = nextPhaseId.split("_");

        // Start the phase with the specific sub-phase
        dispatch(
          startPhase({
            phaseId: mainPhase,
            subPhase: subPhase,
            duration: 600, // 10 minutes
          })
        );
      } else {
        // Start a regular phase
        dispatch(
          startPhase({
            phaseId: nextPhaseId,
            duration: 600, // 10 minutes
          })
        );
      }

      // Navigate to questions page
      router.push(`/exams/questions?phase=${nextPhaseId}`);
    }
  };

  const handleStartSubPhase = (phaseId, subPhaseId) => {
    dispatch(
      startPhase({
        phaseId: phaseId,
        subPhase: subPhaseId,
        duration: 600, // 10 minutes
      })
    );

    // Navigate to questions page
    router.push(`/exams/questions?phase=${phaseId}_${subPhaseId}`);
  };

  const formatTime = (seconds) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
      {/* Global Break Timer - Visible at the top */}
      {globalBreakVisible && (
        <div className="bg-amber-50 rounded-xl shadow-sm border border-amber-200 mb-4 p-4 text-center">
          <div className="flex flex-col items-center">
            <div className="text-amber-800 font-bold mb-2">فترة راحة</div>
            <div className="text-2xl font-bold text-amber-700 mb-1">
              {formatTime(breakTimeRemaining)}
            </div>
            <div className="text-amber-600 text-sm">
              ستبدأ المرحلة التالية تلقائياً بعد انتهاء الوقت
            </div>
            <button
              onClick={() => {
                dispatch(endBreak());
                setGlobalBreakVisible(false);
                router.push(`/exams/questions?phase=${getNextPhaseId()}`);
              }}
              className="mt-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-4 py-2 text-sm transition-colors"
            >
              ابدأ الآن
            </button>
          </div>
        </div>
      )}

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
                    {status === PhaseStatus.ACTIVE &&
                      !isBreakTime &&
                      !phase.subPhases && (
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
                          {formatTime(breakTimeRemaining)}
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
                    {phase.subPhases.map((subPhase) => {
                      const subPhaseStatus = getSubPhaseStatus(
                        phase.id,
                        subPhase.id
                      );

                      return (
                        <div
                          key={subPhase.id}
                          className={`bg-gray-50 rounded-md p-2 border transition-colors ${
                            subPhaseStatus === PhaseStatus.COMPLETED_SUBPHASE
                              ? "border-green-200 bg-green-50"
                              : subPhaseStatus === PhaseStatus.CURRENT_SUBPHASE
                              ? "border-blue-200 bg-blue-50 shadow-sm"
                              : subPhaseStatus === PhaseStatus.WAITING
                              ? "border-amber-200 bg-amber-50"
                              : "border-gray-100"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="text-xs font-medium text-gray-700">
                              {subPhase.title}
                            </div>

                            {subPhaseStatus ===
                              PhaseStatus.COMPLETED_SUBPHASE && (
                              <svg
                                className="w-4 h-4 text-green-600"
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
                            )}

                            {subPhaseStatus ===
                              PhaseStatus.CURRENT_SUBPHASE && (
                              <button
                                onClick={() =>
                                  handleStartSubPhase(phase.id, subPhase.id)
                                }
                                className="text-xs text-blue-600 hover:underline"
                              >
                                ابدأ
                              </button>
                            )}

                            {subPhaseStatus === PhaseStatus.WAITING && (
                              <div className="flex items-center text-amber-600">
                                <svg
                                  className="w-3 h-3 animate-spin mr-1"
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
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
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

      {/* Results Card - Show if all phases are completed */}
      {currentPhaseIndex === phases.length && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-green-200">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              النتائج النهائية
            </h2>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium">
              اكتمل
            </div>
          </div>
          <div className="p-6 text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {calculateTotalScore()}%
              </h3>
              <p className="text-gray-600">النتيجة الإجمالية</p>
            </div>

            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to calculate total score (example)
const calculateTotalScore = () => {
  // In a real implementation, this would use the actual exam results
  // from Redux state
  return Math.round(Math.random() * 40 + 60); // Random score between 60-100%
};

export default ExamPhases;
