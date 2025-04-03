import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ✅ 忽略 TS 构建错误
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ 忽略 ESLint 构建错误
  },
}

export default nextConfig
