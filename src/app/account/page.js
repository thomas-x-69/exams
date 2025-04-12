"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClientAuth } from "../../../context/ClientAuthContext";
import Header from "../../../components/Header";

export default function AccountPage() {
  const router = useRouter();
  const { user, isPremium, logout, checkPremiumStatus } = useClientAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [premiumInfo, setPremiumInfo] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  // Check if user is premium and redirect if not
  useEffect(() => {
    if (!isPremium) {
      router.replace("/premium");
      return;
    }

    // Load user data
    if (user) {
      setName(user.name || "");

      // Get premium info for display
      const info = checkPremiumStatus();
      setPremiumInfo(info);
      setPageLoading(false);
    }
  }, [user, isPremium, router, checkPremiumStatus]);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setMessage({ type: "", text: "" });

      // Update user name in localStorage
      const updatedUser = { ...user, name };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("userName", name);

      setMessage({
        type: "success",
        text: "تم تحديث الملف الشخصي بنجاح",
      });

      // Refresh page after 1 second
      setTimeout(() => {
        window.location.reload();
      }, 1000);
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

      // Form validation
      if (!currentPassword) {
        setMessage({ type: "error", text: "يرجى إدخال كلمة المرور الحالية" });
        return;
      }

      if (newPassword.length < 6) {
        setMessage({
          type: "error",
          text: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل",
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        setMessage({ type: "error", text: "كلمات المرور غير متطابقة" });
        return;
      }

      // Verify current password (simplified for client-side auth)
      if (user.password !== currentPassword) {
        setMessage({ type: "error", text: "كلمة المرور الحالية غير صحيحة" });
        setIsLoading(false);
        return;
      }

      // Update password
      const updatedUser = { ...user, password: newPassword };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage({
        type: "success",
        text: "تم تغيير كلمة المرور بنجاح",
      });
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

  // Handle sign out
  const handleLogout = async () => {
    logout();
    router.push("/");
  };

  // Loading state
  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute top-0 left-0 w-full h-full border-8 border-blue-500/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-8 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 text-xl">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
          <p className="text-white text-xl font-bold">
            جاري تحميل بيانات الحساب...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden pt-28">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 pattern-dots opacity-30"></div>
        <div className="absolute top-0 -right-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-3xl floating"></div>
        <div
          className="absolute bottom-0 -left-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-3xl floating"
          style={{ animationDelay: "-4s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-[1200px] h-[1200px] bg-purple-600/5 rounded-full blur-3xl floating"
          style={{
            animationDelay: "-2s",
            transform: "translate(-50%, -50%)",
          }}
        ></div>
      </div>

      <Header />

      <div className="max-w-5xl mx-auto px-4 pt-8 pb-16">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
            <svg
              className="w-10 h-10 text-blue-500"
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            إعدادات الحساب
          </h1>
          <p className="text-xl text-white/70 mb-2">
            مرحباً {user?.name || "المستخدم"}
          </p>

          {isPremium && premiumInfo && (
            <div className="inline-block mt-2 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 rounded-lg px-4 py-2 border border-amber-500/30">
              <span className="text-amber-400 flex items-center gap-2">
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
                <span>
                  عضو ذهبي - صالحة حتى {premiumInfo.expiryFormatted} (متبقي{" "}
                  {premiumInfo.daysRemaining} يوم)
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-t-xl border border-white/10 overflow-hidden">
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-6 font-medium text-sm md:text-base border-b-2 transition-all ${
                activeTab === "profile"
                  ? "border-blue-500 text-blue-500 bg-blue-500/5"
                  : "border-transparent text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                الملف الشخصي
              </span>
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`py-4 px-6 font-medium text-sm md:text-base border-b-2 transition-all ${
                activeTab === "password"
                  ? "border-blue-500 text-blue-500 bg-blue-500/5"
                  : "border-transparent text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2">
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
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                تغيير كلمة المرور
              </span>
            </button>
            <button
              onClick={() => setActiveTab("subscription")}
              className={`py-4 px-6 font-medium text-sm md:text-base border-b-2 transition-all ${
                activeTab === "subscription"
                  ? "border-blue-500 text-blue-500 bg-blue-500/5"
                  : "border-transparent text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2">
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
                الاشتراك
              </span>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-500"
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
                  </span>
                  المعلومات الشخصية
                </h2>

                {message.text && activeTab === "profile" && (
                  <div
                    className={`mb-6 p-4 rounded-xl ${
                      message.type === "success"
                        ? "bg-green-500/20 border border-green-500/30 text-green-400"
                        : "bg-red-500/20 border border-red-500/30 text-red-400"
                    }`}
                  >
                    <p className="flex items-center gap-2">
                      {message.type === "success" ? (
                        <svg
                          className="w-5 h-5 flex-shrink-0"
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
                      ) : (
                        <svg
                          className="w-5 h-5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      )}
                      {message.text}
                    </p>
                  </div>
                )}

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="bg-slate-800 border border-white/10 rounded-xl p-5">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-white/80 text-sm mb-2">
                          الاسم
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="الاسم الكامل"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label className="block text-white/80 text-sm mb-2">
                          رقم الهاتف
                        </label>
                        <input
                          type="text"
                          value={user?.phone || ""}
                          disabled
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white/70 cursor-not-allowed"
                        />
                        <p className="text-xs text-white/50 mt-1">
                          لا يمكن تغيير رقم الهاتف
                        </p>
                      </div>

                      <div>
                        <label className="block text-white/80 text-sm mb-2">
                          تاريخ الانضمام
                        </label>
                        <input
                          type="text"
                          value={new Date().toLocaleDateString("ar-EG", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                          disabled
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white/70 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:hover:from-blue-500 disabled:hover:to-blue-600"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>جاري الحفظ...</span>
                        </>
                      ) : (
                        <>
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>حفظ التغييرات</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                  </span>
                  تغيير كلمة المرور
                </h2>

                {message.text && activeTab === "password" && (
                  <div
                    className={`mb-6 p-4 rounded-xl ${
                      message.type === "success"
                        ? "bg-green-500/20 border border-green-500/30 text-green-400"
                        : "bg-red-500/20 border border-red-500/30 text-red-400"
                    }`}
                  >
                    <p className="flex items-center gap-2">
                      {message.type === "success" ? (
                        <svg
                          className="w-5 h-5 flex-shrink-0"
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
                      ) : (
                        <svg
                          className="w-5 h-5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      )}
                      {message.text}
                    </p>
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="bg-slate-800 border border-white/10 rounded-xl p-5">
                    <div className="space-y-5">
                      <div>
                        <label className="block text-white/80 text-sm mb-2">
                          كلمة المرور الحالية
                        </label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="أدخل كلمة المرور الحالية"
                          disabled={isLoading}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-white/80 text-sm mb-2">
                            كلمة المرور الجديدة
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="أدخل كلمة المرور الجديدة"
                            disabled={isLoading}
                          />
                          <p className="text-xs text-white/50 mt-1">
                            على الأقل 6 أحرف
                          </p>
                        </div>

                        <div>
                          <label className="block text-white/80 text-sm mb-2">
                            تأكيد كلمة المرور الجديدة
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="أعد إدخال كلمة المرور الجديدة"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:hover:from-blue-500 disabled:hover:to-blue-600"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>جاري الحفظ...</span>
                        </>
                      ) : (
                        <>
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
                              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
                          </svg>
                          <span>تغيير كلمة المرور</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Subscription Tab */}
            {activeTab === "subscription" && (
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-500"
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
                  </span>
                  معلومات الاشتراك
                </h2>

                <div className="bg-slate-800 border border-white/10 rounded-xl p-6 mb-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                        <svg
                          className="w-5 h-5 text-yellow-500"
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
                        <span>العضوية الذهبية</span>
                      </h3>
                      <p className="text-white/70">اشتراك شهري بقيمة 99 جنيه</p>
                    </div>

                    <div className="bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full text-white px-4 py-2 text-sm font-bold shadow-lg">
                      اشتراك فعال
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-700/50 rounded-xl p-4 border border-white/10">
                      <h4 className="text-white/80 text-sm mb-2">
                        تاريخ بداية الاشتراك
                      </h4>
                      <p className="text-white font-medium">
                        {new Date(
                          premiumInfo?.expiryDate
                            ? new Date(premiumInfo.expiryDate).getTime() -
                              30 * 24 * 60 * 60 * 1000
                            : new Date()
                        ).toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="bg-slate-700/50 rounded-xl p-4 border border-white/10">
                      <h4 className="text-white/80 text-sm mb-2">
                        تاريخ انتهاء الاشتراك
                      </h4>
                      <p className="text-white font-medium">
                        {premiumInfo?.expiryFormatted || "غير معروف"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="bg-gradient-to-r from-amber-500/20 to-yellow-600/20 p-4 rounded-xl border border-amber-500/30 relative overflow-hidden">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-amber-400 mb-1">
                            متبقي على انتهاء الاشتراك
                          </h4>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 bg-slate-700 rounded-full flex-1 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-400 to-yellow-500"
                                style={{
                                  width: `${
                                    premiumInfo
                                      ? Math.min(
                                          100,
                                          (premiumInfo.daysRemaining / 30) * 100
                                        )
                                      : 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-white font-medium whitespace-nowrap">
                              {premiumInfo?.daysRemaining || 0} يوم
                            </span>
                          </div>
                          <p className="text-white/70 text-sm">
                            سيتوقف الوصول إلى المحتوى المميز بعد انتهاء فترة
                            الاشتراك
                          </p>
                        </div>

                        <div className="shrink-0">
                          <a
                            href="/premium"
                            className="inline-block px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md"
                          >
                            تجديد الاشتراك
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    مميزات العضوية الذهبية
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg
                          className="w-4 h-4 text-amber-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-white/90">
                        الوصول لجميع الاختبارات التدريبية
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg
                          className="w-4 h-4 text-amber-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-white/90">
                        أكثر من 30 نموذج امتحان حقيقي سابق
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg
                          className="w-4 h-4 text-amber-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-white/90">
                        تحليل مفصل للأداء ونقاط القوة والضعف
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg
                          className="w-4 h-4 text-amber-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-white/90">
                        شهادات إتمام الاختبارات بتصميم احترافي
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg
                          className="w-4 h-4 text-amber-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-white/90">
                        دعم فني على مدار الساعة
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg
                          className="w-4 h-4 text-amber-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-white/90">
                        تحديثات مستمرة بأحدث الامتحانات
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-10 text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
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
    </div>
  );
}
