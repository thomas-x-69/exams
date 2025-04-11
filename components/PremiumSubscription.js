// components/PremiumSubscription.js
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PaymentStatusModal from "./PaymentStatusModal";

const PremiumSubscription = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("cardPayment"); // Default to card payments

  // Pricing plan - one-time monthly subscription
  const plan = {
    id: "monthly",
    name: "اشتراك شهري",
    price: 99,
    originalPrice: 150,
    features: [
      "الوصول لجميع الاختبارات التدريبية",
      "أكثر من 30 نموذج امتحان حقيقي سابق",
      "تحليل مفصل للأداء ونقاط القوة والضعف",
      "شهادات إتمام الاختبارات بتصميم احترافي",
      "دعم فني على مدار الساعة",
      "تحديثات مستمرة بأحدث الامتحانات",
      "دفع شهري لمرة واحدة",
      "صلاحية استخدام لمدة شهر كامل",
    ],
  };

  // Payment methods - simplified to just card payment
  const paymentMethods = [
    {
      id: "credit",
      name: "بطاقة ائتمان",
      description: "فيزا، ماستركارد، ميزة",
      icon: "credit.png",
      integrationId: 5034950,
      type: "cardPayment",
      iframeId: 911567,
      steps: [
        "أدخل بيانات البطاقة",
        "تأكد من صحة البيانات",
        "تأكيد الدفع",
        "سيتم تحويلك لصفحة البنك للتأكيد إذا لزم الأمر",
      ],
    },
  ];

  const handleSelectPaymentMethod = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };

  const handlePaymentInitiation = async () => {
    if (!selectedPaymentMethod) {
      alert("برجاء اختيار وسيلة الدفع");
      return;
    }

    setIsLoading(true);

    try {
      // Get user info
      const userName = localStorage.getItem("tempUserName") || "Guest User";
      const userEmail =
        localStorage.getItem("tempUserEmail") || "guest@example.com";
      const userPhone = localStorage.getItem("tempUserPhone") || "01000000000";

      // In a real implementation, this would make an API call to your backend
      // to initialize the subscription payment process

      // Set a brief timeout to simulate server communication
      setTimeout(() => {
        // Redirecting to a backend payment processing page would happen here
        // For now, we'll just show a loading state

        // After the backend handles the payment, you would redirect the user to a success page
        // or handle the subscription activation

        setIsLoading(false);

        // Show success message (in real implementation, this would only happen after
        // successful backend confirmation)
        setPaymentStatus({
          status: "pending",
          message: "جاري تحويلك إلى صفحة الدفع...",
        });
        setShowPaymentModal(true);

        // In a real implementation, this would redirect to your payment gateway
        // window.location.href = "/api/subscription/create";
      }, 1500);
    } catch (error) {
      console.error("Payment initialization error:", error);
      setPaymentStatus({
        status: "error",
        message: "حدث خطأ أثناء الدفع. يرجى المحاولة مرة أخرى.",
      });
      setShowPaymentModal(true);
      setIsLoading(false);
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentStatus(null);
  };

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Premium Package Display */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
        {/* Left Column - Package Info */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 p-6 h-full">
            {/* Package Title */}
            <div className="relative">
              <span className="text-xs font-semibold bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-3 py-1 rounded-full absolute -top-10 right-0">
                عرض لفترة محدودة
              </span>
              <h3 className="text-2xl font-bold text-white mb-2">
                العضوية الذهبية
              </h3>
              <p className="text-white/70 text-sm mb-4">
                الوصول الكامل لجميع الامتحانات الحقيقية
              </p>
            </div>

            {/* Price Section */}
            <div className="mt-6 flex items-end gap-2 mb-6">
              <div className="text-4xl font-bold text-white">{plan.price}</div>
              <div className="flex flex-col">
                <span className="text-amber-400 line-through text-lg">
                  {plan.originalPrice}
                </span>
                <span className="text-white/80 text-sm">جنيه مصري / شهر</span>
              </div>
              <div className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-lg border border-green-500/30 mr-2">
                خصم{" "}
                {Math.round(
                  ((plan.originalPrice - plan.price) / plan.originalPrice) * 100
                )}
                %
              </div>
            </div>

            {/* Monthly Badge */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 p-2 rounded-lg border border-amber-500/30 mb-6">
              <svg
                className="w-5 h-5 text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-amber-300 font-bold">
                اشتراك شهري - دفع مرة واحدة
              </span>
            </div>

            {/* Features List */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-amber-400"
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
                المميزات الحصرية
              </h4>
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-amber-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-white/90 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Payment Methods */}
        <div className="lg:col-span-3">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 p-6">
            <h3 className="text-xl font-bold text-white mb-6">
              اختر طريقة الدفع المفضلة
            </h3>

            {/* Payment Methods Grid - Simplified to just card payment */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => handleSelectPaymentMethod(method.id)}
                  className={`
                    relative p-4 rounded-xl border transition-all duration-300 cursor-pointer
                    ${
                      selectedPaymentMethod === method.id
                        ? "bg-gradient-to-br from-amber-500/20 to-yellow-600/10 border-amber-500/50 shadow-lg shadow-amber-500/10"
                        : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    {/* Payment Method Icon */}
                    <div className="w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center shadow-md flex-shrink-0">
                      {method.id === "credit" && (
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Payment Method Details */}
                    <div className="flex-1">
                      <h4 className="font-bold text-white mb-1 flex items-center justify-between">
                        {method.name}

                        {selectedPaymentMethod === method.id && (
                          <div className="bg-green-500 rounded-full w-5 h-5 flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </h4>
                      <p className="text-white/70 text-sm mb-3">
                        {method.description}
                      </p>

                      {/* Payment Steps */}
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <h5 className="text-xs font-medium text-white/90 mb-2">
                          خطوات الدفع:
                        </h5>
                        <ol className="space-y-1 pr-2">
                          {method.steps.map((step, idx) => (
                            <li
                              key={idx}
                              className="text-white/70 text-xs flex items-start gap-2"
                            >
                              <span className="inline-block w-4 h-4 bg-white/10 rounded-full text-center flex-shrink-0 text-[10px] leading-4">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white/5 rounded-xl p-5 mb-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">
                ملخص الطلب
              </h4>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-white/70">
                    العضوية الذهبية (شهرياً)
                  </span>
                  <span className="text-white">{plan.price} جنيه</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-white/70">الخصم</span>
                  <span className="text-green-400">
                    {plan.originalPrice - plan.price} جنيه
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">
                    الإجمالي (شهرياً)
                  </span>
                  <div className="text-xl font-bold text-amber-400">
                    {plan.price} جنيه
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-500/20 to-yellow-600/20 p-3 rounded-lg border border-amber-500/30 text-sm text-white/90 mb-4">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <span className="block font-medium text-amber-300 mb-1">
                      دفع آمن ومضمون
                    </span>
                    <span>
                      اشتراك شهري بدفعة واحدة. بعد انتهاء الشهر، يمكنك تجديد
                      الاشتراك مرة أخرى إذا رغبت في ذلك.
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePaymentInitiation}
                disabled={isLoading || !selectedPaymentMethod}
                className={`
                  w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 relative overflow-hidden
                  ${
                    isLoading || !selectedPaymentMethod
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 shadow-lg hover:shadow-xl shadow-amber-500/20 transform hover:scale-[1.01]"
                  }
                `}
              >
                {/* Animated Shine Effect */}
                <span className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shine"></span>

                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                    <span>جاري التحميل...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>اشترك الآن</span>
                  </div>
                )}
              </button>
            </div>

            {/* Secure Badges */}
            <div className="flex justify-center items-center gap-6 mt-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-1">
                  <svg
                    className="w-5 h-5 text-amber-400"
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
                </div>
                <span className="text-white/60 text-xs">دفع آمن</span>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-1">
                  <svg
                    className="w-5 h-5 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <span className="text-white/60 text-xs">اشتراك موثوق</span>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-1">
                  <svg
                    className="w-5 h-5 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <span className="text-white/60 text-xs">دعم فني 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status Modal */}
      <PaymentStatusModal
        isOpen={showPaymentModal}
        status={paymentStatus}
        onClose={closePaymentModal}
      />

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          60%,
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shine {
          animation: shine 4s infinite;
        }
      `}</style>
    </div>
  );
};

export default PremiumSubscription;
