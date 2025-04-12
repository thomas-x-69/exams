// components/WelcomePremiumModal.js
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useClientAuth } from "../context/ClientAuthContext";

const WelcomePremiumModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isPremium, userProfile } = useClientAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user has premium access and hasn't seen the welcome modal
    if (isPremium && typeof window !== "undefined") {
      const hasSeenWelcome =
        localStorage.getItem("hasSeenPremiumWelcome") === "true";

      if (!hasSeenWelcome) {
        // Show welcome modal after a short delay
        const timer = setTimeout(() => {
          setIsOpen(true);
          // Mark as seen
          localStorage.setItem("hasSeenPremiumWelcome", "true");
        }, 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [isPremium]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const goToPremiumExams = () => {
    router.push("/premium-exams");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-2xl w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-yellow-500/30 shadow-2xl shadow-yellow-500/20 overflow-hidden animate-zoom-in">
        {/* Animated gold particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Content */}
        <div className="relative p-8 text-center">
          {/* Premium badge */}
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 mb-6 glow-premium">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            مرحباً بك في العضوية الذهبية!
          </h2>

          <p className="text-xl text-white/80 mb-2">
            {userProfile?.name ? `أهلاً ${userProfile.name}!` : "أهلاً بك!"} تم
            تفعيل اشتراكك الذهبي بنجاح.
          </p>
          <p className="text-lg text-white/70 mb-6">
            لقد أصبح بإمكانك الآن الوصول إلى جميع الامتحانات الحقيقية والمحتوى
            الحصري.
          </p>

          <div className="mb-8 p-4 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 rounded-xl border border-amber-500/30">
            <h3 className="text-amber-400 font-bold mb-2">
              بعض المميزات التي تحصل عليها:
            </h3>
            <ul className="text-white/80 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-right pr-4">
              <li className="flex items-start gap-2 rtl">
                <svg
                  className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>أكثر من 30 نموذج امتحان رسمي</span>
              </li>
              <li className="flex items-start gap-2 rtl">
                <svg
                  className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>تحليل مفصل لأدائك</span>
              </li>
              <li className="flex items-start gap-2 rtl">
                <svg
                  className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>شهادات اجتياز احترافية</span>
              </li>
              <li className="flex items-start gap-2 rtl">
                <svg
                  className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>دعم فني متميز</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={goToPremiumExams}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white rounded-xl font-bold transition-all duration-300 shadow-md shadow-amber-500/20 w-full sm:w-auto"
            >
              استعرض الامتحانات الحقيقية
            </button>
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 border border-white/20 hover:border-white/30 w-full sm:w-auto"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes zoom-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes float-particle {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.4;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 1;
          }
          50% {
            transform: translateY(-40px) translateX(0);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-20px) translateX(-10px);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .animate-zoom-in {
          animation: zoom-in 0.4s cubic-bezier(0.17, 0.67, 0.29, 0.99) forwards;
        }

        .animate-float-particle {
          animation: float-particle 5s ease-in-out infinite;
        }

        .glow-premium {
          position: relative;
        }

        .glow-premium::after {
          content: "";
          position: absolute;
          inset: -5px;
          background: radial-gradient(
            circle,
            rgba(251, 191, 36, 0.6) 0%,
            transparent 70%
          );
          z-index: -1;
          border-radius: 50%;
          filter: blur(10px);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default WelcomePremiumModal;
