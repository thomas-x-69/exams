// src/components/AdSenseScript.js
"use client";

import { useEffect } from "react";

export default function AdSenseScript() {
  useEffect(() => {
    // Create script asynchronously
    const script = document.createElement("script");
    script.src = "";
    script.async = true;
    script.crossOrigin = "anonymous";

    // Add to DOM
    document.head.appendChild(script);

    // Clean up on unmount
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null; // This component doesn't render anything
}
