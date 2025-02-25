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
  examData: {},
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
    },

    // Start a phase with timer
    startPhase: (state, action) => {
      const { phaseId, subPhase = null, duration = 600 } = action.payload;
      const fullPhaseId = subPhase ? `${phaseId}_${subPhase}` : phaseId;

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
      if (state.phases[phaseId]) {
        state.phases[phaseId].answers = {
          ...state.phases[phaseId].answers,
          [questionId]: answerId,
        };
      }
    },

    // Complete a phase
    completePhase: (state, action) => {
      const { phaseId } = action.payload;

      if (state.phases[phaseId]) {
        state.phases[phaseId].completed = true;
        state.phases[phaseId].endTime = Date.now();

        // Handle main phase vs sub-phase completion
        if (phaseId.includes("_")) {
          // This is a sub-phase
          const [mainPhase, subPhase] = phaseId.split("_");

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
          const completedSubPhases = state.completedSubPhases[mainPhase] || [];

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
      if (state.phases[phaseId]) {
        state.phases[phaseId].currentQuestion = index;
      }
    },

    // Store questions for a phase
    setQuestions: (state, action) => {
      const { phaseId, questions } = action.payload;
      state.examData[phaseId] = { questions };
    },

    // Mark exam as completed
    completeExam: (state) => {
      state.examCompleted = true;
      state.breakTime = null;
    },

    // Set exam results
    setExamResults: (state, action) => {
      state.currentResult = action.payload;
    },

    // Reset the entire exam state
    resetExam: () => initialState,
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
} = examSlice.actions;

export default examSlice.reducer;
