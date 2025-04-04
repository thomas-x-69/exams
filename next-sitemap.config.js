/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://www.egyptianexams.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/api/*", "/admin/*"],
      },
    ],
    additionalSitemaps: [
      "https://www.egyptianexams.com/sitemap.xml",
      "https://www.egyptianexams.com/server-sitemap.xml",
    ],
  },
  exclude: ["/api/*", "/admin/*"],
  // Generate a sitemap for all static routes
  generateIndexSitemap: true,
  // Add this property to auto-generate server-sitemap.xml
  outDir: "public",
  // Add alternate language versions
  alternateRefs: [
    {
      href: "https://www.egyptianexams.com",
      hreflang: "ar",
    },
  ],
  // Change default priority for certain paths
  transform: async (config, path) => {
    const priority =
      path === "/"
        ? 1.0
        : path.startsWith("/exams")
        ? 0.9
        : path.startsWith("/pdfs")
        ? 0.8
        : 0.7;

    const changefreq =
      path === "/" ? "daily" : path.includes("results") ? "always" : "weekly";

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
