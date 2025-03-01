"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ReloadHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if we're on an exam page
    if (pathname.startsWith("/exams/")) {
      // Check if this is a reload of an active exam
      const isActiveExam = localStorage.getItem("activeExam");

      if (isActiveExam === "true") {
        // Clear the flag
        localStorage.removeItem("activeExam");

        // Redirect to home
      }
    }
  }, [pathname, router]);

  return null; // This component doesn't render anything
}
