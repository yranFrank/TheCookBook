'use client'

import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center text-center px-6">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
        poster="/videos/poster.jpg"
      >
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Text */}
      <div className="relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-[10vw] font-semibold text-white leading-tight drop-shadow-xl"
        >
          What’s for <br className="hidden md:block" /> Dinner Today?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-6 text-lg md:text-2xl text-white/90 max-w-xl drop-shadow-lg"
        >
          Curated daily meals for my dearest wife ❤️
        </motion.p>
      </div>
    </section>
  )
}
