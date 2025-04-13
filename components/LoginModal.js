// components/LoginModal.js
"use client";

import React from "react";
import AuthModal from "./AuthModal";

const LoginModal = ({ isOpen, onClose, onSuccess, initialMode = "login" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-white/70 hover:text-white"
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={true}
        onClose={onClose}
        onSuccess={onSuccess}
        initialMode={initialMode}
      />
    </div>
  );
};

export default LoginModal;
