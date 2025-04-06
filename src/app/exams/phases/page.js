// src/app/exams/phases/page.js - Enhanced with sleek animations and transitions
"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  memo,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  startPhase,
  endBreak,
  startBreak,
  completeExam,
  setExamResults,
} from "../../../../store/examSlice";
import { calculatePhaseScore } from "../../data/questionsUtils";
import ExitConfirmationDialog from "../../../../components/ExitConfirmationDialog";

const PhaseStatus = {
  LOCKED: "locked",
  ACTIVE: "active",
  COMPLETED: "completed",
  CURRENT_SUBPHASE: "current_subphase",
  PENDING_SUBPHASE: "pending_subphase",
  COMPLETED_SUBPHASE: "completed_subphase",
};

// Memoized phase configuration data
const mailPhases = [
  {
    id: "behavioral",
    title: "الكفايات السلوكية والنفسية",
    icon: "🧠",
    gradient: "from-blue-500/20 to-indigo-500/20",
    borderColor: "border-blue-200",
    questions: 150,
    time: 25, // minutes
  },
  {
    id: "language",
    title: "الكفايات اللغوية",
    icon: "📝",
    gradient: "from-emerald-500/20 to-green-500/20",
    borderColor: "border-emerald-200",
    questions: 40,
    subPhases: [
      { id: "arabic", title: "اللغة العربية", questions: 20, time: 10 },
      { id: "english", title: "اللغة الإنجليزية", questions: 20, time: 10 },
    ],
    time: 20, // Total time for both subphases
  },
  {
    id: "knowledge",
    title: "الكفايات المعرفية والتكنولوجية",
    icon: "💡",
    gradient: "from-violet-500/20 to-purple-500/20",
    borderColor: "border-violet-200",
    questions: 40,
    subPhases: [
      { id: "iq", title: "اختبار الذكاء", questions: 15, time: 5 },
      { id: "general", title: "معلومات عامة", questions: 15, time: 5 },
      { id: "it", title: "تكنولوجيا المعلومات", questions: 10, time: 5 },
    ],
    time: 15, // Total time for all subphases
  },
  {
    id: "specialization",
    title: "كفايات التخصص",
    icon: "📚",
    gradient: "from-amber-500/20 to-yellow-500/20",
    borderColor: "border-amber-200",
    questions: 30,
    time: 15, // 15 minutes
  },
];

const educationPhases = [
  {
    id: "behavioral",
    title: "الكفايات السلوكية والنفسية",
    icon: "🧠",
    gradient: "from-blue-500/20 to-indigo-500/20",
    borderColor: "border-blue-200",
    questions: 150,
    time: 25, // minutes
  },
  {
    id: "language",
    title: "الكفايات اللغوية",
    icon: "📝",
    gradient: "from-emerald-500/20 to-green-500/20",
    borderColor: "border-emerald-200",
    questions: 40,
    subPhases: [
      { id: "arabic", title: "اللغة العربية", questions: 20, time: 10 },
      { id: "english", title: "اللغة الإنجليزية", questions: 20, time: 10 },
    ],
    time: 20, // Total time for both subphases
  },
  {
    id: "knowledge",
    title: "الكفايات المعرفية والتكنولوجية",
    icon: "💡",
    gradient: "from-violet-500/20 to-purple-500/20",
    borderColor: "border-violet-200",
    questions: 40,
    subPhases: [
      { id: "iq", title: "اختبار الذكاء", questions: 15, time: 5 },
      { id: "general", title: "معلومات عامة", questions: 15, time: 5 },
      { id: "it", title: "تكنولوجيا المعلومات", questions: 10, time: 5 },
    ],
    time: 15, // Total time for all subphases
  },
  {
    id: "education",
    title: "الكفايات التربوية",
    icon: "🎓",
    gradient: "from-rose-500/20 to-pink-500/20",
    borderColor: "border-rose-200",
    questions: 30,
    time: 15, // 15 minutes
  },
  {
    id: "specialization",
    title: "كفايات التخصص",
    icon: "📚",
    gradient: "from-cyan-500/20 to-sky-500/20",
    borderColor: "border-cyan-200",
    questions: 30,
    time: 15, // 15 minutes
  },
];

