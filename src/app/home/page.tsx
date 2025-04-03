'use client'

import { motion } from 'framer-motion'
import HeroSection from '@/components/HeroSection'
import TodayMenuSection from '@/components/TodayMenuSection'
import MessageBoard from '@/components/MessageBoard'
import FeaturesSection from '@/components/FeaturesSection'

export default function HomePage() {
  return (
    <main className="text-black min-h-screen relative overflow-hidden bg-[#fdfaf5]">
      {/* 🎥 Hero 视频背景 + 动画 */}
      <motion.section
        className="relative w-full h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
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
        </video>

        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-20"
        >
          <HeroSection />
        </motion.div>
      </motion.section>

      {/* 🍽️ 今日菜单模块 */}
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="bg-[#c2a87a] py-36 px-6"
      >
        <TodayMenuSection />
      </motion.section>

      {/* 💬 留言板 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <MessageBoard />
      </motion.div>

      {/* 🧩 功能卡片模块 */}
      <motion.section
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <FeaturesSection />
      </motion.section>
    </main>
  )
}
