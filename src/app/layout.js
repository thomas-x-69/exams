// src/app/layout.js
import { Cairo } from "next/font/google";
import Script from "next/script";
import { Providers } from "../../store/provider";
import { ClientAuthProvider } from "../../context/ClientAuthContext";
import { ToastProvider } from "../../components/ToastNotification";
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
    "امتحانات التنظيم والاداره",
    "اختبارات مصرية",
    "امتحان البريد المصري",
    "امتحانات التربية",
    "نماذج امتحانات",
    "تدريب على الاختبارات",
    "امتحانات وزارة التربية",
    "اختبارات التوظيف 2025",
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
        {/* <link
          rel="preconnect"
          href="https://resolvedinsaneox.com"
          crossOrigin="anonymous"
        /> */}

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
        <meta name="monetag" content="80244ef307a61f906066873950e415dd"></meta>
        <meta name="msapplication-TileColor" content="#1e40af" />

        {/* Anti-AdBlock Popunder Script */}
        {/* <Script
          type="text/javascript"
          src="//resolvedinsaneox.com/55/0f/6e/550f6e2624c4b06afeb9e2c9270717f9.js"
        ></Script> */}
      </head>

      <body
        className={`${cairo.className} antialiased app-container relative`}
        suppressHydrationWarning
      >
        {/* Google AdSense Script */}
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

        {/* Left Side Banner Ad - Fixed position, only visible on larger screens */}
        <div className="fixed left-0 top-1/2 transform -translate-y-1/2 hidden lg:block z-[-100]">
          <div className="p-1 bg-slate-800/40 backdrop-blur-sm rounded-r-lg border-t border-r border-b border-white/10">
            <iframe
              src="//resolvedinsaneox.com/59f57cb5378aa0442a7174596eb991bf"
              width="160"
              height="600"
              frameBorder="0"
              scrolling="no"
              title="Left Side Ad"
              className="rounded"
            ></iframe>
          </div>
        </div>

        {/* Right Side Banner Ad - Fixed position, only visible on larger screens */}
        <div className="fixed right-0 top-1/2 transform -translate-y-1/2  hidden lg:block">
          <div className="p-1 bg-slate-800/40 backdrop-blur-sm rounded-l-lg border-t border-l border-b border-white/10">
            <iframe
              src="//resolvedinsaneox.com/59f57cb5378aa0442a7174596eb991bf"
              width="160"
              height="600"
              frameBorder="0"
              scrolling="no"
              title="Right Side Ad"
              className="rounded"
            ></iframe>
          </div>
        </div>

        {/* Wrap with Toast Provider, AuthProvider and Redux Provider */}
        <ToastProvider>
          <ClientAuthProvider>
            <Providers>
              <div className="min-h-screen pattern-grid relative overflow-hidden pt-0">
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

                {/* Native Banner Ad #1 */}
                {/* <div className="mx-auto max-w-4xl px-4 mt-4 text-center">
                  <div className="glass-card p-4 rounded-xl border border-white/10 overflow-hidden">
                    <div id="container-8ec6bdce286a228c65ed68b05a0ddd40"></div>
                    <script
                      async="async"
                      data-cfasync="false"
                      src="//resolvedinsaneox.com/8ec6bdce286a228c65ed68b05a0ddd40/invoke.js"
                    ></script>
                  </div>
                </div> */}

                {/* Main Content with children - Add margin to make space for side ads on large screens */}
                <main className="relative lg:mx-40">
                  {/* Actual page content */}
                  {children}

                  {/* Native Banner Ad #2 */}
                  <div className="m-auto max-w-4xl px-4 mt-4 text-center align-middle">
                    <div className="glass-card p-4 rounded-xl border border-white/10 overflow-hidden">
                      <div id="container-8ec6bdce286a228c65ed68b05a0ddd40"></div>
                      <script
                        async="async"
                        data-cfasync="false"
                        src="//resolvedinsaneox.com/8ec6bdce286a228c65ed68b05a0ddd40/invoke.js"
                      ></script>
                    </div>
                  </div>

                  {/* Direct Link #2 */}
                  <div className="text-center mb-8">
                    <a
                      href="https://resolvedinsaneox.com/iuqv5gis0?key=779ef1d65c161a4272e71c070144eb6f"
                      className="inline-block px-4 py-2 bg-green-600/10 hover:bg-green-600/20 text-green-400 hover:text-green-300 rounded-lg border border-green-500/20 transition-all duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      نماذج امتحانات إضافية
                    </a>
                  </div>
                </main>
              </div>

              {/* Banner Ad #3 */}
              <div className="text-center my-4 px-4">
                <iframe
                  src="//resolvedinsaneox.com/watchnew?key=6b1c05b745f1da5b03f0e410efd596d7"
                  width="320"
                  height="50"
                  frameBorder="0"
                  scrolling="no"
                  title="Ad"
                ></iframe>
              </div>

              {/*  Banner Ad (728X90) */}
              <div className="sticky top-0 z-10 w-full text-center m-auto bg-slate-900/80 backdrop-blur-sm py-2 border-b border-white/10 overflow-hidden">
                <iframe
                  src="//resolvedinsaneox.com/252e3a0d8ed4072689291e0bce42bbe2"
                  width="728"
                  height="90"
                  frameBorder="0"
                  scrolling="no"
                  title="Ad"
                ></iframe>
              </div>
            </Providers>
          </ClientAuthProvider>
        </ToastProvider>

        <Footer />

        {/* Social Bar Ad */}
        <Script
          type="text/javascript"
          src="//resolvedinsaneox.com/50/55/cc/5055cc0e317be9a83e103b3bd187356f.js"
        ></Script>

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
