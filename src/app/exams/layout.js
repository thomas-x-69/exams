// src/app/exams/layout.js
"use client";

import { Cairo } from "next/font/google";
import { Providers } from "../../../store/provider";

const cairo = Cairo({ subsets: ["arabic"] });

export default function ExamLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.className} antialiased bg-[#f4f6f8]`}
        suppressHydrationWarning
      >
        <Providers>
          <div className="min-h-screen">
            {/* Background Base Layer */}
            <div className="fixed inset-0 pointer-events-none">
              {/* Main Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-[#f4f6f8] to-slate-100"></div>

              {/* Grid Pattern - More visible now */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
                    linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: "24px 24px",
                }}
              ></div>

              {/* Subtle Dot Pattern */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(rgba(148, 163, 184, 0.15) 1px, transparent 1px)`,
                  backgroundSize: "16px 16px",
                }}
              ></div>

              {/* Very Subtle Color Orbs */}
              <div className="absolute top-0 -right-1/4 w-[800px] h-[800px] bg-blue-100/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 -left-1/4 w-[800px] h-[800px] bg-indigo-100/20 rounded-full blur-3xl"></div>
            </div>

            {/* Main Content */}
            <main className="relative z-10">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
