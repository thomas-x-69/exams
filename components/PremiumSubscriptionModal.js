// components/PremiumSubscriptionModal.js
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const PremiumSubscriptionModal = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const modalRef = useRef(null);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب";
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!/^01[0125][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = "رقم الهاتف غير صحيح";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Process payment and handle subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Save user info to session/localStorage for later use in payment
      localStorage.setItem("tempUserName", formData.name);
      localStorage.setItem("tempUserEmail", formData.email);
      localStorage.setItem("tempUserPhone", formData.phone);

      // Redirect to the premium page to start actual payment
      setIsProcessing(false);
      onClose();
      router.push("/premium");
    } catch (error) {
      console.error("Error initiating payment process:", error);
      setIsProcessing(false);
      alert("حدث خطأ أثناء بدء عملية الدفع. يرجى المحاولة مرة أخرى.");
    }
  };

  // Close the modal
  const handleClose = () => {
    if (isProcessing) return; // Prevent closing while processing
    onClose();
    // Reset state after a delay to allow fade-out animation
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "" });
      setErrors({});
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-slate-800 rounded-lg shadow-xl overflow-hidden transition-all duration-300 border border-amber-500/30"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4">
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">العضوية المميزة</h2>
              <p className="text-white/80 text-sm">
                اشتراك شهري - 99 جنيه / شهر
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Premium Features */}
          <div className="mb-5">
            <h3 className="text-lg font-bold text-white mb-3">
              ماذا ستحصل عليه:
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0"
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
                <span className="text-white/90">
                  وصول كامل لامتحانات حقيقية من الاختبارات السابقة
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0"
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
                <span className="text-white/90">
                  تحليلات متقدمة وإحصائيات مفصلة عن أدائك
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0"
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
                <span className="text-white/90">
                  صلاحية استخدام لمدة شهر كامل
                </span>
              </li>
            </ul>
          </div>

          {/* Form */}
          <form onSubmit={handleSubscribe} className="space-y-4">
            {/* User Info */}
            <div>
              <label className="block text-white/80 text-sm mb-1">الاسم</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full bg-slate-700 border ${
                  errors.name ? "border-red-500" : "border-slate-600"
                } rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500`}
                placeholder="الاسم بالكامل"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-slate-700 border ${
                  errors.email ? "border-red-500" : "border-slate-600"
                } rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500`}
                placeholder="example@domain.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-1">
                رقم الهاتف
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full bg-slate-700 border ${
                  errors.phone ? "border-red-500" : "border-slate-600"
                } rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500`}
                placeholder="01xxxxxxxxx"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Payment Info */}
            <div className="bg-slate-700 rounded-lg p-3 border border-slate-600">
              <div className="text-white/90 text-sm mb-1">سعر الاشتراك:</div>
              <div className="text-amber-500 font-bold text-2xl">
                99 جنيه / شهر
              </div>
              <div className="text-white/60 text-xs">
                دفعة واحدة لمدة شهر كامل
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-lg font-bold transition-colors shadow-md flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري معالجة الطلب...</span>
                </>
              ) : (
                <span>متابعة للدفع</span>
              )}
            </button>

            <p className="text-white/50 text-xs text-center">
              اشتراك صالح لمدة شهر واحد - يحتاج إلى تجديد يدوي بعد انتهاء المدة
            </p>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-slate-700 p-3 border-t border-slate-600 flex justify-between items-center">
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="text-white/60 hover:text-white transition-colors disabled:opacity-50"
          >
            إغلاق
          </button>

          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4 text-amber-400"
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
            <span className="text-white/60 text-xs">اتصال آمن</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumSubscriptionModal;
