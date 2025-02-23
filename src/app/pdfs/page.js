// src/app/pdfs/page.js

"use client";

import React, { useState } from "react";

const categories = [
  { id: "all", name: "الكل" },
  { id: "mail", name: "البريد" },
  { id: "pe", name: "تربية رياضية" },
  { id: "english", name: "تربية انجليزي" },
  { id: "science", name: "تربية علوم" },
  { id: "social", name: "دراسات اجتماعية" },
  { id: "arabic", name: "تربية عربي" },
];

const pdfFiles = [
  {
    id: 1,
    title: "نموذج امتحان البريد المصري",
    category: "mail",
    date: "2024",
    downloads: 1250,
    size: "2.4MB",
    path: "/pdfs/mail-exam-2024.pdf",
  },
  {
    id: 2,
    title: "نموذج امتحان التربية الرياضية",
    category: "pe",
    date: "2024",
    downloads: 980,
    size: "1.8MB",
    path: "/pdfs/pe-exam-2024.pdf",
  },
  {
    id: 3,
    title: "نموذج امتحان اللغة الإنجليزية",
    category: "english",
    date: "2024",
    downloads: 1560,
    size: "2.1MB",
    path: "/pdfs/english-exam-2024.pdf",
  },
  {
    id: 4,
    title: "نموذج امتحان اللغة الإنجليزية",
    category: "english",
    date: "2024",
    downloads: 1560,
    size: "2.1MB",
    path: "/pdfs/english-exam-2024.pdf",
  },
  {
    id: 5,
    title: "نموذج امتحان اللغة الإنجليزية",
    category: "english",
    date: "2024",
    downloads: 1560,
    size: "2.1MB",
    path: "/pdfs/english-exam-2024.pdf",
  },
  {
    id: 6,
    title: "نموذج امتحان اللغة الإنجليزية",
    category: "english",
    date: "2024",
    downloads: 1560,
    size: "2.1MB",
    path: "/pdfs/english-exam-2024.pdf",
  },
];

export default function PDFsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPDFs = pdfFiles.filter((pdf) => {
    const matchesCategory =
      selectedCategory === "all" || pdf.category === selectedCategory;
    const matchesSearch = pdf.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          مكتبة الامتحانات والأسئلة
        </h1>
        <p className="text-xl text-white/70">
          تصفح وحمل نماذج الامتحانات السابقة للتدريب
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="ابحث عن ملف..."
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-white/10 border-white/20 text-white"
                    : "border-white/5 text-white/70 hover:border-white/10 hover:text-white"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PDF Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPDFs.map((pdf) => (
          <div key={pdf.id} className="glass-card group hover:bg-white/5">
            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* PDF Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600/20 to-pink-600/20 flex items-center justify-center border border-white/10">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {pdf.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {pdf.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      {pdf.downloads}
                    </span>
                    <span>{pdf.size}</span>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <a
                href={pdf.path}
                download
                className="mt-6 w-full py-2 px-4 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center gap-2 hover:bg-white/10 transition-all duration-300"
              >
                <span>تحميل الملف</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
