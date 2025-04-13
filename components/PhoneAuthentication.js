// components/PhoneAuthentication.js
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  createRecaptchaVerifier,
  signInWithPhone,
  verifyCode,
  registerUser,
} from "../lib/firebase";

const PhoneAuthentication = ({ onComplete, onCancel }) => {
  const { user, userProfile, login } = useAuth();
  const [step, setStep] = useState("phone"); // phone, verification, profile, success
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [showLoginStep, setShowLoginStep] = useState(false);

  // Set up countdown timer for resending verification code
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Clear error when step changes
  useEffect(() => {
    setError("");
  }, [step]);

  // Validate phone number (Egyptian format)
  const validatePhoneNumber = (phone) => {
    // Egyptian phone numbers: 01x followed by 8 digits
    const phoneRegex = /^01[0125][0-9]{8}$/;
    return phoneRegex.test(phone);
  };

  // Format phone number for Firebase (add +2 country code for Egypt)
  const formatPhoneNumber = (phone) => {
    return `+2${phone}`;
  };

  // Handle phone number submission
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Validate phone number
      if (!phoneNumber.trim()) {
        setError("يرجى إدخال رقم الهاتف");
        return;
      }

      if (!validatePhoneNumber(phoneNumber)) {
        setError("يرجى إدخال رقم هاتف مصري صحيح");
        return;
      }

      setIsLoading(true);

      // Create invisible reCAPTCHA
      const recaptchaVerifier = createRecaptchaVerifier(
        "recaptcha-container",
        () => {
          console.log("reCAPTCHA solved");
          setRecaptchaVerified(true);
        }
      );

      // Format phone number and send verification code
      const formattedPhone = formatPhoneNumber(phoneNumber);
      await signInWithPhone(formattedPhone, recaptchaVerifier);

      // Move to verification step
      setStep("verification");
      setCountdown(60); // Start 60-second countdown
    } catch (err) {
      console.error("Error sending verification code:", err);
      setError(
        err.message || "حدث خطأ أثناء إرسال رمز التحقق. يرجى المحاولة مرة أخرى."
      );
    } finally {
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

      if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
        setError("رمز التحقق يجب أن يكون 6 أرقام");
        return;
      }

      setIsLoading(true);

      // Verify code with Firebase
      const result = await verifyCode(verificationCode);

      if (result && result.user) {
        setAuthUser(result.user);

        // Try to login first with a dummy password to check if user exists
        const loginResult = await login(
          phoneNumber,
          "checking_if_exists_123456"
        );

        if (loginResult.success) {
          // User exists, move to success step
          if (onComplete) {
            onComplete(loginResult.user, loginResult.userData);
          } else {
            setStep("success");
          }
        } else {
          // User doesn't exist or password was wrong, check if it's a new user
          setShowLoginStep(true);
          setStep("login_or_create");
        }
      }
    } catch (err) {
      console.error("Error verifying code:", err);
      setError(err.message || "رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle login with registered account
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Validate password
      if (!password.trim()) {
        setError("يرجى إدخال كلمة المرور");
        return;
      }

      setIsLoading(true);

      // Try to login
      const loginResult = await login(phoneNumber, password);

      if (loginResult.success) {
        // Login successful
        if (onComplete) {
          onComplete(loginResult.user, loginResult.userData);
        } else {
          setStep("success");
        }
      } else {
        setError(loginResult.error || "كلمة المرور غير صحيحة");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile completion
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Validate profile info
      if (!name.trim()) {
        setError("يرجى إدخال الاسم");
        return;
      }

      if (!password.trim()) {
        setError("يرجى إدخال كلمة المرور");
        return;
      }

      if (password.length < 6) {
        setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
        return;
      }

      if (password !== confirmPassword) {
        setError("كلمة المرور غير متطابقة");
        return;
      }

      setIsLoading(true);

      // Register user in Firestore
      const result = await registerUser({
        name,
        phone: phoneNumber,
        password,
      });

      if (result.success) {
        // Success - register complete
        if (onComplete) {
          onComplete(result.user, result.userData);
        } else {
          setStep("success");
        }
      } else {
        setError(result.error || "حدث خطأ أثناء إنشاء الحساب");
      }
    } catch (err) {
      console.error("Error creating profile:", err);
      setError(err.message || "حدث خطأ أثناء إنشاء الملف الشخصي");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resending verification code
  const handleResendCode = async () => {
    if (countdown > 0) return;

    try {
      setIsLoading(true);
      setError("");

      // Create new reCAPTCHA
      const recaptchaVerifier = createRecaptchaVerifier(
        "recaptcha-resend",
        () => {
          console.log("reCAPTCHA solved for resend");
        }
      );

      // Format phone and resend code
      const formattedPhone = formatPhoneNumber(phoneNumber);
      await signInWithPhone(formattedPhone, recaptchaVerifier);

      // Reset countdown
      setCountdown(60);
    } catch (err) {
      console.error("Error resending code:", err);
      setError(err.message || "حدث خطأ أثناء إعادة إرسال رمز التحقق");
    } finally {
      setIsLoading(false);
    }
  };

  // Render phone step
  const renderPhoneStep = () => (
    <div className="glass-card p-6 border border-white/10 rounded-xl bg-slate-800/50 backdrop-blur-sm shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
        <span>تسجيل الدخول برقم الهاتف</span>
      </h2>

      <form onSubmit={handlePhoneSubmit} className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm mb-1.5">
            رقم الهاتف
          </label>
          <div className="relative">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors pl-16 dir-ltr text-left"
              placeholder="01xxxxxxxxx"
              disabled={isLoading}
            />
            <div className="absolute left-0 top-0 h-full flex items-center px-4 text-white/60 border-r border-slate-600">
              +2
            </div>
          </div>
          <p className="text-white/50 text-xs mt-1">
            سيتم إرسال رمز التحقق في رسالة نصية
          </p>
        </div>

        {/* Invisible reCAPTCHA container */}
        <div id="recaptcha-container"></div>

        <div className="pt-2 space-y-3">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg font-bold transition-colors shadow-md disabled:bg-blue-700/50 disabled:cursor-not-allowed relative overflow-hidden"
          >
            {isLoading ? (
              <>
                <span className="opacity-0">إرسال رمز التحقق</span>
                <div className="absolute inset-0 flex items-center justify-center gap-2">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري الإرسال...</span>
                </div>
              </>
            ) : (
              <span>إرسال رمز التحقق</span>
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-white/10 hover:bg-white/15 text-white/80 hover:text-white py-2.5 rounded-lg font-medium transition-colors border border-white/5 hover:border-white/10"
            >
              إلغاء
            </button>
          )}
        </div>
      </form>
    </div>
  );

  // Render verification code step
  const renderVerificationStep = () => (
    <div className="glass-card p-6 border border-white/10 rounded-xl bg-slate-800/50 backdrop-blur-sm shadow-lg">
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-blue-400"
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
        <span>التحقق من رقم الهاتف</span>
      </h2>

      <p className="text-white/70 text-sm mb-4">
        تم إرسال رمز التحقق برسالة نصية إلى {formatPhoneNumber(phoneNumber)}
      </p>

      <form onSubmit={handleVerificationSubmit} className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm mb-1.5">
            رمز التحقق
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => {
              // Only allow digits and limit to 6 characters
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 6) {
                setVerificationCode(value);
              }
            }}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-center font-mono text-xl tracking-wider"
            placeholder="⬚⬚⬚⬚⬚⬚"
            maxLength={6}
            disabled={isLoading}
          />
        </div>

        {/* Invisible reCAPTCHA container for resend */}
        <div id="recaptcha-resend"></div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg font-bold transition-colors shadow-md disabled:bg-blue-700/50 disabled:cursor-not-allowed relative overflow-hidden"
          >
            {isLoading ? (
              <>
                <span className="opacity-0">تأكيد الرمز</span>
                <div className="absolute inset-0 flex items-center justify-center gap-2">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري التحقق...</span>
                </div>
              </>
            ) : (
              <span>تأكيد الرمز</span>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between text-sm pt-1">
          <button
            type="button"
            onClick={() => setStep("phone")}
            className="text-white/60 hover:text-white"
            disabled={isLoading}
          >
            تغيير رقم الهاتف
          </button>

          <button
            type="button"
            onClick={handleResendCode}
            className={`text-blue-400 hover:text-blue-300 ${
              countdown > 0 || isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={countdown > 0 || isLoading}
          >
            {countdown > 0
              ? `إعادة الإرسال (${countdown})`
              : "إعادة إرسال الرمز"}
          </button>
        </div>
      </form>
    </div>
  );

  // Render login or create profile decision step
  const renderLoginOrCreateStep = () => (
    <div className="glass-card p-6 border border-white/10 rounded-xl bg-slate-800/50 backdrop-blur-sm shadow-lg">
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-blue-400"
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
        <span>حساب موجود أم جديد؟</span>
      </h2>

      <p className="text-white/70 text-sm mb-6">
        تم التحقق من رقم هاتفك بنجاح. هل لديك حساب مسجل بالفعل؟
      </p>

      <div className="space-y-3">
        <button
          onClick={() => setStep("login")}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg font-bold transition-colors shadow-md"
        >
          نعم، لدي حساب مسجل
        </button>

        <button
          onClick={() => setStep("profile")}
          className="w-full bg-white/10 hover:bg-white/15 text-white py-2.5 rounded-lg font-medium transition-colors border border-white/5 hover:border-white/10"
        >
          لا، أريد إنشاء حساب جديد
        </button>
      </div>
    </div>
  );

  // Render login step for existing users
  const renderLoginStep = () => (
    <div className="glass-card p-6 border border-white/10 rounded-xl bg-slate-800/50 backdrop-blur-sm shadow-lg">
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-blue-400"
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
        <span>تسجيل الدخول</span>
      </h2>

      <p className="text-white/70 text-sm mb-4">
        الرجاء إدخال كلمة المرور للدخول إلى حسابك على رقم الهاتف {phoneNumber}
      </p>

      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm mb-1.5">
            كلمة المرور
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="كلمة المرور"
            disabled={isLoading}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg font-bold transition-colors shadow-md disabled:bg-blue-700/50 disabled:cursor-not-allowed relative overflow-hidden"
          >
            {isLoading ? (
              <>
                <span className="opacity-0">تسجيل الدخول</span>
                <div className="absolute inset-0 flex items-center justify-center gap-2">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري التحقق...</span>
                </div>
              </>
            ) : (
              <span>تسجيل الدخول</span>
            )}
          </button>
        </div>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setStep("login_or_create")}
            className="text-white/60 hover:text-white text-sm"
            disabled={isLoading}
          >
            رجوع
          </button>
        </div>
      </form>
    </div>
  );

  // Render profile setup step
  const renderProfileStep = () => (
    <div className="glass-card p-6 border border-white/10 rounded-xl bg-slate-800/50 backdrop-blur-sm shadow-lg">
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-blue-400"
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
        <span>إنشاء حساب جديد</span>
      </h2>

      <p className="text-white/70 text-sm mb-4">
        تم التحقق من رقم هاتفك بنجاح. يرجى إكمال بيانات حسابك للاستمرار
      </p>

      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm mb-1.5">الاسم</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="الاسم الكامل"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm mb-1.5">
            كلمة المرور
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="كلمة المرور (6 أحرف على الأقل)"
            disabled={isLoading}
          />
          <p className="text-white/50 text-xs mt-1">
            كلمة المرور يجب أن تكون 6 أحرف على الأقل
          </p>
        </div>

        <div>
          <label className="block text-white/80 text-sm mb-1.5">
            تأكيد كلمة المرور
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="تأكيد كلمة المرور"
            disabled={isLoading}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg font-bold transition-colors shadow-md disabled:bg-blue-700/50 disabled:cursor-not-allowed relative overflow-hidden"
          >
            {isLoading ? (
              <>
                <span className="opacity-0">إنشاء الحساب</span>
                <div className="absolute inset-0 flex items-center justify-center gap-2">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري الإنشاء...</span>
                </div>
              </>
            ) : (
              <span>إنشاء الحساب</span>
            )}
          </button>
        </div>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setStep("login_or_create")}
            className="text-white/60 hover:text-white text-sm"
            disabled={isLoading}
          >
            رجوع
          </button>
        </div>
      </form>
    </div>
  );

  // Render success step
  const renderSuccessStep = () => (
    <div className="glass-card p-6 border border-white/10 rounded-xl bg-slate-800/50 backdrop-blur-sm shadow-lg text-center">
      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500/30">
        <svg
          className="w-10 h-10 text-green-500"
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

      <h2 className="text-xl font-bold text-white mb-2">
        تم تسجيل الدخول بنجاح!
      </h2>
      <p className="text-white/70 mb-6">
        أهلاً بك {name || userProfile?.name || "المستخدم"} في منصة الاختبارات
        المصرية
      </p>

      <button
        onClick={() => {
          if (onComplete) {
            onComplete(authUser || user, {
              name: name || userProfile?.name,
              phone: phoneNumber,
            });
          }
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-6 rounded-lg font-bold transition-colors shadow-md"
      >
        استمرار
      </button>
    </div>
  );

  // Show error message if any
  const renderError = () => {
    if (!error) return null;

    return (
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
    );
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (step) {
      case "phone":
        return renderPhoneStep();
      case "verification":
        return renderVerificationStep();
      case "login_or_create":
        return renderLoginOrCreateStep();
      case "login":
        return renderLoginStep();
      case "profile":
        return renderProfileStep();
      case "success":
        return renderSuccessStep();
      default:
        return renderPhoneStep();
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      {renderError()}
      {renderCurrentStep()}
    </div>
  );
};

export default PhoneAuthentication;
