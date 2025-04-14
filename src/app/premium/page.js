// src/app/premium/page.js
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../../components/Header";
import PremiumSubscription from "../../../components/PremiumSubscription";
import PaymentStatusModal from "../../../components/PaymentStatusModal";
import { useClientAuth } from "../../../context/ClientAuthContext";
import Link from "next/link";

// Component to handle the search params logic
function PaymentParamsProcessor() {
  const searchParams = useSearchParams();
  const { activatePremium } = useClientAuth();
  const [processedPayment, setProcessedPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  // Process URL parameters when component mounts
  useEffect(() => {
    const status = searchParams.get("status");
    const orderId = searchParams.get("order_id");

    if (status && orderId && !processedPayment) {
      handlePaymentCallback(status, orderId);
    }
  }, [searchParams, processedPayment]);

  // Handle payment callback from payment gateway
  const handlePaymentCallback = async (status, orderId) => {
    try {
      setProcessedPayment(true); // Mark as processed to prevent duplicate processing

      if (status === "success" && orderId) {
        // Verify payment with backend
        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        });

        const data = await response.json();

        if (data.success && data.status === "paid") {
          // Activate premium subscription
          const result = await activatePremium(30); // 30 days subscription

          if (result.success) {
            setPaymentStatus({
              status: "success",
              message: "تم تفعيل العضوية المميزة بنجاح!",
              verifiedByServer: true,
            });
            setShowPaymentModal(true);
          } else {
            setPaymentStatus({
              status: "error",
              message:
                "تم الدفع بنجاح ولكن حدث خطأ أثناء تفعيل العضوية. يرجى التواصل مع الدعم الفني.",
            });
            setShowPaymentModal(true);
          }
        } else if (data.status === "pending") {
          setPaymentStatus({
            status: "pending",
            message:
              "الدفع قيد المعالجة. سيتم تفعيل العضوية المميزة بمجرد تأكيد الدفع.",
            referenceNumber: data.referenceNumber || orderId,
          });
          setShowPaymentModal(true);
        } else {
          setPaymentStatus({
            status: "error",
            message:
              "فشل التحقق من الدفع. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.",
          });
          setShowPaymentModal(true);
        }
      } else if (status === "error") {
        setPaymentStatus({
          status: "error",
          message: "فشلت عملية الدفع. يرجى المحاولة مرة أخرى.",
        });
        setShowPaymentModal(true);
      }

      // Clean URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete("status");
      url.searchParams.delete("order_id");
      window.history.replaceState({}, "", url.toString());
    } catch (error) {
      console.error("Error handling payment callback:", error);
      setPaymentStatus({
        status: "error",
        message:
          "حدث خطأ أثناء معالجة نتيجة الدفع. يرجى التواصل مع الدعم الفني.",
      });
      setShowPaymentModal(true);
    }
  };

  return (
    paymentStatus && (
      <PaymentStatusModal
        isOpen={showPaymentModal}
        status={paymentStatus}
        onClose={() => setShowPaymentModal(false)}
      />
    )
  );
}

