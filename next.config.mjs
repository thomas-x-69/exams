/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GOOGLE_SCRIPT_URL: process.env.GOOGLE_SCRIPT_URL,
  },
  reactStrictMode: true,
  i18n: {
    locales: ["ar"],
    defaultLocale: "ar",
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

      if (cssRule) {
        // Ensure proper handling of CSS variables
        cssRule.use.push({
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: ["postcss-preset-env", "autoprefixer"],
            },
          },
        });
      }
    }

    return config;
  },
};

export default nextConfig;
