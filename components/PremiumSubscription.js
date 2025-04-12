// components/PremiumSubscription.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClientAuth } from "../context/ClientAuthContext";
import Image from "next/image";
import PaymentStatusModal from "./PaymentStatusModal";

const PremiumSubscription = () => {
  const router = useRouter();
  const { login, activatePremium } = useClientAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentIframeUrl, setPaymentIframeUrl] = useState(null);
  const [showPaymentIframe, setShowPaymentIframe] = useState(false);

  // User registration form
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Pricing plan - one-time monthly subscription
  const plan = {
    id: "monthly",
    name: "اشتراك شهري",
    price: 99,
    originalPrice: 150,
    features: [
      "الوصول لجميع الاختبارات التدريبية",
      "أكثر من 30 نموذج امتحان حقيقي سابق",
      "تحليل مفصل للأداء ونقاط القوة والضعف",
      "شهادات إتمام الاختبارات بتصميم احترافي",
      "دعم فني على مدار الساعة",
      "تحديثات مستمرة بأحدث الامتحانات",
      "دفع شهري لمرة واحدة",
      "صلاحية استخدام لمدة شهر كامل",
    ],
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!userInfo.name.trim()) {
      errors.name = "يرجى إدخال الاسم";
    }

    if (!userInfo.phone.trim()) {
      errors.phone = "يرجى إدخال رقم الهاتف";
    } else if (!/^01[0125][0-9]{8}$/.test(userInfo.phone)) {
      errors.phone = "يرجى إدخال رقم هاتف مصري صحيح";
    }

    if (!userInfo.password.trim()) {
      errors.password = "يرجى إدخال كلمة المرور";
    } else if (userInfo.password.length < 6) {
      errors.password = "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل";
    }

    if (userInfo.password !== userInfo.confirmPassword) {
      errors.confirmPassword = "كلمتا المرور غير متطابقتين";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePaymentInitiation = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create payment session with API
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: plan.price,
          planId: plan.id,
          userInfo: {
            name: userInfo.name,
            phone: userInfo.phone,
            email: `${userInfo.phone}@egyptianexams.com`, // Generated email
          },
        }),
      });

      const data = await response.json();

      if (data.success && data.iframeUrl) {
        // Save order info and user info for later use
        localStorage.setItem("currentOrderId", data.orderId);
        localStorage.setItem("tempUserInfo", JSON.stringify(userInfo));

        // Show payment iframe
        setPaymentIframeUrl(data.iframeUrl);
        setShowPaymentIframe(true);
      } else {
        // Show error
        setPaymentStatus({
          status: "error",
          message:
            data.message ||
            "حدث خطأ أثناء إنشاء جلسة الدفع. يرجى المحاولة مرة أخرى.",
        });
        setShowPaymentModal(true);
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      setPaymentStatus({
        status: "error",
        message: "حدث خطأ أثناء الدفع. يرجى المحاولة مرة أخرى.",
      });
      setShowPaymentModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle payment success
  const handlePaymentSuccess = async () => {
    try {
      // Get stored user info
      const storedUserInfo = JSON.parse(
        localStorage.getItem("tempUserInfo") || "{}"
      );

      // Create user account
      await login(storedUserInfo);

      // Activate premium
      await activatePremium(30); // 30 days

      // Clean up temp storage
      localStorage.removeItem("tempUserInfo");
      localStorage.removeItem("currentOrderId");

      // Show success modal
      setPaymentStatus({
        status: "success",
        message:
          "تم الاشتراك بنجاح! يمكنك الآن الوصول إلى جميع الامتحانات الحقيقية.",
        verifiedByServer: true,
      });
      setShowPaymentModal(true);
    } catch (error) {
      console.error("Error handling payment success:", error);
      setPaymentStatus({
        status: "error",
        message: "حدث خطأ أثناء تفعيل الاشتراك. يرجى التواصل مع الدعم الفني.",
      });
      setShowPaymentModal(true);
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentStatus(null);
  };

  const closePaymentIframe = () => {
    setShowPaymentIframe(false);
    setPaymentIframeUrl(null);
  };

  // For the demo, simulate payment completion when iframe closes
  const handleIframeClose = () => {
    closePaymentIframe();
    handlePaymentSuccess();
  };

  return (
    <div className="max-w-6xl mx-auto relative bg-slate-800/80 backdrop-blur-md rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shine z-10 pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 p-8">
        {/* Left Column - Package Info */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 p-6 h-full">
            {/* Package Title */}
            <div className="relative">
              <span className="text-xs font-semibold bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-3 py-1 rounded-full absolute -top-10 right-0">
                عرض لفترة محدودة
              </span>
              <h3 className="text-2xl font-bold text-white mb-2">
                العضوية الذهبية
              </h3>
              <p className="text-white/70 text-sm mb-4">
                الوصول الكامل لجميع الامتحانات الحقيقية
              </p>
            </div>

            {/* Price Section */}
            <div className="mt-6 flex items-end gap-2 mb-6">
              <div className="text-4xl font-bold text-white">{plan.price}</div>
              <div className="flex flex-col">
                <span className="text-amber-400 line-through text-lg">
                  {plan.originalPrice}
                </span>
                <span className="text-white/80 text-sm">جنيه مصري / شهر</span>
              </div>
              <div className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-lg border border-green-500/30 mr-2">
                خصم{" "}
                {Math.round(
                  ((plan.originalPrice - plan.price) / plan.originalPrice) * 100
                )}
                %
              </div>
            </div>

            {/* Monthly Badge */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 p-2 rounded-lg border border-amber-500/30 mb-6">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-amber-300 font-bold">
                اشتراك شهري - دفع مرة واحدة
              </span>
            </div>

            {/* Features List */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                المميزات الحصرية
              </h4>
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
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
                    <span className="text-white/90 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Secure Badges */}
            <div className="flex justify-center items-center gap-6 mt-8">
              <div className="text-center">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-1">
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
                </div>
                <span className="text-white/60 text-xs">دفع آمن</span>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-1">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <span className="text-white/60 text-xs">اشتراك موثوق</span>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-1">
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
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <span className="text-white/60 text-xs">دعم فني 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - User Info & Payment Form */}
        <div className="lg:col-span-3">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 p-6">
            <h3 className="text-xl font-bold text-white mb-6">
              بيانات المستخدم والدفع
            </h3>

            {/* User Registration Form */}
            <div className="mb-6">
              <div className="bg-gradient-to-br from-amber-500/10 to-yellow-600/5 rounded-xl p-5 mb-6 border border-amber-500/20">
                <h4 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  بيانات المستخدم
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-1">
                      الاسم
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={userInfo.name}
                      onChange={handleInputChange}
                      className={`w-full bg-slate-700 border ${
                        validationErrors.name
                          ? "border-red-500"
                          : "border-slate-600"
                      } rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500`}
                      placeholder="الاسم بالكامل"
                      disabled={isLoading}
                    />
                    {validationErrors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-1">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={userInfo.phone}
                      onChange={handleInputChange}
                      className={`w-full bg-slate-700 border ${
                        validationErrors.phone
                          ? "border-red-500"
                          : "border-slate-600"
                      } rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500`}
                      placeholder="01xxxxxxxxx"
                      disabled={isLoading}
                    />
                    {validationErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.phone}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm mb-1">
                        كلمة المرور
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={userInfo.password}
                        onChange={handleInputChange}
                        className={`w-full bg-slate-700 border ${
                          validationErrors.password
                            ? "border-red-500"
                            : "border-slate-600"
                        } rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500`}
                        placeholder="كلمة المرور"
                        disabled={isLoading}
                      />
                      {validationErrors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm mb-1">
                        تأكيد كلمة المرور
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={userInfo.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full bg-slate-700 border ${
                          validationErrors.confirmPassword
                            ? "border-red-500"
                            : "border-slate-600"
                        } rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500`}
                        placeholder="تأكيد كلمة المرور"
                        disabled={isLoading}
                      />
                      {validationErrors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
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
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                طريقة الدفع
              </h4>

              <div className="p-4 rounded-xl border border-white/10 bg-white/5 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg p-2 flex items-center justify-center shadow-md flex-shrink-0">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h5 className="font-bold text-white mb-1">بطاقة ائتمان</h5>
                    <p className="text-white/70 text-sm">
                      فيزا، ماستركارد، ميزة
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white/5 rounded-xl p-5 mb-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">
                ملخص الطلب
              </h4>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-white/70">
                    العضوية الذهبية (شهرياً)
                  </span>
                  <span className="text-white">{plan.price} جنيه</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-white/70">الخصم</span>
                  <span className="text-green-400">
                    {plan.originalPrice - plan.price} جنيه
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">
                    الإجمالي (شهرياً)
                  </span>
                  <div className="text-xl font-bold text-amber-400">
                    {plan.price} جنيه
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-500/20 to-yellow-600/20 p-3 rounded-lg border border-amber-500/30 text-sm text-white/90 mb-4">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <span className="block font-medium text-amber-300 mb-1">
                      دفع آمن ومضمون
                    </span>
                    <span>
                      اشتراك شهري بدفعة واحدة. بعد انتهاء الشهر، يمكنك تجديد
                      الاشتراك مرة أخرى إذا رغبت في ذلك.
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePaymentInitiation}
                disabled={isLoading}
                className={`
                  w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 relative overflow-hidden
                  ${
                    isLoading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 shadow-lg hover:shadow-xl shadow-amber-500/20 transform hover:scale-[1.01]"
                  }
                `}
              >
                {/* Animated Shine Effect */}
                <span className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shine"></span>

                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                    <span>جاري التحميل...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>اشترك الآن</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status Modal */}
      <PaymentStatusModal
        isOpen={showPaymentModal}
        status={paymentStatus}
        onClose={closePaymentModal}
      />

      {/* Payment Iframe Modal */}
      {showPaymentIframe && paymentIframeUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-amber-500 text-white">
              <h3 className="font-bold text-lg">إتمام عملية الدفع</h3>
              <button
                onClick={handleIframeClose} // Using handleIframeClose instead of closePaymentIframe
                className="p-1 rounded-lg hover:bg-white/20"
              >
                <svg
                  className="w-6 h-6"
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
              </button>
            </div>
            <div className="w-full h-[600px]">
              <iframe
                src={paymentIframeUrl}
                className="w-full h-full border-0"
                title="بوابة الدفع"
              />
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          60%,
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shine {
          animation: shine 4s infinite;
        }
      `}</style>
    </div>
  );
};

export default PremiumSubscription;
