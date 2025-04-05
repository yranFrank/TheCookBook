// src/lib/auth.ts
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from './firebase'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
// src/lib/auth.ts

import { getAuth } from 'firebase/auth'

// ✅ 获取当前用户（同步函数）
export function getCurrentUser() {
  const auth = getAuth()
  return auth.currentUser
}


// ✅ 设置 token 保存函数
export const saveAuthToken = async () => {
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    Cookies.set('token', token, { expires: 7 })
  }
}

// ✅ 清除 cookie 并登出
export const logout = async () => {
  await signOut(auth)
  Cookies.remove('token')
}

// ✅ 注册
export const registerWithEmail = async (email: string, password: string) => {
  const res = await createUserWithEmailAndPassword(auth, email, password)
  await saveAuthToken()
  return res
}

// ✅ 登录
export const loginWithEmail = async (email: string, password: string) => {
  const res = await signInWithEmailAndPassword(auth, email, password)
  await saveAuthToken()
  return res
}

// ✅ Google 登录
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  const res = await signInWithPopup(auth, provider)
  await saveAuthToken()
  return res
}

// ✅ 获取当前用户 Hook
export const useAuthUser = () => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsub()
  }, [])

  return user
}
