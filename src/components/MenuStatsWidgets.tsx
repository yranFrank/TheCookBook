'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MenuStatsWidgets({
  weeklyMenu,
  allRecipes,
}: {
  weeklyMenu: any[]
  allRecipes: any[]
}) {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null)

  const allSelectedIds = weeklyMenu.flatMap(day =>
    Object.values(day).filter(id => id)
  )

  const selectedRecipes = allRecipes.filter(r => allSelectedIds.includes(r.id))
  const totalCalories = selectedRecipes.reduce((sum, r) => sum + (r.calories || 0), 0)

  const allIngredients = selectedRecipes.flatMap(r => r.ingredients || [])
  const uniqueIngredients = [...new Set(allIngredients)]

  // 🔍 每天的卡路里
  const dailyCalories = weeklyMenu.map(day =>
    Object.values(day)
      .map(id => allRecipes.find(r => r.id === id)?.calories || 0)
      .reduce((a, b) => a + b, 0)
  )
  const maxDayIndex = dailyCalories.indexOf(Math.max(...dailyCalories))

  const cards = [
    {
      title: '总热量',
      value: `${totalCalories} kcal`,
      color: '#ff5722',
      details: selectedRecipes.map(r => `${r.name}：${r.calories || 0} kcal`).join('\n'),
      extra: `🔥 热量最高的一天：周${maxDayIndex + 1}（${dailyCalories[maxDayIndex]} kcal）`,
    },
    {
      title: '使用材料',
      value: `${uniqueIngredients.length} 种`,
      color: '#3f51b5',
      details: uniqueIngredients.join('、'),
      extra: `🧂 共计 ${uniqueIngredients.length} 种材料`,
    },
    {
      title: '已选菜品',
      value: `${selectedRecipes.length} 道`,
      color: '#009688',
      details: selectedRecipes.map(r => `✅ ${r.name}`).join('\n'),
      extra: `📌 菜单已含 ${selectedRecipes.length} 道菜`,
    },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <h2 className="text-3xl font-extrabold flex items-center gap-2">📊 每周菜单分析</h2>

      <div className="grid md:grid-cols-3 gap-6 relative">
        {cards.map((card, index) => {
          const isFlipped = flippedIndex === index

          return (
            <div
              key={index}
              className="perspective"
              onClick={() => setFlippedIndex(isFlipped ? null : index)}
            >
              <motion.div
                className={`relative w-full h-[220px] ${isFlipped ? 'z-20 scale-110' : ''}`}
                animate={{ rotateY: isFlipped ? 180 : 0, scale: isFlipped ? 1.1 : 1 }}
                transition={{ duration: 0.8, type: 'spring' }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* 正面 */}
                <motion.div
                  className="absolute w-full h-full rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl cursor-pointer"
                  style={{
                    backgroundColor: card.color,
                    backfaceVisibility: 'hidden',
                  }}
                  whileHover={{ scale: 1.03 }}
                >
                  <p className="text-lg font-semibold mb-2">{card.title}</p>
                  <h2 className="text-5xl font-black tracking-wide">{card.value}</h2>
                  <motion.p
                    className="text-sm text-white/80 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    点击查看详情 ➤
                  </motion.p>
                </motion.div>

                {/* 背面 */}
                <motion.div
                  className="absolute w-full h-full rounded-2xl p-6 bg-white text-gray-800 shadow-xl overflow-auto"
                  style={{
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="text-xl font-bold mb-2">{card.title} · 详情</h4>
                  <p className="text-sm whitespace-pre-line leading-relaxed text-gray-600">{card.details}</p>
                  <p className="mt-4 text-sm text-gray-500">{card.extra}</p>
                  <p className="text-right mt-4 text-sm text-gray-400">(点击卡片返回)</p>
                </motion.div>
              </motion.div>
            </div>
          )
        })}
      </div>
    </motion.section>
  )
}
