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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const modalRef = useRef(null);
  const usernameRef = useRef(null);

  // Reset state when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      clearError();
      setFormErrors({});
      setSuccessMessage("");

      // Focus the first input field with a slight delay
      setTimeout(() => {
        if (usernameRef.current) {
          usernameRef.current.focus();
        }
      }, 300);
    } else {
      // Reset form when modal closes
      setUsername("");
      setPassword("");
      setName("");
      setPhone("");
      setConfirmPassword("");
      setIsLoading(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
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

  // Handle input change with real-time validation feedback
  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter(value);

    // Clear any existing error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Perform real-time validation for specific fields
    if (name === "phone" && value) {
      const phoneRegex = /^01[0125][0-9]{8}$/;
      if (!phoneRegex.test(value) && value.length >= 11) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: "يرجى إدخال رقم هاتف مصري صحيح",
        }));
      }
    }

    if (name === "confirmPassword" && password && value) {
      if (password !== value) {
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword: "كلمة المرور غير متطابقة",
        }));
      }
    }
  };

  // Check password strength
  const getPasswordStrength = (pass) => {
    if (!pass) return { strength: 0, text: "", color: "" };

    const hasLower = /[a-z]/.test(pass);
    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const length = pass.length;

    let strength = 0;
    if (length >= 6) strength += 1;
    if (length >= 8) strength += 1;
    if (hasLower) strength += 1;
    if (hasUpper) strength += 1;
    if (hasNumber) strength += 1;
    if (hasSpecial) strength += 1;

    let text = "";
    let color = "";

    if (strength <= 2) {
      text = "ضعيفة";
      color = "bg-red-500";
    } else if (strength <= 4) {
      text = "متوسطة";
      color = "bg-yellow-500";
    } else {
      text = "قوية";
      color = "bg-green-500";
    }

    return {
      strength: Math.min(Math.floor((strength / 6) * 100), 100),
      text,
      color,
    };
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};

    // Validate username
    if (!username) {
      errors.username = "يرجى إدخال اسم المستخدم";
    } else if (username.length < 3) {
      errors.username = "اسم المستخدم يجب أن يكون 3 أحرف على الأقل";
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

      // Validate phone
      if (!phone) {
        errors.phone = "يرجى إدخال رقم الهاتف";
      } else {
        // Egyptian phone number validation
        const phoneRegex = /^01[0125][0-9]{8}$/;
        if (!phoneRegex.test(phone)) {
          errors.phone = "يرجى إدخال رقم هاتف مصري صحيح";
        }
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

    // Clear any previous errors and success messages
    clearError();
    setSuccessMessage("");

    // Validate form
    if (!validateForm()) {
      // Find the first input with an error and focus it
      const errorFields = Object.keys(formErrors);
      if (errorFields.length > 0) {
        const firstErrorField = document.querySelector(
          `[name="${errorFields[0]}"]`
        );
        if (firstErrorField) {
          firstErrorField.focus();
        }
      }
      return;
    }

    setIsLoading(true);

    try {
      let result;

      if (mode === "login") {
        // Login flow
        result = await login(username, password);
      } else {
        // Register flow
        result = await register({
          username,
          name,
          phone,
          password,
        });
      }

      if (result.success) {
        // Show success message briefly before closing
        setSuccessMessage(
          mode === "login" ? "تم تسجيل الدخول بنجاح!" : "تم إنشاء الحساب بنجاح!"
        );

        // Call success callback after a short delay to show the success message
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(result.user);
          }
          // Close modal
          onClose();
        }, 1000);
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
    <div
      ref={modalRef}
      className="w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-white/20 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300"
      style={{ maxHeight: "90vh", overflowY: "auto" }}
    >
      {/* Header with decorative elements */}
      <div className="sticky top-0 z-10 bg-slate-800 bg-opacity-95 backdrop-blur-sm">
        <div className="relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 opacity-80"></div>
          <div className="absolute inset-0 pattern-dots opacity-30"></div>

          {/* Animated light effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 -right-40 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 -left-40 w-80 h-80 bg-indigo-500 rounded-full blur-3xl"></div>
          </div>

          {/* Header content */}
          <div className="relative p-5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-500/30 flex items-center justify-center border border-white/20 shadow-lg shadow-blue-500/10">
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
                <p className="text-white/70 text-sm">
                  {mode === "login"
                    ? "قم بتسجيل الدخول للوصول إلى حسابك"
                    : "سجل وانضم إلى منصة الاختبارات المصرية"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form area */}
      <div className="p-6">
        {/* Success message */}
        {successMessage && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4 flex items-start gap-2 animate-pulse">
            <svg
              className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"
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
            <p className="text-green-400 text-sm flex-1">{successMessage}</p>
          </div>
        )}

        {/* Display general error if any */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 flex items-start gap-2 animate-in slide-in-from-top duration-300">
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
            <div className="transition-all duration-300 animate-in slide-in-from-left">
              <label className="block text-white/80 text-sm mb-1.5">
                الاسم
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => handleInputChange(e, setName)}
                  className={`w-full bg-slate-700 border ${
                    formErrors.name ? "border-red-500" : "border-slate-600"
                  } rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                  placeholder="الاسم الكامل"
                  disabled={isLoading}
                />
              </div>
              {formErrors.name && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1 animate-in slide-in-from-top duration-200">
                  <svg
                    className="w-3 h-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {formErrors.name}
                </p>
              )}
            </div>
          )}

          {/* Username field */}
          <div
            className="transition-all duration-300 animate-in slide-in-from-left"
            style={{ animationDelay: "75ms" }}
          >
            <label className="block text-white/80 text-sm mb-1.5">
              اسم المستخدم
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                ref={usernameRef}
                value={username}
                onChange={(e) => handleInputChange(e, setUsername)}
                className={`w-full bg-slate-700 border ${
                  formErrors.username ? "border-red-500" : "border-slate-600"
                } rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                placeholder="اسم المستخدم"
                disabled={isLoading}
              />
            </div>
            {formErrors.username && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1 animate-in slide-in-from-top duration-200">
                <svg
                  className="w-3 h-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {formErrors.username}
              </p>
            )}
            {mode === "register" && (
              <p className="text-xs text-white/50 mt-1">
                يجب أن يكون اسم المستخدم 3 أحرف على الأقل
              </p>
            )}
          </div>

          {/* Phone field - only for registration */}
          {mode === "register" && (
            <div
              className="transition-all duration-300 animate-in slide-in-from-left"
              style={{ animationDelay: "150ms" }}
            >
              <label className="block text-white/80 text-sm mb-1.5">
                رقم الهاتف
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={(e) => handleInputChange(e, setPhone)}
                  className={`w-full bg-slate-700 border ${
                    formErrors.phone ? "border-red-500" : "border-slate-600"
                  } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors pr-10 pl-16 dir-ltr text-left`}
                  placeholder="01xxxxxxxxx"
                  disabled={isLoading}
                  maxLength={11}
                />
              </div>
              {formErrors.phone && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1 animate-in slide-in-from-top duration-200">
                  <svg
                    className="w-3 h-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {formErrors.phone}
                </p>
              )}
            </div>
          )}

          {/* Password field */}
          <div
            className="transition-all duration-300 animate-in slide-in-from-left"
            style={{ animationDelay: "225ms" }}
          >
            <label className="block text-white/80 text-sm mb-1.5">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => handleInputChange(e, setPassword)}
                className={`w-full bg-slate-700 border ${
                  formErrors.password ? "border-red-500" : "border-slate-600"
                } rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                placeholder="كلمة المرور"
                disabled={isLoading}
              />

              <button
                type="button"
                className="absolute top-1/2 left-3 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
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
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {formErrors.password && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1 animate-in slide-in-from-top duration-200">
                <svg
                  className="w-3 h-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {formErrors.password}
              </p>
            )}
            {mode === "register" && password && (
              <div className="mt-1.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/50">
                    قوة كلمة المرور:
                  </span>
                  <span
                    className={`text-xs ${getPasswordStrength(
                      password
                    ).color.replace("bg-", "text-")}`}
                  >
                    {getPasswordStrength(password).text}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      getPasswordStrength(password).color
                    } transition-all duration-300`}
                    style={{
                      width: `${getPasswordStrength(password).strength}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
            {mode === "register" && (
              <p className="text-xs text-white/50 mt-1">
                يجب أن تكون كلمة المرور 6 أحرف على الأقل
              </p>
            )}
          </div>

          {/* Confirm Password field - only for registration */}
          {mode === "register" && (
            <div
              className="transition-all duration-300 animate-in slide-in-from-left"
              style={{ animationDelay: "300ms" }}
            >
              <label className="block text-white/80 text-sm mb-1.5">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => handleInputChange(e, setConfirmPassword)}
                  className={`w-full bg-slate-700 border ${
                    formErrors.confirmPassword
                      ? "border-red-500"
                      : "border-slate-600"
                  } rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                  placeholder="تأكيد كلمة المرور"
                  disabled={isLoading}
                />

                <button
                  type="button"
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1 animate-in slide-in-from-top duration-200">
                  <svg
                    className="w-3 h-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
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
            disabled={isLoading}
            className="relative w-full overflow-hidden mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-bold shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Button shine effect */}
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-shine"></span>

            {/* Loading state */}
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
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm focus:outline-none focus:underline"
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
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shine {
          animation: shine 2s infinite;
        }

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

        @keyframes slide-in-from-left {
          from {
            transform: translateX(-10px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slide-in-from-top {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
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

        .slide-in-from-left {
          animation-name: slide-in-from-left;
        }

        .slide-in-from-top {
          animation-name: slide-in-from-top;
        }

        .duration-200 {
          animation-duration: 200ms;
        }

        .duration-300 {
          animation-duration: 300ms;
        }
      `}</style>
    </div>
  );
};

export default AuthModal;
