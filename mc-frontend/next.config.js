/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
};

module.exports = {
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: [
      "res-1.cloudinary.com",
      "pbs.twimg.com",
      "www.chattanoogapulse.com",
      "foxchattanooga.com",
      "media.timesfreepress.com",
      "noogatoday.6amcity.com",
      "bloximages.newyork1.vip.townnews.com",
      "wpcdn.us-east-1.vip.tn-cloud.net",
      "www.wdef.com",
      "mychattanooga-files.nyc3.digitaloceanspaces.com",
      "s.gravatar.com",
    ],
  },
  reactStrictMode: false,
};
