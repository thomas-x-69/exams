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
  const modalRef = useRef(null);

  // Reset state when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      clearError();
      setFormErrors({});
    } else {
      setUsername("");
      setPassword("");
      setName("");
      setPhone("");
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    // Validate form
    if (!validateForm()) {
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

      if (result.success) {
        if (onSuccess) {
          onSuccess(result.user);
        }
        onClose();
      } else {
        // Show error
        setError(result.error || "حدث خطأ. يرجى المحاولة مرة أخرى.");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.message || "حدث خطأ. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/30 to-indigo-600/30 p-5 border-b border-white/10">
        <h2 className="text-xl font-bold text-white">
          {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
        </h2>
        <p className="text-white/70 text-sm">
          {mode === "login"
            ? "قم بتسجيل الدخول للوصول إلى حسابك"
            : "سجل وانضم إلى منصة الاختبارات المصرية"}
        </p>
      </div>

      {/* Form */}
      <div className="p-6">
        {/* Display error if any */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field - only for registration */}
          {mode === "register" && (
            <div>
              <label className="block text-white/80 text-sm mb-1.5">
                الاسم
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full bg-slate-700 border ${
                  formErrors.name ? "border-red-500" : "border-slate-600"
                } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500`}
                placeholder="الاسم الكامل"
                disabled={isLoading}
              />
              {formErrors.name && (
                <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>
              )}
            </div>
          )}

          {/* Username field */}
          <div>
            <label className="block text-white/80 text-sm mb-1.5">
              اسم المستخدم
            </label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full bg-slate-700 border ${
                formErrors.username ? "border-red-500" : "border-slate-600"
              } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500`}
              placeholder="اسم المستخدم"
              disabled={isLoading}
            />
            {formErrors.username && (
              <p className="text-red-400 text-xs mt-1">{formErrors.username}</p>
            )}
          </div>

          {/* Phone field - only for registration */}
          {mode === "register" && (
            <div>
              <label className="block text-white/80 text-sm mb-1.5">
                رقم الهاتف
              </label>
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full bg-slate-700 border ${
                  formErrors.phone ? "border-red-500" : "border-slate-600"
                } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500`}
                placeholder="01xxxxxxxxx"
                disabled={isLoading}
                maxLength={11}
              />
              {formErrors.phone && (
                <p className="text-red-400 text-xs mt-1">{formErrors.phone}</p>
              )}
            </div>
          )}

          {/* Password field */}
          <div>
            <label className="block text-white/80 text-sm mb-1.5">
              كلمة المرور
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-slate-700 border ${
                formErrors.password ? "border-red-500" : "border-slate-600"
              } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500`}
              placeholder="كلمة المرور"
              disabled={isLoading}
            />
            {formErrors.password && (
              <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
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
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full bg-slate-700 border ${
                  formErrors.confirmPassword
                    ? "border-red-500"
                    : "border-slate-600"
                } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500`}
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
            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-bold shadow-md transition-all duration-300 disabled:opacity-70"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>
                  {mode === "login"
                    ? "جاري تسجيل الدخول..."
                    : "جاري إنشاء الحساب..."}
                </span>
              </div>
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
              disabled={isLoading}
            >
              {mode === "login"
                ? "ليس لديك حساب؟ إنشاء حساب جديد"
                : "لديك حساب بالفعل؟ تسجيل الدخول"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