// Beautiful animated break timer component
const BreakTimer = memo(({ remainingTime, nextPhaseTitle, onStartNow }) => {
  // Calculate percentage for the circular progress
  const percentage = (remainingTime / 120) * 100;

  return (
    <div className="bg-amber-50 rounded-xl shadow-md border border-amber-200 mb-4 p-6 text-center transform transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col items-center">
        {/* Animated title */}
        <div className="text-amber-800 font-bold mb-4 animate-in slide-in-from-top-4 duration-700">
          <span className="text-xl">فترة راحة</span>
        </div>

        {/* Circular timer */}
        <div className="w-32 h-32 relative mb-4">
          {/* Background circle */}
          <div className="absolute inset-0 rounded-full border-8 border-amber-100"></div>

          {/* Animated progress circle */}
          <svg
            className="absolute inset-0 w-full h-full rotate-[-90deg]"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#FEF3C7"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="8"
              strokeDasharray="264"
              strokeDashoffset={264 - (264 * percentage) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Timer text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-3xl font-bold text-amber-700">
              {formatTime(remainingTime)}
            </div>
          </div>
        </div>

        <div className="text-amber-600 text-sm mb-4 animate-in slide-in-from-bottom-4 duration-700">
          <span>ستبدأ المرحلة التالية تلقائياً بعد انتهاء الوقت</span>
        </div>

        <div className="font-bold text-lg text-amber-800 mb-5 animate-pulse">
          {nextPhaseTitle}
        </div>

        <button
          onClick={onStartNow}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg px-6 py-2.5 text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          ابدأ الآن
        </button>
      </div>
    </div>
  );
});

// Memoized phase card component with enhanced animations
const PhaseCard = memo(
  ({
    phase,
    status,
    isStarted,
    onStartPhase,
    onResumePhase,
    currentPhaseTimeRemaining,
    expanded,
    toggleSection,
    completedSubPhases,
    getSubPhaseStatus,
    formatTime,
    handleStartNextPhase,
    breakTime,
    isActivePhase,
  }) => {
    // Dynamic classes based on phase status
    const cardClasses = `
    bg-white rounded-lg shadow-sm border transition-all duration-500
    ${
      status === PhaseStatus.ACTIVE
        ? "border-blue-300 shadow-md shadow-blue-100/70 ring-2 ring-blue-200/40 transform scale-[1.01]"
        : status === PhaseStatus.COMPLETED
        ? "border-green-200 bg-green-50/50"
        : "border-gray-200 opacity-70"
    }
    ${
      isActivePhase
        ? "animate-in fade-in slide-in-from-bottom-4 duration-700"
        : ""
    }
  `;

    return (
      <div className={cardClasses}>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Phase Icon - With pulse animation when active */}
            <div className="flex items-center gap-3 flex-1">
              <div
                className={`
              w-12 h-12 rounded-lg 
              ${
                status === PhaseStatus.ACTIVE
                  ? "bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border-blue-300"
                  : `bg-gradient-to-br ${phase.gradient} ${phase.borderColor}`
              } 
              flex items-center justify-center text-2xl border
              transform transition-all duration-500
              ${status === PhaseStatus.ACTIVE ? "animate-pulse" : ""}
            `}
              >
                {phase.icon}
              </div>

              {/* Phase Info */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-lg font-bold truncate ${
                    status === PhaseStatus.ACTIVE
                      ? "text-blue-700"
                      : "text-gray-900"
                  }`}
                >
                  {phase.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5 text-gray-400"
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
                      className="w-3.5 h-3.5 text-gray-400"
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
                <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-md w-full sm:w-auto justify-center animate-in fade-in duration-500">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm font-medium">تم</span>
                </div>
              )}

              {status === PhaseStatus.ACTIVE &&
                !breakTime &&
                !phase.subPhases &&
                !isStarted && (
                  <button
                    onClick={onStartPhase}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 w-full sm:w-auto justify-center flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <span>ابدأ المرحلة</span>
                    <svg
                      className="w-4 h-4 animate-bounce"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                )}

              {isStarted && (
                <div className="flex items-center gap-2">
                  {/* Timer */}
                  <div className="bg-blue-100 px-3 py-1.5 rounded-lg text-blue-700 text-sm font-medium flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 animate-pulse"
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
                    {formatTime(currentPhaseTimeRemaining)}
                  </div>

                  {/* Resume Button */}
                  <button
                    onClick={onResumePhase}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-1.5"
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
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>استئناف</span>
                  </button>
                </div>
              )}

              {status === PhaseStatus.LOCKED && (
                <div className="flex items-center gap-1.5 text-gray-400 justify-center w-full sm:w-auto">
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Sub-phases with enhanced animations */}
          {phase.subPhases && status === PhaseStatus.ACTIVE && (
            <div className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 animate-in slide-in-from-top-4 duration-700">
                {phase.subPhases.map((subPhase, subIndex) => {
                  const subPhaseStatus = getSubPhaseStatus(
                    phase.id,
                    subPhase.id
                  );
                  const completedSubs = completedSubPhases[phase.id] || [];
                  const isNextInSequence = subIndex === completedSubs.length;

                  return (
                    <div
                      key={subPhase.id}
                      className={`bg-gray-50 rounded-md p-2.5 border transition-all duration-300 transform 
                      ${
                        subPhaseStatus === PhaseStatus.COMPLETED_SUBPHASE
                          ? "border-green-200 bg-green-50 shadow"
                          : isNextInSequence
                          ? "border-blue-200 bg-blue-50 shadow-md animate-pulse"
                          : "border-gray-100 opacity-60"
                      }
                    `}
                      style={{ animationDelay: `${subIndex * 100}ms` }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-xs font-medium text-gray-700">
                          {subPhase.title}
                          {subPhase.time && (
                            <span className="ml-1 text-gray-500">
                              ({subPhase.time} د)
                            </span>
                          )}
                        </div>

                        {subPhaseStatus === PhaseStatus.COMPLETED_SUBPHASE && (
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

                        {/* Next subphase indicator with animation */}
                        {isNextInSequence && !breakTime && !isStarted && (
                          <div
                            onClick={() =>
                              handleStartNextPhase(`${phase.id}_${subPhase.id}`)
                            }
                            className="w-5 h-5 bg-blue-500 rounded-full cursor-pointer flex items-center justify-center shadow-md transform transition-transform duration-300 hover:scale-110"
                          >
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

// Results button with pulsing animation
const ResultsButton = memo(({ onClick }) => (
  <div className="mt-6 bg-white rounded-xl shadow-md border border-green-200 p-5 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center rounded-full border border-green-200">
      <svg
        className="w-8 h-8 text-green-600"
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
    </div>

    <h3 className="text-lg font-bold text-gray-800 mb-2">
      اكتملت جميع المراحل بنجاح!
    </h3>
    <p className="text-gray-600 mb-4">
      لقد أكملت جميع مراحل الاختبار، يمكنك الآن عرض النتيجة النهائية
    </p>

    <button
      onClick={onClick}
      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2.5 rounded-lg text-base font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2 mx-auto"
    >
      <span>اظهار النتيجة</span>
      <svg
        className="w-5 h-5 animate-bounce"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
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
));

// Format time consistently
const formatTime = (seconds) => {
  if (seconds === undefined || seconds === null) return "--:--";
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

// Main component
const ExamPhases = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject");

  // Add mounted state to prevent Redux access before hydration
  const [mounted, setMounted] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [phasesData, setPhasesData] = useState([]);

  // First mount effect - without Redux
  useEffect(() => {
    // Check for reload - without needing Redux
    const wasReloaded = localStorage.getItem("_wasReloaded");
    if (wasReloaded === "true") {
      // Clear the flag
      localStorage.removeItem("_wasReloaded");
      // Redirect immediately to landing page
      return;
    }

    // Set mounted state to true
    setMounted(true);
  }, [router]);

  // Add enter animation after component mounts
  useEffect(() => {
    if (mounted) {
      // Use a short timeout to ensure the animation runs after mount
      const timer = setTimeout(() => {
        setPageLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  // Render placeholder while waiting for client-side hydration
  if (!mounted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  // This is a component that only runs after the page is mounted
  // and Redux is available
  return (
    <div
      className={`transition-opacity duration-500 ${
        pageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <MountedPhasesContent subject={subject} />
    </div>
  );
};

// This component only runs after mounting, so Redux is safe to use
function MountedPhasesContent({ subject }) {
  const router = useRouter();
  const dispatch = useDispatch();

  // Get exam state from Redux
  const examState = useSelector((state) => state.exam);
  const {
    completedPhases,
    completedSubPhases,
    currentSubPhase,
    currentPhase,
    breakTime,
    activeExam,
    examCompleted,
    phases,
  } = examState;

  // Use refs to avoid stale closures in event handlers and timers
  const timerRef = useRef(null);
  const navigatingRef = useRef(false);

  const [phasesData, setPhasesData] = useState([]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPhaseTimeRemaining, setCurrentPhaseTimeRemaining] =
    useState(null);
  const [showResultsButton, setShowResultsButton] = useState(false);
  const [phaseInProgress, setPhaseInProgress] = useState(false);
  const [nextPhaseTitle, setNextPhaseTitle] = useState("");
  const [pageAnimated, setPageAnimated] = useState(false);

  // Exit confirmation dialog
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [exitDestination, setExitDestination] = useState("/");
  const [exitMessage, setExitMessage] = useState("");

  // Memoized functions for optimal performance
  const getPhaseStatus = useCallback(
    (index) => {
      if (index < currentPhaseIndex) return PhaseStatus.COMPLETED;
      if (index === currentPhaseIndex) return PhaseStatus.ACTIVE;
      return PhaseStatus.LOCKED;
    },
    [currentPhaseIndex]
  );

  // Memoize subphase status calculation to prevent unnecessary recalculations
  const getSubPhaseStatus = useCallback(
    (phaseId, subPhaseId) => {
      // Get completed sub-phases for this phase
      const completedSubs = completedSubPhases[phaseId] || [];

      // Check if sub-phase is completed
      if (completedSubs.includes(subPhaseId)) {
        return PhaseStatus.COMPLETED_SUBPHASE;
      }

      // Check if this is the current active sub-phase
      if (
        getPhaseStatus(phasesData.findIndex((p) => p.id === phaseId)) ===
          PhaseStatus.ACTIVE &&
        (!completedSubs.length || currentSubPhase === subPhaseId)
      ) {
        return PhaseStatus.CURRENT_SUBPHASE;
      }

      // It's a future sub-phase
      return PhaseStatus.PENDING_SUBPHASE;
    },
    [completedSubPhases, currentSubPhase, getPhaseStatus, phasesData]
  );

  // Memoize getNextPhaseId to avoid recalculation on every render
  const getNextPhaseId = useCallback(() => {
    // If all phases are completed, return null
    if (currentPhaseIndex >= phasesData.length) {
      return null;
    }

    const currentPhaseObj = phasesData[currentPhaseIndex];
    if (!currentPhaseObj) return null;

    // Check if this phase has sub-phases
    if (currentPhaseObj.subPhases) {
      const completedSubs = completedSubPhases[currentPhaseObj.id] || [];

      // Find the first uncompleted sub-phase in sequence
      for (let i = 0; i < currentPhaseObj.subPhases.length; i++) {
        const subPhase = currentPhaseObj.subPhases[i];
        if (!completedSubs.includes(subPhase.id)) {
          return `${currentPhaseObj.id}_${subPhase.id}`;
        }
      }

      // All sub-phases completed, move to next main phase
      if (currentPhaseIndex + 1 < phasesData.length) {
        const nextPhase = phasesData[currentPhaseIndex + 1];

        // If next phase has sub-phases, start with first sub-phase
        if (nextPhase.subPhases && nextPhase.subPhases.length > 0) {
          return `${nextPhase.id}_${nextPhase.subPhases[0].id}`;
        }

        // Otherwise return the phase itself
        return nextPhase.id;
      }
    } else {
      // Current phase doesn't have sub-phases
      if (!completedPhases.includes(currentPhaseObj.id)) {
        return currentPhaseObj.id;
      }

      // If current phase is completed, move to next phase
      if (currentPhaseIndex + 1 < phasesData.length) {
        const nextPhase = phasesData[currentPhaseIndex + 1];

        // If next phase has sub-phases, start with first sub-phase
        if (nextPhase.subPhases && nextPhase.subPhases.length > 0) {
          return `${nextPhase.id}_${nextPhase.subPhases[0].id}`;
        }

        // Otherwise return the phase itself
        return nextPhase.id;
      }
    }

    return null;
  }, [currentPhaseIndex, completedPhases, completedSubPhases, phasesData]);

  const getCurrentPhaseId = useCallback(() => {
    if (!currentPhase) return null;

    return currentSubPhase
      ? `${currentPhase}_${currentSubPhase}`
      : currentPhase;
  }, [currentPhase, currentSubPhase]);

  // Function to get the time duration for a phase
  const getPhaseDuration = useCallback(
    (phaseId) => {
      if (phaseId.includes("_")) {
        const [mainPhase, subPhase] = phaseId.split("_");
        const mainPhaseObj = phasesData.find((p) => p.id === mainPhase);
        const subPhaseObj = mainPhaseObj?.subPhases?.find(
          (s) => s.id === subPhase
        );

        // Return the subphase time in minutes, convert to seconds
        return subPhaseObj && subPhaseObj.time ? subPhaseObj.time * 60 : 600; // Default to 10 minutes if not found
      } else {
        const phaseObj = phasesData.find((p) => p.id === phaseId);

        // Return the phase time in minutes, convert to seconds
        return phaseObj && phaseObj.time ? phaseObj.time * 60 : 600; // Default to 10 minutes if not found
      }
    },
    [phasesData]
  );

  // Handle exit confirmation - memoized to prevent recreating on every render
  const handleExit = useCallback(
    (destination = "/", message) => {
      if (navigatingRef.current) return;

      // If exam is in progress and not completed, show confirmation
      if (activeExam && !examCompleted && completedPhases.length > 0) {
        setExitDestination(destination);
        setExitMessage(
          message ||
            "سيتم فقدان تقدمك في الاختبار ولا يمكن استعادته. هل تريد الخروج بالفعل؟"
        );
        setShowExitDialog(true);
        return;
      }

      // Otherwise navigate directly
      router.push(destination);
    },
    [activeExam, examCompleted, completedPhases, router]
  );

  // Confirm exit
  const confirmExit = useCallback(() => {
    setShowExitDialog(false);
    navigatingRef.current = true;
    router.push(exitDestination);
  }, [exitDestination, router]);

  // Cancel exit
  const cancelExit = useCallback(() => {
    setShowExitDialog(false);
  }, []);

  // Redirect if no active exam
  useEffect(() => {
    if (!activeExam) {
      router.replace("/");
      return;
    }

    // Set phases based on subject with animation delay
    const currentSubject = activeExam?.subject || subject;
    setPhasesData(currentSubject === "mail" ? mailPhases : educationPhases);

    // Use a short timeout to allow for transition animation
    setTimeout(() => {
      setLoading(false);
      setPageAnimated(true);
    }, 300);
  }, [activeExam, router, subject]);

  useEffect(() => {
    // Set current phase index based on completed phases
    if (completedPhases && completedPhases.length > 0) {
      setCurrentPhaseIndex(completedPhases.length);

      // Check if all phases are completed - Only show results button if ALL phases are completed
      if (completedPhases.length >= phasesData.length) {
        setShowResultsButton(true);
      } else {
        setShowResultsButton(false);
      }
    }
  }, [completedPhases, phasesData]);

  // Break timer effect and navigation to next phase
  useEffect(() => {
    if (!breakTime) {
      return;
    }

    // Set the next phase title first
    const nextId = getNextPhaseId();
    if (nextId) {
      if (nextId.includes("_")) {
        const [mainId, subId] = nextId.split("_");
        const mainPhase = phasesData.find((p) => p.id === mainId);
        const subPhase = mainPhase?.subPhases?.find((s) => s.id === subId);
        if (mainPhase && subPhase) {
          setNextPhaseTitle(`${mainPhase.title} - ${subPhase.title}`);
        }
      } else {
        const phase = phasesData.find((p) => p.id === nextId);
        if (phase) {
          setNextPhaseTitle(phase.title);
        }
      }
    }

    // Calculate break time remaining
    const elapsedTime = Math.floor((Date.now() - breakTime.startTime) / 1000);
    const timeLeft = Math.max(0, breakTime.duration - elapsedTime);
    setBreakTimeRemaining(timeLeft);

    // If break is already over, navigate to next phase
    if (timeLeft <= 0) {
      setTimeout(() => {
        dispatch(endBreak());
        const nextPhaseId = getNextPhaseId();
        if (nextPhaseId) {
          handleStartNextPhase(nextPhaseId);
        }
      }, 0);
      return;
    }

    // Otherwise, start break timer countdown
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setBreakTimeRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          // End break and start next phase
          setTimeout(() => {
            dispatch(endBreak());
            const nextPhaseId = getNextPhaseId();
            if (nextPhaseId) {
              handleStartNextPhase(nextPhaseId);
            }
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [breakTime, dispatch, phasesData, getNextPhaseId]);

  // Calculate remaining time for current active phase (if any)
  useEffect(() => {
    if (!currentPhase) {
      setPhaseInProgress(false);
      return;
    }

    // Get the current active phase ID
    let activePhaseId = currentPhase;
    if (currentSubPhase) {
      activePhaseId = `${currentPhase}_${currentSubPhase}`;
    }

    const phaseState = phases[activePhaseId];

    if (phaseState && !phaseState.completed) {
      setPhaseInProgress(true);

      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - phaseState.startTime) / 1000);
        const remaining = Math.max(0, phaseState.duration - elapsedSeconds);

        setCurrentPhaseTimeRemaining(remaining);

        if (remaining <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setPhaseInProgress(false);
          setCurrentPhaseTimeRemaining(0);
        }
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    } else {
      setPhaseInProgress(false);
      setCurrentPhaseTimeRemaining(null);
    }
  }, [currentPhase, currentSubPhase, phases]);

  // Expanded state for details sections
  const [expanded, setExpanded] = useState({});

  // Toggle section expansion
  const toggleSection = useCallback((sectionId) => {
    setExpanded((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  const handleStartPhase = () => {
    const nextPhaseId = getNextPhaseId();
    if (nextPhaseId) {
      handleStartNextPhase(nextPhaseId);
    }
  };

  const handleResumePhase = () => {
    const currentPhaseId = getCurrentPhaseId();
    if (currentPhaseId) {
      router.replace(`/exams/questions?phase=${currentPhaseId}`);
    }
  };

  const handleStartNextPhase = useCallback(
    (nextPhaseId) => {
      if (!nextPhaseId) return;

      // Show loading before starting
      setLoading(true);

      setTimeout(() => {
        // Get the duration for this phase in seconds
        const phaseDuration = getPhaseDuration(nextPhaseId);

        // Check if it's a sub-phase
        if (nextPhaseId.includes("_")) {
          const [mainPhase, subPhase] = nextPhaseId.split("_");

          // Start the phase with the specific sub-phase and its duration
          dispatch(
            startPhase({
              phaseId: mainPhase,
              subPhase: subPhase,
              duration: phaseDuration, // Use specific phase duration
            })
          );
        } else {
          // Start a regular phase with its duration
          dispatch(
            startPhase({
              phaseId: nextPhaseId,
              duration: phaseDuration, // Use specific phase duration
            })
          );
        }

        // Navigate to questions page with animation first
        setTimeout(() => {
          router.replace(`/exams/questions?phase=${nextPhaseId}`);
        }, 300);
      }, 0);
    },
    [dispatch, getPhaseDuration, router]
  );

  const handleShowResults = useCallback(() => {
    // Show loading with animation before generating results
    setLoading(true);

    // Calculate actual scores from the answers
    const scores = calculateActualScores(examState);

    // Create result object
    const results = {
      totalScore: scores.totalScore,
      phaseScores: scores.phaseScores,
      details: scores.details,
      completedAt: new Date().toISOString(),
      userName: activeExam.userName,
      subject: activeExam.subject,
    };

    // Store results in Redux
    dispatch(setExamResults(results));

    // Mark exam as completed
    dispatch(completeExam());

    // Navigate to results page with transition
    setTimeout(() => {
      router.replace("/exams/results");
    }, 500);
  }, [activeExam, dispatch, examState, router]);

  // Check if phase is already started
  const isPhaseStarted = useCallback(
    (phaseId) => {
      return currentPhase === phaseId && phaseInProgress;
    },
    [currentPhase, phaseInProgress]
  );

  // Display loading state
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`max-w-3xl mx-auto px-2 sm:px-4 py-2 sm:py-4 mt-0 transition-all duration-500 
      ${
        pageAnimated
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform translate-y-8"
      }`}
    >
      {/* Reload Warning Banner */}
      <div className="bg-amber-50 border-r-4 border-amber-500 p-4 mb-4 rounded-md shadow-sm animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex">
          <div className="flex-shrink-0 ml-3">
            <svg
              className="h-5 w-5 text-amber-500 animate-pulse"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-amber-800">
              <strong className="font-medium">تنبيه:</strong> لا تقم بتحديث
              الصفحة أو الضغط على F5 أثناء الاختبار. سيؤدي ذلك إلى فقدان تقدمك
              والعودة للصفحة الرئيسية.
            </p>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <ExitConfirmationDialog
        isOpen={showExitDialog}
        onCancel={cancelExit}
        onConfirm={confirmExit}
        message={exitMessage}
      />

      {/* Break Timer - Only shown during break time */}
      {breakTime && nextPhaseTitle && (
        <BreakTimer
          remainingTime={breakTimeRemaining}
          nextPhaseTitle={nextPhaseTitle}
          onStartNow={() => {
            dispatch(endBreak());
            const nextPhaseId = getNextPhaseId();
            if (nextPhaseId) {
              handleStartNextPhase(nextPhaseId);
            }
          }}
        />
      )}

      {/* Header */}
      <div className="bg-white rounded-xl shadow-md shadow-indigo-200/20 mb-4 sm:mb-6 overflow-hidden animate-in slide-in-from-top-4 duration-700">
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center text-2xl sm:text-3xl border border-blue-200">
                {activeExam?.subject === "mail" ? "📬" : "📚"}
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  {activeExam?.subject === "mail"
                    ? "اختبار البريد المصري"
                    : "اختبار التربية"}
                </h1>
                <p className="text-sm text-gray-600">
                  {phasesData.length} مراحل •{" "}
                  {phasesData.reduce((acc, phase) => acc + phase.questions, 0)}{" "}
                  سؤال
                </p>
              </div>
            </div>

            <div className="mt-2 sm:mt-0 sm:ml-auto flex items-center gap-2">
              <div className="bg-blue-50 px-3 py-1.5 rounded-lg text-blue-700 text-sm flex items-center gap-1.5">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-medium">{activeExam?.userName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-3 bg-gradient-to-r from-white to-gray-50">
          <div className="flex justify-between items-center text-xs text-gray-600 mb-1.5">
            <span>تقدم الاختبار</span>
            <span className="font-medium">
              {Math.round((currentPhaseIndex / phasesData.length) * 100)}%
            </span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out-expo"
              style={{
                width: `${(currentPhaseIndex / phasesData.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Phases Grid with staggered animations */}
      <div className="space-y-3">
        {phasesData.map((phase, index) => {
          const status = getPhaseStatus(index);
          const isStarted = isPhaseStarted(phase.id);
          const isActive = status === PhaseStatus.ACTIVE;

          // Apply a subtle staggered animation based on index
          const animationDelay = index * 100;

          return (
            <div
              key={phase.id}
              className="transform transition-all duration-500"
              style={{
                animationDelay: `${animationDelay}ms`,
                opacity: pageAnimated ? 1 : 0,
                transform: pageAnimated ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <PhaseCard
                phase={phase}
                status={status}
                isStarted={isStarted}
                onStartPhase={handleStartPhase}
                onResumePhase={handleResumePhase}
                currentPhaseTimeRemaining={currentPhaseTimeRemaining}
                expanded={expanded}
                toggleSection={toggleSection}
                completedSubPhases={completedSubPhases}
                getSubPhaseStatus={getSubPhaseStatus}
                formatTime={formatTime}
                handleStartNextPhase={handleStartNextPhase}
                breakTime={breakTime}
                isActivePhase={isActive}
              />
            </div>
          );
        })}
      </div>

      {/* Results Button - Show only if all phases are completed */}
      {showResultsButton && <ResultsButton onClick={handleShowResults} />}
    </div>
  );
}

// Calculate actual scores based on answers by comparing with correct answers
const calculateActualScores = (examState) => {
  const { phases, activeExam } = examState;
  const subject = activeExam?.subject || "mail";

  // Calculate score for each phase
  const phaseScores = {};

  // For weighted average calculation
  let totalWeightedScore = 0;
  let totalWeight = 0;

  // For debugging
  console.log("Calculating actual scores for phases:", Object.keys(phases));

  Object.entries(phases).forEach(([phaseId, phaseData]) => {
    if (!phaseData.completed) return;

    // Get the answers for this phase
    const phaseAnswers = phaseData.answers || {};

    // Skip if no answers
    const questionCount = Object.keys(phaseAnswers).length;
    if (questionCount === 0) return;

    // Use the utility function to calculate the correct score
    const scoreResult = calculatePhaseScore(subject, phaseId, phaseAnswers);

    // Log raw score result
    console.log(
      `Phase ${phaseId} raw score result:`,
      JSON.stringify(scoreResult)
    );

    // IMPORTANT: Use the calculated percentage directly, with no modifications
    phaseScores[phaseId] = scoreResult.percentage;

    // Log the score we're using for this phase
    console.log(`Using score for ${phaseId}: ${phaseScores[phaseId]}`);

    // Add to weighted average calculation
    totalWeightedScore += phaseScores[phaseId] * questionCount;
    totalWeight += questionCount;
  });

  // Calculate weighted average for final score
  const finalScore =
    totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;

  // Log final calculations in detail
  console.log("Final score calculation details:", {
    individualPhaseScores: JSON.stringify(phaseScores),
    totalWeightedScore,
    totalWeight,
    finalScore,
  });

  return {
    totalScore: finalScore,
    phaseScores,
    details: {
      totalCorrect: 0,
      totalQuestions: totalWeight,
    },
  };
};
export default ExamPhases;
