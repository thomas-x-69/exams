// store/trainingSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isTrainingMode: false,
  trainingSession: null,
  trainingHistory: {},
  activePhase: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  showFeedback: false,
  trainingResults: null,
};

export const trainingSlice = createSlice({
  name: "training",
  initialState,
  reducers: {
    // Start a new training session
    startTrainingSession: (state, action) => {
      const { subject, phase, subPhase, questionCount } = action.payload;

      // Generate a unique session ID
      const sessionId = `training_${Date.now()}`;

      // Reset the state for a new training session
      state.isTrainingMode = true;
      state.trainingSession = {
        id: sessionId,
        subject,
        phase,
        subPhase,
        phaseId: subPhase ? `${phase}_${subPhase}` : phase,
        questionCount,
        startTime: Date.now(),
      };
      state.activePhase = subPhase ? `${phase}_${subPhase}` : phase;
      state.questions = [];
      state.currentQuestionIndex = 0;
      state.answers = {};
      state.showFeedback = false;
      state.trainingResults = null;
    },

    // Set questions for the training session
    setTrainingQuestions: (state, action) => {
      state.questions = action.payload;
    },

    // Set the current question index
    setCurrentQuestionIndex: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },

    // Record an answer for the current question
    answerQuestion: (state, action) => {
      const { questionId, selectedAnswer, isCorrect } = action.payload;
      const currentQuestion = state.questions[state.currentQuestionIndex];

      if (currentQuestion && questionId) {
        state.answers[questionId] = {
          selectedAnswer,
          isCorrect,
          question: currentQuestion.text,
          options: currentQuestion.options,
          correctAnswer: currentQuestion.correctAnswer,
          timestamp: Date.now(),
        };

        // Show feedback after answering
        state.showFeedback = true;
      }
    },

    // Reset feedback state (before moving to next question)
    resetFeedback: (state) => {
      state.showFeedback = false;
    },

    // Complete the training session and record results
    completeTrainingSession: (state) => {
      if (!state.trainingSession) return;

      // Calculate results
      const correctAnswers = Object.values(state.answers).filter(
        (answer) => answer.isCorrect
      ).length;
      const totalAnswers = Object.keys(state.answers).length;
      const score =
        totalAnswers > 0
          ? Math.round((correctAnswers / totalAnswers) * 100)
          : 0;

      // Record end time
      const endTime = Date.now();
      const duration = Math.floor(
        (endTime - state.trainingSession.startTime) / 1000
      );

      // Prepare results
      const results = {
        sessionId: state.trainingSession.id,
        subject: state.trainingSession.subject,
        phase: state.trainingSession.phase,
        subPhase: state.trainingSession.subPhase,
        phaseId: state.trainingSession.phaseId,
        questionsCount: totalAnswers,
        correctCount: correctAnswers,
        score,
        duration,
        startTime: state.trainingSession.startTime,
        endTime,
        timestamp: Date.now(),
      };

      // Save results
      state.trainingResults = results;

      // Add to history
      state.trainingHistory[state.trainingSession.id] = {
        ...results,
        answers: state.answers,
      };

      // Reset training mode
      state.isTrainingMode = false;
    },

    // Reset the training state completely
    resetTrainingState: (state) => {
      return initialState;
    },
  },
});

export const {
  startTrainingSession,
  setTrainingQuestions,
  setCurrentQuestionIndex,
  answerQuestion,
  resetFeedback,
  completeTrainingSession,
  resetTrainingState,
} = trainingSlice.actions;

export default trainingSlice.reducer;
