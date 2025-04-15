// components/AccountSettings.js
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useClientAuth } from "../context/ClientAuthContext";

const AccountSettings = ({ isOpen, onClose }) => {
  const { user, userProfile, updateProfile, isPremium, premiumExpiryDate } =
    useClientAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const modalRef = useRef(null);
  const [premiumInfo, setPremiumInfo] = useState(null);

  // Load user data
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "");
    }

    // Get premium info for display
    if (isPremium && premiumExpiryDate) {
      const expiry = new Date(premiumExpiryDate);
      const now = new Date();

      setPremiumInfo({
        expiryDate: expiry,
        expiryFormatted: expiry.toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        daysRemaining: Math.ceil((expiry - now) / (1000 * 60 * 60 * 24)),
      });
    }
  }, [userProfile, isPremium, premiumExpiryDate]);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
      // Restore body scrolling when modal is closed
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setMessage({ type: "", text: "" });

      // Validate name
      if (!name.trim()) {
        setMessage({
          type: "error",
          text: "يرجى إدخال الاسم",
        });
        setIsLoading(false);
        return;
      }

      // Update profile
      const result = await updateProfile({ name });

      if (result.success) {
        setMessage({
          type: "success",
          text: "تم تحديث الملف الشخصي بنجاح",
        });
      } else {
        setMessage({
          type: "error",
          text: result.error || "حدث خطأ أثناء تحديث الملف الشخصي",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: "حدث خطأ أثناء تحديث الملف الشخصي",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setMessage({ type: "", text: "" });

      // Validate passwords
      if (!password) {
        setMessage({ type: "error", text: "يرجى إدخال كلمة المرور الجديدة" });
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setMessage({
          type: "error",
          text: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل",
        });
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setMessage({ type: "error", text: "كلمات المرور غير متطابقة" });
        setIsLoading(false);
        return;
      }

      // Update password
      const result = await updateProfile({
        newPassword: password,
      });

      if (result.success) {
        // Clear form
        setPassword("");
        setConfirmPassword("");

        setMessage({
          type: "success",
          text: "تم تغيير كلمة المرور بنجاح",
        });
      } else {
        setMessage({
          type: "error",
          text: result.error || "حدث خطأ أثناء تغيير كلمة المرور",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage({
        type: "error",
        text: "حدث خطأ أثناء تغيير كلمة المرور",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div
        ref={modalRef}
        className="w-full max-w-md sm:max-w-lg glass-effect rounded-xl overflow-hidden border border-blue-500/20 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800/30 to-blue-600/20 p-3 sm:p-4 border-b border-blue-500/20">
          <div className="flex items-center justify-between">
            <h2
              id="settings-title"
              className="text-lg sm:text-xl font-bold text-white"
            >
              إعدادات الحساب
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label="إغلاق"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab("profile");
              setMessage({ type: "", text: "" });
            }}
            className={`flex-1 min-w-0 px-4 py-2 font-medium text-xs sm:text-sm transition-colors ${
              activeTab === "profile"
                ? "text-blue-400 border-b-2 border-blue-500 bg-blue-500/10"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
            aria-selected={activeTab === "profile" ? "true" : "false"}
            role="tab"
          >
            <span className="whitespace-nowrap">الملف الشخصي</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("password");
              setMessage({ type: "", text: "" });
            }}
            className={`flex-1 min-w-0 px-4 py-2 font-medium text-xs sm:text-sm transition-colors ${
              activeTab === "password"
                ? "text-blue-400 border-b-2 border-blue-500 bg-blue-500/10"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
            aria-selected={activeTab === "password" ? "true" : "false"}
            role="tab"
          >
            <span className="whitespace-nowrap">كلمة المرور</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("subscription");
              setMessage({ type: "", text: "" });
            }}
            className={`flex-1 min-w-0 px-4 py-2 font-medium text-xs sm:text-sm transition-colors ${
              activeTab === "subscription"
                ? "text-amber-400 border-b-2 border-amber-500 bg-amber-500/10"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
            aria-selected={activeTab === "subscription" ? "true" : "false"}
            role="tab"
          >
            <span className="whitespace-nowrap">الاشتراك</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div>
              {message.text && activeTab === "profile" && (
                <div
                  className={`mb-4 p-3 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-500/20 border border-green-500/30 text-green-400"
                      : "bg-red-500/20 border border-red-500/30 text-red-400"
                  }`}
                  role="alert"
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-white/80 text-sm mb-1 font-medium"
                  >
                    الاسم
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-white/80 text-sm mb-1 font-medium"
                  >
                    البريد الإلكتروني
                  </label>
                  <input
                    id="email"
                    type="text"
                    value={userProfile?.email || ""}
                    disabled
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-white/70 cursor-not-allowed"
                    aria-readonly="true"
                  />
                  <p className="text-xs text-white/50 mt-1">
                    لا يمكن تغيير البريد الإلكتروني
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors disabled:bg-blue-600/50 disabled:cursor-not-allowed mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      <span>جاري الحفظ...</span>
                    </div>
                  ) : (
                    "حفظ التغييرات"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <div>
              {message.text && activeTab === "password" && (
                <div
                  className={`mb-4 p-3 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-500/20 border border-green-500/30 text-green-400"
                      : "bg-red-500/20 border border-red-500/30 text-red-400"
                  }`}
                  role="alert"
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-white/80 text-sm mb-1 font-medium"
                  >
                    كلمة المرور الجديدة
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    disabled={isLoading}
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-white/50 mt-1">على الأقل 6 أحرف</p>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-white/80 text-sm mb-1 font-medium"
                  >
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    disabled={isLoading}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors disabled:bg-blue-600/50 disabled:cursor-not-allowed mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      <span>جاري الحفظ...</span>
                    </div>
                  ) : (
                    "تغيير كلمة المرور"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === "subscription" && (
            <div className="space-y-4">
              <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-white/80 text-sm">حالة الاشتراك:</span>
                  {isPremium ? (
                    <span className="text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full text-xs font-medium">
                      مشترك
                    </span>
                  ) : (
                    <span className="text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full text-xs font-medium">
                      غير مشترك
                    </span>
                  )}
                </div>

                {isPremium && premiumInfo && (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-white/80 text-sm">
                        تاريخ انتهاء الاشتراك:
                      </span>
                      <span className="text-amber-400 font-medium text-sm">
                        {premiumInfo.expiryFormatted}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-white/80 text-sm">
                        الأيام المتبقية:
                      </span>
                      <span className="text-amber-400 font-medium text-sm">
                        {premiumInfo.daysRemaining} يوم
                      </span>
                    </div>
                  </>
                )}

                {!isPremium && (
                  <div className="mt-3">
                    <p className="text-white/70 text-sm mb-3">
                      لم تقم بالاشتراك في العضوية الذهبية بعد. اشترك الآن للوصول
                      إلى جميع الامتحانات الحقيقية.
                    </p>
                    <a
                      href="/premium"
                      className="block w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white py-2 text-center rounded-lg font-medium transition-colors shadow-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                    >
                      اشترك الآن
                    </a>
                  </div>
                )}
              </div>

              {isPremium && (
                <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
                  <h4 className="text-amber-400 font-medium mb-2 text-sm">
                    مميزات العضوية الذهبية
                  </h4>
                  <ul className="text-white/80 text-xs space-y-1.5 pr-4 list-disc">
                    <li>
                      الوصول إلى أكثر من 30 اختباراً حقيقياً من امتحانات سابقة
                    </li>
                    <li>تحليل مفصل لأدائك ونقاط القوة والضعف</li>
                    <li>شهادات إتمام الاختبارات بتصميم احترافي</li>
                    <li>دعم فني على مدار الساعة</li>
                    <li>تحديثات مستمرة بأحدث الامتحانات</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
