// src/app/exams/phases/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  startPhase,
  endBreak,
  startBreak,
  completeExam,
  setExamResults,
} from "../../../../store/examSlice";

const PhaseStatus = {
  LOCKED: "locked",
  ACTIVE: "active",
  COMPLETED: "completed",
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
    time: 10, // 10 minutes
  },
  {
    id: "language",
    title: "الكفايات اللغوية",
    icon: "📝",
    gradient: "from-emerald-500/20 to-green-500/20",
    borderColor: "border-emerald-200",
    questions: 40,
    subPhases: [
      { id: "arabic", title: "اللغة العربية", questions: 20, time: 10 }, // 10 minutes
      { id: "english", title: "اللغة الإنجليزية", questions: 20, time: 10 }, // 10 minutes
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
      { id: "iq", title: "اختبار الذكاء", questions: 15, time: 5 }, // 5 minutes
      { id: "general", title: "معلومات عامة", questions: 15, time: 5 }, // 5 minutes
      { id: "it", title: "تكنولوجيا المعلومات", questions: 10, time: 5 }, // 5 minutes
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
    questions: 40,
    time: 10, // 10 minutes
  },
  {
    id: "language",
    title: "الكفايات اللغوية",
    icon: "📝",
    gradient: "from-emerald-500/20 to-green-500/20",
    borderColor: "border-emerald-200",
    questions: 40,
    subPhases: [
      { id: "arabic", title: "اللغة العربية", questions: 20, time: 10 }, // 10 minutes
      { id: "english", title: "اللغة الإنجليزية", questions: 20, time: 10 }, // 10 minutes
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
      { id: "iq", title: "اختبار الذكاء", questions: 15, time: 5 }, // 5 minutes
      { id: "general", title: "معلومات عامة", questions: 15, time: 5 }, // 5 minutes
      { id: "it", title: "تكنولوجيا المعلومات", questions: 10, time: 5 }, // 5 minutes
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

const ExamPhases = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject");
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

  const [phasesData, setPhasesData] = useState([]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPhaseTimeRemaining, setCurrentPhaseTimeRemaining] =
    useState(null);
  const [showResultsButton, setShowResultsButton] = useState(false);
  const [phaseInProgress, setPhaseInProgress] = useState(false);
  const [nextPhaseTitle, setNextPhaseTitle] = useState("");

  // Redirect if no active exam
  useEffect(() => {
    if (!activeExam) {
      router.push("/");
      return;
    }

    // Set phases based on subject
    const currentSubject = activeExam?.subject || subject;
    setPhasesData(currentSubject === "mail" ? mailPhases : educationPhases);
    setLoading(false);
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
    const timer = setInterval(() => {
      setBreakTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
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

    return () => clearInterval(timer);
  }, [breakTime, dispatch, phasesData]);

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

      const timer = setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - phaseState.startTime) / 1000);
        const remaining = Math.max(0, phaseState.duration - elapsedSeconds);

        setCurrentPhaseTimeRemaining(remaining);

        if (remaining <= 0) {
          clearInterval(timer);
          setPhaseInProgress(false);
          setCurrentPhaseTimeRemaining(0);
        }
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setPhaseInProgress(false);
      setCurrentPhaseTimeRemaining(null);
    }
  }, [currentPhase, currentSubPhase, phases]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (e) => {
      // If a phase was just completed, we should prevent going back
      if (completedPhases.length > 0 && !examCompleted) {
        router.push("/");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [completedPhases, examCompleted, router]);

  const getPhaseStatus = (index) => {
    if (index < currentPhaseIndex) return PhaseStatus.COMPLETED;
    if (index === currentPhaseIndex) return PhaseStatus.ACTIVE;
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
      getPhaseStatus(phasesData.findIndex((p) => p.id === phaseId)) ===
        PhaseStatus.ACTIVE &&
      (!completedSubs.length || currentSubPhase === subPhaseId)
    ) {
      return PhaseStatus.CURRENT_SUBPHASE;
    }

    // It's a future sub-phase
    return PhaseStatus.PENDING_SUBPHASE;
  };

  const getNextPhaseId = () => {
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
  };

  const getCurrentPhaseId = () => {
    if (!currentPhase) return null;

    return currentSubPhase
      ? `${currentPhase}_${currentSubPhase}`
      : currentPhase;
  };

  // Function to get the time duration for a phase
  const getPhaseDuration = (phaseId) => {
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
  };

  const handleStartPhase = () => {
    const nextPhaseId = getNextPhaseId();
    if (nextPhaseId) {
      handleStartNextPhase(nextPhaseId);
    }
  };

  const handleResumePhase = () => {
    const currentPhaseId = getCurrentPhaseId();
    if (currentPhaseId) {
      router.push(`/exams/questions?phase=${currentPhaseId}`);
    }
  };

  const handleStartNextPhase = (nextPhaseId) => {
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

      // Navigate to questions page
      router.push(`/exams/questions?phase=${nextPhaseId}`);
    }, 0);
  };

  const handleShowResults = () => {
    // Show loading before generating results
    setLoading(true);

    // Calculate actual scores from the answers
    const scores = calculateActualScores(examState);

    // Create result object
    const results = {
      totalScore: scores.totalScore,
      phaseScores: scores.phaseScores,
      completedAt: new Date().toISOString(),
      userName: activeExam.userName,
      subject: activeExam.subject,
    };

    // Store results in Redux
    dispatch(setExamResults(results));

    // Mark exam as completed
    dispatch(completeExam());

    // Navigate to results page
    router.push("/exams/results");
  };

  const formatTime = (seconds) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  // Check if phase is already started
  const isPhaseStarted = (phaseId) => {
    return currentPhase === phaseId && phaseInProgress;
  };

  // Display loading state
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-2 sm:py-4 mt-0">
      {/* Break Timer - Only shown during break time */}
      {breakTime && (
        <div className="bg-amber-50 rounded-xl shadow-sm border border-amber-200 mb-4 p-4 text-center">
          <div className="flex flex-col items-center">
            <div className="text-amber-800 font-bold mb-2">فترة راحة</div>
            <div className="text-2xl font-bold text-amber-700 mb-1">
              {formatTime(breakTimeRemaining)}
            </div>
            <div className="text-amber-600 text-sm">
              ستبدأ المرحلة التالية تلقائياً بعد انتهاء الوقت:
              <span className="font-bold mr-1">{nextPhaseTitle}</span>
            </div>
            <button
              onClick={() => {
                dispatch(endBreak());
                const nextPhaseId = getNextPhaseId();
                if (nextPhaseId) {
                  handleStartNextPhase(nextPhaseId);
                }
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
                {activeExam?.subject === "mail" ? "📬" : "📚"}
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900">
                  {activeExam?.subject === "mail"
                    ? "اختبار البريد المصري"
                    : "اختبار التربية"}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  {phasesData.length} مراحل -{" "}
                  {phasesData.reduce((acc, phase) => acc + phase.questions, 0)}{" "}
                  سؤال
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phases Grid */}
      <div className="space-y-3">
        {phasesData.map((phase, index) => {
          const status = getPhaseStatus(index);
          const isStarted = isPhaseStarted(phase.id);
          const isActive = status === PhaseStatus.ACTIVE;

          return (
            <div
              key={phase.id}
              className={`bg-white rounded-lg shadow-sm border transition-all duration-300 ${
                isActive
                  ? "border-blue-300 shadow-md shadow-blue-100/70 ring-2 ring-blue-200/40"
                  : status === PhaseStatus.COMPLETED
                  ? "border-green-200 bg-green-50/50"
                  : "border-gray-200 opacity-50"
              }`}
            >
              <div className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    {/* Phase Icon */}
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${
                        isActive
                          ? "bg-gradient-to-br from-blue-600/30 to-indigo-600/30"
                          : `bg-gradient-to-br ${phase.gradient}`
                      } flex items-center justify-center text-lg sm:text-xl border ${
                        isActive ? "border-blue-300" : phase.borderColor
                      }`}
                    >
                      {phase.icon}
                    </div>

                    {/* Phase Info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-sm sm:text-base font-bold ${
                          isActive ? "text-blue-700" : "text-gray-900"
                        } truncate`}
                      >
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
                      !breakTime &&
                      !phase.subPhases &&
                      !isStarted && (
                        <button
                          onClick={handleStartPhase}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center flex items-center"
                        >
                          ابدأ المرحلة
                        </button>
                      )}
                    {isStarted && (
                      <div className="flex items-center gap-2">
                        {/* Timer */}
                        <div className="bg-blue-100 px-2 py-1 rounded text-blue-700 text-xs font-medium">
                          {formatTime(currentPhaseTimeRemaining)}
                        </div>

                        {/* Resume Button */}
                        <button
                          onClick={handleResumePhase}
                          className="bg-green-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-green-700 transition-colors w-full sm:w-auto justify-center flex items-center"
                        >
                          استئناف
                        </button>
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

                {/* Sub-phases if any - only show them for the active phase */}
                {phase.subPhases && status === PhaseStatus.ACTIVE && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {phase.subPhases.map((subPhase, subIndex) => {
                      const subPhaseStatus = getSubPhaseStatus(
                        phase.id,
                        subPhase.id
                      );

                      // Get all completed sub-phases for this phase
                      const completedSubs = completedSubPhases[phase.id] || [];

                      // Determine if this is the next sub-phase in sequence
                      const isNextInSequence =
                        subIndex === completedSubs.length;

                      return (
                        <div
                          key={subPhase.id}
                          className={`bg-gray-50 rounded-md p-2 border transition-colors ${
                            subPhaseStatus === PhaseStatus.COMPLETED_SUBPHASE
                              ? "border-green-200 bg-green-50"
                              : isNextInSequence
                              ? "border-blue-200 bg-blue-50 shadow-sm"
                              : "border-gray-100 opacity-60"
                          }`}
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

                            {/* Only show clickable indicator for the next subphase in sequence */}
                            {isNextInSequence && !breakTime && !isStarted && (
                              <div
                                onClick={() =>
                                  handleStartNextPhase(
                                    `${phase.id}_${subPhase.id}`
                                  )
                                }
                                className="w-4 h-4 bg-blue-500 rounded-full cursor-pointer"
                              ></div>
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
              {Math.round((currentPhaseIndex / phasesData.length) * 100)}%
            </span>
            <div className="w-32 sm:w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{
                  width: `${(currentPhaseIndex / phasesData.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Button - Show if all phases are completed */}
      {showResultsButton && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-green-200 p-4 text-center">
          <p className="text-gray-700 mb-4">
            لقد أكملت جميع مراحل الاختبار، يمكنك الآن عرض النتيجة النهائية
          </p>
          <button
            onClick={handleShowResults}
            className="bg-green-600 text-white px-5 py-2 rounded-lg text-base font-medium hover:bg-green-700 transition-colors"
          >
            اظهار النتيجة
          </button>
        </div>
      )}
    </div>
  );
};

// Calculate actual scores based on answers
const calculateActualScores = (examState) => {
  const { phases } = examState;

  // Calculate score for each phase
  const phaseScores = {};
  let totalCorrect = 0;
  let totalQuestions = 0;

  Object.entries(phases).forEach(([phaseId, phaseData]) => {
    if (!phaseData.completed) return;

    // Count correct answers
    let phaseCorrect = 0;
    const phaseAnswers = phaseData.answers || {};

    // For now, simulate scores - in a real app, you'd compare with correct answers
    const answerKeys = Object.keys(phaseAnswers);
    totalQuestions += answerKeys.length;

    answerKeys.forEach((questionId) => {
      // Simulate 70-90% correct answers
      if (Math.random() > 0.3) {
        phaseCorrect++;
        totalCorrect++;
      }
    });

    // Calculate percentage score for this phase
    const phaseScore =
      answerKeys.length > 0
        ? Math.round((phaseCorrect / answerKeys.length) * 100)
        : 0;

    phaseScores[phaseId] = phaseScore;
  });

  // Calculate total score
  const totalScore =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return {
    totalScore,
    phaseScores,
  };
};

export default ExamPhases;
