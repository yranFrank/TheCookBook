'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, createContext, ReactNode } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'

import Navbar from './Navbar'
import GlobalLoading from './GlobalLoading'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// ✅ 创建 AuthContext
export const AuthContext = createContext<{ user: User | null, loading: boolean }>({
  user: null,
  loading: true,
})

export default function RootLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [loadingPage, setLoadingPage] = useState(false) // 页面切换 loading
  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true) // Firebase auth loading

  // ✅ 页面路径变化时 loading
  useEffect(() => {
    setLoadingPage(true)
    const timer = setTimeout(() => setLoadingPage(false), 700)
    return () => clearTimeout(timer)
  }, [pathname])

  // ✅ Firebase 登录状态监听
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        const userData = userDoc.exists() ? userDoc.data() : {}
    
        // 强制附加 username 到 user 对象上
        setUser({
          ...firebaseUser,
          username: userData.username || '匿名用户',
        } as any)
      } else {
        setUser(null)
      }
      setLoadingUser(false)
    })
    
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading: loadingUser }}>
      <Navbar />
      {loadingPage && <GlobalLoading />}
      {!loadingPage && <main>{children}</main>}
    </AuthContext.Provider>
  )
}
