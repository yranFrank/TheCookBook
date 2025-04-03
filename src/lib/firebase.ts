import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage' // ✅ 添加这一行

const firebaseConfig = {
  apiKey: "AIzaSyCa3zCBE2IEjBIKYijBdxfHt5dZILc9Bp0",
  authDomain: "whatsfordinner-6918d.firebaseapp.com",
  projectId: "whatsfordinner-6918d",
  storageBucket: "whatsfordinner-6918d.appspot.com",
  messagingSenderId: "476611465785",
  appId: "1:476611465785:web:e548934f281b0cc233b3e8"
}

// 初始化 Firebase App
const app = initializeApp(firebaseConfig)

// ✅ 导出实例
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app) // ✅ 添加这一行
