// src/app/pdfs/page.js
"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";

// Define categories for our PDFs
const pdfCategories = [
  { id: "all", name: "جميع الملفات" },
  { id: "mail", name: "البريد المصري" },
  { id: "education", name: "وزارة التربية" },
  { id: "specialized", name: "تخصصات" },
  { id: "general", name: "عام" },
];

// PDF resources data with proper categorization
const pdfResources = [
  {
    id: "iq",
    title: "ملفات اختبار الذكاء (IQ)",
    subtitle: "لجميع التخصصات",
    description: "كل ما يخص من ملفات أسئلة الذكاء (IQ) لجميع التخصصات",
    category: ["mail", "education", "general"],
    icon: "🧠",
    gradient: "from-blue-600/20 to-indigo-600/20",
    borderColor: "border-blue-200",
    link: "https://drive.google.com/drive/folders/1RQRFi-CZRxcbEaGx-W9xnlE7Fy4R6nQO",
  },
  {
    id: "english",
    title: "ملفات اللغة الإنجليزية",
    subtitle: "لجميع التخصصات",
    description: "كل ما يخص من ملفات اللغة الإنجليزية لجميع التخصصات",
    category: ["mail", "education", "general"],
    icon: "🌎",
    gradient: "from-green-600/20 to-emerald-600/20",
    borderColor: "border-green-200",
    link: "https://drive.google.com/drive/folders/1FIKwMHav4JwASxYe6l_LWR5i52L-lQhT",
  },
  {
    id: "math-spec",
    title: "تخصص رياضيات",
    subtitle: "ملفات تخصص رياضيات",
    description: "كل ما يخص من ملفات تخصص رياضيات",
    category: ["education", "specialized"],
    icon: "➗",
    gradient: "from-purple-600/20 to-violet-600/20",
    borderColor: "border-purple-200",
    link: "https://drive.google.com/drive/folders/1bDFQOAmC_Z1J2Q48h-w7IZ5Mw57M7Tvk",
  },
  {
    id: "math-edu",
    title: "تربوي رياضيات",
    subtitle: "ملفات تربوي لتخصص رياضيات",
    description: "كل ما يخص من ملفات التربوي لتخصص رياضيات",
    category: ["education", "specialized"],
    icon: "📊",
    gradient: "from-rose-600/20 to-pink-600/20",
    borderColor: "border-rose-200",
    link: "https://drive.google.com/drive/folders/1WYyWZlfa0SMUOEv3zK_vsJq1Oq9bGMh5",
  },
  {
    id: "it",
    title: "تكنولوجيا المعلومات (IT)",
    subtitle: "ملفات الحاسب الآلي",
    description: "كل ما يخص من ملفات الحاسب الآلي لجميع التخصصات",
    category: ["mail", "education", "general"],
    icon: "💻",
    gradient: "from-cyan-600/20 to-sky-600/20",
    borderColor: "border-cyan-200",
    link: "https://drive.google.com/drive/folders/1XnvcWKTDYlBB54HSI_GfA31yK7WJugyM",
  },
  {
    id: "behavioral",
    title: "كفايات سلوكية ونفسية",
    subtitle: "ملفات الكفايات السلوكية",
    description:
      "كل ما يخص من ملفات الجدارات والكفايات السلوكية والنفسية لجميع التخصصات",
    category: ["mail", "education", "general"],
    icon: "🧩",
    gradient: "from-amber-600/20 to-yellow-600/20",
    borderColor: "border-amber-200",
    link: "https://drive.google.com/drive/folders/1E5g3G46HBkXPIrpj2dLNpZH1jwjUBPPH",
  },
  {
    id: "arabic",
    title: "ملفات اللغة العربية",
    subtitle: "لجميع التخصصات",
    description: "كل ما يخص من ملفات اللغة العربية لجميع التخصصات",
    category: ["mail", "education", "general"],
    icon: "📖",
    gradient: "from-teal-600/20 to-emerald-600/20",
    borderColor: "border-teal-200",
    link: "https://drive.google.com/drive/folders/1krl5dHLoj7T9bHRo0F7aqO7MPVQ3gxBf",
  },
  {
    id: "general-knowledge",
    title: "معلومات عامة",
    subtitle: "ملفات المعلومات العامة",
    description: "كل ما يخص من ملفات المعلومات العامة لجميع التخصصات",
    category: ["mail", "education", "general"],
    icon: "🔍",
    gradient: "from-blue-600/20 to-sky-600/20",
    borderColor: "border-blue-200",
    link: "https://drive.google.com/drive/folders/1-Y78_lsS5xSxziYT-sMijA2Gy6OOsjFJ",
  },
];

