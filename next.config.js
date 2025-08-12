/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com', 'yt3.ggpht.com'],
  },
  env: {
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  },
}

module.exports = nextConfig
