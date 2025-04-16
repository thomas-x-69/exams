// src/app/subscription/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Link from "next/link";

export default function ComingSoonPage() {
  const router = useRouter();
  const [animateIn, setAnimateIn] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Countdown timer state
  const [countdown, setCountdown] = useState({
    days: 4,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Set animation after component mounts
  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100);

    // Set launch date (4 days from now)
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 4);

    // Update countdown timer
    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      // Here you would normally send the email to your backend or email service
      // For now, we'll just simulate a successful submission
      setIsSubmitted(true);

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setEmailInput("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden pt-28">
      {/* Header */}
      <Header />

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
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-amber-600/30 to-yellow-600/10 rounded-full filter blur-3xl"></div>
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

      <div
        className={`transition-all duration-700 max-w-4xl mx-auto px-4 ${
          animateIn
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-12"
        }`}
      >
        {/* Main Card - All content in a single card as requested */}
        <div className="glass-card border-2 border-amber-500/30 bg-slate-800/80 rounded-3xl p-8 mb-12 max-w-4xl mx-auto shadow-lg shadow-amber-500/5">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-block bg-amber-600/20 text-amber-400 px-4 py-2 rounded-full font-bold text-sm mb-6 border border-amber-500/30">
              قريباً جداً
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 leading-tight">
                الأسئلة الحقيقية
              </span>{" "}
              من الامتحانات السابقة
            </h1>

            <p className="text-lg text-white/80 mb-8 max-w-3xl mx-auto">
              نقدم لكم الأسئلة التي تظهر في الامتحانات الفعلية بتحديث أسبوعي مع
              نماذج جديدة من امتحانات حقيقية سابقة
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-6 text-center">
              انطلاق المحتوى المميز خلال
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold text-amber-400 mx-auto mb-2 border border-amber-500/30">
                  {countdown.days}
                </div>
                <span className="text-white/80 text-sm">يوم</span>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold text-amber-400 mx-auto mb-2 border border-amber-500/30">
                  {countdown.hours}
                </div>
                <span className="text-white/80 text-sm">ساعة</span>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold text-amber-400 mx-auto mb-2 border border-amber-500/30">
                  {countdown.minutes}
                </div>
                <span className="text-white/80 text-sm">دقيقة</span>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold text-amber-400 mx-auto mb-2 border border-amber-500/30">
                  {countdown.seconds}
                </div>
                <span className="text-white/80 text-sm">ثانية</span>
              </div>
            </div>
          </div>

          {/* Features Section - Streamlined to focus on weekly updates */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-10">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              ماذا يميز خدمتنا؟
            </h3>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500/30 to-yellow-600/30 flex items-center justify-center text-white mt-0.5 flex-shrink-0">
                  <svg
                    className="w-4 h-4"
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
                <p className="text-white/80">
                  <strong className="text-amber-400">
                    تحديث أسبوعي للأسئلة
                  </strong>{" "}
                  - نضيف أسئلة جديدة من الامتحانات الحقيقية كل أسبوع
                </p>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500/30 to-yellow-600/30 flex items-center justify-center text-white mt-0.5 flex-shrink-0">
                  <svg
                    className="w-4 h-4"
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
                <p className="text-white/80">
                  <strong className="text-amber-400">
                    أكثر من 30 نموذج امتحان
                  </strong>{" "}
                  - مجموعة متنوعة من الامتحانات الحقيقية للتدرب عليها
                </p>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500/30 to-yellow-600/30 flex items-center justify-center text-white mt-0.5 flex-shrink-0">
                  <svg
                    className="w-4 h-4"
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
                <p className="text-white/80">
                  <strong className="text-amber-400">
                    محاكاة دقيقة للامتحانات
                  </strong>{" "}
                  - نفس مستوى الصعوبة وأسلوب الأسئلة الذي ستواجهه في الامتحان
                  الفعلي
                </p>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500/30 to-yellow-600/30 flex items-center justify-center text-white mt-0.5 flex-shrink-0">
                  <svg
                    className="w-4 h-4"
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
                <p className="text-white/80">
                  <strong className="text-amber-400">تحليل مفصل للنتائج</strong>{" "}
                  - تعرف على مستواك ونقاط قوتك وضعفك لتحسين أدائك
                </p>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link
              href="/"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              عودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes floating {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }

        .floating {
          animation: floating 15s ease-in-out infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
