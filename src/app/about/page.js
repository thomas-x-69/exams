// src/app/about/page.js
"use client";

import React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function AboutUsPage() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8 pt-28">
        {/* Header */}
        <Header />

        <div className="glass-card bg-white/10 p-8 rounded-xl">
          <h1 className="text-3xl font-bold text-white mb-6">من نحن</h1>

          <div className="space-y-8 text-white/80">
            <div>
              <h2 className="text-xl font-bold text-white mb-3">عن المنصة</h2>
              <p>
                منصة الاختبارات المصرية هي منصة تعليمية متخصصة تهدف إلى مساعدة
                المتقدمين للوظائف الحكومية والعامة في مصر على الاستعداد
                لاختبارات التوظيف بشكل فعال. تم إنشاء المنصة عام 2025 على يد
                مجموعة من الخبراء في مجال التعليم والتكنولوجيا، بهدف تقديم بيئة
                تدريبية محاكية للاختبارات الحقيقية.
              </p>
              <p className="mt-2">
                نحن نؤمن بأن التدريب المتخصص والموجه هو المفتاح للنجاح في هذه
                الاختبارات، ونسعى لتوفير أدوات وموارد عالية الجودة تساعد
                المستخدمين على تحقيق أهدافهم الوظيفية.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">رؤيتنا</h2>
              <p>
                أن نكون المنصة الرائدة في مجال التدريب على الاختبارات الوظيفية
                في مصر والوطن العربي، وأن نساهم في رفع كفاءة المتقدمين للوظائف
                من خلال توفير بيئة تدريبية متكاملة تحاكي الاختبارات الحقيقية.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">ما نقدمه</h2>
              <ul className="list-disc mr-6 mt-2 space-y-2">
                <li>
                  <strong className="text-white">اختبارات محاكية:</strong> نقدم
                  اختبارات تحاكي بيئة الاختبارات الرسمية في البريد المصري
                  والتربية بمختلف تخصصاتها.
                </li>
                <li>
                  <strong className="text-white">نماذج امتحانات:</strong> توفير
                  نماذج للاختبارات السابقة والأسئلة المتوقعة في صيغة PDF للتحميل
                  والدراسة.
                </li>
                <li>
                  <strong className="text-white">تقييم وتحليل:</strong> تقديم
                  تقارير مفصلة عن أداء المستخدم في الاختبارات مع تحديد نقاط
                  القوة والضعف.
                </li>
                <li>
                  <strong className="text-white">قاعدة أسئلة شاملة:</strong>{" "}
                  أكثر من 10000 سؤال في مختلف المجالات والتخصصات تغطي جميع أجزاء
                  الاختبارات الرسمية.
                </li>
              </ul>
            </div>

            <div className="border-t border-white/10 pt-8">
              <h2 className="text-2xl font-bold text-white mb-6">اتصل بنا</h2>
              <div>
                <div className="mt-4 bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
                  <a
                    href="https://t.me/Egyptian_Exams"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M8.5,8.5L6.5,10.5L12,16L17.5,10.5L15.5,8.5L12,12L8.5,8.5Z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        مجموعة التيليجرام - منصة الاختبارات المصرية
                      </div>
                      <div className="text-white/60 text-sm">
                        الطريقة المفضلة للتواصل وطلب المساعدة
                      </div>
                    </div>
                  </a>
                </div>
                <p className="mt-3 text-white/60 text-sm">
                  نقدم الدعم والمساعدة بشكل أساسي عبر مجموعة التيليجرام الخاصة
                  بنا. انضم إلى المجموعة للتواصل مع فريق الدعم وللاستفادة من
                  خبرات المجتمع.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
