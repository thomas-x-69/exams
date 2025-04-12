// components/AuthModal.js
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/ClientAuthContext";

const AuthModal = ({ isOpen, onClose, initialMode = "login", onSuccess }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [step, setStep] = useState("phone"); // 'phone', 'verification', 'profile'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const modalRef = useRef(null);

  // Form data
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    name: "",
    confirmPassword: "",
  });

  // Verification code (in a real app, this would be generated and sent via SMS)
  const [verificationCode, setVerificationCode] = useState("");

  // Get auth context
  const { signInWithPhone, signUpWithPhone } = useAuth();

  // Handle countdown for resending verification code
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setStep("phone");
      setFormData({
        phone: "",
        password: "",
        name: "",
        confirmPassword: "",
      });
      setError("");
      setVerificationCode("");
    }
  }, [isOpen, initialMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (error) setError("");
  };

  // Validate phone number (Egyptian format)
  const validatePhoneNumber = (phone) => {
    // Egyptian phone numbers: 01x followed by 8 digits
    const phoneRegex = /^01[0125][0-9]{8}$/;
    return phoneRegex.test(phone);
  };

  // Handle phone submission
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Validate phone number
      if (!formData.phone.trim()) {
        setError("يرجى إدخال رقم الهاتف");
        return;
      }

      if (!validatePhoneNumber(formData.phone)) {
        setError("يرجى إدخال رقم هاتف مصري صحيح");
        return;
      }

      setIsLoading(true);

      // In a real app, you would send a verification code via SMS here
      // For demo purposes, we'll just move to the verification step
      setTimeout(() => {
        setStep("verification");
        setCountdown(60); // Set countdown for 60 seconds
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error sending verification code:", error);
      setError("حدث خطأ أثناء إرسال رمز التحقق");
      setIsLoading(false);
    }
  };

  // Handle verification code submission
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Validate verification code
      if (!verificationCode.trim()) {
        setError("يرجى إدخال رمز التحقق");
        return;
      }

      if (!/^\d{6}$/.test(verificationCode)) {
        setError("يجب أن يكون رمز التحقق 6 أرقام");
        return;
      }

      setIsLoading(true);

      // For demo purposes, we'll consider any 6-digit code valid
      // In a real app, you would validate the code with your backend

      // Check if user exists (login) or needs to complete profile (register)
      if (mode === "login") {
        setStep("password");
      } else {
        setStep("profile");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error verifying code:", error);
      setError("رمز التحقق غير صحيح");
      setIsLoading(false);
    }
  };

  // Handle login with password
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Validate password
      if (!formData.password.trim()) {
        setError("يرجى إدخال كلمة المرور");
        return;
      }

      setIsLoading(true);

      // Sign in with phone and password
      const result = await signInWithPhone(formData.phone, formData.password);

      if (result.success) {
        if (onSuccess) {
          onSuccess(result.user);
        }
        onClose();
      } else {
        setError(result.error || "حدث خطأ أثناء تسجيل الدخول");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error signing in:", error);
      setError("حدث خطأ أثناء تسجيل الدخول");
      setIsLoading(false);
    }
  };

  // Handle profile completion and registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Validate fields
      if (!formData.name.trim()) {
        setError("يرجى إدخال الاسم");
        return;
      }

      if (!formData.password.trim()) {
        setError("يرجى إدخال كلمة المرور");
        return;
      }

      if (formData.password.length < 6) {
        setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("كلمات المرور غير متطابقة");
        return;
      }

      setIsLoading(true);

      // Sign up with phone, password, and name
      const result = await signUpWithPhone(
        formData.phone,
        formData.password,
        formData.name
      );

      if (result.success) {
        if (onSuccess) {
          onSuccess(result.user);
        }
        onClose();
      } else {
        setError(result.error || "حدث خطأ أثناء إنشاء الحساب");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error signing up:", error);
      setError("حدث خطأ أثناء إنشاء الحساب");
      setIsLoading(false);
    }
  };

  // Handle resend verification code
  const handleResendCode = () => {
    if (countdown > 0) return;

    // In a real app, you would resend the verification code here
    setCountdown(60);
    // Simulate sending code
    setTimeout(() => {
      // Code sent
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              {step === "phone" &&
                (mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد")}
              {step === "verification" && "التحقق من رقم الهاتف"}
              {step === "password" && "تسجيل الدخول"}
              {step === "profile" && "إكمال بيانات الحساب"}
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Phone number step */}
          {step === "phone" && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-1.5">
                  رقم الهاتف
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="01xxxxxxxxx"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 pl-16 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <div className="absolute left-0 top-0 h-full flex items-center px-4 text-white/60 border-r border-slate-600">
                    +2
                  </div>
                </div>
                <p className="text-white/50 text-xs mt-1">
                  سنرسل لك رسالة نصية تحتوي على رمز التحقق
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    "إرسال رمز التحقق"
                  )}
                </button>
              </div>

              <div className="flex justify-center gap-2 pt-3">
                <span className="text-white/60">
                  {mode === "login" ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setMode(mode === "login" ? "register" : "login")
                  }
                  className="text-blue-400 hover:text-blue-300"
                >
                  {mode === "login" ? "إنشاء حساب" : "تسجيل الدخول"}
                </button>
              </div>
            </form>
          )}

          {/* Verification code step */}
          {step === "verification" && (
            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-1.5">
                  رمز التحقق
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 6) setVerificationCode(value);
                  }}
                  placeholder="أدخل الرمز المكون من 6 أرقام"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center tracking-wider text-xl"
                  maxLength={6}
                  disabled={isLoading}
                />
                <p className="text-white/50 text-xs mt-1">
                  تم إرسال رمز التحقق إلى {formData.phone}+
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>جاري التحقق...</span>
                    </>
                  ) : (
                    "تأكيد الرمز"
                  )}
                </button>
              </div>

              <div className="flex justify-between text-sm pt-2">
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="text-white/60 hover:text-white"
                >
                  تغيير رقم الهاتف
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={countdown > 0}
                  className={`text-blue-400 hover:text-blue-300 ${
                    countdown > 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {countdown > 0
                    ? `إعادة الإرسال (${countdown})`
                    : "إعادة إرسال الرمز"}
                </button>
              </div>
            </form>
          )}

          {/* Password step (for login) */}
          {step === "password" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="mb-2">
                <p className="text-white/80 text-sm">
                  تسجيل الدخول لرقم: {formData.phone}+
                </p>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-1.5">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="أدخل كلمة المرور"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>جاري تسجيل الدخول...</span>
                    </>
                  ) : (
                    "تسجيل الدخول"
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="text-white/60 hover:text-white text-sm"
                >
                  العودة
                </button>
              </div>
            </form>
          )}

          {/* Profile setup step (for registration) */}
          {step === "profile" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="mb-2">
                <p className="text-white/80 text-sm">
                  إكمال إنشاء حساب لرقم: {formData.phone}+
                </p>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-1.5">
                  الاسم
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="أدخل اسمك الكامل"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-1.5">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-1.5">
                  تأكيد كلمة المرور
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="أعد إدخال كلمة المرور"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>جاري إنشاء الحساب...</span>
                    </>
                  ) : (
                    "إنشاء الحساب"
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="text-white/60 hover:text-white text-sm"
                >
                  العودة
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
