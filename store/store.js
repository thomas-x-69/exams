// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import examReducer from "./examSlice";

export const store = configureStore({
  reducer: {
    exam: examReducer,
  },
  // Disable serializable check for handling Date objects
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
