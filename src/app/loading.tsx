'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#f0e0c8] flex flex-col justify-center items-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.2, 1], opacity: 1, rotate: [0, 360] }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop'
        }}
      >
        <Image
          src="/images/Icon.png" // 你的位置
          alt="Loading Icon"
          width={120}
          height={120}
          className="rounded-xl"
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.7, 1] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'loop'
        }}
        className="mt-6 text-lg text-gray-700"
      >
        页面加载中，请稍等...
      </motion.p>
    </div>
  )
}
