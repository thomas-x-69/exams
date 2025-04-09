// components/ExitConfirmationDialog.js
"use client";

import React, { useEffect, useRef } from "react";

const ExitConfirmationDialog = ({ isOpen, onCancel, onConfirm, message }) => {
  const dialogRef = useRef(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onCancel]);

  // Focus trap for accessibility
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      // Focus the dialog when it opens
      dialogRef.current.focus();

      // Prevent scrolling on body when dialog is open
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = "auto";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>

      {/* Dialog */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          ref={dialogRef}
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 transform transition-all animate-in fade-in zoom-in-95 duration-200"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
        >
          <div className="text-center sm:text-right">
            {/* Warning Icon */}
            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4">
              <svg
                className="h-8 w-8 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">
              تحذير: سيتم فقدان تقدمك
            </h3>

            <p className="text-gray-600 text-base mb-6">
              {message ||
                "سيتم فقدان جميع إجاباتك ولا يمكن استعادتها. هل أنت متأكد من الخروج؟"}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row-reverse gap-2 sm:gap-3 justify-center">
              <button
                type="button"
                onClick={onConfirm}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
                autoFocus
              >
                نعم، الخروج
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
              >
                البقاء في الاختبار
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitConfirmationDialog;
