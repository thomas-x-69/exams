// src/app/premium/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import PremiumSubscription from "../../../components/PremiumSubscription";
import Image from "next/image";
import Link from "next/link";

export default function PremiumPage() {
  const router = useRouter();
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check premium status on initial load
  useEffect(() => {
    // Simulate loading
    const loadTimer = setTimeout(() => {
      try {
        const isPremium = localStorage.getItem("premiumUser") === "true";
        setIsPremiumUser(isPremium);
        setLoading(false);

        // If already premium, redirect to premium content
        if (isPremium) {
          router.replace("/premium-exams");
        }
      } catch (error) {
        console.error("Error checking premium status:", error);
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(loadTimer);
  }, [router]);

  // Loading state
  if (loading) {
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

          {/* Premium Subscription Component */}
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
              <div className="glass-card rounded-3xl overflow-hidden backdrop-blur-xl bg-slate-900/80 ">
                <div className="p-6 sm:p-10">
                  <PremiumSubscription />
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

              {/* Feature 4 - Certificate Icon */}
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  شهادات إتمام
                </h3>
                <p className="text-white/70">
                  احصل على شهادات إتمام مخصصة توثق أداءك في كل اختبار، يمكن
                  تحميلها ومشاركتها مع توضيح مفصل للنتائج.
                </p>
              </div>

              {/* Feature 5 - Support Icon */}
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  دعم فني متميز
                </h3>
                <p className="text-white/70">
                  فريق دعم متخصص لمساعدتك في أي استفسارات فنية أو تعليمية على
                  مدار الساعة لضمان تجربة تدريبية مثالية.
                </p>
              </div>

              {/* Feature 6 - Payment/Monthly Icon */}
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  اشتراك شهري
                </h3>
                <p className="text-white/70">
                  اشتراك شهري بدفعة واحدة، صالح لمدة شهر كامل بسعر منافس، بعدها
                  يمكنك تجديد الاشتراك إذا رغبت في ذلك.
                </p>
              </div>
            </div>
          </div>

          {/* Compare Before and After Section */}
          <div className="max-w-5xl mx-auto mt-20 px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                  قبل وبعد
                </span>{" "}
                العضوية الذهبية
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Before - Free Plan */}
              <div className="glass-card p-6 rounded-2xl border border-white/10">
                <div className="bg-white/10 rounded-xl px-4 py-2 mb-6 inline-block">
                  <span className="text-white font-medium">
                    بدون العضوية الذهبية
                  </span>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
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
                    <span className="text-white/70">
                      تدريب على أسئلة عامة فقط لا تعكس مستوى الصعوبة الحقيقي
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
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
                    <span className="text-white/70">
                      عدم التعرف على نوعية الأسئلة الحقيقية في الاختبارات
                      الرسمية
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
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
                    <span className="text-white/70">
                      تحليل محدود للنتائج بدون توصيات مخصصة للتحسين
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
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
                    <span className="text-white/70">
                      احتمالية المفاجأة بأنماط جديدة من الأسئلة في الاختبار
                      الفعلي
                    </span>
                  </li>
                </ul>

                <div className="mt-8 bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                  <p className="text-white/80 text-sm">
                    <strong className="text-red-400">النتيجة:</strong> استعداد
                    غير كافٍ مع مخاطرة أكبر بعدم تحقيق الدرجات المطلوبة في
                    الاختبار الرسمي.
                  </p>
                </div>
              </div>

              {/* After - Premium Plan */}
              <div className="glass-card p-6 rounded-2xl border-2 border-yellow-500/30 shadow-lg shadow-yellow-500/10">
                <div className="bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl px-4 py-2 mb-6 inline-block">
                  <span className="text-white font-medium">
                    مع العضوية الذهبية
                  </span>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
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
                    <span className="text-white/90">
                      تدرب على أكثر من 30 نموذج امتحان حقيقي من الدفعات السابقة
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
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
                    <span className="text-white/90">
                      خوض تجربة مماثلة تماماً للاختبار الرسمي من حيث الصعوبة
                      والأسلوب
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
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
                    <span className="text-white/90">
                      تحليل متقدم للنتائج مع توصيات مخصصة لتطوير مستواك في كل
                      مهارة
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
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
                    <span className="text-white/90">
                      الاستعداد النفسي والمعرفي الكامل بدون مفاجآت في الاختبار
                      الرسمي
                    </span>
                  </li>
                </ul>

                <div className="mt-8 bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                  <p className="text-white/90 text-sm">
                    <strong className="text-green-400">النتيجة:</strong> استعداد
                    احترافي كامل مع فرصة أكبر بكثير لتحقيق درجات عالية واجتياز
                    الاختبار الرسمي من المرة الأولى.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto mt-20 px-4 relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                  الأسئلة
                </span>{" "}
                الشائعة
              </h2>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10">
              {/* FAQ Item 1 */}
              <div className="border-b border-white/10 pb-4 mb-4">
                <h3 className="text-xl font-bold text-amber-400 mb-2">
                  ما هي مميزات العضوية الذهبية؟
                </h3>
                <p className="text-white/80 text-sm">
                  العضوية الذهبية توفر لك الوصول إلى أكثر من 30 اختباراً حقيقياً
                  من الامتحانات السابقة، مع تحليل مفصل لأدائك، وشهادات إتمام
                  مخصصة، ودعم فني متميز، وتحديثات مستمرة بسعر شهري مناسب مع
                  إمكانية الإلغاء في أي وقت.
                </p>
              </div>

              {/* FAQ Item 2 */}
              <div className="border-b border-white/10 pb-4 mb-4">
                <h3 className="text-xl font-bold text-amber-400 mb-2">
                  هل الاشتراك شهري أم سنوي؟
                </h3>
                <p className="text-white/80 text-sm">
                  الاشتراك شهري بقيمة 99 جنيه شهرياً، دفعة واحدة لمدة شهر كامل.
                  بعد انتهاء المدة، يمكنك تجديد الاشتراك مرة أخرى إذا رغبت في
                  ذلك. لا يتم التجديد تلقائياً.
                </p>
              </div>

              {/* FAQ Item 3 */}
              <div className="border-b border-white/10 pb-4 mb-4">
                <h3 className="text-xl font-bold text-amber-400 mb-2">
                  كيف أدفع ثمن الاشتراك؟
                </h3>
                <p className="text-white/80 text-sm">
                  يمكنك الدفع عبر بطاقات الائتمان (فيزا، ماستركارد، ميزة). جميع
                  طرق الدفع آمنة ومشفرة بالكامل ويتم التعامل معها من خلال بوابات
                  دفع موثوقة.
                </p>
              </div>

              {/* FAQ Item 4 */}
              <div>
                <h3 className="text-xl font-bold text-amber-400 mb-2">
                  هل الامتحانات حقيقية فعلاً من الاختبارات السابقة؟
                </h3>
                <p className="text-white/80 text-sm">
                  نعم، جميع الامتحانات مأخوذة من نماذج فعلية من الاختبارات
                  الرسمية السابقة، وتم تدقيقها من قبل متخصصين لضمان مطابقتها
                  لمستوى الصعوبة والهيكل الدقيق للاختبارات الحقيقية، مما يوفر لك
                  تجربة تدريبية واقعية تماماً.
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
                  اشترك الآن في العضوية الذهبية
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
