// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  // Get response
  const response = NextResponse.next();

  // Define CSP directives
  const csp = [
    // Default policy for resources without explicit directives
    "default-src 'self'",

    // Scripts - Allow self, Google services (for AdSense), cdnjs (for libraries)
    // "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://*.google.com https://*.googletagmanager.com https://cdnjs.cloudflare.com",

    // Styles - Allow self and inline styles (needed for Tailwind's JIT)
    // "style-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com",

    // Images - Allow from self, Google services, and placeholders
    "img-src 'self' data: https: blob:",

    // Fonts - Allow from self and Google Fonts
    "font-src 'self' https://fonts.gstatic.com data:",

    // Connect - Allow connections to API and Google services
    "connect-src 'self' https://*.google.com https://*.googleapis.com https://script.google.com",

    // Media - Restrict to self
    "media-src 'self'",

    // Object - Restrict to none (no Flash, etc.)
    "object-src 'none'",

    // Frame ancestors - Prevent clickjacking
    "frame-ancestors 'self'",

    // Form action - Restrict form submissions to self
    "form-action 'self'",

    // Base URI - Restrict base URIs to self
    "base-uri 'self'",

    // Upgrade Insecure Requests - Force HTTPS
    "upgrade-insecure-requests",
  ].join("; ");

  // Set security headers
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Return response with added security headers
  return response;
}

// Configure which paths should be processed by this middleware
export const config = {
  matcher: [
    // Apply to all routes except API routes, static files, and _next
    "/((?!api/|_next/|public/|favicon.ico).*)",
  ],
};
