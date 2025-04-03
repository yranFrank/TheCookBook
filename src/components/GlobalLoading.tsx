'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useMemo } from 'react'

export default function GlobalLoading() {
  // ✅ 随机选择一个 emoji（只生成一次）
  const emoji = useMemo(() => {
    const options = ['🍣', '🍜', '🥟', '🍚', '🥢', '🥩', '🍛', '🍲', '🍱', '🍤', '🍝']
    const random = Math.floor(Math.random() * options.length)
    return options[random]
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#f5e8d3] to-[#f0e0c8] flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scaleX: -1 }}
        animate={{ scaleX: [1, -1, 1] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <Image
          src="/images/Icon.png"
          alt="加载动画"
          width={360}
          height={360}
          className="drop-shadow-xl"
        />
      </motion.div>

      {/* ✅ 随机 Emoji 动画 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.7, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-6 text-2xl text-gray-700 select-none"
      >
        “{emoji}”
      </motion.div>
    </motion.div>
  )
}

