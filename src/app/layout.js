// src/app/layout.js
import { Cairo } from "next/font/google";
import Script from "next/script";
import Image from "next/image";
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

            {/* Floating Header */}
            <header className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4">
              <div className="glass-effect rounded-2xl border border-white/10 p-3">
                <div className="flex items-center justify-between">
                  {/* Logo & Title */}
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-12 h-12 rounded-2xl glass-effect flex items-center justify-center border border-white/10 overflow-hidden">
                      <Image
                        src="/logo.png"
                        alt="Logo"
                        width={60}
                        height={40}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <h1 className="text-lg font-bold text-white hidden sm:block">
                      منصة الاختبارات المصرية
                    </h1>
                  </div>

                  {/* Stats & Actions */}
                  <div className="flex items-center gap-3">
                    {/* Stats Pills */}
                    <div className="hidden md:flex items-center gap-2">
                      <div className="glass-effect px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-white/90 text-sm">3000 سؤال</span>
                      </div>
                      <div className="glass-effect px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-white/90 text-sm whitespace-nowrap">
                          150 اختبار
                        </span>
                      </div>
                    </div>

                    {/* Contact Button */}
                    <a
                      href="#contact"
                      className="px-5 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl border border-white/10 transition-all duration-300 flex items-center gap-2"
                    >
                      <span>ابدأ الآن</span>
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
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
