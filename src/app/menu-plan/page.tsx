'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { getDoc, doc, setDoc, collection, getDocs } from 'firebase/firestore'
import { motion } from 'framer-motion'
import WeeklyMenuEditorSection from '@/components/WeeklyMenuEditorSection'
import MenuStatsWidgets from '@/components/MenuStatsWidgets'

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const meals = ['早餐', '午餐', '晚餐']

export default function MenuPlanPage() {
  const [weeklyMenu, setWeeklyMenu] = useState<any[]>(
    Array(7).fill(null).map(() => ({ 早餐: '', 午餐: '', 晚餐: '' }))
  )
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

      const querySnapshot = await getDocs(collection(db, 'recipes'))
      const recipeList: any[] = []
      querySnapshot.forEach((docSnap) => {
        recipeList.push({
          id: docSnap.id,
          ...docSnap.data(),
        })
      })

      setAllRecipes(recipeList)
    }

    fetchData()
  }, [])

  const updateMenuItem = (dayIndex: number, meal: string, recipeId: string) => {
    const updated = [...weeklyMenu]
    updated[dayIndex][meal] =
      updated[dayIndex][meal] === recipeId ? '' : recipeId
    setWeeklyMenu(updated)
  }

  const saveMenu = async () => {
    await setDoc(doc(db, 'weeklyMenu', 'structured'), {
      menu: weeklyMenu,
      updatedAt: new Date(),
    })
    alert('菜单已保存 ✅')
  }

  return (
    <>
      {/* Hero Section */}
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
          className="absolute inset-0 w-full h-full object-cover brightness-[0.6]"
        >
          <source src="/videos/hero2.webm" type="video/webm" />
          您的浏览器不支持 video 标签。
        </video>

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

      {/* 每周菜单编辑区域 */}
      <section className="px-6 md:px-20 py-16 bg-[#fdf5e6] text-black">
        <h2 className="text-3xl font-bold mb-10">🍽️ 本周菜单编辑</h2>

        <WeeklyMenuEditorSection
          weeklyMenu={weeklyMenu}
          allRecipes={allRecipes}
          updateMenuItem={updateMenuItem}
        />

        <div className="text-right mt-10">
          <button
            onClick={saveMenu}
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
          >
            保存菜单
          </button>
        </div>
      </section>

      {/* 数据分析区域 */}
      <section className="px-6 md:px-20 py-16 bg-white text-black">
        <MenuStatsWidgets weeklyMenu={weeklyMenu} allRecipes={allRecipes} />
      </section>
    </>
  )
}
