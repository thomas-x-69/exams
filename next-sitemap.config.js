/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://egyptianexams.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: [
      "https://egyptianexams.com/sitemap.xml",
      "https://egyptianexams.com/server-sitemap.xml",
    ],
  },
  exclude: ["/api/*"],
  // Generate a sitemap for all static routes
  generateIndexSitemap: true,
  // Add this property to auto-generate server-sitemap.xml
  outDir: "public",
};
