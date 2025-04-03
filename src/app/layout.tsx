// app/layout.tsx (✅ 保持为服务端组件)
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import RootLayoutClient from "@/components/RootLayoutClient" // 🌟 客户端部分

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "TheCookBook",
  description: "你的专属饮食小助手",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RootLayoutClient>{children}</RootLayoutClient> {/* ✅ 客户端功能交给它 */}
      </body>
    </html>
  )
}
