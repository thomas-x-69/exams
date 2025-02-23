import { createSlice } from "@reduxjs/toolkit";

const examSlice = createSlice({
  name: "exam",
  initialState: {
    currentPhase: 0,
    currentQuestion: 0,
    answers: {},
    timeRemaining: 600,
    examType: "",
    userData: {
      name: "",
      organizationCode: "",
    },
  },
  reducers: {
    setCurrentPhase: (state, action) => {
      state.currentPhase = action.payload;
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    setAnswer: (state, action) => {
      state.answers[action.payload.questionId] = action.payload.answer;
    },
    setExamType: (state, action) => {
      state.examType = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    resetExam: (state) => {
      return examSlice.initialState;
    },
  },
});

export const {
  setCurrentPhase,
  setCurrentQuestion,
  setAnswer,
  setExamType,
  setUserData,
  resetExam,
} = examSlice.actions;

export default examSlice.reducer;
