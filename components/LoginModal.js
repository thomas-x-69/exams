// components/LoginModal.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "./AuthModal";

const LoginModal = ({ isOpen, onClose, onSuccess, initialMode = "login" }) => {
  const router = useRouter();

  // Handle success callback
  const handleSuccess = (user) => {
    if (onSuccess) {
      onSuccess(user);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md relative">
        {/* Close button outside modal for better mobile experience */}
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

        {/* Auth component */}
        <AuthModal
          isOpen={true}
          onClose={onClose}
          onSuccess={handleSuccess}
          initialMode={initialMode}
        />
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoginModal;
