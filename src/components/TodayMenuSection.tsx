'use client'

import { useEffect, useState } from 'react'
import { db, auth } from '@/lib/firebase'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.15,
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

const mealIcons: Record<string, string> = {
  早餐: '🍞',
  午餐: '🍱',
  晚餐: '🍲',
}

export default function TodayMenuSection() {
  const [todayMenu, setTodayMenu] = useState<Record<string, string[]>>({
    早餐: [],
    午餐: [],
    晚餐: [],
  })

  useEffect(() => {
    const fetchTodayMenu = async () => {
      const today = new Date()
      const weekdayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1

      const user = auth.currentUser
      if (!user) return

      const userSnap = await getDoc(doc(db, 'users', user.uid))
      const inviteCode = userSnap.exists() ? userSnap.data().inviteCode : null
      if (!inviteCode) return

      const menuSnap = await getDoc(doc(db, 'weeklyMenus', inviteCode))
      if (!menuSnap.exists()) return

      const weeklyMenu = menuSnap.data().menu
      const todayData = weeklyMenu?.[weekdayIndex] || {}

      const recipeSnap = await getDocs(collection(db, 'recipes'))
      const recipeMap: Record<string, string> = {}
      recipeSnap.forEach(doc => {
        recipeMap[doc.id] = doc.data().name || '未知菜品'
      })

      const result: Record<string, string[]> = { 早餐: [], 午餐: [], 晚餐: [] }
      for (const meal of ['早餐', '午餐', '晚餐']) {
        const value = todayData[meal]
        const ids = Array.isArray(value) ? value : value ? [value] : []
        ids.forEach(id => {
          if (id && recipeMap[id]) result[meal].push(recipeMap[id])
        })
      }

      setTodayMenu(result)
    }

    fetchTodayMenu()
  }, [])

  return (
    <section className="relative w-full h-screen bg-[#f0e0c8] text-black flex flex-col justify-center items-center px-6 rounded-3xl">
      <div className="max-w-6xl w-full flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="text-black text-[10vw] md:text-[6vw] font-light tracking-widest">
          今日
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="flex-1 bg-white/90 border border-black/10 rounded-[30px] p-8 md:p-10 space-y-4 shadow-xl backdrop-blur-md max-w-md w-full"
        >
          {['早餐', '午餐', '晚餐'].map(meal => (
            <motion.div key={meal} variants={itemVariants}>
              <div className="text-lg font-semibold mb-1 flex items-center gap-2">
                <span>{mealIcons[meal]}</span> {meal}
              </div>
              <ul className="pl-4 list-disc space-y-1 text-gray-800">
                {todayMenu[meal].length > 0 ? (
                  todayMenu[meal].map((dish, index) => (
                    <li key={index}>{dish}</li>
                  ))
                ) : (
                  <li className="text-sm text-gray-400">无记录</li>
                )}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-black text-[10vw] md:text-[6vw] font-light tracking-widest">
          菜单
        </div>
      </div>
    </section>
  )
}