// Enhanced creative PDF document card component with glassmorphism
const PdfCard = ({ resource }) => {
  return (
    <div className="group perspective">
      <a
        href={resource.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`block h-full glass-effect backdrop-blur-sm bg-white/10 rounded-2xl border-2 ${resource.borderColor} overflow-hidden transition-all duration-500 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/10 relative`}
      >
        {/* Hover glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
          <div
            className={`absolute inset-0 blur-xl bg-gradient-to-br ${resource.gradient} opacity-30`}
          ></div>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1500 ease-in-out"></div>

        <div className="p-6 relative z-10">
          {/* Floating Icon */}
          <div className="absolute -top-3 -right-3 transform group-hover:rotate-3 transition-transform duration-500">
            <div
              className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl bg-gradient-to-br ${resource.gradient} shadow-lg border-2 border-white/20 group-hover:border-white/30 transition-all duration-500`}
            >
              {resource.icon}
            </div>
          </div>

          {/* Title Section with gradient underline */}
          <div className="mr-16 mb-6 pb-3 border-b border-white/10">
            <h3 className="font-bold text-xl text-white mb-1 group-hover:text-blue-300 transition-colors duration-300">
              {resource.title}
            </h3>
            <p className="text-sm text-white/70">{resource.subtitle}</p>
          </div>

          {/* Description with subtle styling */}
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 mb-5">
            <p className="text-white/80 text-sm leading-relaxed">
              {resource.description}
            </p>
          </div>

          {/* Enhanced Download Button */}
          <div className="flex justify-end">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-md shadow-blue-500/20 group-hover:shadow-lg group-hover:shadow-blue-500/30 transform group-hover:translate-y-[-2px]">
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>تصفح الملفات وتنزيلها</span>
              <svg
                className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default function PDFsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showSubjects, setShowSubjects] = useState(false);
  const [filteredResources, setFilteredResources] = useState(pdfResources);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter resources based on category and search query
  useEffect(() => {
    if (mounted) {
      let filtered = pdfResources;

      // Filter by category
      if (selectedCategory !== "all") {
        filtered = filtered.filter((resource) =>
          resource.category.includes(selectedCategory)
        );
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (resource) =>
            resource.title.toLowerCase().includes(query) ||
            resource.description.toLowerCase().includes(query)
        );
      }

      setFilteredResources(filtered);
    }
  }, [selectedCategory, searchQuery, mounted]);

  // Skip rendering until client-side hydration is complete
  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>مكتبة الملفات والامتحانات | منصة الاختبارات المصرية</title>
        <meta
          name="description"
          content="مكتبة ملفات PDF الشاملة لاختبارات التوظيف المصرية. تحميل نماذج أسئلة وامتحانات البريد المصري والتربية والتعليم بجميع التخصصات."
        />
      </Head>

      <div className="min-h-screen pattern-grid relative overflow-hidden top-0 pt-28">
        {/* Header */}
        <Header showSubjects={showSubjects} setShowSubjects={setShowSubjects} />

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Enhanced Hero Section with animated elements */}
          <div className="relative text-center mb-16">
            {/* Modern creative heading with reveal animation */}
            <div className="relative inline-block mb-4">
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 pb-1">
                مكتبة الملفات والنماذج
              </h1>
            </div>

            <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
              مجموعة شاملة من ملفات PDF والامتحانات لمساعدتك في التحضير الأمثل
              للاختبارات
            </p>

            {/* Enhanced Search and Filter with glassmorphism */}
            <div className="max-w-3xl mx-auto glass-effect backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl mb-12 transform hover:shadow-blue-500/10 transition-all duration-500">
              <div className="flex flex-col sm:flex-row gap-5">
                {/* Advanced Search Box */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="ابحث عن ملفات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border-2 border-white/10 text-white rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/30 placeholder-white/40 shadow-inner"
                  />
                </div>

                {/* Creative Category Filter */}
                <div className="flex flex-wrap gap-2 justify-center bg-white/5 p-2 rounded-xl">
                  {pdfCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        selectedCategory === category.id
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-105"
                          : "bg-white/10 text-white/80 hover:bg-white/20"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Resources Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredResources.map((resource) => (
              <PdfCard key={resource.id} resource={resource} />
            ))}
          </div>

          {/* Creative Empty State with animated elements */}
          {filteredResources.length === 0 && (
            <div className="glass-effect backdrop-blur-md p-10 text-center rounded-2xl border-2 border-white/10 shadow-xl overflow-hidden relative">
              {/* Animated background */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-indigo-900/50"></div>
                <div className="absolute top-0 left-0 w-full h-full pattern-dots opacity-5"></div>
                <div className="absolute -top-20 right-1/3 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div
                  className="absolute -bottom-20 left-1/3 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl animate-pulse"
                  style={{ animationDelay: "2s" }}
                ></div>
              </div>

              {/* Animated file icon */}
              <div className="relative">
                <div className="relative mx-auto mb-6 w-24 h-24">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-xl blur-lg animate-pulse"></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-xl transform rotate-6 animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                  <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 w-full h-full rounded-xl flex items-center justify-center shadow-xl">
                    <svg
                      className="w-12 h-12 text-white/80"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 mb-3">
                  لا توجد ملفات مطابقة
                </h3>
                <p className="text-white/80 max-w-md mx-auto mb-6 leading-relaxed">
                  لم نتمكن من العثور على ملفات تطابق معايير البحث. جرب تغيير
                  كلمات البحث أو اختر تصنيفًا آخر.
                </p>

                {/* Suggestion button */}
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 px-6 py-2.5 rounded-xl text-white shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105"
                >
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>عرض جميع الملفات</span>
                </button>

                {/* Decorative element */}
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full mx-auto mt-8"></div>
              </div>
            </div>
          )}

          {/* Creative 3D Step Cards Section */}
          <div className="glass-effect backdrop-blur-md p-8 mb-12 rounded-2xl border border-white/20 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -z-10 inset-0">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl"></div>
              <div className="absolute top-0 left-0 w-full h-full pattern-dots opacity-5"></div>
            </div>

            <div className="relative">
              {/* Section heading with decorative underline */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white inline-block pb-2 relative">
                  استعد للامتحان بشكل أفضل
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
                </h2>
                <p className="text-white/80 mt-3 max-w-3xl mx-auto">
                  تحتوي مكتبتنا على مجموعة شاملة من الملفات والنماذج التي تساعدك
                  في التحضير المثالي للامتحانات. نوصي باتباع الخطوات التالية:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white/90">
                {/* Step 1 - Enhanced 3D card */}
                <div className="group bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-2xl p-1 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 flex flex-col h-full backdrop-blur-sm relative overflow-hidden">
                    {/* Animated corner decorator */}
                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/30 to-transparent transform rotate-45 translate-x-8 -translate-y-8 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-500"></div>
                    </div>

                    {/* Enhanced number indicator */}
                    <div className="relative">
                      <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-500/10 rounded-full blur-lg group-hover:bg-blue-500/20 transition-colors duration-500"></div>
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500/80 to-indigo-500/80 rounded-2xl flex items-center justify-center mb-4 shadow-lg transform group-hover:rotate-6 transition-transform duration-500">
                        <span className="text-2xl font-bold text-white">١</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
                      ابدأ بالأساسيات
                    </h3>
                    <p className="text-sm text-white/80 flex-1 leading-relaxed">
                      مراجعة الكفايات السلوكية والمعلومات العامة أولاً، ثم انتقل
                      للتخصص. ركز على الأساسيات وضمان إتقانها قبل الانتقال
                      للموضوعات المتقدمة.
                    </p>

                    {/* Bottom decorator line */}
                    <div className="w-16 h-1 mt-4 bg-gradient-to-r from-blue-500/50 to-indigo-500/50 rounded-full transform transition-all duration-500 group-hover:w-full"></div>
                  </div>
                </div>

                {/* Step 2 - Enhanced 3D card */}
                <div className="group bg-gradient-to-br from-purple-900/20 to-violet-900/20 rounded-2xl p-1 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 flex flex-col h-full backdrop-blur-sm relative overflow-hidden">
                    {/* Animated corner decorator */}
                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-500/30 to-transparent transform rotate-45 translate-x-8 -translate-y-8 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-500"></div>
                    </div>

                    {/* Enhanced number indicator */}
                    <div className="relative">
                      <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-500/10 rounded-full blur-lg group-hover:bg-purple-500/20 transition-colors duration-500"></div>
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500/80 to-violet-500/80 rounded-2xl flex items-center justify-center mb-4 shadow-lg transform group-hover:rotate-6 transition-transform duration-500">
                        <span className="text-2xl font-bold text-white">٢</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-violet-300">
                      التدرب على الاختبارات
                    </h3>
                    <p className="text-sm text-white/80 flex-1 leading-relaxed">
                      حل نماذج الاختبارات المتاحة مع الالتزام بالوقت المحدد لكل
                      مرحلة. التدرب بانتظام يساعد على بناء الثقة وتعزيز سرعة
                      الاستجابة.
                    </p>

                    {/* Bottom decorator line */}
                    <div className="w-16 h-1 mt-4 bg-gradient-to-r from-purple-500/50 to-violet-500/50 rounded-full transform transition-all duration-500 group-hover:w-full"></div>
                  </div>
                </div>

                {/* Step 3 - Enhanced 3D card */}
                <div className="group bg-gradient-to-br from-emerald-900/20 to-teal-900/20 rounded-2xl p-1 transform transition-all duration-500 hover:scale-105 hover:shadow-xl ">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 flex flex-col h-full backdrop-blur-sm relative overflow-hidden">
                    {/* Animated corner decorator */}
                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-500/30 to-transparent transform rotate-45 translate-x-8 -translate-y-8 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-500"></div>
                    </div>

                    {/* Enhanced number indicator */}
                    <div className="relative">
                      <div className="absolute -top-10 -right-10 w-20 h-20 bg-emerald-500/10 rounded-full blur-lg group-hover:bg-emerald-500/20 transition-colors duration-500"></div>
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/80 to-teal-500/80 rounded-2xl flex items-center justify-center mb-4 shadow-lg transform group-hover:rotate-6 transition-transform duration-500">
                        <span className="text-2xl font-bold text-white">٣</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg mb-3 text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
                      تحليل النتائج
                    </h3>
                    <p className="text-sm text-white/80 flex-1 leading-relaxed">
                      تحديد نقاط القوة والضعف من خلال تحليل أدائك في الاختبارات
                      التجريبية. استخدم نتائجك لتوجيه دراستك نحو المجالات التي
                      تحتاج لتحسين.
                    </p>

                    {/* Bottom decorator line */}
                    <div className="w-16 h-1 mt-4 bg-gradient-to-r from-emerald-500/50 to-teal-500/50 rounded-full transform transition-all duration-500 group-hover:w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced 3D CTA Section with advanced effects */}
          <div className="relative overflow-hidden">
            {/* Background glow effects */}
            <div className="glass-effect backdrop-blur-md border-2 border-blue-500/30 p-10 text-center mb-8 rounded-2xl relative z-10 transform transition-transform duration-500  ">
              {/* Floating decorative elements */}
              <div className="absolute top-6 right-10 w-20 h-20 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-xl animate-pulse"></div>
              <div
                className="absolute bottom-6 left-10 w-16 h-16 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>

              {/* Content with 3D hover effect */}
              <div className="transform transition-transform duration-700 ">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 mb-4">
                  جاهز للتدرب على الاختبارات؟
                </h2>
                <p className="text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                  بعد الاطلاع على الملفات والنماذج، يمكنك الآن البدء في التدرب
                  على اختبارات محاكية للاختبارات الفعلية مع تقييم مباشر لأدائك
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link
                    href="/"
                    className="group relative px-8 py-4 bg-gradient-to-br from-blue-600/90 to-indigo-600/90 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all duration-500 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 overflow-hidden"
                  >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

                    <span className="relative z-10">العودة للرئيسية</span>
                    <svg
                      className="w-5 h-5 transform transition-transform duration-500 group-hover:-translate-x-2 relative z-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
