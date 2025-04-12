// components/LoginModal.js
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useClientAuth } from "../context/ClientAuthContext";
import { useRouter } from "next/navigation";

const LoginModal = ({ isOpen, onClose }) => {
  const { login, register } = useClientAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const modalRef = useRef(null);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
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

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      setError("");
      setIsLogin(true);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form data
  const validateForm = () => {
    // Clear previous errors
    setError("");

    // Login validation
    if (isLogin) {
      if (!formData.phone) {
        setError("يرجى إدخال رقم الهاتف");
        return false;
      }
      if (!formData.password) {
        setError("يرجى إدخال كلمة المرور");
        return false;
      }
      return true;
    }

    // Registration validation
    if (!formData.name) {
      setError("يرجى إدخال الاسم");
      return false;
    }
    if (!formData.phone) {
      setError("يرجى إدخال رقم الهاتف");
      return false;
    }
    // Validate Egyptian phone number
    const phoneRegex = /^01[0125][0-9]{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("يرجى إدخال رقم هاتف مصري صحيح");
      return false;
    }
    if (!formData.password) {
      setError("يرجى إدخال كلمة المرور");
      return false;
    }
    if (formData.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("كلمة المرور غير متطابقة");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      let result;

      if (isLogin) {
        // Login
        result = await login(formData.phone, formData.password);
      } else {
        // Register
        result = await register({
          name: formData.name,
          phone: formData.phone,
          password: formData.password,
        });
      }

      if (result.success) {
        onClose();
        router.refresh(); // Refresh the page to update UI with logged-in state
      } else {
        setError(
          result.error ||
            "حدث خطأ أثناء " + (isLogin ? "تسجيل الدخول" : "التسجيل")
        );
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError(error.message || "حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-slate-800 rounded-xl overflow-hidden border border-white/10 shadow-2xl transform transition-all"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-black/10 transition-colors"
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
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {!isLogin && (
            <div>
              <label
                htmlFor="name"
                className="block text-white/80 text-sm mb-1"
              >
                الاسم
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="الاسم الكامل"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                disabled={isLoading}
              />
            </div>
          )}

          <div>
            <label htmlFor="phone" className="block text-white/80 text-sm mb-1">
              رقم الهاتف
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="01xxxxxxxxx"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-blue-500 transition-colors"
                disabled={isLoading}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">
                +2
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-white/80 text-sm mb-1"
            >
              كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={
                isLogin ? "كلمة المرور" : "كلمة المرور (6 أحرف على الأقل)"
              }
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              disabled={isLoading}
            />
          </div>

          {!isLogin && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-white/80 text-sm mb-1"
              >
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="تأكيد كلمة المرور"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                disabled={isLoading}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors shadow-md disabled:bg-blue-800/50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>
                  {isLogin ? "جاري تسجيل الدخول..." : "جاري إنشاء الحساب..."}
                </span>
              </div>
            ) : (
              <span>{isLogin ? "تسجيل الدخول" : "إنشاء حساب"}</span>
            )}
          </button>

          {/* Toggle between login/register */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
              disabled={isLoading}
            >
              {isLogin
                ? "ليس لديك حساب؟ إنشاء حساب جديد"
                : "لديك حساب بالفعل؟ تسجيل الدخول"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
