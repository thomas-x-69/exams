/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(favicon.ico|logo.png)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  env: {
    GOOGLE_SCRIPT_URL: process.env.GOOGLE_SCRIPT_URL,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
  reactStrictMode: true,
  i18n: {
    locales: ["ar"],
    defaultLocale: "ar",
  },
  siteMap: {
    generateRobotsTxt: true,
  },
  // Add optimizations for production builds
  swcMinify: true,
  // Configure image optimization
  images: {
    domains: [],
    formats: ["image/avif", "image/webp"],
    // This ensures images are optimized for production
    unoptimized: process.env.NODE_ENV !== "production",
  },
  // Configure webpack to handle CSS properly
  webpack: (config) => {
    // This ensures CSS is properly extracted during the build
    const oneOfRule = config.module.rules.find(
      (rule) => typeof rule.oneOf === "object"
    );

    if (oneOfRule) {
      // Find the CSS rule
      const cssRule = oneOfRule.oneOf.find(
        (rule) => rule.test && rule.test.toString().includes("css")
      );
    }

    return config;
  },
};

export default nextConfig;
