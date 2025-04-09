// store/provider.js
"use client";

import { Provider } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { store } from "./store";
import { recoverExamAccess } from "./examSlice";

export function Providers({ children }) {
  const [mounted, setMounted] = useState(false);
  const storeRef = useRef(store);

  // Handle reload detection before Redux is available
  useEffect(() => {
    const pathname = window.location.pathname;
    const isExamPage =
      pathname.startsWith("/exams/") &&
      !pathname.includes("/instructions") &&
      !pathname.includes("/results");

    // Check if this page was reloaded during an exam
    if (isExamPage) {
      const wasReloaded = localStorage.getItem("_wasReloaded");

      if (wasReloaded === "true") {
        // Clear the flag and redirect
        localStorage.removeItem("_wasReloaded");
        window.location.href = "/";
        return;
      }
    }

    // Setup reload detection
    const handleBeforeUnload = () => {
      if (isExamPage) {
        localStorage.setItem("_wasReloaded", "true");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Try to recover exam access if needed
    try {
      storeRef.current.dispatch(recoverExamAccess());
    } catch (e) {
      console.error("Failed to recover exam access:", e);
    }

    // Wait until after client-side hydration to mount
    setMounted(true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Block navigation attempts via browser back/forward buttons during active phases
  useEffect(() => {
    if (!mounted) return;

    const handlePopState = (event) => {
      const state = storeRef.current.getState();
      const pathname = window.location.pathname;

      // If we're in an active question phase, prevent navigation
      if (state.exam.activeQuestionPhase && pathname !== "/exams/questions") {
        event.preventDefault();
        // Push back to questions page to override the navigation
        window.history.pushState(null, "", "/exams/questions");
        return;
      }

      // If we're during a break and trying to leave phases page
      if (state.exam.breakTime && pathname !== "/exams/phases") {
        event.preventDefault();
        // Push back to phases page to override the navigation
        window.history.pushState(null, "", "/exams/phases");
        return;
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [mounted]);

  // Use the suppressHydrationWarning on the div to prevent issues
  if (!mounted) {
    // During SSR and first client render, return a placeholder with the same structure
    // but with minimal content to avoid hydration mismatch
    return (
      <div suppressHydrationWarning>
        <div style={{ visibility: "hidden" }}>{children}</div>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning>
      <Provider store={storeRef.current}>{children}</Provider>
    </div>
  );
}
