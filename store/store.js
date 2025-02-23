import { configureStore } from "@reduxjs/toolkit";
import examReducer from "./examSlice";

export const store = configureStore({
  reducer: {
    exam: examReducer,
  },
});
