// src/app/privacy/page.js
"use client";

import React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8 pt-28">
        {/* Header */}
        <Header />

        <div className="glass-card bg-white/10 p-8 rounded-xl">
          <h1 className="text-3xl font-bold text-white mb-6">سياسة الخصوصية</h1>

          <div className="space-y-6 text-white/80">
            <p>
              آخر تحديث:{" "}
              {new Date().toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">مقدمة</h2>
              <p>
                نحن في منصة الاختبارات المصرية نقدر خصوصيتك ونلتزم بحماية
                بياناتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمع واستخدام
                وحماية المعلومات التي تقدمها أثناء استخدام موقعنا الإلكتروني.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                البيانات التي نجمعها
              </h2>
              <p>نحن نجمع المعلومات التالية:</p>
              <ul className="list-disc mr-6 mt-2 space-y-1">
                <li>المعلومات الشخصية: الاسم ورقم الهاتف (اختياري).</li>
                <li>معلومات الجلسة: مثل نتائج الاختبارات والإجابات.</li>
                <li>معلومات تقنية: عنوان IP، نوع المتصفح، ومعلومات الجهاز.</li>
                <li>ملفات تعريف الارتباط وتقنيات التتبع المماثلة.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                كيف نستخدم بياناتك
              </h2>
              <p>نستخدم المعلومات التي نجمعها للأغراض التالية:</p>
              <ul className="list-disc mr-6 mt-2 space-y-1">
                <li>توفير وتحسين خدماتنا وموقعنا الإلكتروني.</li>
                <li>حفظ نتائج الاختبارات وتقديم تحليل الأداء.</li>
                <li>التواصل معك بشأن الاختبارات والتحديثات الجديدة.</li>
                <li>تخصيص تجربة المستخدم وتحليل استخدام الموقع.</li>
                <li>عرض الإعلانات المخصصة عبر خدمة Google AdSense.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                ملفات تعريف الارتباط (Cookies)
              </h2>
              <p>
                نستخدم ملفات تعريف الارتباط وتقنيات مماثلة لتحسين تجربتك على
                موقعنا. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال
                متصفحك، لكن تعطيل بعض ملفات تعريف الارتباط قد يؤثر على تجربتك
                وقدرتك على استخدام بعض ميزات موقعنا.
              </p>
              <p className="mt-2">
                نستخدم الأنواع التالية من ملفات تعريف الارتباط:
              </p>
              <ul className="list-disc mr-6 mt-2 space-y-1">
                <li>
                  ملفات تعريف ارتباط ضرورية: لتمكين الوظائف الأساسية للموقع.
                </li>
                <li>
                  ملفات تعريف ارتباط التفضيلات: لتذكر تفضيلاتك واختياراتك.
                </li>
                <li>
                  ملفات تعريف ارتباط الإحصائيات: لفهم كيفية استخدام الزوار
                  لموقعنا.
                </li>
                <li>
                  ملفات تعريف ارتباط التسويق: لعرض الإعلانات ذات الصلة
                  باهتماماتك.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                Google AdSense
              </h2>
              <p>
                نستخدم خدمة Google AdSense لعرض الإعلانات على موقعنا. تستخدم
                Google تقنيات مثل ملفات تعريف الارتباط لجمع معلومات حول استخدامك
                للموقع لغرض عرض إعلانات مخصصة. يمكنك الاطلاع على سياسة الخصوصية
                الخاصة بـ Google من خلال زيارة{" "}
                <a
                  href="https://policies.google.com/technologies/ads"
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  سياسة إعلانات Google
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                مشاركة البيانات
              </h2>
              <p>
                لا نبيع أو نؤجر بياناتك الشخصية لأطراف ثالثة. قد نشارك بياناتك
                في الحالات التالية:
              </p>
              <ul className="list-disc mr-6 mt-2 space-y-1">
                <li>
                  مع مقدمي الخدمات الذين يساعدوننا في تشغيل موقعنا وتقديم
                  خدماتنا.
                </li>
                <li>مع شركاء الإعلانات مثل Google AdSense.</li>
                <li>
                  عندما يكون ذلك مطلوبًا بموجب القانون أو للاستجابة للإجراءات
                  القانونية.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                أمان البيانات
              </h2>
              <p>
                نتخذ تدابير أمنية معقولة لحماية بياناتك الشخصية من الفقدان أو
                الوصول غير المصرح به أو الكشف أو الإتلاف أو التعديل. ومع ذلك، لا
                يمكن ضمان أمان عمليات النقل عبر الإنترنت بنسبة 100%.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">حقوقك</h2>
              <p>
                اعتمادًا على موقعك، قد يكون لديك حقوق معينة فيما يتعلق ببياناتك
                الشخصية، بما في ذلك:
              </p>
              <ul className="list-disc mr-6 mt-2 space-y-1">
                <li>الوصول إلى بياناتك الشخصية.</li>
                <li>تصحيح البيانات غير الدقيقة.</li>
                <li>حذف بياناتك الشخصية.</li>
                <li>الاعتراض على معالجة بياناتك.</li>
                <li>سحب موافقتك في أي وقت.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                تغييرات على سياسة الخصوصية
              </h2>
              <p>
                قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإخطارك بأي
                تغييرات جوهرية من خلال نشر السياسة الجديدة على هذه الصفحة وتحديث
                تاريخ "آخر تحديث".
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">اتصل بنا</h2>
              <p>
                إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه، يمكنك التواصل
                معنا عبر:
              </p>
              <ul className="list-disc mr-6 mt-2">
                <li>البريد الإلكتروني: support@egyptianexams.com</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
