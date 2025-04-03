'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { getDoc, doc } from 'firebase/firestore'
import { motion } from 'framer-motion'

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const meals = ['早餐', '午餐', '晚餐']

export default function MenuHeroSection() {
  const [weeklyMenu, setWeeklyMenu] = useState<any[][]>([])
  const [allRecipes, setAllRecipes] = useState<any[]>([])
  const [today] = useState(new Date())

  const weekdayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1
  const getWeekday = () => weekDays[weekdayIndex]
  const getRecipeName = (id: string | null) =>
    allRecipes.find(r => r.id === id)?.name || '未选择'

  useEffect(() => {
    const fetchData = async () => {
      const menuSnap = await getDoc(doc(db, 'weeklyMenu', 'structured'))
      if (menuSnap.exists()) {
        setWeeklyMenu(menuSnap.data().menu)
      }

      const recipeSnap = await getDoc(doc(db, 'meta', 'recipes'))
      if (recipeSnap.exists()) {
        setAllRecipes(recipeSnap.data().recipes)
      }
    }
    fetchData()
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* 全屏背景视频 */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover brightness-[0.5]"
      >
        <source src="/videos/hero2.webm" type="video/webm" />
        您的浏览器不支持 video 标签。
      </video>

      {/* 前景文字内容 */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-start px-10 md:px-20 text-white">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          {getWeekday()} · {today.getFullYear()}/{today.getMonth() + 1}/{today.getDate()}
        </h1>
        <p className="mt-6 text-xl md:text-2xl">
          今日菜单：
          {meals.map(m => (
            <span key={m} className="mr-6 block md:inline">
              <b>{m}</b>：{getRecipeName(weeklyMenu[weekdayIndex]?.[m])}
            </span>
          ))}
        </p>
      </div>
    </motion.section>
  )
}
