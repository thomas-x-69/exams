// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  // Enable JIT mode for faster builds and smaller CSS
  mode: "jit",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Cairo", "sans-serif"],
      },
      colors: {
        // Define your color palette here to reduce CSS size
        primary: {
          DEFAULT: "#1e40af", // blue-800
          dark: "#1e3a8a", // blue-900
          light: "#3b82f6", // blue-500
        },
      },
    },
  },
  // Remove unused styles in production
  safelist: [
    // Add any classes that might be dynamically created and need to be preserved
    "text-red-600",
    "bg-red-600",
  ],
  // Disable variants that aren't used to reduce CSS size
  variants: {
    extend: {
      opacity: ["disabled"],
      cursor: ["disabled"],
    },
  },
  plugins: [],
};

export default config;
