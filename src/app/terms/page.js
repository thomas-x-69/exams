// src/app/terms/page.js
"use client";

import React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function TermsOfService() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8 pt-28">
        {/* Header */}
        <Header />

        <div className="glass-card bg-white/10 p-8 rounded-xl">
          <h1 className="text-3xl font-bold text-white mb-6">شروط الاستخدام</h1>

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
                مرحبًا بك في منصة الاختبارات المصرية. تحكم شروط الاستخدام هذه
                استخدامك لموقعنا الإلكتروني وجميع الخدمات المقدمة من خلاله.
                بالوصول إلى موقعنا أو استخدامه، فإنك توافق على الالتزام بهذه
                الشروط. إذا كنت لا توافق على أي جزء من هذه الشروط، فيرجى عدم
                استخدام موقعنا.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                استخدام الموقع
              </h2>
              <p>توافق على استخدام موقعنا وفقًا لما يلي:</p>
              <ul className="list-disc mr-6 mt-2 space-y-1">
                <li>الالتزام بجميع القوانين واللوائح المعمول بها.</li>
                <li>عدم انتهاك حقوق الآخرين أو التدخل في استخدامهم للموقع.</li>
                <li>
                  عدم محاولة الوصول إلى أنظمتنا أو شبكاتنا بطرق غير مصرح بها.
                </li>
                <li>
                  عدم استخدام موقعنا بطريقة قد تضر بالموقع أو تجعله غير متاح
                  للآخرين.
                </li>
                <li>
                  عدم استخدام أي آليات آلية (مثل الروبوتات) للوصول إلى موقعنا
                  دون إذن صريح.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                حسابات المستخدمين
              </h2>
              <p>
                قد تتطلب بعض ميزات موقعنا تسجيل حساب. أنت مسؤول عن الحفاظ على
                سرية بيانات اعتماد حسابك وعن جميع الأنشطة التي تحدث تحت حسابك.
                يجب عليك إخطارنا فورًا بأي استخدام غير مصرح به لحسابك.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                الملكية الفكرية
              </h2>
              <p>
                جميع المحتويات والمواد والعلامات التجارية وحقوق الطبع والنشر
                والملكية الفكرية الأخرى المعروضة على موقعنا هي ملكنا أو ملك
                مرخصينا. أنت تتلقى ترخيصًا محدودًا فقط للوصول إلى محتوى موقعنا
                واستخدامه للأغراض الشخصية غير التجارية.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">الإعلانات</h2>
              <p>
                قد يعرض موقعنا إعلانات مقدمة من أطراف ثالثة، بما في ذلك Google
                AdSense. هذه الإعلانات قد تستخدم ملفات تعريف الارتباط وتقنيات
                مماثلة لجمع معلومات عن استخدامك للإنترنت وموقعنا لتقديم إعلانات
                ذات صلة باهتماماتك.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                إخلاء المسؤولية
              </h2>
              <p>
                يتم توفير موقعنا "كما هو" و"كما هو متاح" دون أي ضمانات من أي
                نوع، صريحة أو ضمنية. نحن لا نضمن دقة أو موثوقية أو اكتمال محتوى
                موقعنا.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                تحديد المسؤولية
              </h2>
              <p>
                لن نكون مسؤولين عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو
                خاصة أو تبعية أو عقابية ناتجة عن استخدامك أو عدم قدرتك على
                استخدام موقعنا.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">التعديلات</h2>
              <p>
                قد نقوم بتعديل شروط الاستخدام هذه في أي وقت. ستكون مسؤولاً عن
                مراجعة أي تغييرات. استمرارك في استخدام موقعنا بعد نشر التغييرات
                يشكل قبولك للشروط المعدلة.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                القانون الحاكم
              </h2>
              <p>
                تخضع شروط الاستخدام هذه وأي نزاعات تنشأ عنها لقوانين جمهورية مصر
                العربية.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">اتصل بنا</h2>
              <p>
                إذا كانت لديك أي أسئلة حول شروط الاستخدام هذه، يمكنك التواصل
                معنا عبر:
              </p>
              <ul className="list-disc mr-6 mt-2">
                <li>البريد الإلكتروني: support@egyptianexams.com</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
