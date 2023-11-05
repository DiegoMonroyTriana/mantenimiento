/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@nivo"],
  "experimental": {
    "serverActions": true
  },
}

module.exports = nextConfig
