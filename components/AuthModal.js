// components/AuthModal.js
"use client";

import React, { useRef, useEffect } from "react";
import PhoneAuth from "./PhoneAuth";
import { useAuth } from "../context/ClientAuthContext";

const AuthModal = ({ isOpen, onClose, onAuthenticated, mode = "register" }) => {
  const modalRef = useRef(null);
  const { loading } = useAuth();

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-slate-800 rounded-lg shadow-xl overflow-hidden transition-all duration-300 border border-amber-500/30"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
                </h2>
                <p className="text-white/80 text-sm">
                  {mode === "login"
                    ? "الدخول إلى حسابك الموجود"
                    : "انضم إلى منصة الاختبارات المصرية"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
              aria-label="إغلاق"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <PhoneAuth
              onAuthenticated={onAuthenticated}
              isModal={true}
              onClose={onClose}
            />
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-700 p-4 border-t border-slate-600 flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            إغلاق
          </button>

          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4 text-amber-400"
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
            <span className="text-white/60 text-xs">اتصال آمن</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
