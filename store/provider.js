// store/provider.js
"use client";

import { Provider } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { store } from "./store";

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

    // Wait until after client-side hydration to mount
    setMounted(true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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
