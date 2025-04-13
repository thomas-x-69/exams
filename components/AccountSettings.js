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

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-slate-800 rounded-lg shadow-xl overflow-hidden transition-all duration-300 border border-amber-500/30"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  إعدادات الحساب
                </h2>
                <p className="text-white/80 text-sm">
                  {userProfile?.name || "المستخدم"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
              aria-label="إغلاق"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
        <div className="flex border-b border-slate-700">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-3 px-4 font-medium text-sm border-b-2 ${
              activeTab === "profile"
                ? "border-amber-500 text-amber-500"
                : "border-transparent text-white/70 hover:text-white"
            }`}
          >
            الملف الشخصي
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`py-3 px-4 font-medium text-sm border-b-2 ${
              activeTab === "password"
                ? "border-amber-500 text-amber-500"
                : "border-transparent text-white/70 hover:text-white"
            }`}
          >
            تغيير كلمة المرور
          </button>
          <button
            onClick={() => setActiveTab("subscription")}
            className={`py-3 px-4 font-medium text-sm border-b-2 ${
              activeTab === "subscription"
                ? "border-amber-500 text-amber-500"
                : "border-transparent text-white/70 hover:text-white"
            }`}
          >
            الاشتراك
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                المعلومات الشخصية
              </h3>

              {message.text && activeTab === "profile" && (
                <div
                  className={`mb-4 p-3 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-500/20 border border-green-500/30 text-green-400"
                      : "bg-red-500/20 border border-red-500/30 text-red-400"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-1">
                    الاسم
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-1">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="text"
                    value={userProfile?.email || ""}
                    disabled
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white/70 cursor-not-allowed"
                  />
                  <p className="text-xs text-white/50 mt-1">
                    لا يمكن تغيير البريد الإلكتروني
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors shadow-md disabled:bg-amber-500/50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
              </form>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                تغيير كلمة المرور
              </h3>

              {message.text && activeTab === "password" && (
                <div
                  className={`mb-4 p-3 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-500/20 border border-green-500/30 text-green-400"
                      : "bg-red-500/20 border border-red-500/30 text-red-400"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-1">
                    كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-white/50 mt-1">على الأقل 6 أحرف</p>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-1">
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors shadow-md disabled:bg-amber-500/50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "جاري الحفظ..." : "تغيير كلمة المرور"}
                </button>
              </form>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === "subscription" && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                معلومات الاشتراك
              </h3>

              <div className="bg-slate-700 rounded-lg p-4 border border-slate-600 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80">حالة الاشتراك:</span>
                  {isPremium ? (
                    <span className="text-green-400 bg-green-500/20 px-3 py-1 rounded-full text-sm font-medium">
                      مشترك
                    </span>
                  ) : (
                    <span className="text-red-400 bg-red-500/20 px-3 py-1 rounded-full text-sm font-medium">
                      غير مشترك
                    </span>
                  )}
                </div>

                {isPremium && premiumInfo && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80">
                      تاريخ انتهاء الاشتراك:
                    </span>
                    <span className="text-amber-400 font-medium">
                      {premiumInfo.expiryFormatted}
                    </span>
                  </div>
                )}

                {isPremium && premiumInfo?.daysRemaining !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">الأيام المتبقية:</span>
                    <span className="text-amber-400 font-medium">
                      {premiumInfo.daysRemaining} يوم
                    </span>
                  </div>
                )}

                {!isPremium && (
                  <div className="mt-4">
                    <p className="text-white/70 text-sm mb-3">
                      لم تقم بالاشتراك في العضوية الذهبية بعد. اشترك الآن للوصول
                      إلى جميع الامتحانات الحقيقية.
                    </p>
                    <a
                      href="/premium"
                      className="block w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white py-2 text-center rounded-lg font-medium transition-colors shadow-md"
                    >
                      اشترك الآن
                    </a>
                  </div>
                )}
              </div>

              {isPremium && (
                <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                  <h4 className="text-yellow-400 font-medium mb-2">
                    مميزات العضوية الذهبية
                  </h4>
                  <ul className="text-white/80 text-sm space-y-2 pr-5 list-disc">
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
