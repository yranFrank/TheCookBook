'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { doc, getDoc, getDocs, collection } from 'firebase/firestore'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function BasketPage() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [recipeList, setRecipeList] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchBasket = async () => {
      setLoading(true)

      const menuSnap = await getDoc(doc(db, 'weeklyMenu', 'structured'))
      if (!menuSnap.exists()) {
        setIngredients([])
        setRecipeList([])
        setLoading(false)
        return
      }

      const weeklyMenu = menuSnap.data().menu || []
      const recipeIds = weeklyMenu.flatMap((day: any) =>
        Object.values(day).filter((id: string) => !!id)
      )

      const recipeSnap = await getDocs(collection(db, 'recipes'))
      const matchedIngredients = new Set<string>()
      const matchedRecipes: { id: string; name: string }[] = []

      recipeSnap.forEach(snap => {
        const recipe = snap.data()
        if (recipeIds.includes(snap.id)) {
          matchedRecipes.push({ id: snap.id, name: recipe.name || '未知菜品' })
          ;(recipe.ingredients || []).forEach((ing: string) =>
            matchedIngredients.add(ing)
          )
        }
      })

      const ingredientList = [...matchedIngredients]
      const initialChecked: Record<string, boolean> = {}
      ingredientList.forEach(i => (initialChecked[i] = false))

      setIngredients(ingredientList)
      setRecipeList(matchedRecipes)
      setChecked(initialChecked)
      setLoading(false)
    }

    fetchBasket()
  }, [])

  const toggleCheck = (item: string) => {
    setChecked(prev => ({ ...prev, [item]: !prev[item] }))
  }

  const clearAll = () => {
    const resetChecked: Record<string, boolean> = {}
    ingredients.forEach(i => (resetChecked[i] = false))
    setChecked(resetChecked)
  }

  return (
    <main className="min-h-screen bg-[#f0e0c8] py-20 px-6 text-black">
      <div className="max-w-6xl mx-auto bg-white p-10 rounded-[36px] shadow-xl border border-black/10 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        {/* 左侧：材料列表 */}
<div>
  <motion.h1
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-3xl md:text-4xl font-extrabold tracking-wide flex items-center gap-2 mb-4"
  >
    🧺 本周菜篮子
  </motion.h1>

  {/* 移动后的按钮组 */}
  <div className="flex flex-wrap gap-4 mb-6">
    <Link href="/menu-plan">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="text-sm px-4 py-2 rounded-full text-blue-600 hover:text-white hover:bg-blue-600 transition border border-blue-600"
      >
        ← 返回菜单页
      </motion.button>
    </Link>

    <motion.button
      onClick={clearAll}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="text-sm px-4 py-2 rounded-full text-red-500 hover:text-white hover:bg-red-500 transition border border-red-400"
    >
      清除所有勾选
    </motion.button>
  </div>

  {loading ? (
    <p className="text-gray-500 mt-4">加载中...</p>
  ) : ingredients.length === 0 ? (
    <p className="text-gray-600 mt-4">暂无已选菜品，无法生成菜篮子 🥲</p>
  ) : (
    <ul className="space-y-3 mt-2 text-base">
      <AnimatePresence>
        {ingredients.map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ delay: i * 0.02 }}
            className="flex items-center gap-3"
          >
            <input
              type="checkbox"
              checked={checked[item]}
              onChange={() => toggleCheck(item)}
              className="w-5 h-5 accent-black"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggleCheck(item)}
              className={`px-4 py-2 rounded-lg w-full text-left text-sm font-medium shadow-sm transition-all ${
                checked[item]
                  ? 'bg-gray-200 text-gray-400 line-through'
                  : 'bg-gray-50 text-black'
              }`}
            >
              {item}
            </motion.button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )}
</div>


        {/* 右侧：菜名列表 */}
        <div>
          <motion.div className="flex items-center justify-between mb-6">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-extrabold tracking-wide flex items-center gap-2"
            >
              🍽️ 本周菜品
            </motion.h2>
          </motion.div>

          <ul className="space-y-3 text-base">
            {recipeList.map((r, i) => (
              <motion.button
                key={r.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push(`/recipes/${r.id}`)}
                className="w-full text-left bg-[#f5f5f5] hover:bg-[#e5e5e5] transition px-4 py-3 rounded-xl shadow-md font-semibold"
              >
                🍛 {r.name}
              </motion.button>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
