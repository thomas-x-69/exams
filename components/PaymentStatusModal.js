// components/PaymentStatusModal.js
import React from "react";
import { useRouter } from "next/navigation";

const PaymentStatusModal = ({ isOpen, status, onClose }) => {
  const router = useRouter();

  if (!isOpen || !status) return null;

  const getStatusIcon = () => {
    switch (status.status) {
      case "success":
        return (
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-green-600"
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
        );
      case "error":
        return (
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-red-600"
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
          </div>
        );
      case "pending":
      default:
        return (
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-blue-600 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        );
    }
  };

  const handleAction = () => {
    if (status.status === "success") {
      // Navigate to premium content or dashboard
      router.push("/premium-exams");
    } else {
      // Close the modal
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center animate-in fade-in zoom-in duration-300">
        {getStatusIcon()}

        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {status.status === "success"
            ? "تم الدفع بنجاح!"
            : status.status === "error"
            ? "حدث خطأ!"
            : "جاري معالجة الدفع"}
        </h3>

        <p className="text-gray-600 mb-6">{status.message}</p>

        <button
          onClick={handleAction}
          className={`px-8 py-2 rounded-lg font-bold text-white ${
            status.status === "success"
              ? "bg-green-600 hover:bg-green-700"
              : status.status === "error"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-600"
          } transition-colors`}
        >
          {status.status === "success"
            ? "استعرض المحتوى المميز"
            : status.status === "error"
            ? "حاول مرة أخرى"
            : "انتظار..."}
        </button>
      </div>
    </div>
  );
};

export default PaymentStatusModal;
