import React, { useState, useEffect } from "react";
import PaymentMethodCard from "./PaymentMethodCard";
import PaymentStatusModal from "./PaymentStatusModal";
import Image from "next/image";

const PremiumSubscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  // Pricing plan - now just a single lifetime plan
  const plan = {
    id: "lifetime",
    name: "اشتراك مدى الحياة",
    price: 99,
    originalPrice: 150,
    features: [
      "الوصول لجميع الاختبارات التدريبية",
      "نماذج الاختبارات الحقيقية السابقة",
      "تحليل مفصل للأداء",
      "شهادات إتمام الاختبارات",
      "دعم فني متميز",
      "تحديثات مجانية مدى الحياة",
      "اشتراك لمرة واحدة فقط",
      "وصول VIP للمحتوى الحصري",
    ],
  };

  // Payment methods
  const paymentMethods = [
    {
      id: "fawry",
      name: "فوري",
      description: "الدفع من خلال فروع فوري",
      icon: "fawry",
      integrationId: process.env.NEXT_PUBLIC_PAYMOB_INTEGRATION_ID_FAWRY,
    },
    {
      id: "wallet",
      name: "محفظة إلكترونية",
      description: "فودافون كاش، اتصالات كاش، أورانج كاش، وي باي",
      icon: "wallet",
      integrationId: process.env.NEXT_PUBLIC_PAYMOB_INTEGRATION_ID_WALLET,
    },
    {
      id: "credit",
      name: "بطاقة ائتمان",
      description: "فيزا، ماستركارد، ميزة",
      icon: "credit",
      integrationId: process.env.NEXT_PUBLIC_PAYMOB_INTEGRATION_ID_CARD,
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
      // Get selected payment method details
      const paymentMethod = paymentMethods.find(
        (method) => method.id === selectedPaymentMethod
      );

      // Call the API to create a payment
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: plan.price * 100, // In piasters
          planId: plan.id,
          integrationId: paymentMethod.integrationId,
          paymentMethodId: paymentMethod.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store the order details
        setOrderDetails(data.order);

        // Redirect to payment page or show iframe depending on payment method
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          // Handle iframe payment methods
          setShowPaymentModal(true);
          setPaymentStatus({
            status: "pending",
            message: "جاري تحويلك إلى صفحة الدفع...",
          });

          // Redirect after a short delay
          setTimeout(() => {
            window.location.href = data.paymentUrl;
          }, 1500);
        }
      } else {
        throw new Error(data.message || "حدث خطأ أثناء إنشاء عملية الدفع");
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      setPaymentStatus({
        status: "error",
        message: error.message || "حدث خطأ أثناء الدفع، يرجى المحاولة مرة أخرى",
      });
      setShowPaymentModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentStatus(null);
  };

  // Check for payment status on component mount (for handling callbacks)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");

    if (status === "success") {
      setPaymentStatus({
        status: "success",
        message: "تم الدفع بنجاح! جاري تفعيل اشتراكك.",
      });
      setShowPaymentModal(true);

      // You'd typically verify the payment server-side before confirming
      // but for demo we'll just show success

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (status === "error") {
      setPaymentStatus({
        status: "error",
        message: "فشلت عملية الدفع. يرجى المحاولة مرة أخرى.",
      });
      setShowPaymentModal(true);

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Main Hero - Premium Lifetime Offer */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-yellow-700 p-0.5 shadow-xl shadow-amber-700/20 mb-16">
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden">
          {/* Shape Decorations */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30 overflow-hidden">
            <div className="absolute -top-24 -left-16 w-72 h-72 bg-yellow-500 rounded-full filter blur-3xl"></div>
            <div className="absolute top-20 right-20 w-52 h-52 bg-amber-500 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-20 w-72 h-72 bg-yellow-600 rounded-full filter blur-3xl"></div>
          </div>

          <div className="relative z-10 p-6 sm:p-10">
            {/* Limited Time Offer Badge */}
            <div className="absolute -top-1 right-8 transform rotate-3 z-20">
              <div className="bg-gradient-to-r from-red-500 to-red-700 text-white text-sm font-bold py-2 px-8 rounded-b-lg shadow-lg animate-pulse">
                عرض لفترة محدودة
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center md:items-start">
              {/* Left side - Image */}
              <div className="relative flex-shrink-0 w-64 h-64">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full animate-pulse-slow opacity-50"></div>
                <div className="absolute inset-2 bg-slate-800 rounded-full flex items-center justify-center">
                  <div className="text-8xl">🏆</div>
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-600 px-6 py-2 rounded-full text-white font-bold text-sm shadow-lg">
                  العضوية الذهبية
                </div>
              </div>

              {/* Right side - Content */}
              <div className="flex-1 text-center md:text-right">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 mb-4">
                  اشتراك مدى الحياة بعرض حصري
                </h2>

                <div className="flex items-center gap-3 justify-center md:justify-end mb-6">
                  <span className="text-4xl md:text-5xl font-bold text-white">
                    {plan.price}
                  </span>
                  <div className="flex flex-col items-start">
                    <span className="text-white text-sm">جنيه فقط</span>
                    <span className="text-amber-300 text-sm line-through">
                      بدلاً من {plan.originalPrice} جنيه
                    </span>
                  </div>

                  <div className="bg-yellow-500/20 text-yellow-300 text-sm font-bold px-3 py-1 rounded-lg border border-yellow-500/30 mr-2">
                    خصم{" "}
                    {Math.round(
                      ((plan.originalPrice - plan.price) / plan.originalPrice) *
                        100
                    )}
                    %
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6 max-w-lg mx-auto md:mr-0 md:ml-auto">
                  {plan.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-right"
                    >
                      <svg
                        className="w-5 h-5 text-yellow-500 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-white/90 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="glass-card p-8 mb-8 rounded-2xl relative overflow-hidden border-2 border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 animate-shimmer"></div>

        <h2 className="text-2xl font-bold text-white mb-6 relative z-10 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-400">
            اختر وسيلة الدفع المناسبة
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => handleSelectPaymentMethod(method.id)}
              className={`
                relative p-6 rounded-xl border transition-all duration-300 cursor-pointer
                ${
                  selectedPaymentMethod === method.id
                    ? "bg-gradient-to-br from-amber-500/20 to-yellow-600/10 border-amber-500/50 shadow-lg shadow-amber-500/10 transform scale-105"
                    : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"
                }
              `}
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md">
                  {method.icon === "fawry" && (
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/ar/d/db/%D9%81%D9%88%D8%B1%D9%8A.png"
                      alt="فوري"
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  )}
                  {method.icon === "wallet" && (
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
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
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                  )}
                  {method.icon === "credit" && (
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

                <div>
                  <h3 className="font-bold text-white text-lg mb-1">
                    {method.name}
                  </h3>
                  <p className="text-white/60 text-sm">{method.description}</p>
                </div>

                {selectedPaymentMethod === method.id && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary & Checkout Section */}
      <div className="glass-card p-8 rounded-2xl border-2 border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          ملخص الطلب
        </h2>

        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/10">
            <div className="text-white/80">الباقة المختارة:</div>
            <div className="text-white font-bold">{plan.name}</div>
          </div>

          <div className="flex justify-between items-center mb-6 pb-3 border-b border-white/10">
            <div className="text-white/80">المبلغ الإجمالي:</div>
            <div className="text-2xl text-amber-400 font-bold">
              {plan.price} جنيه
            </div>
          </div>

          <button
            onClick={handlePaymentInitiation}
            disabled={isLoading || !selectedPaymentMethod}
            className={`
              w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300
              ${
                isLoading || !selectedPaymentMethod
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 shadow-lg hover:shadow-xl shadow-amber-500/20 transform hover:scale-[1.02]"
              }
            `}
          >
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>إتمام الدفع الآن</span>
              </div>
            )}
          </button>

          <div className="mt-6 text-center text-white/60 text-sm">
            <p>
              بالضغط على "إتمام الدفع الآن" أنت توافق على{" "}
              <a href="/terms" className="text-amber-400 hover:underline">
                شروط الاستخدام
              </a>{" "}
              و{" "}
              <a href="/privacy" className="text-amber-400 hover:underline">
                سياسة الخصوصية
              </a>
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex justify-center gap-6 mt-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-amber-400"
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
              <span className="text-white/70 text-xs">دفع آمن</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-amber-400"
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
              <span className="text-white/70 text-xs">ضمان الجودة</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-amber-400"
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
              <span className="text-white/70 text-xs">دعم فني 24/7</span>
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
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.3;
          }
        }

        .animate-shimmer {
          animation: shimmer 4s infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PremiumSubscription;
