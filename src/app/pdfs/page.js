// src/app/pdfs/page.js - Optimized for SEO

"use client";

import React, { useState, useMemo, memo, useEffect } from "react";
import Head from "next/head";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const categories = [
  { id: "all", name: "الكل" },
  { id: "mail", name: "البريد" },
  { id: "math", name: "تربية رياضيات" },
  { id: "english", name: "تربية انجليزي" },
  { id: "science", name: "تربية علوم" },
  { id: "social", name: "دراسات اجتماعية" },
  { id: "arabic", name: "تربية لغة عربية" },
];

const pdfFiles = [
  {
    id: 1,
    title: "نموذج امتحان البريد المصري المحاكي للإختبار الرسمي",
    category: "mail",
    date: "2024",
    // downloads: 1250,
    size: "2.4MB",
    path: "/pdfs/mail-exam-2024.pdf",
    description:
      "نموذج امتحان شامل للبريد المصري يحاكي الإختبار الرسمي بنفس نمط الأسئلة والزمن",
  },
  {
    id: 2,
    title: "نموذج امتحان تربية رياضيات - المرحلة الأولى",
    category: "math",
    date: "2024",
    // downloads: 980,
    size: "1.8MB",
    path: "/pdfs/math-exam-2024.pdf",
    description: "امتحان تربية رياضيات محاكي للمرحلة الأولى من الاختبار الرسمي",
  },
  {
    id: 3,
    title: "اختبار اللغة الإنجليزية للتربية والتعليم",
    category: "english",
    date: "2024",
    // downloads: 1560,
    size: "2.1MB",
    path: "/pdfs/english-exam-2024.pdf",
    description:
      "اختبار اللغة الإنجليزية لمسابقة التربية والتعليم مع نماذج الإجابة",
  },
  {
    id: 4,
    title: "امتحان اللغة الإنجليزية المطور للوظائف الحكومية",
    category: "english",
    date: "2024",
    // downloads: 1560,
    size: "2.1MB",
    path: "/pdfs/english-exam-2024.pdf",
    description: "نموذج امتحان اللغة الإنجليزية المطور لجميع الوظائف الحكومية",
  },
  {
    id: 5,
    title: "ملخص الكفايات اللغوية لامتحانات مصر",
    category: "english",
    date: "2024",
    // downloads: 1560,
    size: "2.1MB",
    path: "/pdfs/english-exam-2024.pdf",
    description:
      "ملخص شامل للكفايات اللغوية المطلوبة في اختبارات مصر التوظيفية",
  },
  {
    id: 6,
    title: "بنك أسئلة امتحانات مصر للتوظيف",
    category: "english",
    date: "2024",
    // downloads: 1560,
    size: "2.1MB",
    path: "/pdfs/english-exam-2024.pdf",
    description:
      "بنك أسئلة شامل لجميع امتحانات مصر التوظيفية والوزارات المختلفة",
  },
];

