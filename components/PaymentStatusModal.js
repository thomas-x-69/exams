// components/PaymentStatusModal.js
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/ClientAuthContext";

const PaymentStatusModal = ({ isOpen, status, onClose }) => {
  const router = useRouter();
  const { activatePremium } = useAuth();

  // Handle successful payment
  useEffect(() => {
    if (
      isOpen &&
      status?.status === "success" &&
      status?.verifiedByServer === true
    ) {
      // Only activate premium if payment was verified by the server
      const activatePremiumSubscription = async () => {
        const result = await activatePremium(30); // 30 days

        if (result.success) {
          // Set a timer to redirect to premium content
          const timer = setTimeout(() => {
            router.push("/premium-exams");
          }, 3000);
          return () => clearTimeout(timer);
        }
      };

      activatePremiumSubscription();
    }
  }, [isOpen, status, router, activatePremium]);

  if (!isOpen || !status) return null;

  const getStatusIcon = () => {
    switch (status.status) {
      case "success":
        return (
          <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20">
            <svg
              className="w-14 h-14 text-green-600"
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
          <div className="w-24 h-24 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/20">
            <svg
              className="w-14 h-14 text-red-600"
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
          <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20">
            <svg
              className="w-14 h-14 text-blue-600 animate-spin-slow"
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
    if (status.status === "success" && status.verifiedByServer === true) {
      // Navigate to premium content or dashboard
      router.push("/premium-exams");
    } else if (status.status === "pending") {
      // For pending payments with reference number
      if (status.referenceNumber) {
        navigator.clipboard.writeText(status.referenceNumber);
        alert("تم نسخ رقم المرجع: " + status.referenceNumber);
      }
    } else {
      // Close the modal for errors
      onClose();
    }
  };

  const getBackgroundColor = () => {
    switch (status.status) {
      case "success":
        return "bg-gradient-to-br from-white to-green-50";
      case "error":
        return "bg-gradient-to-br from-white to-red-50";
      case "pending":
      default:
        return "bg-gradient-to-br from-white to-blue-50";
    }
  };

  const getBorderColor = () => {
    switch (status.status) {
      case "success":
        return "border-green-200";
      case "error":
        return "border-red-200";
      case "pending":
      default:
        return "border-blue-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className={`${getBackgroundColor()} rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in zoom-in fade-in duration-300 border-2 ${getBorderColor()}`}
      >
        {getStatusIcon()}

        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          {status.status === "success"
            ? "تم الاشتراك بنجاح!"
            : status.status === "error"
            ? "حدث خطأ!"
            : "جاري معالجة الدفع"}
        </h3>

        <p className="text-gray-600 mb-6 text-lg">{status.message}</p>

        {status.status === "pending" && status.referenceNumber && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 font-medium text-sm">رقم المرجع:</p>
            <p className="text-xl font-bold text-blue-900">
              {status.referenceNumber}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              اضغط على الزر أدناه لنسخ الرقم
            </p>
          </div>
        )}

        {status.status === "success" && status.verifiedByServer === true && (
          <>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-green-500 animate-pulse"
                style={{ width: "100%" }}
              ></div>
            </div>
            <p className="text-gray-500 mb-4 text-sm">
              جاري تحويلك للمحتوى المميز خلال ثواني...
            </p>
            <p className="text-gray-500 mb-4 text-sm">
              بدأ اشتراكك الشهري بنجاح وسيكون صالحاً لمدة شهر كامل.
            </p>
          </>
        )}

        <button
          onClick={handleAction}
          className={`px-8 py-3 rounded-xl font-bold text-white text-lg transition-all duration-300 hover:shadow-lg ${
            status.status === "success"
              ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              : status.status === "error"
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              : "bg-gradient-to-r from-blue-500 to-indigo-600"
          }`}
        >
          {status.status === "success" && status.verifiedByServer === true
            ? "استعرض المحتوى المميز"
            : status.status === "pending" && status.referenceNumber
            ? "نسخ رقم المرجع"
            : status.status === "error"
            ? "حاول مرة أخرى"
            : "انتظار..."}
        </button>

        {status.status === "error" && (
          <p className="mt-4 text-gray-500 text-sm">
            إذا واجهت أي مشكلة، يرجى التواصل مع الدعم الفني على{" "}
            <span className="font-medium text-gray-800">
              support@egyptianexams.com
            </span>
          </p>
        )}
      </div>

      {/* Custom animation */}
      <style jsx>{`
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-in {
          animation: fade-in 0.3s ease-out;
        }

        @keyframes zoom-in {
          0% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
          }
        }
        .zoom-in {
          animation: zoom-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PaymentStatusModal;
