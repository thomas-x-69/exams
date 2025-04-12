// components/PhoneAuth.js
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/ClientAuthContext";
import {
  auth,
  createRecaptchaVerifier,
  signInWithPhone,
  verifyCode,
} from "../lib/firebase";
import { signOut } from "firebase/auth";

const PhoneAuth = ({ onAuthenticated, isModal = false, onClose }) => {
  const { user, userProfile, createProfile, loading, error, setError } =
    useAuth();

  const [step, setStep] = useState(user ? "profile" : "phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  // Handle existing user detection
  useEffect(() => {
    if (user && !loading) {
      if (userProfile) {
        // User already has a profile, consider them fully registered
        setStep("profile");
        if (onAuthenticated) onAuthenticated(user, userProfile);
      } else {
        // User is authenticated but doesn't have a profile yet
        setStep("profile-setup");
      }
    }
  }, [user, userProfile, loading, onAuthenticated]);

  // Handle countdown for resending verification code
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Validate phone number format
  const validatePhoneNumber = (phone) => {
    // Check for Egyptian phone number format (starts with 01 followed by 9 digits)
    const phoneRegex = /^01[0125][0-9]{8}$/;
    return phoneRegex.test(phone);
  };

  // Format phone number for Firebase (add +2 country code for Egypt)
  const formatPhoneNumber = (phone) => {
    if (phone.startsWith("+2")) return phone;
    return `+2${phone}`;
  };

  // Handle phone number submission
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsProcessing(true);
      setValidationErrors({});

      // Validate phone number
      if (!phoneNumber.trim()) {
        setValidationErrors({ phone: "يرجى إدخال رقم الهاتف" });
        return;
      }

      if (!validatePhoneNumber(phoneNumber)) {
        setValidationErrors({ phone: "يرجى إدخال رقم هاتف مصري صحيح" });
        return;
      }

      // Create invisible reCAPTCHA
      const recaptchaVerifier = createRecaptchaVerifier(
        "recaptcha-container",
        () => {
          console.log("reCAPTCHA solved");
        }
      );

      // Send verification code
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      await signInWithPhone(formattedPhoneNumber, recaptchaVerifier);

      // Move to verification code step
      setStep("verification");
      setCountdown(60); // Start countdown for resend (60 seconds)
    } catch (error) {
      console.error("Error sending verification code:", error);
      setError("فشل في إرسال رمز التحقق. يرجى المحاولة مرة أخرى.");
      setValidationErrors({ phone: "حدث خطأ أثناء إرسال رمز التحقق" });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle verification code submission
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsProcessing(true);
      setValidationErrors({});

      if (!verificationCode.trim()) {
        setValidationErrors({ code: "يرجى إدخال رمز التحقق" });
        return;
      }

      // Verify code
      const result = await verifyCode(verificationCode);

      if (result.user) {
        // Check if user has a profile
        const existingProfile = userProfile;

        if (existingProfile) {
          // User already has a profile, move to success
          setStep("success");
          if (onAuthenticated) onAuthenticated(result.user, existingProfile);
        } else {
          // User needs to complete profile
          setStep("profile-setup");
        }
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setError("رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.");
      setValidationErrors({ code: "رمز التحقق غير صحيح" });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle profile setup
  const handleProfileSetup = async (e) => {
    e.preventDefault();

    try {
      setIsProcessing(true);
      setValidationErrors({});

      // Validate fields
      const errors = {};

      if (!name.trim()) {
        errors.name = "يرجى إدخال الاسم";
      }

      if (!password.trim()) {
        errors.password = "يرجى إدخال كلمة المرور";
      } else if (password.length < 6) {
        errors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
      }

      if (password !== confirmPassword) {
        errors.confirmPassword = "كلمات المرور غير متطابقة";
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }

      // Create user profile
      await createProfile({
        name,
        phone: phoneNumber,
        password: password, // Note: In a real app, you should hash this password
        isPremium: false,
        createdAt: new Date().toISOString(),
      });

      // Move to success step
      setStep("success");
      if (onAuthenticated) onAuthenticated(user, { name, phone: phoneNumber });
    } catch (error) {
      console.error("Error creating profile:", error);
      setError("حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle resend verification code
  const handleResendCode = async () => {
    if (countdown > 0) return;

    try {
      setIsProcessing(true);

      // Create new reCAPTCHA
      const recaptchaVerifier = createRecaptchaVerifier(
        "recaptcha-container",
        () => {
          console.log("reCAPTCHA solved for resend");
        }
      );

      // Resend verification code
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      await signInWithPhone(formattedPhoneNumber, recaptchaVerifier);

      // Reset countdown
      setCountdown(60);
    } catch (error) {
      console.error("Error resending verification code:", error);
      setError("فشل في إعادة إرسال رمز التحقق. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setStep("phone");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Render phone input step
  const renderPhoneStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">تسجيل الدخول</h2>

      <form onSubmit={handlePhoneSubmit} className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm mb-1">رقم الهاتف</label>
          <div className="relative">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`w-full bg-slate-700 border ${
                validationErrors.phone ? "border-red-500" : "border-slate-600"
              } rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 pl-16`}
              placeholder="01xxxxxxxxx"
              disabled={isProcessing}
            />
            <div className="absolute left-0 top-0 h-full flex items-center px-3 text-white/60 border-r border-slate-600">
              +2
            </div>
          </div>
          {validationErrors.phone && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.phone}
            </p>
          )}
        </div>

        <div id="recaptcha-container"></div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-lg font-bold transition-colors shadow-md flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>جاري الإرسال...</span>
            </>
          ) : (
            <span>إرسال رمز التحقق</span>
          )}
        </button>
      </form>
    </div>
  );

  // Render verification code step
  const renderVerificationStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-2">
        التحقق من رقم الهاتف
      </h2>
      <p className="text-white/70 text-sm mb-4">
        تم إرسال رمز التحقق إلى {formatPhoneNumber(phoneNumber)}
      </p>

      <form onSubmit={handleVerificationSubmit} className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm mb-1">رمز التحقق</label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className={`w-full bg-slate-700 border ${
              validationErrors.code ? "border-red-500" : "border-slate-600"
            } rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500`}
            placeholder="رمز التحقق المكون من 6 أرقام"
            maxLength={6}
            disabled={isProcessing}
          />
          {validationErrors.code && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.code}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-lg font-bold transition-colors shadow-md flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>جاري التحقق...</span>
            </>
          ) : (
            <span>تأكيد</span>
          )}
        </button>

        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => setStep("phone")}
            className="text-white/60 hover:text-white"
            disabled={isProcessing}
          >
            تغيير رقم الهاتف
          </button>

          <button
            type="button"
            onClick={handleResendCode}
            className={`text-amber-400 hover:text-amber-300 ${
              countdown > 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={countdown > 0 || isProcessing}
          >
            {countdown > 0
              ? `إعادة الإرسال (${countdown})`
              : "إعادة إرسال الرمز"}
          </button>
        </div>
      </form>
    </div>
  );

  // Render profile setup step
  const renderProfileSetupStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-2">إكمال الحساب</h2>
      <p className="text-white/70 text-sm mb-4">
        يرجى إكمال بيانات حسابك للاستمرار
      </p>

      <form onSubmit={handleProfileSetup} className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm mb-1">الاسم</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full bg-slate-700 border ${
              validationErrors.name ? "border-red-500" : "border-slate-600"
            } rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500`}
            placeholder="الاسم الكامل"
            disabled={isProcessing}
          />
          {validationErrors.name && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-white/80 text-sm mb-1">
            كلمة المرور
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full bg-slate-700 border ${
              validationErrors.password ? "border-red-500" : "border-slate-600"
            } rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500`}
            placeholder="كلمة المرور (6 أحرف على الأقل)"
            disabled={isProcessing}
          />
          {validationErrors.password && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.password}
            </p>
          )}
        </div>

        <div>
          <label className="block text-white/80 text-sm mb-1">
            تأكيد كلمة المرور
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full bg-slate-700 border ${
              validationErrors.confirmPassword
                ? "border-red-500"
                : "border-slate-600"
            } rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500`}
            placeholder="تأكيد كلمة المرور"
            disabled={isProcessing}
          />
          {validationErrors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-lg font-bold transition-colors shadow-md flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>جاري الإنشاء...</span>
            </>
          ) : (
            <span>إنشاء الحساب</span>
          )}
        </button>
      </form>
    </div>
  );

  // Render success step
  const renderSuccessStep = () => (
    <div className="text-center">
      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
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
      <p className="text-white/70 mb-4">
        أهلاً بك {userProfile?.name || name} في منصة الاختبارات المصرية
      </p>

      {isModal ? (
        <button
          onClick={onClose}
          className="bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-6 rounded-lg font-bold transition-colors shadow-md"
        >
          استمرار
        </button>
      ) : (
        <div className="space-y-3">
          <button
            onClick={onClose || (() => window.location.reload())}
            className="bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-6 rounded-lg font-bold transition-colors shadow-md w-full"
          >
            استمرار
          </button>

          <button
            onClick={handleLogout}
            className="text-white/60 hover:text-white text-sm"
          >
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );

  // Render profile step (already logged in)
  const renderProfileStep = () => (
    <div className="text-center">
      <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-10 h-10 text-blue-500"
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

      <h2 className="text-xl font-bold text-white mb-2">مرحبًا بعودتك!</h2>
      <p className="text-white/70 mb-4">
        أهلاً {userProfile?.name || "المستخدم"} في منصة الاختبارات المصرية
      </p>

      {isModal ? (
        <button
          onClick={onClose}
          className="bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-6 rounded-lg font-bold transition-colors shadow-md"
        >
          استمرار
        </button>
      ) : (
        <div className="space-y-3">
          <button
            onClick={onClose || (() => window.location.reload())}
            className="bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-6 rounded-lg font-bold transition-colors shadow-md w-full"
          >
            استمرار
          </button>

          <button
            onClick={handleLogout}
            className="text-white/60 hover:text-white text-sm"
          >
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );

  // Main render function based on current step
  const renderStep = () => {
    switch (step) {
      case "phone":
        return renderPhoneStep();
      case "verification":
        return renderVerificationStep();
      case "profile-setup":
        return renderProfileSetupStep();
      case "success":
        return renderSuccessStep();
      case "profile":
        return renderProfileStep();
      default:
        return renderPhoneStep();
    }
  };

  // Display error message if any
  const renderError = () => {
    if (!error) return null;

    return (
      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {renderError()}
      {renderStep()}
    </div>
  );
};

export default PhoneAuth;
