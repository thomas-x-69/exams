// src/app/layout.js
import { Cairo } from "next/font/google";
import Script from "next/script";
import { Providers } from "../../store/provider";
import { ClientAuthProvider } from "../../context/ClientAuthContext";
import "./globals.css";
import Footer from "../../components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

// Optimize font loading for better Core Web Vitals
const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
  adjustFontFallback: true,
});

export const metadata = {
  metadataBase: new URL("https://egyptianexams.com"),
  title: {
    default: "منصة الاختبارات المصرية | تدرب على امتحانات التوظيف المصرية 2025",
    template: "%s | منصة الاختبارات المصرية - أفضل موقع لتحضير الامتحانات",
  },
  description:
    "منصة تعليمية متكاملة للتحضير لاختبارات التوظيف المصرية. نماذج محاكية لاختبارات البريد المصري والتربية والتنظيم والإدارة وجميع الوظائف الحكومية بطريقة تفاعلية. تدرب واستعد للامتحان بكفاءة.",
  keywords: [
    "اختبارات مصر",
    "امتحانات مصر",
    "موقع امتحانات مصر",
    "موقع الامتحانات المصري",
    "امتحانات التنظيم والاداره",
    "اختبارات مصرية",
    "امتحان البريد المصري",
    "امتحانات التربية",
    "نماذج امتحانات",
    "تدريب على الاختبارات",
    "امتحانات الكترونية",
    "اختبار التنظيم والادارة",
    "امتحانات الوظائف الحكومية",
    "نموذج امتحان",
    "اختبارات التوظيف",
    "اسئلة امتحان البريد المصري",
    "امتحانات الحكومة",
    "امتحانات وزارة التربية",
    "اختبارات تجريبية",
    "التقديم للوظائف الحكومية",
    "اختبار كفايات",
    "كفايات سلوكية",
    "كفايات لغوية",
    "كفايات معرفية",
    "كفايات تربوية",
    "كفايات تخصص",
    "امتحان اونلاين",
    "امتحان تجريبي",
    "وظائف مصر",
    "مسابقات وظائف",
    "نماذج امتحانات سابقة",
    "تحميل امتحانات",
    "حل اسئلة البريد المصري",
    "اختبارات التوظيف 2025",
    "امتحانات تنظيم وادارة",
  ],
  authors: [
    { name: "منصة الاختبارات المصرية", url: "https://egyptianexams.com" },
  ],
  creator: "منصة الاختبارات المصرية",
  publisher: "منصة الاختبارات المصرية",
  applicationName: "منصة الاختبارات المصرية",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    title: "منصة الاختبارات المصرية",
    statusBarStyle: "black-translucent",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    { media: "(prefers-color-scheme: light)", color: "#1e40af" },
  ],
  category: "education",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://egyptianexams.com",
    siteName: "منصة الاختبارات المصرية - اختبارات التوظيف المصرية",
    title: "منصة الاختبارات المصرية | تدرب على امتحانات التوظيف المصرية 2025",
    description:
      "منصة تعليمية متكاملة للتحضير لاختبارات التوظيف المصرية. نماذج محاكية لاختبارات البريد المصري والتربية والتنظيم والإدارة وجميع الوظائف الحكومية بطريقة تفاعلية. تدرب واستعد للامتحان بكفاءة.",
    images: [
      {
        url: "/images/egyptianexams-og.jpg",
        width: 1200,
        height: 630,
        alt: "منصة الاختبارات المصرية - تحضير اختبارات التوظيف المصرية",
        type: "image/jpeg",
      },
    ],
  },
  alternates: {
    canonical: "https://egyptianexams.com",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Resource Hints - Preconnect to external domains */}
        <Script
          strategy="lazyOnload"
          src="//pl26316499.effectiveratecpm.com/55/0f/6e/550f6e2624c4b06afeb9e2c9270717f9.js"
        />

        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://pagead2.googlesyndication.com"
          crossOrigin="anonymous"
        />

        {/* Preload critical assets */}
        <link rel="preload" href="/logo.png" as="image" type="image/png" />

        {/* Favicons */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#1e40af" />
      </head>
      <body
        className={`${cairo.className} antialiased app-container`}
        suppressHydrationWarning
      >
        {/* Google AdSense Script with strategy="afterInteractive" */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4661333319885394"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Structured data for Organization */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "منصة الاختبارات المصرية",
              url: "https://egyptianexams.com",
              logo: "https://egyptianexams.com/logo.png",
              description:
                "منصة تعليمية متخصصة في تقديم نماذج محاكية لاختبارات التوظيف المصرية",
            }),
          }}
        />

        {/* Wrap with both ClientAuthProvider and Redux Provider */}
        <ClientAuthProvider>
          <Providers>
            <div className="min-h-screen pattern-grid relative overflow-hidden top-0 pt-0">
              {/* Background Elements */}
              <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 pattern-dots opacity-30"></div>
                <div className="absolute top-0 -right-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-3xl floating"></div>
                <div
                  className="absolute bottom-0 -left-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-3xl floating"
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
              <main>{children}</main>
            </div>
          </Providers>
        </ClientAuthProvider>
        <Footer />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
