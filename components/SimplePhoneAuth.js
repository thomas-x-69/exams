// components/SimplePhoneAuth.js
"use client";

import React, { useState, useEffect } from "react";

const SimplePhoneAuth = ({ onComplete, isProcessingPayment }) => {
  const [step, setStep] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  // Handle countdown for resending verification code
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Validate phone number format - Egyptian numbers
  const validatePhoneNumber = (phone) => {
    // Check for Egyptian phone number format (starts with 01 followed by 9 digits)
    const phoneRegex = /^01[0125][0-9]{8}$/;
    return phoneRegex.test(phone);
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
        setIsProcessing(false);
        return;
      }

      if (!validatePhoneNumber(phoneNumber)) {
        setValidationErrors({ phone: "يرجى إدخال رقم هاتف مصري صحيح" });
        setIsProcessing(false);
        return;
      }

      // Simulate sending code - In a real app, you would call your API here
      // This is client-side only for demo purposes
      setTimeout(() => {
        // Move to verification code step
        setStep("verification");
        setCountdown(60); // Start countdown for resend (60 seconds)
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      console.error("Error sending verification code:", error);
      setValidationErrors({ phone: "حدث خطأ أثناء إرسال رمز التحقق" });
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
        setIsProcessing(false);
        return;
      }

      // Validate code format
      if (!/^\d{6}$/.test(verificationCode)) {
        setValidationErrors({ code: "يجب أن يكون رمز التحقق 6 أرقام" });
        setIsProcessing(false);
        return;
      }

      // For demo purposes, we'll accept any 6-digit code
      // In a real app, you would validate this with your backend

      // For this demo, let's consider the verification successful
      setTimeout(() => {
        // User needs to complete profile
        setStep("profile-setup");
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      console.error("Error verifying code:", error);
      setValidationErrors({ code: "رمز التحقق غير صحيح" });
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
        setIsProcessing(false);
        return;
      }

      // Create user profile - In a real app, you'd save this to your backend
      const userProfile = {
        name,
        phone: phoneNumber,
        password, // Note: In a real app, you should never store plain text passwords
      };

      // Simulate API call
      setTimeout(() => {
        // Save to localStorage for demo purposes
        localStorage.setItem("userName", name);
        localStorage.setItem("userPhone", phoneNumber);

        if (onComplete) {
          onComplete(userProfile);
        }

        setStep("success");
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      console.error("Error creating profile:", error);
      setIsProcessing(false);
    }
  };

  // Handle resend verification code
  const handleResendCode = async () => {
    if (countdown > 0) return;

    try {
      setIsProcessing(true);

      // Simulate resending code
      setTimeout(() => {
        setCountdown(60);
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      console.error("Error resending verification code:", error);
      setIsProcessing(false);
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
        تم إرسال رمز التحقق إلى {"+2" + phoneNumber}
      </p>

      <form onSubmit={handleVerificationSubmit} className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm mb-1">رمز التحقق</label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => {
              // Only allow digits
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 6) {
                setVerificationCode(value);
              }
            }}
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
      <h2 className="text-xl font-bold text-white mb-2">إكمال بيانات الحساب</h2>
      <p className="text-white/70 text-sm mb-4">
        يرجى إكمال بيانات حسابك للاستمرار بالدفع
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
            <span>إكمال بيانات الحساب والمتابعة للدفع</span>
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
        تم تسجيل البيانات بنجاح!
      </h2>
      <p className="text-white/70 mb-4">
        أهلاً بك {name} في منصة الاختبارات المصرية
      </p>
      <p className="text-white/70 mb-4">
        يمكنك الآن المتابعة لإتمام الاشتراك الذهبي
      </p>

      <button
        onClick={() => {
          if (onComplete) {
            onComplete({ name, phone: phoneNumber });
          }
        }}
        className="bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-6 rounded-lg font-bold transition-colors shadow-md"
      >
        متابعة لإتمام الاشتراك
      </button>
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
      default:
        return renderPhoneStep();
    }
  };

  // Display error message if there's a validation error
  const renderError = () => {
    const errorValues = Object.values(validationErrors);
    if (errorValues.length === 0) return null;

    // Just display an error message at the top for all validation errors
    return (
      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
        <p className="text-red-400 text-sm">{errorValues[0]}</p>
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

export default SimplePhoneAuth;