export default function PremiumPage() {
  const router = useRouter();
  const { user, userProfile, isPremium, loading } = useClientAuth();
  const [pageLoading, setPageLoading] = useState(true);

  // Check premium status on initial load
  useEffect(() => {
    if (!loading) {
      // If already premium, redirect to premium content
      if (isPremium) {
        router.replace("/premium-exams");
      }
      setPageLoading(false);
    }
  }, [isPremium, loading, router]);

  // Loading state
  if (pageLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute top-0 left-0 w-full h-full border-8 border-yellow-500/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-8 border-t-yellow-500 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-400 text-xl">
              <svg
                className="w-12 h-12"
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
          </div>
          <p className="text-white text-xl font-bold">
            جاري التحقق من حالة العضوية...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-900 relative overflow-hidden">
        {/* Dynamic Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Base Grid Pattern */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          ></div>

          {/* Animated Gradient Orbs */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-yellow-600/30 to-amber-600/10 rounded-full filter blur-3xl"></div>
          <div
            className="absolute top-1/3 -left-32 w-96 h-96 bg-amber-600/20 rounded-full filter blur-3xl floating"
            style={{ animationDelay: "-4s" }}
          ></div>
          <div
            className="absolute -bottom-20 right-1/3 w-96 h-96 bg-yellow-600/20 rounded-full filter blur-3xl floating"
            style={{ animationDelay: "-2s" }}
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-amber-500/5 to-yellow-600/5 rounded-full filter blur-3xl floating"></div>
        </div>

        {/* Header */}
        <div className="pt-28 pb-12 md:pt-32 md:pb-16 px-4 relative z-10">
          <Header />

          {/* Suspense boundary for the component that uses useSearchParams */}
          <Suspense fallback={<div style={{ display: "none" }}></div>}>
            <PaymentParamsProcessor />
          </Suspense>

          {/* Hero Section - Enhanced with animated elements */}
          <div className="max-w-4xl mx-auto text-center mb-6">
            {/* Limited Time Offer Tag */}
            <div className="inline-block bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg mb-6">
              عرض خاص لفترة محدودة - خصم 35%
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 leading-tight block md:inline">
                اختبارات حقيقية
              </span>{" "}
              من امتحانات السنوات السابقة
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              استعد للامتحانات الرسمية مع أكثر من 30 نموذج امتحان حقيقي مأخوذ من
              الاختبارات الرسمية السابقة. احصل على تجربة مماثلة تماماً للاختبار
              الفعلي لضمان أعلى درجات النجاح.
            </p>

            {/* Benefits Pills */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/80 text-sm">
                  نماذج امتحانات حصرية
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-white/80 text-sm">
                  تحليل مفصل للنتائج
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-white/80 text-sm">دعم فني 24/7</span>
              </div>

              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-white/80 text-sm">
                  اشتراك شهري بدفعة واحدة
                </span>
              </div>
            </div>
          </div>

          {/* Premium Subscription Component - Always visible for all users */}
          <div className="max-w-6xl mx-auto relative mt-16">
            {/* Spotlight Effect - Premium Highlight Banner */}
            <div className="absolute inset-x-0 -top-8 flex justify-center">
              <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-3 rounded-full text-white font-bold shadow-lg transform -rotate-2 z-10 text-center">
                <span className="text-xl">
                  أقوى باقة تدريبية للاختبارات المصرية
                </span>
              </div>
            </div>

            {/* Premium Card with Shine Effect */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20">
              {/* Animated Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shine z-10 pointer-events-none"></div>

              {/* Card Content */}
              <div className="glass-card rounded-3xl overflow-hidden backdrop-blur-xl bg-slate-900/80">
                <div className="p-6 sm:p-10">
                  {/* Always render the PremiumSubscription component */}
                  <PremiumSubscription userData={userProfile} />
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Premium Section */}
          <div className="max-w-5xl mx-auto mt-20 px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                  لماذا
                </span>{" "}
                العضوية الذهبية؟
              </h2>

              <p className="text-lg text-white/70 max-w-3xl mx-auto">
                مع العضوية الذهبية، تحصل على تجربة تدريبية متكاملة تحاكي
                الاختبارات الرسمية بدقة عالية، مما يضمن لك الاستعداد المثالي
                ويزيد من فرص نجاحك.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature cards (kept for brevity) */}
              {/* Feature 1 - Exam Icon */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-yellow-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  امتحانات حقيقية
                </h3>
                <p className="text-white/70">
                  نماذج حصرية من الامتحانات الرسمية السابقة مع نفس مستوى الصعوبة
                  والهيكل الدقيق للاختبارات الفعلية.
                </p>
              </div>

              {/* Feature 2 - Analytics Icon */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-yellow-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  تحليل متقدم للنتائج
                </h3>
                <p className="text-white/70">
                  تحليل مفصل لأدائك مع توضيح نقاط القوة والضعف وتوصيات مخصصة
                  للتحسين في كل مجال من مجالات الاختبار.
                </p>
              </div>

              {/* Feature 3 - Updates Icon */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-yellow-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  تحديثات مستمرة
                </h3>
                <p className="text-white/70">
                  إضافة نماذج جديدة باستمرار مع كل دفعة من الاختبارات الرسمية،
                  مما يضمن حصولك على أحدث الأسئلة دائماً.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section - Simplified */}
          <div className="max-w-5xl mx-auto mt-16 px-4 mb-16 relative z-10">
            <div className="glass-card overflow-hidden rounded-2xl border-2 border-amber-500/30 shadow-lg">
              <div className="p-8 md:p-10 text-center relative">
                {/* Background accent */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10"></div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10">
                  استمتع بأكثر من 30 امتحان{" "}
                  <span className="text-yellow-400">حقيقي</span> الآن!
                </h2>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                  <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-white/60 text-sm line-through">
                      150 جنيه
                    </span>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold text-white">99</span>
                      <span className="text-lg text-white/80 mb-1">
                        جنيه / شهر
                      </span>
                    </div>
                  </div>

                  <div className="bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold animate-pulse">
                    خصم 34%
                  </div>
                </div>

                <button
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  الاشتراك في العضوية الذهبية الآن
                </button>

                <p className="text-white/60 text-sm mt-3 relative z-10">
                  اشتراك شهري - دفعة واحدة - صالح لمدة شهر كامل
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated float effect for background elements */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-float {
          animation: float 15s ease-in-out infinite;
        }

        .animate-shine {
          animation: shine 8s infinite;
        }
      `}</style>
    </>
  );
}
