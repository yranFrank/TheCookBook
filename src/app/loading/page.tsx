'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function Loading() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true)
    }, 500) // 强制延迟至少 0.5 秒

    return () => clearTimeout(timer)
  }, [])

  if (!show) return null // 不显示组件，防止过短闪烁

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#fef6e4] via-[#f0e0c8] to-[#fce7ae] backdrop-blur-md"
    >
      <motion.div
        className="text-xl font-bold text-black bg-white px-6 py-3 rounded-full shadow-xl"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1.05 }}
        transition={{ yoyo: Infinity, duration: 0.6, ease: 'easeInOut' }}
      >
        页面加载中...
      </motion.div>
    </motion.div>
  )
}
