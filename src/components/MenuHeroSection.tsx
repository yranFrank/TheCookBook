'use client'

import { useEffect, useState } from 'react'
import { db, auth } from '@/lib/firebase'
import { getDoc, doc, collection, getDocs } from 'firebase/firestore'
import { motion } from 'framer-motion'

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const meals = ['早餐', '午餐', '晚餐']

export default function MenuHeroSection() {
  const [weeklyMenu, setWeeklyMenu] = useState<any[]>([])
  const [allRecipes, setAllRecipes] = useState<any[]>([])
  const [today] = useState(new Date())

  const weekdayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1
  const getWeekday = () => weekDays[weekdayIndex]

  const getRecipeName = (value: string | string[] | undefined): string => {
    if (!value || !allRecipes.length) return '未选择'

    if (Array.isArray(value)) {
      return value.map(id => allRecipes.find(r => r.id === id)?.name || '未知').join('、')
    }

    return allRecipes.find(r => r.id === value)?.name || '未知'
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser
        if (!user) return

        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (!userDoc.exists()) return

        const userData = userDoc.data()
        const inviteCode = userData.inviteCode
        if (!inviteCode) return

        const menuSnap = await getDoc(doc(db, 'weeklyMenus', inviteCode))
        if (menuSnap.exists()) {
          setWeeklyMenu(menuSnap.data().menu || [])
        }

        const recipeSnap = await getDocs(collection(db, 'recipes'))
        const recipeList: any[] = []
        recipeSnap.forEach(docSnap => {
          recipeList.push({ id: docSnap.id, ...docSnap.data() })
        })
        setAllRecipes(recipeList)
      } catch (err) {
        console.warn('加载菜单失败:', err)
      }
    }

    fetchData()
  }, [])

  const todayMenu = Array.isArray(weeklyMenu) ? weeklyMenu[weekdayIndex] || {} : {}

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover brightness-[0.5]"
      >
        <source src="/videos/hero2.webm" type="video/webm" />
        <source src="/videos/hero1.mp4" type="video/mp4" />
        您的浏览器不支持 video 标签。
      </video>

      <div className="relative z-10 w-full h-full flex flex-col justify-center items-start px-10 md:px-20 text-white">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          {getWeekday()} · {today.getFullYear()}/{today.getMonth() + 1}/{today.getDate()}
        </h1>

        <p className="mt-6 text-xl md:text-2xl">
          今日菜单：
          {meals.map((m) => (
            <span key={m} className="mr-6 block md:inline">
              <b>{m}</b>：{getRecipeName(todayMenu?.[m])}
            </span>
          ))}
        </p>
      </div>
    </motion.section>
  )
}