// src/app/premium/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import PremiumSubscription from "../../../components/PremiumSubscription";

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
      <div className="min-h-screen bg-slate-900 pattern-grid relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-yellow-600/20 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/3 -left-32 w-96 h-96 bg-amber-600/20 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-32 right-1/3 w-96 h-96 bg-orange-600/20 rounded-full filter blur-3xl"></div>
        </div>

        {/* Header */}
        <div className="pt-28 pb-12 md:pt-32 md:pb-16 px-4 relative z-10">
          <Header />

          {/* Page Title */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-amber-500 to-yellow-600 p-1 rounded-lg mb-5">
              <div className="bg-slate-900 px-6 py-2 rounded-md">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 font-bold">
                  عرض خاص محدود
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
                ارتقِ بمستواك
              </span>{" "}
              مع العضوية الذهبية المميزة
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-6 max-w-3xl mx-auto leading-relaxed">
              استمتع بالوصول غير المحدود لأكثر من 30 امتحان واقعي، مأخوذة من
              اختبارات فعلية سابقة، مصممة خصيصًا لمساعدتك على تحقيق أعلى الدرجات
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-white/80 text-sm">
                  تحديث يومي للمحتوى
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-white/80 text-sm">دعم فني متواصل</span>
              </div>

              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span className="text-white/80 text-sm">
                  تمتع بالميزات الحصرية
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Card - Premium Offer */}
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="glass-card rounded-3xl border-2 border-amber-500/30 overflow-hidden shadow-2xl shadow-amber-500/10">
              <div className="p-6 sm:p-10">
                <PremiumSubscription />
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto mt-16 px-4 relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
              الأسئلة الشائعة
            </h2>

            <div className="glass-card p-6 border border-white/10">
              <div className="space-y-4">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="font-bold text-amber-400 mb-2">
                    ما هي مميزات العضوية الذهبية؟
                  </h3>
                  <p className="text-white/80 text-sm">
                    العضوية الذهبية توفر لك وصولاً كاملاً لجميع الامتحانات
                    الحقيقية السابقة، وتحليلات متقدمة لأدائك، ودعمًا فنيًا
                    متميزًا، بالإضافة إلى تحديثات مستمرة للمحتوى مدى الحياة.
                  </p>
                </div>

                <div className="border-b border-white/10 pb-4">
                  <h3 className="font-bold text-amber-400 mb-2">
                    هل الاشتراك دفعة واحدة أم شهري؟
                  </h3>
                  <p className="text-white/80 text-sm">
                    الاشتراك دفعة واحدة فقط ويمنحك وصولاً مدى الحياة لجميع
                    المميزات الحالية والمستقبلية دون الحاجة لأي دفعات إضافية.
                  </p>
                </div>

                <div className="border-b border-white/10 pb-4">
                  <h3 className="font-bold text-amber-400 mb-2">
                    كيف أدفع ثمن الاشتراك؟
                  </h3>
                  <p className="text-white/80 text-sm">
                    يمكنك الدفع عبر ثلاث طرق: فوري، المحافظ الإلكترونية (فودافون
                    كاش، اتصالات كاش، أورانج كاش، وي باي)، أو عبر بطاقات
                    الائتمان (فيزا، ماستركارد، ميزة).
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-amber-400 mb-2">
                    إلى متى يستمر عرض الخصم؟
                  </h3>
                  <p className="text-white/80 text-sm">
                    عرض الخصم الحالي (99 جنيه بدلاً من 150 جنيه) متاح لفترة
                    محدودة. ننصحك بالاستفادة منه قبل انتهاء العرض والعودة للسعر
                    الأصلي.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="max-w-3xl mx-auto mt-16 text-center">
            <div className="glass-card py-8 px-6 border-2 border-amber-500/20 rounded-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 mb-4">
                لا تفوت الفرصة!
              </h2>
              <p className="text-white/80 mb-6">
                احصل على العضوية الذهبية الآن بسعر خاص واستعد للامتحانات بأفضل
                الطرق
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                اشترك الآن بـ 99 جنيه فقط
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animation CSS */}
      <style jsx>{`
        .pattern-grid {
          background-image: linear-gradient(
              rgba(255, 255, 255, 0.03) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.03) 1px,
              transparent 1px
            );
          background-size: 40px 40px;
        }
      `}</style>
    </>
  );
}
