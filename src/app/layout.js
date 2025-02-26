// src/app/layout.js
import { Cairo } from "next/font/google";
import Script from "next/script";
import { Providers } from "../../store/provider";
import "./globals.css";

const cairo = Cairo({ subsets: ["arabic"] });

export const metadata = {
  title: "منصة الاختبارات المصرية",
  description: "منصة تعليمية للتحضير للاختبارات المصرية",
};

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

            {/* Main Content - Header component is now inside the page.js */}
            <main className="pt-28 relative z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
