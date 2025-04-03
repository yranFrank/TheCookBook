'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaFolderOpen, FaUtensils, FaSave, FaFire } from 'react-icons/fa'

export default function RecipeDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [recipe, setRecipe] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    ingredients: [] as string[],
    categories: [] as string[],
    calories: 0,
  })

  const [allCategories, setAllCategories] = useState<string[]>([])
  const [newCategoryInput, setNewCategoryInput] = useState('')

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      const docRef = doc(db, 'recipes', id as string)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        setRecipe(data)
        setForm({
          name: data.name || '',
          description: data.description || '',
          ingredients: data.ingredients || [],
          categories: data.categories || [],
          calories: data.calories || 0,
        })
      }

      const allDocs = await getDocs(collection(db, 'recipes'))
      const categorySet = new Set<string>()
      allDocs.forEach(doc => {
        const recipe = doc.data()
        recipe.categories?.forEach((c: string) => categorySet.add(c))
      })
      setAllCategories([...categorySet])

      setLoading(false)
    }

    fetchData()
  }, [id])

  const handleChange = (field: string, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: 'ingredients' | 'categories', value: string, index: number) => {
    const updated = [...form[field]]
    updated[index] = value
    setForm(prev => ({ ...prev, [field]: updated }))
  }

  const addToArray = (field: 'ingredients' | 'categories', value: string = '') => {
    setForm(prev => ({ ...prev, [field]: [...prev[field], value] }))
  }

  const removeFromArray = (field: 'ingredients' | 'categories', index: number) => {
    const updated = [...form[field]]
    updated.splice(index, 1)
    setForm(prev => ({ ...prev, [field]: updated }))
  }

  const addSelectedCategory = (cat: string) => {
    if (!form.categories.includes(cat)) {
      setForm(prev => ({ ...prev, categories: [...prev.categories, cat] }))
    }
  }

  const saveChanges = async () => {
    await updateDoc(doc(db, 'recipes', id as string), form)
    setRecipe(form)
    setIsEditing(false)
    alert('菜谱已更新 ✅')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">加载中...</div>
  if (!recipe) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">没有找到菜谱 😢</div>

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f0e0c8] to-[#f7f2ea] px-6 py-20 text-black">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-[36px] shadow-2xl border border-black/10 transition-all duration-500">
        <Link href="/add-recipe">
          <div className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 text-sm mb-6 px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-all w-fit">
            <FaArrowLeft />
            返回菜谱列表
          </div>
        </Link>

        <div className="flex justify-between items-center mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900"
          >
            {isEditing ? (
              <input
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                className="text-3xl border-b border-gray-300 px-2 py-1 outline-none"
              />
            ) : form.name}
          </motion.h1>

          <button
            onClick={() => (isEditing ? saveChanges() : setIsEditing(true))}
            className="flex items-center gap-2 text-white bg-black px-4 py-2 rounded-full hover:bg-gray-800 transition"
          >
            <FaSave />
            {isEditing ? '保存' : '编辑'}
          </button>
        </div>

        {/* 做法 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-1">做法：</h2>
          {isEditing ? (
            <textarea
              className="w-full border rounded-lg px-4 py-2 text-base"
              rows={4}
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
            />
          ) : (
            <p className="text-gray-800 text-lg leading-relaxed">{form.description}</p>
          )}
        </div>

        {/* 热量 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-1 flex items-center gap-2"><FaFire /> 热量（单位 kcal）：</h2>
          {isEditing ? (
            <input
              type="number"
              value={form.calories}
              onChange={e => handleChange('calories', parseInt(e.target.value))}
              className="w-full border px-4 py-2 rounded text-base"
            />
          ) : (
            <p className="text-lg">{form.calories || 0} kcal</p>
          )}
        </div>

        {/* 材料 */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <FaUtensils className="text-gray-600" /> 材料
          </h2>
          {isEditing ? (
            <>
              {form.ingredients.map((item, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <input
                    value={item}
                    onChange={e => handleArrayChange('ingredients', e.target.value, i)}
                    className="flex-1 border px-3 py-1 rounded"
                  />
                  <button onClick={() => removeFromArray('ingredients', i)} className="text-red-500">删除</button>
                </div>
              ))}
              <button onClick={() => addToArray('ingredients')} className="text-blue-600 mt-2">+ 添加材料</button>
            </>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-base pl-2">
              {form.ingredients.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          )}
        </div>

        {/* 分类 */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <FaFolderOpen className="text-yellow-600" /> 分类
          </h3>
          {isEditing ? (
            <>
              <div className="flex flex-wrap gap-3 mb-4">
                {form.categories.map((cat, i) => (
                  <span key={cat} className="bg-black text-white text-sm px-4 py-1 rounded-full flex items-center gap-2">
                    {cat}
                    <button onClick={() => removeFromArray('categories', i)} className="text-red-400">×</button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 flex-wrap mb-4">
                {allCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => addSelectedCategory(cat)}
                    className="text-sm px-3 py-1 border border-gray-400 rounded-full hover:bg-gray-200 transition"
                  >
                    + {cat}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryInput}
                  onChange={e => setNewCategoryInput(e.target.value)}
                  placeholder="输入新分类"
                  className="border px-3 py-1 rounded w-full"
                />
                <button
                  onClick={() => {
                    if (newCategoryInput.trim()) {
                      addToArray('categories', newCategoryInput.trim())
                      setNewCategoryInput('')
                    }
                  }}
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                >
                  添加
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-wrap gap-3">
              {form.categories.map((cat: string) => (
                <span
                  key={cat}
                  className="bg-[#3f4347] text-white text-sm font-medium px-4 py-1 rounded-full shadow-md tracking-wide"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
