// components/ToastNotification.js
"use client";

import React, { useState, useEffect, createContext, useContext } from "react";

// Create a context for the toast system
export const ToastContext = createContext();

// Toast component
const Toast = ({ id, message, type, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [progress, setProgress] = useState(100);

  // Auto dismiss countdown
  useEffect(() => {
    const dismissTime = 5000; // 5 seconds
    const startTime = Date.now();
    const endTime = startTime + dismissTime;

    // Progress bar animation
    const progressInterval = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;
      const percentRemaining = (remaining / dismissTime) * 100;

      if (percentRemaining <= 0) {
        clearInterval(progressInterval);
        setProgress(0);
        setIsClosing(true);
        setTimeout(() => onClose(id), 500);
      } else {
        setProgress(percentRemaining);
      }
    }, 50);

    return () => {
      clearInterval(progressInterval);
    };
  }, [id, onClose]);

  // Icons for different toast types with larger size
  const icons = {
    success: (
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shadow-sm shadow-green-500/20">
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    ),
    error: (
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shadow-sm shadow-red-500/20">
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    ),
    info: (
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shadow-sm shadow-blue-500/20">
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    ),
    warning: (
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center shadow-sm shadow-yellow-500/20">
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
    ),
  };

  // Style configurations based on toast type
  const typeConfig = {
    success: {
      background: "bg-gradient-to-r from-green-500/15 to-emerald-500/15",
      border: "border-2 border-green-500/30",
      text: "text-green-50",
      titleColor: "text-green-400 font-bold",
      shadow: "shadow-lg shadow-green-500/20",
      progressColor: "bg-green-500",
    },
    error: {
      background: "bg-gradient-to-r from-red-500/15 to-rose-500/15",
      border: "border-2 border-red-500/30",
      text: "text-red-50",
      titleColor: "text-red-400 font-bold",
      shadow: "shadow-lg shadow-red-500/20",
      progressColor: "bg-red-500",
    },
    info: {
      background: "bg-gradient-to-r from-blue-500/15 to-indigo-500/15",
      border: "border-2 border-blue-500/30",
      text: "text-blue-50",
      titleColor: "text-blue-400 font-bold",
      shadow: "shadow-lg shadow-blue-500/20",
      progressColor: "bg-blue-500",
    },
    warning: {
      background: "bg-gradient-to-r from-yellow-500/15 to-amber-500/15",
      border: "border-2 border-yellow-500/30",
      text: "text-yellow-50",
      titleColor: "text-yellow-400 font-bold",
      shadow: "shadow-lg shadow-yellow-500/20",
      progressColor: "bg-yellow-500",
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  // Extract title if message contains a separator ":" or "|"
  let title = "";
  let content = message;

  if (typeof message === "string") {
    const separators = [":", "|", "-"];
    for (const separator of separators) {
      if (message.includes(separator)) {
        const parts = message.split(separator);
        title = parts[0].trim();
        content = parts.slice(1).join(separator).trim();
        break;
      }
    }
  }

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(id), 500);
  };

  return (
    <div
      className={`translate-x-[-4rem] w-full max-w-[calc(100vw-2rem)] sm:max-w-md bg-slate-900 rounded-xl text-white ${
        config.background
      } ${config.border} ${
        config.shadow
      } mb-4 transform transition-all duration-500 animate-toast-enter ${
        isClosing
          ? "translate-y-2 opacity-0 scale-95"
          : "translate-y-0 opacity-100 scale-100"
      }`}
    >
      <div className="p-3 sm:p-4 ">
        <div className="flex items-start mb-1">
          <div className="flex-shrink-0 ml-2 sm:ml-3">{icons[type]}</div>
          <div className="flex-1 mr-2 pt-1">
            {title && (
              <h4
                className={`${config.titleColor} text-sm sm:text-base mb-0.5 sm:mb-1 leading-tight`}
              >
                {title}
              </h4>
            )}
            <p
              className={`${config.text} text-xs sm:text-sm leading-relaxed break-words`}
            >
              {content}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0 mt-1"
            aria-label="إغلاق"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 sm:h-1.5 w-full bg-white/10 rounded-full mt-2 overflow-hidden">
          <div
            className={`h-full ${config.progressColor} transition-all duration-300 ease-linear`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Toast provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Add a new toast
  const addToast = (message, type = "info") => {
    const id = Date.now().toString();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    return id;
  };

  // Remove a toast by ID
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Helper functions for specific toast types
  const showSuccess = (message) => addToast(message, "success");
  const showError = (message) => addToast(message, "error");
  const showInfo = (message) => addToast(message, "info");
  const showWarning = (message) => addToast(message, "warning");

  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
      }}
    >
      {children}

      {/* Toast container - responsive positioning */}
      {toasts.length > 0 && (
        <div
          className={`fixed z-50 flex flex-col ${
            isMobile
              ? "bottom-0 left-0 right-0 items-center px-2 pb-2 pt-0"
              : "bottom-6 right-6 items-end space-y-3"
          }`}
        >
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={removeToast}
            />
          ))}
        </div>
      )}

      {/* Custom animation for toasts */}
      <style jsx global>{`
        @keyframes toast-enter {
          0% {
            opacity: 0;
            transform: ${isMobile
              ? "translateY(20px)"
              : "translateY(20px) scale(0.95)"};
          }
          100% {
            opacity: 1;
            transform: ${isMobile ? "translateY(0)" : "translateY(0) scale(1)"};
          }
        }

        .animate-toast-enter {
          animation: toast-enter 0.3s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast system
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
