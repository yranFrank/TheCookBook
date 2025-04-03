'use client'

import { useState, useMemo, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const meals = ['早餐', '午餐', '晚餐']

// 获取本周每一天的日期
const getWeekDates = (): string[] => {
  const today = new Date()
  const currentDay = today.getDay() === 0 ? 7 : today.getDay() // 周日 → 7
  const monday = new Date(today)
  monday.setDate(today.getDate() - currentDay + 1)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return `${d.getMonth() + 1}月${d.getDate()}日`
  })
}

export default function WeeklyMenuEditorSection({
  weeklyMenu,
  allRecipes,
  updateMenuItem,
}: {
  weeklyMenu: any[]
  allRecipes: any[]
  updateMenuItem: (dayIndex: number, meal: string, recipeIds: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null)
  const [selectedMeal, setSelectedMeal] = useState<'早餐' | '午餐' | '晚餐'>('早餐')
  const [searchTerm, setSearchTerm] = useState('')
  const [convertedMenu, setConvertedMenu] = useState<any[]>([])
  const [weekDates, setWeekDates] = useState<string[]>([])

  // 初始化菜单和日期数组
  useEffect(() => {
    const converted = weeklyMenu.map((day: any) => {
      const convertedDay: Record<string, string[]> = {}
      meals.forEach(meal => {
        const val = day?.[meal]
        if (!val) convertedDay[meal] = []
        else if (Array.isArray(val)) convertedDay[meal] = val
        else convertedDay[meal] = [val]
      })
      return convertedDay
    })
    setConvertedMenu(converted)
    setWeekDates(getWeekDates())
  }, [weeklyMenu])

  const openEditor = (index: number) => {
    setSelectedDayIndex(index)
    setSearchTerm('')
    setOpen(true)
  }

  const handleRecipeSelect = async (recipeId: string) => {
    if (selectedDayIndex === null) return

    const current = convertedMenu[selectedDayIndex][selectedMeal] || []
    const updated = current.includes(recipeId)
      ? current.filter(id => id !== recipeId)
      : [...current, recipeId]

    const newMenu = [...convertedMenu]
    newMenu[selectedDayIndex][selectedMeal] = updated
    setConvertedMenu(newMenu)
    updateMenuItem(selectedDayIndex, selectedMeal, updated)

    const menuRef = doc(db, 'weeklyMenu', 'structured')
    const snap = await getDoc(menuRef)
    const existing = snap.exists() ? snap.data().menu : []

    if (!existing[selectedDayIndex]) {
      existing[selectedDayIndex] = { 早餐: [], 午餐: [], 晚餐: [] }
    }

    existing[selectedDayIndex][selectedMeal] = updated
    await updateDoc(menuRef, {
      menu: existing,
      updatedAt: new Date(),
    })
  }

  const isSelected = (recipeId: string) => {
    if (selectedDayIndex === null) return false
    return convertedMenu[selectedDayIndex]?.[selectedMeal]?.includes(recipeId)
  }

  const filteredRecipes = useMemo(() => {
    if (!searchTerm.trim()) return allRecipes
    return allRecipes.filter(recipe =>
      recipe.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, allRecipes])

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {weekDays.map((day, index) => (
          <motion.div
            key={day}
            onClick={() => openEditor(index)}
            className="cursor-pointer break-inside-avoid rounded-2xl shadow-lg p-6 text-white transition hover:scale-[1.01]"
            style={{
              backgroundColor: ['#a459ff', '#7ea2ad', '#f1f3f6', '#cfedd9', '#2d2d2c', '#ff4081', '#00bcd4'][index % 7],
            }}
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <h3 className="text-3xl font-extrabold mb-2">
              {day} · <span className="text-white/80 text-lg">{weekDates[index]}</span>
            </h3>
            {meals.map(meal => (
              <p key={meal} className="text-base">
                <b>{meal}：</b>
                {convertedMenu[index]?.[meal]?.length > 0
                  ? convertedMenu[index][meal]
                      .map((id: string) => allRecipes.find(r => r.id === id)?.name || '未知')
                      .join('、')
                  : '未选择'}
              </p>
            ))}
          </motion.div>
        ))}
      </div>

      {/* 弹窗编辑菜单 */}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-6xl rounded-xl bg-white p-6 shadow-xl">
            <Dialog.Title className="text-2xl font-bold mb-4">
              编辑 {selectedDayIndex !== null ? weekDays[selectedDayIndex] + ' · ' + weekDates[selectedDayIndex] : ''} 菜单
            </Dialog.Title>

            <div className="mb-6 flex gap-4">
              {meals.map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMeal(m)}
                  className={clsx(
                    'px-4 py-2 rounded-full border text-sm font-medium',
                    selectedMeal === m ? 'bg-black text-white' : 'bg-gray-100'
                  )}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="🔍 输入菜名搜索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto">
              {filteredRecipes.length > 0 ? (
                filteredRecipes.map(recipe => (
                  <motion.div
                    key={recipe.id}
                    onClick={() => handleRecipeSelect(recipe.id)}
                    className={clsx(
                      'cursor-pointer border rounded-xl p-4 transition',
                      isSelected(recipe.id)
                        ? 'bg-black text-white border-black'
                        : 'border-gray-300 hover:bg-gray-100'
                    )}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h4 className="text-lg font-bold mb-1">{recipe.name}</h4>
                    {recipe.description && (
                      <p className="text-sm text-gray-400 mb-1">{recipe.description}</p>
                    )}
                    {recipe.ingredients && (
                      <p className="text-sm text-gray-300">🧂 {recipe.ingredients.join(', ')}</p>
                    )}
                    {recipe.calories && (
                      <p className="text-sm text-gray-300 mt-1">🔥 {recipe.calories} kcal</p>
                    )}
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center">没有匹配的菜品，请调整关键词。</p>
              )}
            </div>

            <div className="text-right mt-6">
              <button
                className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
                onClick={() => setOpen(false)}
              >
                完成
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
