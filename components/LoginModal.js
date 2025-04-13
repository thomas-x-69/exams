// components/LoginModal.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "./AuthModal";
import PhoneAuthentication from "./PhoneAuthentication";

const LoginModal = ({ isOpen, onClose, onSuccess, initialMode = "login" }) => {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState("password"); // 'password' or 'phone'

  // Reset auth method when modal is opened
  useEffect(() => {
    if (isOpen) {
      setAuthMethod("password"); // Default to password auth
    }
  }, [isOpen]);

  // Handle success callback
  const handleSuccess = (user) => {
    if (onSuccess) {
      onSuccess(user);
    }
    onClose();
  };

  // Switch between auth methods
  const toggleAuthMethod = () => {
    setAuthMethod(authMethod === "password" ? "phone" : "password");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
      <div className="w-full max-w-md relative">
        {/* Close button outside modals for better mobile experience */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-full bg-slate-800/70 border border-white/10 text-white/70 hover:text-white hover:bg-slate-700/70 transition-colors z-20"
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

        {/* Auth method selector */}
        <div className="glass-card mb-4 p-2 rounded-xl border border-white/10 bg-slate-800/70 flex shadow-lg">
          <button
            onClick={() => setAuthMethod("password")}
            className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
              authMethod === "password"
                ? "bg-blue-600 text-white shadow-md"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4"
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
              <span className="text-xs sm:text-sm">البريد وكلمة المرور</span>
            </div>
          </button>

          <button
            onClick={() => setAuthMethod("phone")}
            className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
              authMethod === "phone"
                ? "bg-blue-600 text-white shadow-md"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4"
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
              <span className="text-xs sm:text-sm">رقم الهاتف</span>
            </div>
          </button>
        </div>

        {/* Auth component based on selected method */}
        {authMethod === "password" ? (
          <AuthModal
            isOpen={true}
            onClose={onClose}
            onSuccess={handleSuccess}
            initialMode={initialMode}
          />
        ) : (
          <PhoneAuthentication onComplete={handleSuccess} onCancel={onClose} />
        )}
      </div>
    </div>
  );
};

export default LoginModal;
