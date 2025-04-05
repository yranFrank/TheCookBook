// app/setup-profile/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { motion } from 'framer-motion'

export default function SetupProfilePage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const user = auth.currentUser

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return
      const userRef = doc(db, 'users', user.uid)
      const snap = await getDoc(userRef)
      if (snap.exists() && snap.data().username) {
        router.push('/home') // 用户已设置，跳转主页
      } else {
        setLoading(false) // 显示表单
      }
    }

    checkProfile()
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const finalInviteCode = inviteCode || Math.random().toString(36).substring(2, 8).toUpperCase()
    const userRef = doc(db, 'users', user.uid)

    try {
      await setDoc(userRef, {
        email: user.email,
        username,
        inviteCode: finalInviteCode,
      }, { merge: true })

      router.push('/home')
    } catch (err) {
      setMessage('❌ 资料保存失败')
    }
  }

  if (loading) {
    return <p className="p-6 text-center text-gray-500">加载中...</p>
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">👋 欢迎首次登录</h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          请填写下方资料以完成账户设置
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="用户名（必填）"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="邀请码（可留空自动生成）"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            完成设置
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-red-600 font-medium">{message}</p>
        )}
      </motion.div>
    </main>
  )
}
