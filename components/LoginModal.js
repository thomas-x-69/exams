// components/LoginModal.js
"use client";

import React from "react";
import AuthModal from "./AuthModal";

const LoginModal = ({ isOpen, onClose, onSuccess, initialMode = "login" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      {/* Auth Modal - close button is now part of the header in AuthModal */}
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
