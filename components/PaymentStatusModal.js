// components/PaymentStatusModal.js
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClientAuth } from "../context/ClientAuthContext";
import { handleSuccessfulPayment } from "../utils/premiumService";

const PaymentStatusModal = ({
  isOpen,
  status,
  onClose,
  planType = "monthly",
}) => {
  const router = useRouter();
  const { user, userProfile, activatePremium } = useClientAuth();

  // Handle successful payment
  useEffect(() => {
    if (
      isOpen &&
      status?.status === "success" &&
      status?.verifiedByServer === true
    ) {
      // Activate premium subscription based on plan type
      const activatePremiumSubscription = async () => {
        try {
          // Get duration based on plan type
          let duration = 30; // Default: monthly

          if (planType === "yearly") {
            duration = 365;
          } else if (planType === "quarterly") {
            duration = 90;
          }

          // Get user ID
          const userId = user?.uid || userProfile?.id;

          // Use premium service utility to handle the payment
          const result = await handleSuccessfulPayment(userId, {
            id: planType,
            duration,
          });

          if (result.success) {
            // Set a timer to redirect to premium content
            const timer = setTimeout(() => {
              router.push("/premium-exams");
            }, 3000);
            return () => clearTimeout(timer);
          }
        } catch (error) {
          console.error("Error activating premium:", error);
        }
      };

      activatePremiumSubscription();
    }
  }, [isOpen, status, router, activatePremium, user, userProfile, planType]);

  if (!isOpen || !status) return null;

  const getStatusContent = () => {
    switch (status.status) {
      case "success":
        return (
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400/20 to-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-500/40 shadow-lg shadow-green-500/10">
              <svg
                className="w-12 h-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              تم الاشتراك بنجاح!
            </h3>

            <p className="text-white/80 text-lg mb-6">
              {status.message ||
                "تم تفعيل العضوية المميزة بنجاح! استمتع بالوصول إلى جميع الامتحانات الحقيقية."}
            </p>

            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-green-500 animate-pulse-fast"
                style={{ width: "100%" }}
              ></div>
            </div>

            <p className="text-white/60 mb-6 text-sm">
              جاري تحويلك للمحتوى المميز خلال ثواني...
            </p>

            <button
              onClick={() => router.push("/premium-exams")}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-600/20"
            >
              استعرض المحتوى المميز الآن
            </button>
          </div>
        );

      case "error":
        return (
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-red-400/20 to-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-500/40 shadow-lg shadow-red-500/10">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              حدث خطأ!
            </h3>

            <p className="text-white/80 text-lg mb-6">
              {status.message ||
                "حدث خطأ أثناء عملية الدفع. يرجى المحاولة مرة أخرى."}
            </p>

            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-600/20"
            >
              المحاولة مرة أخرى
            </button>

            <p className="mt-6 text-white/50 text-sm">
              إذا واجهت أي مشكلة، يرجى التواصل مع الدعم الفني على{" "}
              <a
                href="mailto:support@egyptianexams.com"
                className="text-blue-400 hover:text-blue-300"
              >
                support@egyptianexams.com
              </a>
            </p>
          </div>
        );

      case "pending":
      default:
        return (
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400/20 to-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-blue-500/40 shadow-lg shadow-blue-500/10 relative">
              <svg
                className="w-12 h-12 text-blue-500 animate-spin-slow"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="60"
                  strokeDashoffset="30"
                ></path>
              </svg>
              <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              جاري معالجة الدفع
            </h3>

            <p className="text-white/80 text-lg mb-6">
              {status.message ||
                "عملية الدفع قيد المعالجة. يرجى الانتظار قليلاً..."}
            </p>

            {status.referenceNumber && (
              <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <h4 className="text-blue-400 font-medium mb-2">رقم المرجع:</h4>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-xl font-mono font-bold text-white bg-slate-700/50 px-4 py-2 rounded-lg">
                    {status.referenceNumber}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(status.referenceNumber);
                      alert("تم نسخ رقم المرجع!");
                    }}
                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                    title="نسخ الرقم"
                  >
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-600/20"
            >
              إغلاق والمحاولة لاحقاً
            </button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in">
      <div
        className={`relative rounded-2xl shadow-2xl overflow-hidden border-2 max-w-2xl w-full animate-zoom-in shadow-md ${
          status.status === "success"
            ? "border-green-500/30 shadow-green-500/20"
            : status.status === "error"
            ? "border-red-500/30 shadow-red-500/20"
            : "border-blue-500/30 shadow-blue-500/20"
        }`}
      >
        {/* Background gradient effect */}
        <div
          className={`absolute inset-0 -z-10 opacity-20 ${
            status.status === "success"
              ? "bg-gradient-to-br from-green-500 to-green-700"
              : status.status === "error"
              ? "bg-gradient-to-br from-red-500 to-red-700"
              : "bg-gradient-to-br from-blue-500 to-blue-700"
          }`}
        ></div>

        {/* Content */}
        <div className="glass-effect backdrop-blur-md p-8 relative">
          {/* Status Content */}
          {getStatusContent()}
        </div>
      </div>

      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes zoom-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-fast {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .animate-zoom-in {
          animation: zoom-in 0.4s cubic-bezier(0.17, 0.67, 0.29, 0.99) forwards;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-pulse-fast {
          animation: pulse-fast 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PaymentStatusModal;
