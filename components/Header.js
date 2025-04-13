// components/Header.js
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useClientAuth } from "../context/ClientAuthContext";
import LoginModal from "./LoginModal";
import AccountSettings from "./AccountSettings";

const Header = ({ showSubjects, setShowSubjects }) => {
  const { user, userProfile, isPremium, loading, logout } = useClientAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLandingPage = pathname === "/";
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const accountMenuRef = useRef(null);

  const handleAccountClick = () => {
    setShowAccountMenu(!showAccountMenu);
  };

  const handleAccountSettings = () => {
    setShowAccountMenu(false);
    setShowAccountSettings(true);
  };

  const handleLogout = async () => {
    setShowAccountMenu(false);
    await logout();
    router.push("/");
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
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
                  منصة تدريبية للاختبارات المصرية
                </div>
              </div>

              <div className="relative group">
                <Link href="/">
                  <h1 className="text-lg font-bold text-white hidden sm:block">
                    منصة الاختبارات المصرية{" "}
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

              {/* Account Button - Show when user is logged in */}
              {user && !loading ? (
                <div className="relative group" ref={accountMenuRef}>
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

                  {/* Account Menu */}
                  {showAccountMenu && (
                    <div className="absolute top-full right-0 mt-2 w-56 rounded-xl bg-slate-800 shadow-lg border border-white/10 z-50 overflow-hidden">
                      <div className="p-3 border-b border-white/10 bg-slate-700/50">
                        <div className="text-white font-medium">
                          {userProfile?.name || "المستخدم"}
                        </div>
                        <div className="text-white/60 text-sm truncate">
                          {userProfile?.email || ""}
                        </div>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={handleAccountSettings}
                          className="w-full text-right px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span>إعدادات الحساب</span>
                        </button>

                        {isPremium && (
                          <Link
                            href="/premium-exams"
                            className="w-full text-right px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 block"
                          >
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
                            <span>الامتحانات الحقيقية</span>
                          </Link>
                        )}

                        <Link
                          href="/history"
                          className="w-full text-right px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 block"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          <span>سجل النتائج</span>
                        </Link>

                        <hr className="my-2 border-white/10" />

                        <button
                          onClick={handleLogout}
                          className="w-full text-right px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span>تسجيل الخروج</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tooltip */}
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 right-0 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                    {userProfile?.name || "المستخدم"}
                  </div>
                </div>
              ) : !loading ? (
                /* Login Button - Show when user is not logged in */
                <div className="relative group">
                  <button
                    onClick={handleLoginClick}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 border border-blue-500/30 flex items-center justify-center transition-all duration-300 shadow-md"
                    aria-label="تسجيل الدخول"
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
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                  {/* Tooltip */}
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -bottom-10 right-0 z-50 px-3 py-2 text-xs bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                    تسجيل الدخول
                  </div>
                </div>
              ) : (
                /* Loading State */
                <div className="relative px-4 py-2">
                  <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Account Settings Modal */}
      <AccountSettings
        isOpen={showAccountSettings}
        onClose={() => setShowAccountSettings(false)}
      />
    </>
  );
};

export default Header;
