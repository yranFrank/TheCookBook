'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const navItems = [
  { name: '首页', href: '/home' },
  { name: '添加菜谱', href: '/add-recipe' },
  { name: '本周菜单', href: '/menu-plan' },
  { name: '本周菜篮子', href: '/basket' },
  { name: '登录', href: '/login' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#f0e0c8]/90 shadow-md backdrop-blur-md' : 'bg-transparent'
      } border-b border-black/10`}
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
      <Link href="/home">
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="px-4 py-2 rounded-full bg-white text-black text-sm md:text-base font-semibold flex items-center gap-2 shadow-md backdrop-blur-sm transition-all"
  >
    🍳 What's For Dinner?
  </motion.div>
</Link>


        <div className="flex flex-wrap gap-3">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? 'bg-black text-white'
                    : 'text-gray-800 hover:bg-black hover:text-white bg-gray-100'
                }`}
              >
                {item.name}
              </motion.button>
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
