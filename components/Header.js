// components/Header.js
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Header = ({ showSubjects, setShowSubjects }) => {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

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
                    alt="شعار منصة امتحانات مصر"
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
                منصة رسمية لامتحانات مصر
              </div>
            </div>

            <div className="relative group">
              <Link href="/">
                <h1 className="text-lg font-bold text-white hidden sm:block">
                  منصة امتحانات مصر
                </h1>
              </Link>
              {/* Tooltip */}
              <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 top-full right-0 mt-2 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700 ">
                منصة تدريبية لاختبارات مصر التوظيفية
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
                  <span className="text-white/90 text-sm">8000+ سؤال</span>
                </div>
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 right-0 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                  عدد أسئلة امتحانات مصر المتاحة بالمنصة
                </div>
              </div>

              <div className="relative group">
                <div className="glass-effect px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 cursor-default">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-white/90 text-sm whitespace-nowrap">
                    1000+ اختبار
                  </span>
                </div>
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 right-0 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                  عدد اختبارات مصر التوظيفية المتاحة بالمنصة
                </div>
              </div>
            </div>

            {/* Start Button with Tooltip - Direct approach to open modal */}
            {isLandingPage ? (
              <div className="relative group">
                <button
                  onClick={() => setShowSubjects(true)}
                  className="px-5 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl border border-white/10 transition-all duration-300 flex items-center gap-2"
                  aria-label="ابدأ امتحانات مصر الآن"
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
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 left-1/2 -translate-x-1/2 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                  ابدأ اختبارات مصر الآن
                </div>
              </div>
            ) : (
              <div className="relative group">
                <Link
                  href={"/"}
                  className="px-5 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl border border-white/10 transition-all duration-300 flex items-center gap-2"
                  aria-label="ابدأ امتحانات مصر الآن"
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
                </Link>
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 left-1/2 -translate-x-1/2 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                  العودة للصفحة الرئيسية
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
