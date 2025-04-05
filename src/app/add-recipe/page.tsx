'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import MenuHeroSection from '@/components/MenuHeroSection'
import { useAuthUser } from '@/lib/auth'

const categoryOptions = ['清淡', '重口', '减脂', '家常', '高蛋白']

export default function AddRecipePage() {
  const user = useAuthUser()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState([''])
  const [categories, setCategories] = useState<string[]>([])
  const [recipes, setRecipes] = useState<any[]>([])
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [calories, setCalories] = useState('')
  const [allCategories, setAllCategories] = useState<string[]>([])
  const [newCategoryInput, setNewCategoryInput] = useState('')



  useEffect(() => {
    const q = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setRecipes(list)
    })
    // 加载所有已有分类
    const allCats = new Set<string>()
recipes.forEach(recipe => {
  recipe.categories?.forEach((c: string) => allCats.add(c))
})
setAllCategories(Array.from(allCats))


    return () => unsub()
  }, [])

  const handleAddIngredient = () => {
    setIngredients([...ingredients, ''])
  }

  const handleIngredientChange = (index: number, value: string) => {
    const updated = [...ingredients]
    updated[index] = value
    setIngredients(updated)
  }

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter(c => c !== cat))
    } else {
      setCategories([...categories, cat])
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      alert('请先登录才能添加菜谱！')
      return
    }
  
    if (!name || !description || ingredients.some(i => !i)) return
  
    await addDoc(collection(db, 'recipes'), {
      name,
      description,
      ingredients,
      categories,
      calories: parseInt(calories) || 0,
      createdAt: serverTimestamp(),
      userId: user.uid, // ✅ 可选：标记作者
    })
  
    setName('')
    setDescription('')
    setIngredients([''])
    setCategories([])
    setCalories('')
  }
  

  const filteredRecipes = recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === '' || r.categories?.includes(filter))
  )

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#f0e0c8] min-h-screen text-black"
    >
      {/* 🔥 插入大图 Hero 区域 */}
      <div className="relative z-10">
        <MenuHeroSection />
        {/* 添加底部渐变过渡效果 */}
        <div className="w-full h-10 bg-gradient-to-b from-transparent to-[#f0e0c8]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20 space-y-20">
        {/* 🍳 添加菜谱表单区域 */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-3xl border border-black/10 shadow-xl"
        >
          <motion.h1
            layout
            className="text-4xl font-bold mb-6"
          >
            🍳 添加菜谱
          </motion.h1>

          <motion.input
            whileFocus={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
            placeholder="菜名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 mb-4 rounded-xl border text-lg bg-gray-50"
          />

          <motion.textarea
            whileFocus={{ scale: 1.02 }}
            placeholder="做法"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-4 mb-4 rounded-xl border text-lg bg-gray-50"
          />

<motion.input
  whileFocus={{ scale: 1.02 }}
  transition={{ type: 'spring', stiffness: 300 }}
  placeholder="卡路里（kcal）"
  value={calories}
  onChange={(e) => setCalories(e.target.value)}
  type="number"
  className="w-full p-4 mb-4 rounded-xl border text-lg bg-gray-50"
/>


          <label className="block text-lg font-medium mb-2">材料</label>
          <motion.div layout className="space-y-3 mb-4">
            <AnimatePresence>
              {ingredients.map((item, idx) => (
                <motion.input
                  key={idx}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  placeholder={`材料 ${idx + 1}`}
                  value={item}
                  onChange={(e) => handleIngredientChange(idx, e.target.value)}
                  className="w-full p-3 border rounded-lg bg-gray-50"
                />
              ))}
            </AnimatePresence>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddIngredient}
              className="text-blue-600 underline text-sm"
            >
              + 添加更多材料
            </motion.button>
          </motion.div>

          <label className="block text-lg font-medium mb-2">分类（可多选）</label>

{/* 已选择分类展示（可删除） */}
<div className="flex flex-wrap gap-3 mb-4">
  {categories.map((cat, idx) => (
    <span
      key={cat}
      className="bg-black text-white text-sm px-4 py-1 rounded-full flex items-center gap-2"
    >
      {cat}
      <button
        onClick={() =>
          setCategories(categories.filter((_, i) => i !== idx))
        }
        className="text-red-400 hover:text-red-600"
      >
        ×
      </button>
    </span>
  ))}
</div>

{/* 快捷选择已有分类 */}
<div className="flex flex-wrap gap-2 mb-4">
  {allCategories.map((cat) => (
    <button
      key={cat}
      onClick={() => {
        if (!categories.includes(cat)) {
          setCategories([...categories, cat])
        }
      }}
      className="text-sm px-3 py-1 border border-gray-400 rounded-full hover:bg-gray-200 transition"
    >
      + {cat}
    </button>
  ))}
</div>

{/* 添加新分类 */}
<div className="flex gap-2 mb-6">
  <input
    type="text"
    placeholder="输入新分类"
    value={newCategoryInput}
    onChange={(e) => setNewCategoryInput(e.target.value)}
    className="border px-3 py-1 rounded w-full"
  />
  <button
    onClick={() => {
      if (newCategoryInput.trim()) {
        setCategories([...categories, newCategoryInput.trim()])
        setNewCategoryInput('')
      }
    }}
    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
  >
    添加
  </button>
</div>


<motion.button
  onClick={handleSubmit}
  disabled={!user}
  className={`w-full py-4 rounded-full text-lg font-semibold transition 
    ${user ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
>
  {user ? '添加菜谱' : '请先登录'}
</motion.button>

        </motion.section>

        {/* 🧾 菜谱列表展示区域 */}
        <section>
          <h2 className="text-3xl font-semibold mb-6">📖 菜谱大全</h2>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <input
              placeholder="搜索菜名..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-3 rounded-xl border w-full md:max-w-xs bg-white"
            />

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('')}
                className={`px-4 py-2 rounded-full text-sm border ${
                  filter === '' ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                全部
              </button>
              {categoryOptions.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm border ${
                    filter === cat ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            layout
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {filteredRecipes.map((r, i) => (
                <Link href={`/recipes/${r.id}`} key={r.id}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="cursor-pointer bg-white p-6 rounded-[30px] border border-black/10 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-black mb-3">{r.name}</h3>
                      <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-3">
                        {r.description}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        <span className="font-medium text-gray-700">材料：</span>
                        {r.ingredients?.join('、')}
                      </p>
                      {r.calories !== undefined && (
  <p className="text-sm text-gray-500 mb-4">
    <span className="font-medium text-gray-700">热量：</span>
    {r.calories} kcal
  </p>
)}

                    </div>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {r.categories?.map((c: string) => (
                        <span
                          key={c}
                          className="bg-[#3f4347] text-white px-3 py-1 text-xs font-medium rounded-full shadow-sm tracking-wide"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>
      </div>
    </motion.main>
  )
}
