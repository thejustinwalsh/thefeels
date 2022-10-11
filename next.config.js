const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = withMDX({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["avatars.githubusercontent.com", "platform-lookaside.fbsbx.com"],
  },
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
});

module.exports = nextConfig;
