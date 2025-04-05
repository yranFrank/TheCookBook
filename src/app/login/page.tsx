'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { loginWithGoogle, loginWithEmail, registerWithEmail } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { doc, setDoc, getDoc, getDocs, collection, updateDoc } from 'firebase/firestore'

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const redirectTo = params.get('redirect') || '/home'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [message, setMessage] = useState('')

  const generateInviteCode = () => Math.random().toString(36).substring(2, 8).toUpperCase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      if (isRegistering) {
        const userCred = await registerWithEmail(email, password)
        const user = userCred.user
        const code = inviteCode || generateInviteCode()

        await setDoc(doc(db, 'users', user.uid), {
          username,
          email,
          inviteCode: code,
          joinedFrom: joinCode || null,
        })

        // 如果填写了他人邀请码，加入团队
        if (joinCode) {
          const usersSnapshot = await getDocs(collection(db, 'users'))
          for (const u of usersSnapshot.docs) {
            if (u.data().inviteCode === joinCode) {
              await updateDoc(doc(db, 'users', user.uid), {
                inviteCode: joinCode,
                joinedFrom: joinCode,
              })
              break
            }
          }
        }

        router.push(redirectTo)
      } else {
        await loginWithEmail(email, password)
        router.push(redirectTo)
      }
    } catch (err) {
      setMessage(`❌ 登录失败: ${(err as any).message}`)
    }
  }

  const handleGoogle = async () => {
    try {
      const result = await loginWithGoogle()
      const user = result.user
      const userDocRef = doc(db, 'users', user.uid)
      const snap = await getDoc(userDocRef)

      if (!snap.exists()) {
        // 跳转到设置资料页面
        router.push('/setup-profile')
      } else {
        router.push(redirectTo)
      }
    } catch (err) {
      alert('Google 登录失败：' + (err as any).message)
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {isRegistering ? '注册账户' : '登录'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          {isRegistering && (
            <>
              <input
                type="text"
                placeholder="用户名（必填）"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="你希望用于邀请他人的邀请码（可留空自动生成）"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="加入团队的邀请码（可选）"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
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

        {message && (
          <p className="text-center mt-4 text-sm text-red-600 font-medium">{message}</p>
        )}
      </motion.div>
    </main>
  )
}
