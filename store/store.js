// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import examReducer from "./examSlice";

// Function to load state from localStorage (client-side only)
const loadState = () => {
  if (typeof window === "undefined") {
    return undefined; // Return undefined during server-side rendering
  }

  try {
    const serializedState = localStorage.getItem("examState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Error loading state:", err);
    return undefined;
  }
};

// Function to save state to localStorage (client-side only)
const saveState = (state) => {
  if (typeof window === "undefined") {
    return; // Do nothing during server-side rendering
  }

  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("examState", serializedState);
  } catch (err) {
    console.error("Error saving state:", err);
  }
};

// Create the Redux store with the persisted state
const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    exam: examReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Subscribe to store changes to save state
store.subscribe(() => {
  saveState({
    exam: store.getState().exam,
  });
});

export default store;
