// components/ExitConfirmationDialog.js
"use client";

import React from "react";

const ExitConfirmationDialog = ({ isOpen, onCancel, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
        onClick={onCancel} // Allow clicking outside to cancel
      ></div>

      {/* Dialog Content */}
      <div className="relative max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
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
          </div>

          <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
            هل أنت متأكد من الخروج؟
          </h3>

          <p className="text-center text-gray-600 mb-6">
            {message ||
              "سيتم فقدان تقدمك في الاختبار ولا يمكن استعادته. هل تريد الخروج بالفعل؟"}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-800 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-700 rounded-xl font-medium text-white transition-colors"
            >
              تأكيد الخروج
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitConfirmationDialog;
