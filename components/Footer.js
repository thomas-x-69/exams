// components/Footer.js
"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 py-6  mt-4 bg-[#0f172a]">
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
