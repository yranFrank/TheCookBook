'use client'

import HeroSection from '@/components/HeroSection'
import TodayMenuSection from '@/components/TodayMenuSection'
import MessageBoard from '@/components/MessageBoard'
import FeaturesSection from '@/components/FeaturesSection'



export default function HomePage() {
  return (
    <main className="text-black min-h-screen relative overflow-hidden">
      {/* Hero 视频背景部分 */}
      <section className="relative w-full h-screen">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/hero-cover.jpg"
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-black/20 z-10" />

        <div className="relative z-20">
          <HeroSection />
        </div>
      </section>

      {/* 今日菜单模块 */}
      <section className="bg-[#c2a87a] py-36 px-6">
        <TodayMenuSection />
      </section>
      <MessageBoard />
      {/* 功能卡片模块 */}
      <FeaturesSection />


    </main>
  )
}
