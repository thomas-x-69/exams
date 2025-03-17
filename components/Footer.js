// components/Footer.js
"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 py-4 mt-auto ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 ">
        <div className="text-center text-white/50 text-sm">
          <p>
            © {new Date().getFullYear()} منصة الاختبارات المصرية - جميع الحقوق
            محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
