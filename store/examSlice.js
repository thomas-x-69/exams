// store/examSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeExam: null,
  phases: {},
  subPhases: {
    language: ["arabic", "english"],
    knowledge: ["iq", "general", "it"],
  },
  completedPhases: [],
  completedSubPhases: {},
  currentSubPhase: null,
  currentPhase: null,
  examData: {}, // Only for current session, no persistence
  breakTime: null,
  examCompleted: false,
  currentResult: null,
  // Access control flags - enhanced with more detailed comments
  canAccessPhases: false, // Can only access phases page after instructions or completing a question
  activeQuestionPhase: null, // The currently active question phase (if any)
  hasExamStarted: false, // Whether the exam has officially started (after instructions)
  lastNavigationTimestamp: null, // Tracks when last navigation occurred to prevent URL manipulation
};

export const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    // Initialize a new exam
    initExam: (state, action) => {
      const { subject, userName, organizationCode } = action.payload;
      state.activeExam = {
        subject,
        userName,
        organizationCode,
        startTime: Date.now(),
      };
      // Reset state for new exam
      state.completedPhases = [];
      state.completedSubPhases = {};
      state.currentSubPhase = null;
      state.currentPhase = null;
      state.examCompleted = false;
      state.breakTime = null;
      state.currentResult = null;
      state.examData = {}; // Clear all question data

      // Reset access control flags
      state.canAccessPhases = true; // Allow access to phases page after init
      state.activeQuestionPhase = null; // No active question phase yet
      state.hasExamStarted = true; // Mark exam as started
      state.lastNavigationTimestamp = Date.now(); // Set navigation timestamp

      // Ensure subPhases is properly initialized
      state.subPhases = {
        language: ["arabic", "english"],
        knowledge: ["iq", "general", "it"],
      };
    },

    // Start a phase with timer
    startPhase: (state, action) => {
      const { phaseId, subPhase = null, duration = 60 } = action.payload;

      if (!phaseId) return; // Guard against undefined phaseId

      const fullPhaseId = subPhase ? `${phaseId}_${subPhase}` : phaseId;

      // Initialize phases object if needed
      if (!state.phases) {
        state.phases = {};
      }

      state.phases[fullPhaseId] = {
        startTime: Date.now(),
        duration,
        answers: {},
        completed: false,
      };

      state.currentPhase = phaseId;

      if (subPhase) {
        state.currentSubPhase = subPhase;
      }

      // Set access control flags
      state.activeQuestionPhase = fullPhaseId; // Mark this phase as active
      state.canAccessPhases = false; // Restrict access to phases page while in a question
      state.lastNavigationTimestamp = Date.now(); // Update navigation timestamp
    },

    // Save answers for a phase
    saveAnswers: (state, action) => {
      const { phaseId, questionId, answerId } = action.payload;

      if (!phaseId || !questionId || answerId === undefined) return; // Guard against missing data

      // Initialize phases if needed
      if (!state.phases) {
        state.phases = {};
      }

      if (state.phases[phaseId]) {
        if (!state.phases[phaseId].answers) {
          state.phases[phaseId].answers = {};
        }

        state.phases[phaseId].answers = {
          ...state.phases[phaseId].answers,
          [questionId]: answerId,
        };
      }
    },

    // Complete a phase
    completePhase: (state, action) => {
      try {
        const { phaseId } = action.payload;

        if (!phaseId) return;

        // Log for debugging
        console.log(`Completing phase: ${phaseId}`);

        // Make sure phases object exists
        if (!state.phases) {
          state.phases = {};
        }

        if (state.phases[phaseId]) {
          state.phases[phaseId].completed = true;
          state.phases[phaseId].endTime = Date.now();

          // Add logging for behavioral phase
          if (phaseId === "behavioral") {
            console.log(
              "Behavioral phase completion data:",
              state.phases[phaseId]
            );
          }

          // Handle main phase vs sub-phase completion
          if (phaseId && phaseId.includes("_")) {
            // This is a sub-phase
            const parts = phaseId.split("_");
            if (parts.length !== 2) return; // Invalid format

            const mainPhase = parts[0];
            const subPhase = parts[1];

            if (!mainPhase || !subPhase) return; // Guard against bad data

            // Initialize completedSubPhases for this main phase if needed
            if (!state.completedSubPhases[mainPhase]) {
              state.completedSubPhases[mainPhase] = [];
            }

            // Add to completed sub-phases
            if (!state.completedSubPhases[mainPhase].includes(subPhase)) {
              state.completedSubPhases[mainPhase].push(subPhase);
            }

            // Check if all sub-phases of this main phase are completed
            const allSubPhases = state.subPhases[mainPhase] || [];
            const completedSubPhases =
              state.completedSubPhases[mainPhase] || [];

            if (
              allSubPhases.length > 0 &&
              completedSubPhases.length === allSubPhases.length
            ) {
              // All sub-phases completed, mark main phase as completed
              if (!state.completedPhases.includes(mainPhase)) {
                state.completedPhases.push(mainPhase);
              }
            }
          } else {
            // This is a main phase without sub-phases
            if (!state.completedPhases.includes(phaseId)) {
              state.completedPhases.push(phaseId);
            }
          }

          // Update access control flags
          state.activeQuestionPhase = null; // No active question phase now
          state.canAccessPhases = true; // Allow access to phases page after completing a question
          state.lastNavigationTimestamp = Date.now(); // Update navigation timestamp
        }
      } catch (err) {
        console.error("Error in completePhase reducer:", err);
        // Don't throw the error - let Redux continue
      }
    },

    // Start break time
    startBreak: (state, action) => {
      const { duration = 120 } = action.payload;
      state.breakTime = {
        startTime: Date.now(),
        duration,
      };
      // During break, users should still be on phases page
      state.canAccessPhases = true;
      state.lastNavigationTimestamp = Date.now();
    },

    // End break time
    endBreak: (state) => {
      state.breakTime = null;
      state.lastNavigationTimestamp = Date.now();
    },

    // Set current question index
    setCurrentQuestion: (state, action) => {
      const { phaseId, index } = action.payload;

      if (!phaseId || index === undefined) return;

      if (!state.phases) {
        state.phases = {};
      }

      if (state.phases[phaseId]) {
        state.phases[phaseId].currentQuestion = index;
      }
    },

    // Store questions for a phase - only for current session, no persistence
    setQuestions: (state, action) => {
      const { phaseId, questions } = action.payload;

      if (!phaseId || !questions) return;

      if (!state.examData) {
        state.examData = {};
      }

      state.examData[phaseId] = {
        questions,
        timestamp: Date.now(),
      };
    },

    // Mark exam as completed
    completeExam: (state) => {
      state.examCompleted = true;
      state.breakTime = null;
      state.activeQuestionPhase = null; // Clear active question phase
      state.canAccessPhases = false; // No need to access phases after exam completion
      state.lastNavigationTimestamp = Date.now();

      // Store the current result in localStorage for history tracking
      try {
        if (state.currentResult && state.activeExam) {
          // Create a unique key with timestamp for this result
          const resultKey = `examResult_${Date.now()}_${
            state.activeExam.organizationCode
          }`;

          // Prepare the result data with all needed information
          const resultData = {
            ...state.currentResult,
            subject: state.activeExam.subject,
            userName: state.activeExam.userName,
            organizationCode: state.activeExam.organizationCode,
            completedAt: new Date().toISOString(),
          };

          // Store in localStorage
          localStorage.setItem(resultKey, JSON.stringify(resultData));
          console.log("Exam result saved to history:", resultKey);
        }
      } catch (error) {
        console.error("Failed to save exam result to history:", error);
      }

      // Clear stored questions when exam is completed
      state.examData = {};
    },

    // Set exam results
    setExamResults: (state, action) => {
      // Convert any string percentage values to numbers
      const results = action.payload;

      if (results.totalScore && typeof results.totalScore === "string") {
        results.totalScore = Number(results.totalScore);
      }

      if (results.phaseScores) {
        Object.keys(results.phaseScores).forEach((key) => {
          if (typeof results.phaseScores[key] === "string") {
            results.phaseScores[key] = Number(results.phaseScores[key]);
          }
        });

        // Ensure all phases have numeric scores (default to 0 if undefined)
        const requiredPhases = [
          "behavioral",
          "language",
          "knowledge",
          "education",
          "specialization",
        ];
        requiredPhases.forEach((phase) => {
          if (results.phaseScores[phase] === undefined) {
            results.phaseScores[phase] = 0;
          }
        });
      }

      // Log results for debugging
      console.log("Setting exam results:", JSON.stringify(results, null, 2));

      state.currentResult = results;
    },

    // Reset the entire exam state
    resetExam: () => initialState,

    // Clear questions for a specific phase
    clearPhaseQuestions: (state, action) => {
      const { phaseId } = action.payload;

      if (!phaseId || !state.examData) return;

      if (state.examData[phaseId]) {
        delete state.examData[phaseId];
      }
    },

    // Clear all questions
    clearAllQuestions: (state) => {
      state.examData = {};
    },

    // Manually control access to pages
    setPageAccess: (state, action) => {
      const { canAccessPhases, activeQuestionPhase, hasExamStarted } =
        action.payload;

      if (canAccessPhases !== undefined) {
        state.canAccessPhases = canAccessPhases;
      }

      if (activeQuestionPhase !== undefined) {
        state.activeQuestionPhase = activeQuestionPhase;
      }

      if (hasExamStarted !== undefined) {
        state.hasExamStarted = hasExamStarted;
      }

      state.lastNavigationTimestamp = Date.now();
    },

    // Recovery action to restore access if user somehow gets into an invalid state
    recoverExamAccess: (state) => {
      // This action checks localStorage for exam data and restores access if valid data exists
      try {
        const activeExam = localStorage.getItem("activeExam") === "true";

        if (activeExam && !state.hasExamStarted) {
          const subject = localStorage.getItem("currentExamSubject");
          const userName = localStorage.getItem("currentExamUser");
          const orgCode = localStorage.getItem("currentExamOrgCode");

          if (subject && userName && orgCode) {
            state.activeExam = {
              subject,
              userName,
              organizationCode: orgCode,
              startTime: Date.now(),
            };
            state.hasExamStarted = true;
            state.canAccessPhases = true;
            console.log("Recovered exam access from localStorage data");
          }
        }
      } catch (error) {
        console.error("Error in exam access recovery:", error);
      }
    },
  },
});

export const {
  initExam,
  startPhase,
  saveAnswers,
  completePhase,
  startBreak,
  endBreak,
  setCurrentQuestion,
  setQuestions,
  completeExam,
  setExamResults,
  resetExam,
  clearPhaseQuestions,
  clearAllQuestions,
  setPageAccess,
  recoverExamAccess,
} = examSlice.actions;

export default examSlice.reducer;
