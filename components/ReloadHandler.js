// components/ReloadHandler.js
"use client";

import { useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

const ReloadHandler = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Check for reload on mount
  const checkReload = useCallback(() => {
    const isExamPage =
      pathname.startsWith("/exams/") &&
      !pathname.includes("/instructions") &&
      !pathname.includes("/results");

    if (isExamPage) {
      const wasReloaded = localStorage.getItem("_wasReloaded");

      if (wasReloaded === "true") {
        // Clear the flag and redirect
        localStorage.removeItem("_wasReloaded");
        router.replace("/");
        return true;
      }
    }
    return false;
  }, [pathname, router]);

  // Setup reload detection
  useEffect(() => {
    // First check if this is a reload
    if (checkReload()) return;

    // Then set up the beforeunload handler
    const handleBeforeUnload = () => {
      if (
        pathname.startsWith("/exams/") &&
        !pathname.includes("/instructions") &&
        !pathname.includes("/results")
      ) {
        localStorage.setItem("_wasReloaded", "true");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname, checkReload]);

  // This component doesn't render anything
  return null;
};

export default ReloadHandler;
