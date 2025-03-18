// components/Footer.js
"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 py-4 lg:mt-auto bg-slate-900 mt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-end gap-10">
          {/* Links on the right in desktop view */}
          <div className="flex gap-4 text-white/50 text-sm m-auto">
            <a
              href="/privacy"
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              سياسة الخصوصية
            </a>
          </div>
          {/* Copyright in center */}

          <div className="text-center text-white/50 text-sm ">
            <p>
              © {new Date().getFullYear()} منصة الاختبارات المصرية - جميع الحقوق
              محفوظة
            </p>
          </div>
          {/* Links on the right in desktop view */}
          <div className=" flex gap-4 text-white/50 text-sm m-auto">
            <a
              href="/terms"
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              {" "}
              شروط الاستخدام
            </a>
            <a
              href="/about"
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              من نحن
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
