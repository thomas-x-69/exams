// src/app/exams/layout.js
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function ExamLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // Crucial: Add a mounting state to prevent accessing Redux before hydration
  const [mounted, setMounted] = useState(false);

  // Only access Redux state after component has mounted
  useEffect(() => {
    setMounted(true);

    // Handle reload detection immediately
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
        return;
      }
    }

    // Remove padding from main element
    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.classList.remove("pt-28");
    }

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

    return () => {
      if (mainElement) {
        mainElement.classList.add("pt-28");
      }
    };
  }, [pathname, router]);

  // Now that we're mounted, we can safely access Redux
  const ExamProtection = () => {
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
          e.returnValue =
            "هل أنت متأكد من الخروج؟ سيتم فقدان تقدمك في الاختبار.";
          return e.returnValue;
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("popstate", handlePopState);
      };
    }, [activeExam, examCompleted, completedPhases, pathname]);

    return null;
  };

  return (
    <div className="bg-[#f4f6f8]">
      {/* Only access Redux after mounting */}
      {mounted && <ExamProtection />}

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
