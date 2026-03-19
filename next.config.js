/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    RAILWAY_API_URL: process.env.RAILWAY_API_URL || 'https://your-railway-app.up.railway.app',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-railway-app.up.railway.app'
  }
}

module.exports = nextConfig