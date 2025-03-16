// src/app/layout.js
import { Cairo } from "next/font/google";
import Script from "next/script";
import { Providers } from "../../store/provider";
import "./globals.css";

const cairo = Cairo({ subsets: ["arabic"] });

// Properly export metadata for Next.js
export const metadata = {
  title: {
    default: "منصة الاختبارات المصرية | تدرب على الامتحانات بكفاءة",
    template: "%s | منصة الاختبارات المصرية",
  },
  description:
    "منصة تعليمية متكاملة للتحضير للاختبارات المصرية بطريقة تفاعلية وفعالة. تدرب على نماذج امتحانات البريد المصري والتربية وغيرها",
  keywords: [
    "اختبارات مصرية",
    "امتحان البريد المصري",
    "امتحانات التربية",
    "نماذج امتحانات",
    "تدريب على الاختبارات",
    "امتحانات الكترونية",
  ],
  authors: [{ name: "منصة الاختبارات المصرية" }],
  creator: "منصة الاختبارات المصرية",
  publisher: "منصة الاختبارات المصرية",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "منصة الاختبارات المصرية | تدرب على الامتحانات بكفاءة",
    description:
      "منصة تعليمية متكاملة للتحضير للاختبارات المصرية بطريقة تفاعلية وفعالة",
    url: "https://egyptian-exams.com",
    siteName: "منصة الاختبارات المصرية",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "منصة الاختبارات المصرية",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "منصة الاختبارات المصرية | تدرب على الامتحانات بكفاءة",
    description: "منصة تعليمية متكاملة للتحضير للاختبارات المصرية",
    images: ["/twitter-image.jpg"],
    creator: "@EgyptianExams",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://egyptian-exams.com",
    languages: {
      ar: "https://egyptian-exams.com",
    },
  },
};

// Regular layout component without client directive - metadata won't work with "use client"
export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.className} antialiased`}
        suppressHydrationWarning
      >
        {/* Google AdSense Script */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbrowser.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
          strategy="lazyOnload"
        />

        {/* Schema.org markup for educational organization */}
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "منصة الاختبارات المصرية",
              description:
                "منصة تعليمية متكاملة للتحضير للاختبارات المصرية بطريقة تفاعلية وفعالة",
              url: "https://egyptian-exams.com",
              logo: "https://egyptian-exams.com/logo.png",
            }),
          }}
        />

        <Providers>
          <div className="min-h-screen pattern-grid relative overflow-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 pattern-dots opacity-30"></div>
              <div className="absolute top-0 -right-1/2 w-[1000px] h-[1000px] bg-indigo-600/5 rounded-full blur-3xl floating"></div>
              <div
                className="absolute bottom-0 -left-1/2 w-[1000px] h-[1000px] bg-blue-600/5 rounded-full blur-3xl floating"
                style={{ animationDelay: "-4s" }}
              ></div>
              <div
                className="absolute top-1/2 left-1/2 w-[1200px] h-[1200px] bg-purple-600/5 rounded-full blur-3xl floating"
                style={{
                  animationDelay: "-2s",
                  transform: "translate(-50%, -50%)",
                }}
              ></div>
            </div>

            {/* Main Content with children */}
            <main className="relative z-10">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
