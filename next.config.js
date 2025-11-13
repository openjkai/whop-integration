/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    WHOP_API_KEY: process.env.WHOP_API_KEY,
    WHOP_WEBHOOK_SECRET: process.env.WHOP_WEBHOOK_SECRET,
    WHOP_COMPANY_ID: process.env.WHOP_COMPANY_ID,
  },
}

module.exports = nextConfig

