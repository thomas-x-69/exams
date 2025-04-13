// components/LoginModal.js
"use client";

import React from "react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in overflow-auto">
      <div className="w-full max-w-md relative bg-slate-700 rounded-2xl">
        {/* Close button outside modal for better mobile experience */}
        <button
          onClick={onClose}
          className=" absolute -top-12 left-0 p-2 rounded-full bg-slate-800/80 border border-white/20 text-white/80 hover:text-white hover:bg-slate-700/80 transition-colors z-20 group"
          aria-label="إغلاق"
        >
          <svg
            className="w-5 h-5 group-hover:scale-110 transition-transform"
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
          <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 left-1/2 -translate-x-1/2 -bottom-8 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            إغلاق النافذة
          </span>
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
