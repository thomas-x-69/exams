// src/app/layout.js
import { Cairo } from "next/font/google";
import Script from "next/script";
import { Providers } from "../../store/provider";
import "./globals.css";
import Footer from "../../components/Footer";

// Optimize font loading with display swap
const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap", // Add display strategy for better performance
  preload: true, // Ensure font is preloaded
});

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
  // Additional metadata as in your current file...
};

// Regular layout component without client directive - metadata won't work with "use client"
export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Resource Hints - Preconnect to external domains */}
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

        {/* Preload critical assets */}
        <link rel="preload" href="/logo.png" as="image" type="image/png" />
        <meta
          name="google-site-verification"
          content="9ONgVce-npC3xfNatprDnUxBA4iOXA0tyeX87199ev4"
        />
        <meta
          name="google-adsense-account"
          content="ca-pub-4661333319885394"
        ></meta>
      </head>
      <body
        className={`${cairo.className} antialiased app-container`}
        suppressHydrationWarning
      >
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4661333319885394"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Redux Provider */}
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
        <Footer />
      </body>
    </html>
  );
}
