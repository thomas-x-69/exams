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
  const [showTestimonials, setShowTestimonials] = useState(false);

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
      <div className="min-h-screen bg-slate-900 relative overflow-hidden ">
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
          <div className="max-w-4xl mx-auto text-center mb-8">
            {/* Limited Time Offer Tag */}
            <div className="inline-block bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse mb-6 transform -rotate-2">
              عرض خاص لفترة محدودة - ينتهي خلال 7 أيام
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
                <span className="text-white/80 text-sm">اشتراك مدى الحياة</span>
              </div>
            </div>

            {/* Scroll Direction Indicator */}
            <div className="hidden md:flex flex-col items-center mt-12 animate-bounce">
              <span className="text-white/60 text-sm mb-2">اكتشف المزيد</span>
              <svg
                className="w-6 h-6 text-white/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>

          {/* Premium Card with Highlights */}
          <div className="max-w-6xl mx-auto relative">
            {/* Spotlight Effect - Premium Highlight Banner */}
            <div className="absolute inset-x-0 -top-10 flex justify-center">
              <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-3 rounded-full text-white font-bold shadow-lg transform -rotate-2 z-20 text-center">
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
              {/* Feature 1 */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-yellow-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center mb-4 text-3xl">
                  📝
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  امتحانات حقيقية
                </h3>
                <p className="text-white/70">
                  نماذج حصرية من الامتحانات الرسمية السابقة مع نفس مستوى الصعوبة
                  والهيكل الدقيق للاختبارات الفعلية.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-yellow-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center mb-4 text-3xl">
                  📊
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  تحليل متقدم للنتائج
                </h3>
                <p className="text-white/70">
                  تحليل مفصل لأدائك مع توضيح نقاط القوة والضعف وتوصيات مخصصة
                  للتحسين في كل مجال من مجالات الاختبار.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-yellow-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center mb-4 text-3xl">
                  🔄
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  تحديثات مستمرة
                </h3>
                <p className="text-white/70">
                  إضافة نماذج جديدة باستمرار مع كل دفعة من الاختبارات الرسمية،
                  مما يضمن حصولك على أحدث الأسئلة دائماً.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-yellow-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center mb-4 text-3xl">
                  🏆
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  شهادات إتمام
                </h3>
                <p className="text-white/70">
                  احصل على شهادات إتمام مخصصة توثق أداءك في كل اختبار، يمكن
                  تحميلها ومشاركتها مع توضيح مفصل للنتائج.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-yellow-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center mb-4 text-3xl">
                  💬
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  دعم فني متميز
                </h3>
                <p className="text-white/70">
                  فريق دعم متخصص لمساعدتك في أي استفسارات فنية أو تعليمية على
                  مدار الساعة لضمان تجربة تدريبية مثالية.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-yellow-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center mb-4 text-3xl">
                  💰
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  اشتراك لمرة واحدة
                </h3>
                <p className="text-white/70">
                  ادفع مرة واحدة فقط للحصول على وصول مدى الحياة، بدون اشتراكات
                  شهرية أو رسوم مخفية، مع تحديثات مجانية مستمرة.
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
                      بدون شهادات مخصصة توثق مستوى أدائك وتقدمك
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
                      شهادات إتمام مخصصة قابلة للتحميل والمشاركة لكل اختبار
                      تجتازه
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
                  مخصصة، ودعم فني متميز، وتحديثات مستمرة مدى الحياة - كل ذلك
                  بدفعة واحدة فقط وبدون اشتراكات شهرية.
                </p>
              </div>

              {/* FAQ Item 2 */}
              <div className="border-b border-white/10 pb-4 mb-4">
                <h3 className="text-xl font-bold text-amber-400 mb-2">
                  هل الاشتراك دفعة واحدة أم شهري؟
                </h3>
                <p className="text-white/80 text-sm">
                  الاشتراك دفعة واحدة فقط (99 جنيه) ويمنحك وصولاً مدى الحياة
                  لجميع المميزات الحالية والمستقبلية دون الحاجة لأي دفعات إضافية
                  أو اشتراكات شهرية. استثمار واحد يدوم معك طوال مسيرتك المهنية.
                </p>
              </div>

              {/* FAQ Item 3 */}
              <div className="border-b border-white/10 pb-4 mb-4">
                <h3 className="text-xl font-bold text-amber-400 mb-2">
                  كيف أدفع ثمن الاشتراك؟
                </h3>
                <p className="text-white/80 text-sm">
                  يمكنك الدفع عبر ثلاث طرق مختلفة: فوري، المحافظ الإلكترونية
                  (فودافون كاش، اتصالات كاش، أورانج كاش، وي باي)، أو عبر بطاقات
                  الائتمان (فيزا، ماستركارد، ميزة). جميع طرق الدفع آمنة ومشفرة
                  بالكامل.
                </p>
              </div>

              {/* FAQ Item 4 */}
              <div className="border-b border-white/10 pb-4 mb-4">
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

              {/* FAQ Item 5 */}
              <div>
                <h3 className="text-xl font-bold text-amber-400 mb-2">
                  هل يمكنني تجربة المنصة قبل الاشتراك؟
                </h3>
                <p className="text-white/80 text-sm">
                  نعم، يمكنك تجربة النسخة المجانية من المنصة التي توفر بعض
                  الاختبارات التدريبية العامة. ومع ذلك، فإن الامتحانات الحقيقية
                  المأخوذة من الاختبارات السابقة متوفرة فقط للمشتركين في العضوية
                  الذهبية. العرض الحالي (99 جنيه بدلاً من 150 جنيه) متاح لفترة
                  محدودة.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="max-w-5xl mx-auto mt-20 px-4 relative z-10">
            <div className="relative overflow-hidden rounded-3xl">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/30 to-amber-600/30 overflow-hidden">
                {/* Animated particles (decorative divs) */}
                <div
                  className="absolute w-20 h-20 rounded-full bg-yellow-400/20 top-10 left-10 animate-float"
                  style={{ animationDelay: "0s" }}
                ></div>
                <div
                  className="absolute w-32 h-32 rounded-full bg-amber-400/10 bottom-10 right-20 animate-float"
                  style={{ animationDelay: "-3s" }}
                ></div>
                <div
                  className="absolute w-16 h-16 rounded-full bg-yellow-400/20 top-1/2 right-1/3 animate-float"
                  style={{ animationDelay: "-1.5s" }}
                ></div>
                <div
                  className="absolute w-24 h-24 rounded-full bg-amber-400/10 bottom-1/3 left-1/4 animate-float"
                  style={{ animationDelay: "-2.5s" }}
                ></div>
              </div>

              {/* Content */}
              <div className="glass-card backdrop-blur-md p-8 md:p-16 rounded-3xl border-2 border-amber-500/20 relative z-10">
                <div className="text-center space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    استمتع بأكثر من 30 امتحان{" "}
                    <span className="text-yellow-400">حقيقي</span> الآن!
                  </h2>

                  <p className="text-xl text-white/90 max-w-3xl mx-auto">
                    احصل على العضوية الذهبية بخصم 34% لفترة محدودة
                  </p>

                  <div className="bg-white/10 rounded-2xl p-6 inline-block mb-8">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div>
                        <span className="text-white/60 text-sm line-through">
                          150 جنيه
                        </span>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-bold text-white">
                            99
                          </span>
                          <span className="text-xl text-white/80 mb-1">
                            جنيه فقط
                          </span>
                        </div>
                      </div>

                      <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold animate-pulse">
                        خصم 34%
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                      className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-8 py-4 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-600/20"
                    >
                      اشترك الآن في العضوية الذهبية
                    </button>
                    <p className="text-white/60 text-sm mt-4">
                      *دفعة واحدة فقط - بدون اشتراكات شهرية - وصول مدى الحياة
                    </p>
                  </div>
                </div>
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
