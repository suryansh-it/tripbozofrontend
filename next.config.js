/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "is1-ssl.mzstatic.com", // App Store
      },
      {
        protocol: "https",
        hostname: "play-lh.googleusercontent.com", // Play Store
      },
      {
        protocol: "https",
        hostname: "play.google.com", // Play pages
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google icons
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com", // Unsplash
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org", // Wikimedia Commons
      },
    ],
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      const fs = require("fs");
      const path = require("path");

      const faviconPath = path.join(__dirname, "public", "favicon.ico");
      const logoPath = path.join(__dirname, "public", "logo.png");

      if (!fs.existsSync(faviconPath) && fs.existsSync(logoPath)) {
        console.log("Creating favicon.ico from logo.png");
        try {
          fs.copyFileSync(logoPath, faviconPath);
        } catch (e) {
          console.log("Failed to copy logo to favicon:", e.message);
        }
      }
    }

    return config;
  },
};

module.exports = nextConfig;
