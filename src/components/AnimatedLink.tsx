'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AnimatedLink({
  to,
  children,
  className = '',
}: {
  to: string
  children: React.ReactNode
  className?: string
}) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/loading?to=${encodeURIComponent(to)}`)
  }

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.05 }}
      onClick={handleClick}
      className={className}
    >
      {children}
    </motion.button>
  )
}
