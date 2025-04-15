// src/app/privacy/page.js
"use client";

import React from "react";
import Header from "../../../components/Header";

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
                <li>
                  عرض الإعلانات المخصصة عبر خدمات Google AdSense وAdsterra.
                </li>
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
              <h2 className="text-xl font-bold text-white mb-3">الإعلانات</h2>
              <p>
                نستخدم عدة خدمات إعلانية على موقعنا، بما في ذلك Google AdSense
                وAdsterra وMonetag. تستخدم هذه الشركات تقنيات مثل ملفات تعريف
                الارتباط وعلامات الويب للحصول على معلومات حول استخدامك للموقع
                لغرض عرض إعلانات مخصصة. باستخدامك لموقعنا، فإنك توافق على جمع
                واستخدام بياناتك من قبل هذه الخدمات الإعلانية وفقاً لسياسات
                الخصوصية الخاصة بهم.
              </p>
              <ul className="list-disc mr-6 mt-2 space-y-2">
                <li>
                  يمكنك الاطلاع على سياسة الخصوصية الخاصة بـ Google من خلال
                  زيارة{" "}
                  <a
                    href="https://policies.google.com/technologies/ads"
                    className="text-blue-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    سياسة إعلانات Google
                  </a>
                </li>
                <li>
                  يمكنك الاطلاع على سياسة الخصوصية الخاصة بـ Adsterra من خلال
                  زيارة{" "}
                  <a
                    href="https://adsterra.com/privacy-policy/"
                    className="text-blue-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    سياسة خصوصية Adsterra
                  </a>
                </li>
              </ul>
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
                <li>
                  مع شركاء الإعلانات مثل Google AdSense وAdsterra وMonetag.
                </li>
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
                بنا. انضم إلى المجموعة للتواصل مع فريق الدعم وللاستفادة من خبرات
                المجتمع.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
