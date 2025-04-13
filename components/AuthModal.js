// components/AuthModal.js
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const AuthModal = ({ isOpen, onClose, onSuccess, initialMode = "login" }) => {
  const { login, register, error, clearError, setError } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const modalRef = useRef(null);

  // Reset state when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      clearError();
      setFormErrors({});
    } else {
      // Reset form when modal closes
      setPhoneNumber("");
      setPassword("");
      setName("");
      setConfirmPassword("");
      setIsLoading(false);
    }
  }, [isOpen, initialMode, clearError]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
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

  // Validate form fields
  const validateForm = () => {
    const errors = {};

    // Validate phone number (Egyptian format)
    if (!phoneNumber) {
      errors.phoneNumber = "يرجى إدخال رقم الهاتف";
    } else {
      const phoneRegex = /^01[0125][0-9]{8}$/;
      if (!phoneRegex.test(phoneNumber)) {
        errors.phoneNumber = "يرجى إدخال رقم هاتف مصري صحيح";
      }
    }

    // Validate password
    if (!password) {
      errors.password = "يرجى إدخال كلمة المرور";
    } else if (password.length < 6) {
      errors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    // Registration-specific validations
    if (mode === "register") {
      // Validate name
      if (!name) {
        errors.name = "يرجى إدخال الاسم";
      }

      // Validate password confirmation
      if (password !== confirmPassword) {
        errors.confirmPassword = "كلمة المرور غير متطابقة";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous errors
    clearError();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let result;

      if (mode === "login") {
        // Login flow
        result = await login(phoneNumber, password);
      } else {
        // Register flow
        result = await register({
          name,
          phone: phoneNumber,
          password,
        });
      }

      if (result.success) {
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(result.user);
        }
        // Close modal
        onClose();
      } else {
        // Show error from result
        setError(result.error || "حدث خطأ. يرجى المحاولة مرة أخرى.");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.message || "حدث خطأ. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header with decorative elements */}
        <div className="sticky top-0 z-10 bg-slate-800 bg-opacity-95 backdrop-blur-sm">
          <div className="relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-indigo-600/30"></div>

            {/* Header content */}
            <div className="relative p-5 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-500/30 flex items-center justify-center border border-white/20">
                  {mode === "login" ? (
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
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                  ) : (
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
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
                  </h2>
                  <p className="text-white/60 text-sm">
                    {mode === "login"
                      ? "قم بتسجيل الدخول للوصول إلى حسابك"
                      : "سجل وانضم إلى منصة الاختبارات المصرية"}
                  </p>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                aria-label="إغلاق"
              >
                <svg
                  className="w-5 h-5"
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
          </div>
        </div>

        {/* Form area */}
        <div className="p-6">
          {/* Display general error if any */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 flex items-start gap-2">
              <svg
                className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-red-400 text-sm flex-1">{error}</p>
            </div>
          )}

          {/* Authentication form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field - only for registration */}
            {mode === "register" && (
              <div>
                <label className="block text-white/80 text-sm mb-1.5">
                  الاسم
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-slate-700 border ${
                    formErrors.name ? "border-red-500" : "border-slate-600"
                  } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                  placeholder="الاسم الكامل"
                  disabled={isLoading}
                />
                {formErrors.name && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>
            )}

            {/* Phone number field */}
            <div>
              <label className="block text-white/80 text-sm mb-1.5">
                رقم الهاتف
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`w-full bg-slate-700 border ${
                    formErrors.phoneNumber
                      ? "border-red-500"
                      : "border-slate-600"
                  } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors pl-16 dir-ltr text-left`}
                  placeholder="01xxxxxxxxx"
                  disabled={isLoading}
                />
                <div className="absolute left-0 top-0 h-full flex items-center px-4 text-white/60 border-r border-slate-600">
                  +2
                </div>
              </div>
              {formErrors.phoneNumber && (
                <p className="text-red-400 text-xs mt-1">
                  {formErrors.phoneNumber}
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-white/80 text-sm mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-slate-700 border ${
                    formErrors.password ? "border-red-500" : "border-slate-600"
                  } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                  placeholder="كلمة المرور"
                  disabled={isLoading}
                />
              </div>
              {formErrors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {formErrors.password}
                </p>
              )}
              {mode === "register" && (
                <p className="text-xs text-white/50 mt-1">
                  يجب أن تكون كلمة المرور 6 أحرف على الأقل
                </p>
              )}
            </div>

            {/* Confirm Password field - only for registration */}
            {mode === "register" && (
              <div>
                <label className="block text-white/80 text-sm mb-1.5">
                  تأكيد كلمة المرور
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-slate-700 border ${
                    formErrors.confirmPassword
                      ? "border-red-500"
                      : "border-slate-600"
                  } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                  placeholder="تأكيد كلمة المرور"
                  disabled={isLoading}
                />
                {formErrors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full overflow-hidden mt-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-bold shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {/* Animated loading bar */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>
                      {mode === "login"
                        ? "جاري تسجيل الدخول..."
                        : "جاري إنشاء الحساب..."}
                    </span>
                  </div>
                </div>
              )}

              {/* Button text */}
              <span className={isLoading ? "opacity-0" : ""}>
                {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}
              </span>
            </button>

            {/* Toggle between login and register */}
            <div className="text-center pt-3">
              <button
                type="button"
                onClick={() => {
                  clearError();
                  setFormErrors({});
                  setMode(mode === "login" ? "register" : "login");
                }}
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                disabled={isLoading}
              >
                {mode === "login"
                  ? "ليس لديك حساب؟ إنشاء حساب جديد"
                  : "لديك حساب بالفعل؟ تسجيل الدخول"}
              </button>
            </div>
          </form>
        </div>

        {/* Custom animations */}
        <style jsx>{`
          @keyframes progress-bar {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          .animate-progress-bar {
            animation: progress-bar 1.5s ease-in-out infinite;
          }

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

          .animate-in {
            animation: both;
          }

          .fade-in {
            animation-name: fade-in;
          }

          .zoom-in {
            animation-name: zoom-in;
          }

          .duration-300 {
            animation-duration: 300ms;
          }
        `}</style>
      </div>
    </div>
  );
};

export default AuthModal;
