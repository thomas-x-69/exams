// middleware.js - Optimized for AdSense, security, and app functionality
import { NextResponse } from "next/server";

export function middleware(request) {
  // Get response
  const response = NextResponse.next();

  /* Define CSP directives - optimized for AdSense + security */
  const csp = [
    // Default fallback - restrict to same origin
    "default-src 'self'",

    // Scripts - Allow your scripts, inline scripts, eval, and Google services
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com https://*.googleadservices.com https://*.googlesyndication.com https://*.googletagmanager.com https://cdnjs.cloudflare.com",

    // Styles - Allow your CSS, inline styles, and Google Fonts
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

    // Images - Allow from your domain, data URIs, and any HTTPS source
    "img-src 'self' data: https: blob:",

    // Fonts - Allow from your domain, Google Fonts, and data URIs
    "font-src 'self' https://fonts.gstatic.com data:",

    // Connect - Allow AJAX/fetch to your API and Google services
    "connect-src 'self' https://*.google.com https://*.googleapis.com https://script.google.com",

    // Media - Restrict audio/video to your domain
    "media-src 'self'",

    // Objects - Block plugins like Flash
    "object-src 'none'",

    // Frames - Allow AdSense iframe content
    "frame-src 'self' https://*.google.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.googlesyndication.com",

    // Frame ancestors - Prevent your site from being embedded
    "frame-ancestors 'self'",

    // Form submissions - Restrict to your domain
    "form-action 'self'",

    // Base URI - Restrict base tag to your domain
    "base-uri 'self'",

    // Force HTTPS
    "upgrade-insecure-requests",
  ].join("; ");

  // Set security headers
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Simplified Permissions Policy - restricts access to sensitive features
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
