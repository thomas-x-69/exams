// store/provider.js
"use client";

import { Provider } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { store } from "./store";

export function Providers({ children }) {
  const [mounted, setMounted] = useState(false);
  const storeRef = useRef(store);

  // Wait until after client-side hydration to mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use the suppressHydrationWarning on the div to prevent Grammarly issues
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
