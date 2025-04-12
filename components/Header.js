// components/Header.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useClientAuth } from "../context/ClientAuthContext";

const Header = ({ showSubjects, setShowSubjects }) => {
  const { user, isPremium, loading, logout } = useClientAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLandingPage = pathname === "/";

  const handleAccountClick = () => {
    router.push("/account");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
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
                    alt="شعار منصة الإختبارات المصرية"
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
                منصة رسمية للاختبارات المصرية
              </div>
            </div>

            <div className="relative group">
              <Link href="/">
                <h1 className="text-lg font-bold text-white hidden sm:block">
                  منصة الإختبارات المصرية
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
                  <span className="text-white/90 text-sm">+8000 سؤال</span>
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
                    +1000 اختبار
                  </span>
                </div>
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 right-0 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                  عدد الاختبارات المتاحة بالمنصة
                </div>
              </div>
            </div>

            {/* Premium Button with Tooltip - Show for non-premium users */}
            {!isPremium && !loading && (
              <div className="relative group">
                <Link
                  href="/premium"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white rounded-xl border border-amber-500/30 transition-all duration-300 flex items-center gap-2 shadow-md shadow-amber-500/10"
                  aria-label="اختبارات حقيقية"
                >
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span>اختبارات حقيقية</span>
                </Link>
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 left-1/2 -translate-x-1/2 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                  اختبارات حقيقية من السنوات السابقة
                </div>
              </div>
            )}

            {/* Premium Exams Button - Show for premium users */}
            {isPremium && !loading && (
              <div className="relative group">
                <Link
                  href="/premium-exams"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white rounded-xl border border-amber-500/30 transition-all duration-300 flex items-center gap-2 shadow-md shadow-amber-500/10"
                  aria-label="الامتحانات الحقيقية"
                >
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span>الامتحانات الحقيقية</span>
                </Link>
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 left-1/2 -translate-x-1/2 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                  استعرض الامتحانات الحقيقية المتاحة لك
                </div>
              </div>
            )}

            {/* Account Button - Show ONLY for premium users */}
            {isPremium && user && !loading && (
              <div className="relative group">
                <button
                  onClick={handleAccountClick}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 border border-blue-500/30 flex items-center justify-center transition-all duration-300 shadow-md"
                  aria-label="حسابي"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 right-0 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                  {user?.name || "المستخدم"}
                </div>
              </div>
            )}

            {/* Loading State - Show when authentication is loading */}
            {loading && (
              <div className="relative px-4 py-2">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
