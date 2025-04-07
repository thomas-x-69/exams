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
    },

    // End break time
    endBreak: (state) => {
      state.breakTime = null;
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
} = examSlice.actions;

export default examSlice.reducer;