// Memoized category button component to prevent unnecessary re-renders
const CategoryButton = memo(({ category, isSelected, onClick }) => (
  <button
    onClick={() => onClick(category.id)}
    className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
      isSelected
        ? "bg-white/10 border-white/20 text-white"
        : "border-white/5 text-white/70 hover:border-white/10 hover:text-white"
    }`}
  >
    {category.name}
  </button>
));

// Memoized PDF card component to prevent unnecessary re-renders
const PDFCard = memo(({ pdf }) => (
  <div className="glass-card group hover:bg-white/5">
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
          <h3 className="text-xl font-bold text-white mb-2">{pdf.title}</h3>
          {/* Added PDF description for better SEO */}
          <p className="text-white/70 text-sm mb-3">{pdf.description}</p>
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
            {pdf.downloads && (
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
            )}
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
        <span>
          تحميل ملف{" "}
          {pdf.category === "mail" ? "امتحان البريد" : "اختبارات التربية"}
        </span>
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
));

export default function PDFsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageTitle, setPageTitle] = useState(
    "مكتبة امتحانات مصر | نماذج اختبارات مصر للتحميل"
  );

  // Update page title based on selected category
  useEffect(() => {
    if (selectedCategory === "all") {
      setPageTitle("مكتبة امتحانات مصر | نماذج اختبارات مصر للتحميل");
    } else if (selectedCategory === "mail") {
      setPageTitle("نماذج امتحانات البريد المصري | امتحانات مصر للتوظيف");
    } else {
      const category = categories.find((c) => c.id === selectedCategory);
      setPageTitle(
        `نماذج امتحانات ${category?.name || ""} | اختبارات مصر التعليمية`
      );
    }
  }, [selectedCategory]);

  // Memoize the filtered PDFs to prevent unnecessary filtering on every render
  const filteredPDFs = useMemo(() => {
    return pdfFiles.filter((pdf) => {
      const matchesCategory =
        selectedCategory === "all" || pdf.category === selectedCategory;
      const matchesSearch = pdf.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Handler for category button clicks
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content="تحميل نماذج امتحانات مصر التوظيفية وملفات PDF لاختبارات البريد المصري والتربية. أكثر من 100 ملف تدريبي لامتحانات مصر الرسمية."
        />
        <meta
          name="keywords"
          content="تحميل امتحانات مصر, نماذج اختبارات مصر, ملفات PDF, امتحان البريد المصري, اختبارات التربية, نماذج أسئلة"
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8 pt-28">
        {/* Header */}
        <Header />
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 mt-4">
            مكتبة امتحانات مصر وملفات التدريب
          </h1>
          <p className="text-xl text-white/70">
            تصفح وحمل نماذج اختبارات مصر التوظيفية السابقة للتدريب
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="ابحث عن نماذج امتحانات مصر..."
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
                <CategoryButton
                  key={category.id}
                  category={category}
                  isSelected={selectedCategory === category.id}
                  onClick={handleCategoryClick}
                />
              ))}
            </div>
          </div>
        </div>

        {/* PDF Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPDFs.map((pdf) => (
            <PDFCard key={pdf.id} pdf={pdf} />
          ))}
        </div>

        {/* SEO Content Section */}
        <div className="mt-16 glass-card p-6">
          <h2 className="text-2xl font-bold text-white mb-4 mt-6">
            امتحانات مصر التوظيفية - دليل المتقدمين
          </h2>
          <div className="text-white/80 space-y-4">
            <p>
              توفر منصة امتحانات مصر مجموعة شاملة من نماذج اختبارات مصر
              التوظيفية المحاكية للاختبارات الرسمية. تشمل هذه المكتبة نماذج
              امتحانات البريد المصري واختبارات التربية بتخصصاتها المختلفة.
            </p>
            <p>
              تم إعداد هذه النماذج وفقاً لأحدث معايير امتحانات مصر الحكومية، حيث
              تغطي جميع الكفايات المطلوبة: السلوكية، اللغوية، المعرفية
              والتكنولوجية، بالإضافة إلى كفايات التخصص.
            </p>
            <h3 className="text-xl font-bold text-white mt-6 mb-3">
              أنواع ملفات اختبارات مصر المتوفرة للتحميل:
            </h3>
            <ul className="list-disc mr-8 space-y-2">
              <li>نماذج محاكية لامتحانات البريد المصري</li>
              <li>نماذج اختبارات التربية والتعليم بجميع التخصصات</li>
              <li>بنوك أسئلة للكفايات المختلفة</li>
              <li>ملخصات وشروحات للمهارات المطلوبة</li>
              <li>اختبارات الدفعات السابقة مع الحلول النموذجية</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Structured Data for PDFs Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: pageTitle,
            description:
              "تحميل نماذج امتحانات مصر التوظيفية وملفات PDF لاختبارات البريد المصري والتربية",
            keywords:
              "امتحانات مصر, اختبارات مصر, نماذج امتحانات البريد المصري, اختبارات التربية",
            url: "https://www.egyptianexams.com/pdfs",
            mainEntity: {
              "@type": "ItemList",
              itemListElement: filteredPDFs.map((pdf, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `https://www.egyptianexams.com${pdf.path}`,
                name: pdf.title,
                description: pdf.description,
              })),
            },
          }),
        }}
      />
    </>
  );
}
