// src/app/exams/layout.js
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, useState, useCallback, memo } from "react";

// Memoized background component to prevent unnecessary re-renders
const ExamBackground = memo(() => (
  <>
    {/* Background Base Layer */}
    <div className="fixed inset-0 pointer-events-none">
      {/* Main Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-[#f4f6f8] to-slate-100"></div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
            linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      ></div>

      {/* Subtle Dot Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(rgba(148, 163, 184, 0.15) 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
      ></div>

      {/* Very Subtle Color Orbs */}
      <div className="absolute top-0 -right-1/4 w-[800px] h-[800px] bg-blue-100/20 rounded-full blur-3xl"></div>
      <div
        className="absolute bottom-0 -left-1/4 w-[800px] h-[800px] bg-indigo-100/20 rounded-full blur-3xl floating"
        style={{ animationDelay: "-4s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 w-[1200px] h-[1200px] bg-purple-100/20 rounded-full blur-3xl floating"
        style={{
          animationDelay: "-2s",
          transform: "translate(-50%, -50%)",
        }}
      ></div>
    </div>
  </>
));

// Separated ExamProtection component for better organization and memoization
const ExamProtection = memo(({ pathname, router }) => {
  const activeExam = useSelector((state) => state.exam.activeExam);
  const examCompleted = useSelector((state) => state.exam.examCompleted);
  const completedPhases = useSelector((state) => state.exam.completedPhases);

  useEffect(() => {
    if (
      !activeExam &&
      pathname.startsWith("/exams") &&
      !pathname.includes("/instructions") &&
      !pathname.includes("/results")
    ) {
      console.log("No active exam, redirecting to home");
      router.push("/");
      return;
    }

    // Handle browser back button
    const handlePopState = (event) => {
      if (
        pathname.includes("/questions") &&
        completedPhases &&
        completedPhases.length > 0 &&
        !examCompleted
      ) {
        event.preventDefault();
        router.push("/");
        return;
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Add beforeunload event handler for warnings
    const handleBeforeUnload = (e) => {
      if (
        activeExam &&
        !pathname.includes("/instructions") &&
        !examCompleted &&
        !pathname.includes("/results")
      ) {
        e.preventDefault();
        e.returnValue = "هل أنت متأكد من الخروج؟ سيتم فقدان تقدمك في الاختبار.";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [activeExam, examCompleted, completedPhases, pathname, router]);

  return null;
});

export default function ExamLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // Crucial: Add a mounting state to prevent accessing Redux before hydration
  const [mounted, setMounted] = useState(false);

  // Memoized reload check function
  const checkReload = useCallback(() => {
    if (
      pathname.startsWith("/exams/") &&
      !pathname.includes("/instructions") &&
      !pathname.includes("/results")
    ) {
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

  // First mount effect - without Redux
  useEffect(() => {
    // Handle reload detection immediately
    if (checkReload()) return;

    // Remove padding from main element

    // Set unload flag to detect reloads
    window.addEventListener("beforeunload", () => {
      if (
        pathname.startsWith("/exams/") &&
        !pathname.includes("/instructions") &&
        !pathname.includes("/results")
      ) {
        localStorage.setItem("_wasReloaded", "true");
      }
    });

    // Wait until after client-side hydration to mount
    setMounted(true);
  }, [pathname, router, checkReload]);

  // Render nothing while checking for reload or waiting for hydration
  if (!mounted) {
    return (
      <div className="bg-[#f4f6f8]">
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f6f8]">
      {/* Only access Redux after mounting */}
      <ExamProtection pathname={pathname} router={router} />

      {/* Memoized background component */}
      <ExamBackground />

      {/* Main Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
