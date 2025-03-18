// components/Header.js
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Header = ({ showSubjects, setShowSubjects }) => {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  // Safe handler for the subjects button
  const handleShowSubjects = () => {
    if (typeof setShowSubjects === "function") {
      setShowSubjects(true);
    }
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-20">
      <div className="glass-effect rounded-2xl border border-white/10 p-3">
        <div className="flex items-center justify-between">
          {/* Logo & Title with Tooltip */}
          <div className="flex items-center gap-3 px-2">
            <div className="relative group">
              <Link href="/">
                <div className="w-12 h-12 rounded-2xl glass-effect flex items-center justify-center border border-white/10 overflow-hidden cursor-pointer">
                  <Image
                    src="/logo.png"
                    alt="شعار منصة الاختبارات المصرية"
                    width={60}
                    height={40}
                    className="w-full h-full object-contain p-1"
                    priority
                    quality={90}
                  />
                </div>
              </Link>
              {/* Tooltip */}
              <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 right-0 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                منصة غير رسمية
              </div>
            </div>

            <div className="relative group">
              <Link href="/">
                <h1 className="text-lg font-bold text-white hidden sm:block">
                  منصة الاختبارات المصرية
                </h1>
              </Link>
              {/* Tooltip */}
              <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 top-full right-0 mt-2 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700 ">
                منصة تدريبية لاختبارات التوظيف المصرية
              </div>
            </div>
          </div>

          {/* Stats & Actions with Tooltips */}
          <div className="flex items-center gap-3">
            {/* Stats Pills */}
            <div className="hidden md:flex items-center gap-2">
              <div className="relative group">
                <div className="glass-effect px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 cursor-default">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-white/90 text-sm">3000 سؤال</span>
                </div>
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 right-0 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                  عدد الأسئلة المتاحة بالمنصة
                </div>
              </div>

              <div className="relative group">
                <div className="glass-effect px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 cursor-default">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-white/90 text-sm whitespace-nowrap">
                    150 اختبار
                  </span>
                </div>
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 right-0 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                  عدد الاختبارات المتاحة بالمنصة
                </div>
              </div>
            </div>

            {/* Start Button with Tooltip */}
            <div className="relative group">
              {isLandingPage ? (
                <button
                  onClick={handleShowSubjects}
                  className="px-5 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl border border-white/10 transition-all duration-300 flex items-center gap-2"
                  aria-label="ابدأ الاختبار الآن"
                >
                  <span>ابدأ الآن</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ) : (
                <Link
                  href="/"
                  className="px-5 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl border border-white/10 transition-all duration-300 flex items-center gap-2"
                  aria-label="العودة للرئيسية"
                >
                  <span>العودة للرئيسية</span>
                </Link>
              )}
              {/* Tooltip */}
              <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 left-1/2 -translate-x-1/2 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                {isLandingPage
                  ? "ابدأ الاختبار الآن"
                  : "العودة للصفحة الرئيسية"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
