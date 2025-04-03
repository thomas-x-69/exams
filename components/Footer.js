// components/Footer.js
"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 py-6 mt-4 bg-[#0f172a] mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Links on the left */}
          <div className="flex gap-4 text-white/50 text-sm">
            <Link
              href="/privacy"
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              سياسة الخصوصية
            </Link>
            <Link
              href="/history"
              className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-1"
            >
              <svg
                className="w-3.5 h-3.5"
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
          </div>

          {/* Copyright in center */}
          <div className="text-center text-white/50 text-sm">
            <p>
              © {new Date().getFullYear()} منصة الاختبارات المصرية - جميع الحقوق
              محفوظة
            </p>
          </div>

          {/* Links on the right */}
          <div className="flex gap-6 text-white/50 text-sm">
            <Link
              href="/terms"
              className="text-white/50 hover:text-white text-sm transition-colors "
            >
              شروط الاستخدام
            </Link>
            <Link
              href="/about"
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              من نحن
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
