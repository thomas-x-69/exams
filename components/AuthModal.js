// components/AuthModal.js
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const AuthModal = ({ isOpen, onClose, onSuccess, initialMode = "login" }) => {
  const { login, register, error, clearError, setError } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [authTimeout, setAuthTimeout] = useState(false);
  const modalRef = useRef(null);
  const timerRef = useRef(null);

  // Reset state when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      clearError();
      setFormErrors({});
      setSuccessMessage("");
      setAuthTimeout(false);

      // Set a timeout to prevent hanging forever if Firebase fails
      timerRef.current = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          setAuthTimeout(true);
          localStorage.setItem("_firebase_init_error", "true");
        }
      }, 8000); // 8 seconds timeout
    } else {
      setUsername("");
      setPassword("");
      setName("");
      setPhone("");
      setConfirmPassword("");
      setIsLoading(false);
      setSuccessMessage("");
      setAuthTimeout(false);

      // Clear timeout on close
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isOpen, initialMode, clearError]);

  // Modified click outside behavior - does not close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      // We keep the event listener but don't close the modal when clicking outside
      // This way only the explicit close button will close the modal
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // No action - removed onClose() call
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]); // Removed onClose from dependencies

  // Validate form
  const validateForm = () => {
    const errors = {};

    // Username validation
    if (!username) {
      errors.username = "يرجى إدخال اسم المستخدم";
    }

    // Password validation
    if (!password) {
      errors.password = "يرجى إدخال كلمة المرور";
    } else if (password.length < 6) {
      errors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    // Registration-specific validations
    if (mode === "register") {
      if (!name) {
        errors.name = "يرجى إدخال الاسم";
      }

      if (!phone) {
        errors.phone = "يرجى إدخال رقم الهاتف";
      } else {
        // Egyptian phone number validation
        const phoneRegex = /^01[0125][0-9]{8}$/;
        if (!phoneRegex.test(phone)) {
          errors.phone = "يرجى إدخال رقم هاتف مصري صحيح";
        }
      }

      if (password !== confirmPassword) {
        errors.confirmPassword = "كلمة المرور غير متطابقة";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Error animation effect
  const triggerErrorAnimation = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setSuccessMessage("");
    setAuthTimeout(false);

    // Validate form
    if (!validateForm()) {
      triggerErrorAnimation();
      return;
    }

    setIsLoading(true);

    try {
      let result;

      if (mode === "login") {
        // Login
        result = await login(username, password);
      } else {
        // Register
        result = await register({
          username,
          name,
          phone,
          password,
        });
      }

      // Clear timeout since we got a response
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      if (result.success) {
        // Show success message
        setSuccessMessage(
          mode === "login" ? "تم تسجيل الدخول بنجاح!" : "تم إنشاء الحساب بنجاح!"
        );

        // Close modal after a short delay
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(result.user);
          }
          onClose();
        }, 1500);
      } else {
        // Show error
        setError(result.error || "حدث خطأ. يرجى المحاولة مرة أخرى.");
        triggerErrorAnimation();
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.message || "حدث خطأ. يرجى المحاولة مرة أخرى.");
      triggerErrorAnimation();
    } finally {
      setIsLoading(false);
    }
  };

  // Format error message with icon
  const getErrorWithIcon = (errorText) => {
    return (
      <div className="flex items-start gap-2">
        <svg
          className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0"
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
        <span>{errorText}</span>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className={`glass-card bg-slate-900/80 w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-300 ${
        isShaking ? "animate-shake" : ""
      }`}
    >
      {/* Close button - integrated in header with more visible styling */}
      <button
        onClick={onClose}
        className="p-3 rounded-md left-0 absolute m-0 bg-slate-700 text-white flex items-center justify-center shadow transition-all duration-300  hover:shadow-xl"
        aria-label="إغلاق"
      >
        <svg
          className="w-7 h-7"
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
      {/* Header with integrated close button */}
      <div className="bg-gradient-to-r from-blue-600/20 to-indigo-800/30 p-5 border-b border-white/10 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">
            {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </h2>
          <p className="text-white/70 text-sm">
            {mode === "login"
              ? "قم بتسجيل الدخول للوصول إلى حسابك"
              : "سجل وانضم إلى منصة الاختبارات المصرية"}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full  bg-green-500/20 flex items-center justify-center border border-green-500/30">
                <svg
                  className="w-6 h-6 "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-green-400 font-medium">{successMessage}</p>
                <p className="text-green-400/70 text-sm">جاري تحويلك...</p>
              </div>
            </div>
          </div>
        )}

        {/* Auth Timeout Error */}
        {authTimeout && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30 flex-shrink-0">
                <svg
                  className="w-6 h-6 text-red-500"
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
              </div>
              <div>
                <p className="text-red-400 font-medium">
                  حدث خطأ في خدمات تسجيل الدخول
                </p>
                <p className="text-red-400/70 text-sm">
                  يرجى المحاولة مرة أخرى لاحقاً أو التواصل مع الدعم الفني
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Display error if any */}
        {error && !authTimeout && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30 flex-shrink-0">
                <svg
                  className="w-6 h-6 text-red-500"
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
              </div>
              <div>
                <p className="text-red-400 font-medium">
                  {error.includes("اسم المستخدم مستخدم")
                    ? "اسم المستخدم موجود بالفعل"
                    : error.includes("كلمة المرور غير صحيحة") ||
                      error.includes("اسم المستخدم غير موجود")
                    ? "اسم المستخدم أو كلمة المرور غير صحيحة"
                    : error.includes("خطأ في الاتصال") ||
                      error.includes("حدث خطأ")
                    ? "خطأ في الخادم"
                    : error}
                </p>
                <p className="text-red-400/70 text-sm">
                  {error.includes("اسم المستخدم مستخدم")
                    ? "يرجى اختيار اسم مستخدم آخر أو تسجيل الدخول إذا كنت تملك حساباً بالفعل"
                    : error.includes("كلمة المرور غير صحيحة") ||
                      error.includes("اسم المستخدم غير موجود")
                    ? "يرجى التأكد من اسم المستخدم وكلمة المرور"
                    : error.includes("خطأ في الاتصال") ||
                      error.includes("حدث خطأ")
                    ? "يرجى المحاولة مرة أخرى لاحقاً. إذا استمرت المشكلة، تواصل معنا عبر Telegram"
                    : ""}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field - only for registration */}
          {mode === "register" && (
            <div>
              <label className="block text-white/80 text-sm mb-1.5">
                الاسم
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-slate-700 border ${
                    formErrors.name ? "border-red-500" : "border-slate-600"
                  } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors pr-10`}
                  placeholder="الاسم الكامل"
                  disabled={isLoading || successMessage || authTimeout}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
              </div>
              {formErrors.name && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <svg
                    className="w-3 h-3 flex-shrink-0"
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
                  {formErrors.name}
                </p>
              )}
            </div>
          )}

          {/* Username field */}
          <div>
            <label className="block text-white/80 text-sm mb-1.5">
              اسم المستخدم
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full bg-slate-700 border ${
                  formErrors.username ? "border-red-500" : "border-slate-600"
                } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors pr-10`}
                placeholder="اسم المستخدم"
                disabled={isLoading || successMessage || authTimeout}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </span>
            </div>
            {formErrors.username && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <svg
                  className="w-3 h-3 flex-shrink-0"
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
                {formErrors.username}
              </p>
            )}
          </div>

          {/* Phone field - only for registration */}
          {mode === "register" && (
            <div>
              <label className="block text-white/80 text-sm mb-1.5">
                رقم الهاتف
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  dir="rtl"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full bg-slate-700 border ${
                    formErrors.phone ? "border-red-500" : "border-slate-600"
                  } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors pr-10`}
                  placeholder="01xxxxxxxxx"
                  disabled={isLoading || successMessage || authTimeout}
                  maxLength={11}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </span>
              </div>
              {formErrors.phone && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <svg
                    className="w-3 h-3 flex-shrink-0"
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
                  {formErrors.phone}
                </p>
              )}
            </div>
          )}

          {/* Password field */}
          <div>
            <label className="block text-white/80 text-sm mb-1.5">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-slate-700 border ${
                  formErrors.password ? "border-red-500" : "border-slate-600"
                } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors pr-10`}
                placeholder="كلمة المرور"
                disabled={isLoading || successMessage || authTimeout}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
            </div>
            {formErrors.password && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <svg
                  className="w-3 h-3 flex-shrink-0"
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
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-slate-700 border ${
                    formErrors.confirmPassword
                      ? "border-red-500"
                      : "border-slate-600"
                  } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors pr-10`}
                  placeholder="تأكيد كلمة المرور"
                  disabled={isLoading || successMessage || authTimeout}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </span>
              </div>
              {formErrors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <svg
                    className="w-3 h-3 flex-shrink-0"
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
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading || successMessage || authTimeout}
            className="w-full mt-6 bg-gradient-to-r from-blue-600/70 to-indigo-600/70 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-bold shadow-md transition-all duration-300 disabled:opacity-70 relative overflow-hidden"
          >
            {/* Button shine effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></span>

            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>
                  {mode === "login"
                    ? "جاري تسجيل الدخول..."
                    : "جاري إنشاء الحساب..."}
                </span>
              </div>
            ) : successMessage ? (
              <div className="flex items-center justify-center gap-2  text-white">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{successMessage}</span>
              </div>
            ) : authTimeout ? (
              <span>حاول مرة أخرى لاحقاً</span>
            ) : (
              <span>{mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}</span>
            )}
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
              disabled={isLoading || successMessage || authTimeout}
            >
              {mode === "login"
                ? "ليس لديك حساب؟ إنشاء حساب جديد"
                : "لديك حساب بالفعل؟ تسجيل الدخول"}
            </button>
          </div>
        </form>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shake {
          animation: shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default AuthModal;
