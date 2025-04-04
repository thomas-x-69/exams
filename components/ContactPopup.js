// src/components/ContactPopup.js
"use client";

import { useState, useEffect, useRef } from "react";

export default function ContactPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState("");
  const popupRef = useRef(null);

  useEffect(() => {
    // Check if we should show the popup
    const checkPopupVisibility = () => {
      try {
        // Check if user has already connected
        const telegramConnected =
          window.localStorage.getItem("telegramConnected");

        // If already connected, don't show the popup
        if (telegramConnected) {
          setIsVisible(false);
        } else {
          // Wait a bit before showing the popup for better UX
          setTimeout(() => {
            setIsVisible(true);
            setAnimationClass("animate-in fade-in zoom-in-95 duration-300");
          }, 2500);
        }
      } catch (e) {
        console.error("Error accessing localStorage:", e);
        // Default to showing the popup if there's an error
        setIsVisible(true);
      }
    };

    // Run the check when the component mounts
    checkPopupVisibility();

    // Add click outside listener
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        handleSkip();
      }
    };

    // Add the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleConnect = () => {
    try {
      // Save connection status to localStorage
      window.localStorage.setItem("telegramConnected", "true");

      // Close the popup with exit animation
      handleClose();

      // Open Telegram group in new tab
      window.open("https://t.me/Egyptian_Exams", "_blank");
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  };

  const handleClose = () => {
    // Add exit animation
    setAnimationClass("animate-out fade-out zoom-out-95 duration-300");

    // Wait for animation to complete before hiding
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const handleSkip = () => {
    // Add exit animation
    setAnimationClass("animate-out fade-out zoom-out-95 duration-300");

    // Wait for animation to complete before hiding
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"></div>

      {/* Popup Card */}
      <div
        ref={popupRef}
        className={`relative w-full max-w-md ${animationClass}`}
      >
        <div className="glass-card bg-slate-900/80 border border-white/20 overflow-hidden">
          {/* Telegram Brand Header */}
          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
            <div className="flex items-center gap-3 p-4">
              <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center border border-white/30 shadow-lg">
                <div className="w-10 h-10 relative">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/2048px-Telegram_2019_Logo.svg.png"
                    alt="Telegram Logo"
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  مجتمع منصة الاختبارات
                </h2>
                <p className="text-white/60 text-sm">
                  انضم للمجموعة على تليجرام
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-white/80 mb-5">
              انضم إلى مجتمعنا على تليجرام للحصول على:
            </p>

            {/* Benefits */}
            <div className="bg-white/5 rounded-xl p-4 mb-5 border border-white/10">
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex-shrink-0 flex items-center justify-center border border-blue-500/20">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">اختبارات جديدة</h4>
                    <p className="text-sm text-white/60">
                      تنبيهات بأحدث الاختبارات فور إضافتها
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-600/20 flex-shrink-0 flex items-center justify-center border border-green-500/20">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">نصائح وإرشادات</h4>
                    <p className="text-sm text-white/60">
                      خطوات النجاح من متخصصين في المجال
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-600/20 flex-shrink-0 flex items-center justify-center border border-amber-500/20">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">مجتمع داعم</h4>
                    <p className="text-sm text-white/60">
                      تعرف على زملاء وتبادل الخبرات معهم
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Community Count */}
            {/* <div className="flex justify-center mb-5 border-0">
              <div className="bg-gradient-to-r from-blue-600/40 to-indigo-600/40 rounded-lg px-5 py-3 border border-blue-400/20 shadow-lg shadow-blue-500/10">
                <span className="text-white font-medium text-center block">
                  انضم إلى{" "}
                  <span className="font-bold text-lg text-blue-300">
                    +3,500
                  </span>{" "}
                  متدرب
                </span>
              </div>
            </div> */}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleConnect}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 group"
              >
                <div className="w-6 h-6 bg-white rounded-full p-1">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/2048px-Telegram_2019_Logo.svg.png"
                    alt="Telegram Logo"
                    className="object-contain w-full h-full"
                  />
                </div>
                <span>انضم للمجموعة</span>
              </button>
              <button
                onClick={handleSkip}
                className="flex-1 border border-white/10 hover:bg-white/5 text-white/80 hover:text-white py-2.5 rounded-lg font-medium transition-all duration-200"
              >
                لاحقاً
              </button>
            </div>

            {/* Privacy Note */}
            <p className="mt-4 text-center text-white/50 text-xs">
              يمكنك الانضمام أو المغادرة في أي وقت. لا نشارك بياناتك مع أي طرف
              ثالث.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
