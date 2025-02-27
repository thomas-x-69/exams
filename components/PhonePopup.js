// src/app/components/PhonePopup.js
"use client";

import { useState, useEffect } from "react";

export default function PhonePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if we should show the popup
    const checkPopupVisibility = () => {
      try {
        // Get the saved phone number from localStorage
        const savedPhone = window.localStorage.getItem("userPhone");

        // If a phone number exists, don't show the popup
        if (savedPhone) {
          setIsVisible(false);
        } else {
          // Otherwise, show the popup
          setIsVisible(true);
        }
      } catch (e) {
        console.error("Error accessing localStorage:", e);
        // Default to showing the popup if there's an error
        setIsVisible(true);
      }
    };

    // Run the check when the component mounts
    checkPopupVisibility();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate Egyptian phone number (11 digits starting with 01)
    const phoneRegex = /^01[0-2|5]{1}[0-9]{8}$/;

    if (!phone) {
      setError("يرجى إدخال رقم الهاتف");
      return;
    }

    if (!phoneRegex.test(phone)) {
      setError("يرجى إدخال رقم هاتف مصري صحيح");
      return;
    }

    try {
      // Save the phone number to localStorage
      window.localStorage.setItem("userPhone", phone);
      // Close the popup
      setIsVisible(false);
    } catch (e) {
      console.error("Error saving to localStorage:", e);
      setError("حدث خطأ أثناء حفظ البيانات");
    }
  };

  const handleSkip = () => {
    // Just hide the popup for this session
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"></div>

      {/* Popup Content */}
      <div className="relative w-full max-w-md">
        <div className="glass-card bg-slate-900/80 border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-white/10 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/60 to-indigo-100/90 flex items-center justify-center text-xl border border-blue-300/20">
                📱
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">أدخل رقم هاتفك</h2>
                <p className="text-white/60 text-sm">
                  للتواصل معك بشأن الاختبارات الجديدة
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5">
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-white/80 text-sm mb-2"
              >
                رقم الهاتف
              </label>
              <input
                type="tel"
                id="phone"
                placeholder="01xxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value.trim())}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500/50"
                dir="ltr"
              />
              {error && <p className="mt-2 text-white text-sm">{error}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md shadow-blue-500/20"
              >
                تأكيد
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="flex-1 border border-white/10 hover:bg-white/5 text-white/80 hover:text-white py-2.5 rounded-lg font-medium transition-all duration-200"
              >
                تخطي
              </button>
            </div>

            <p className="mt-4 text-center text-white/50 text-xs">
              لن نقوم بمشاركة بياناتك مع أي طرف ثالث
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
