'use client'

import { useEffect, useState } from 'react'
import { db, auth } from '@/lib/firebase'
import { getDoc, doc, setDoc, collection, getDocs } from 'firebase/firestore'
import { motion } from 'framer-motion'
import WeeklyMenuEditorSection from '@/components/WeeklyMenuEditorSection'
import MenuStatsWidgets from '@/components/MenuStatsWidgets'

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const meals = ['早餐', '午餐', '晚餐']

export default function MenuPlanPage() {
  const [weeklyMenu, setWeeklyMenu] = useState<any[]>(Array(7).fill(null).map(() => ({
    早餐: [],
    午餐: [],
    晚餐: []
  })))
  const [allRecipes, setAllRecipes] = useState<any[]>([])
  const [today] = useState(new Date())
  const [inviteCode, setInviteCode] = useState<string | null>(null)

  const user = auth.currentUser

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      // 获取用户的邀请码
      const userRef = doc(db, 'users', user.uid)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        const data = userSnap.data()
        setInviteCode(data.inviteCode || null)
      }

      if (!inviteCode) return

      // 获取团队的 weeklyMenu
      const menuSnap = await getDoc(doc(db, 'weeklyMenus', inviteCode))
      if (menuSnap.exists()) {
        const menu = menuSnap.data().menu
        if (Array.isArray(menu) && menu.length === 7) {
          setWeeklyMenu(menu)
        }
      }

      // 获取所有食谱
      const querySnapshot = await getDocs(collection(db, 'recipes'))
      const recipeList: any[] = []
      querySnapshot.forEach((docSnap) => {
        recipeList.push({ id: docSnap.id, ...docSnap.data() })
      })
      setAllRecipes(recipeList)
    }

    fetchData()
  }, [user, inviteCode])

  const updateMenuItem = (dayIndex: number, meal: string, recipeIds: string[]) => {
    const updated = [...weeklyMenu]
    if (!updated[dayIndex]) {
      updated[dayIndex] = { 早餐: [], 午餐: [], 晚餐: [] }
    }
    updated[dayIndex][meal] = recipeIds
    setWeeklyMenu(updated)
  }

  const saveMenu = async () => {
    if (!inviteCode) {
      alert('❌ 无法保存菜单，邀请码未找到')
      return
    }

    const cleaned = weeklyMenu.map(day => {
      const obj: any = {}
      meals.forEach(m => {
        const ids = day[m]
        obj[m] = Array.isArray(ids) ? ids.map(id => String(id)) : []
      })
      return obj
    })

    await setDoc(doc(db, 'weeklyMenus', inviteCode), {
      menu: cleaned,
      updatedAt: new Date(),
    })

    alert('✅ 菜单已保存')
  }

  const weekdayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1
  const getWeekday = () => weekDays[weekdayIndex]

  const getRecipeName = (ids: string[] | undefined) => {
    if (!Array.isArray(ids) || ids.length === 0) return '未选择'
    return ids.map(id => allRecipes.find(r => r.id === id)?.name || '未知').join('、')
  }

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-screen overflow-hidden bg-black"
      >
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover brightness-[0.6]">
          <source src="/videos/hero2.webm" type="video/webm" />
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

      <section className="px-6 md:px-20 py-16 bg-[#fdf5e6] text-black">
        <h2 className="text-3xl font-bold mb-10">🍽️ 本周菜单编辑</h2>
        <WeeklyMenuEditorSection
          weeklyMenu={weeklyMenu}
          allRecipes={allRecipes}
          updateMenuItem={updateMenuItem}
        />
        <div className="text-right mt-10">
          <button onClick={saveMenu} className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition">
            保存菜单
          </button>
        </div>
      </section>

      <section className="px-6 md:px-20 py-16 bg-white text-black">
        <MenuStatsWidgets weeklyMenu={weeklyMenu} allRecipes={allRecipes} />
      </section>
    </>
  )
}
