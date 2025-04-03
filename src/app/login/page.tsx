'use client'

import { useState } from 'react'
import { loginWithGoogle, loginWithEmail, registerWithEmail } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isRegistering) {
        await registerWithEmail(email, password)
      } else {
        await loginWithEmail(email, password)
      }
      router.push('/home')
    } catch (err) {
      alert("登录失败：" + (err as any).message)
    }
  }

  const handleGoogle = async () => {
    try {
      await loginWithGoogle()
      router.push('/home')
    } catch (err) {
      alert("Google 登录失败：" + (err as any).message)
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">{isRegistering ? '注册账户' : '登录'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email" placeholder="邮箱"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
          <input
            type="password" placeholder="密码"
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
          <button type="submit" className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
            {isRegistering ? '注册' : '登录'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            className="text-sm text-blue-500 hover:underline"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? '已有账户？去登录' : '没有账户？去注册'}
          </button>
        </div>

        <div className="mt-6">
          <button
            onClick={handleGoogle}
            className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            使用 Google 登录
          </button>
        </div>
      </motion.div>
    </main>
  )
}
