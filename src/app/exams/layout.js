// src/app/exams/layout.js
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function ExamLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeExam = useSelector((state) => state.exam.activeExam);
  const examCompleted = useSelector((state) => state.exam.examCompleted);
  const phases = useSelector((state) => state.exam.phases);
  const completedPhases = useSelector((state) => state.exam.completedPhases);

  // Protect exam routes
  useEffect(() => {
    // If accessing exam pages but no active exam (except instructions page)
    if (
      pathname.startsWith("/exams") &&
      !pathname.includes("/instructions") &&
      !activeExam &&
      !pathname.includes("/results")
    ) {
      router.push("/");
    }

    // Remove padding from main element
    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.classList.remove("pt-28");
    }

    // Handle browser back button
    const handlePopState = (event) => {
      // If in questions page and a phase was completed, prevent going back
      if (
        pathname.includes("/questions") &&
        completedPhases &&
        completedPhases.length > 0 &&
        !examCompleted
      ) {
        // Prevent default behavior
        event.preventDefault();
        // Handle browser backward button press - go to landing page
        router.push("/");
        return;
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Add beforeunload event handler - but not for instructions page or after exam is completed
    const handleBeforeUnload = (e) => {
      if (
        activeExam &&
        !pathname.includes("/instructions") &&
        !examCompleted &&
        !pathname.includes("/results")
      ) {
        // Cancel the event
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = "هل أنت متأكد من الخروج؟ سيتم فقدان تقدمك في الاختبار.";
        // Return value for older browsers
        return "هل أنت متأكد من الخروج؟ سيتم فقدان تقدمك في الاختبار.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup when component unmounts
    return () => {
      if (mainElement) {
        mainElement.classList.add("pt-28");
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathname, activeExam, router, examCompleted, phases, completedPhases]);

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
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
        <div className="absolute bottom-0 -left-1/4 w-[800px] h-[800px] bg-indigo-100/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
