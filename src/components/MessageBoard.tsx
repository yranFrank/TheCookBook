'use client'

import { useState, useEffect } from 'react'
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  limit,
  where,
  getDoc,
  doc
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/hooks/useAuth'
import { motion } from 'framer-motion'

export default function MessageBoard() {
  const { user, loading } = useAuth()
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [inviteCode, setInviteCode] = useState<string | null>(null)

  useEffect(() => {
    const fetchInviteCode = async () => {
      if (!user) return
      const userRef = doc(db, 'users', user.uid)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        const data = userSnap.data()
        setInviteCode(data.inviteCode || null)
      }
    }
    fetchInviteCode()
  }, [user])

  useEffect(() => {
    if (!inviteCode) return

    const q = query(
      collection(db, 'messages'),
      where('inviteCode', '==', inviteCode),
      orderBy('createdAt', 'desc'),
      limit(5)
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      setMessages(data)
    })

    return () => unsubscribe()
  }, [inviteCode])

  const handleSubmit = async () => {
    if (!user || !message.trim() || !inviteCode) return
    setSending(true)
    try {
      await addDoc(collection(db, 'messages'), {
        text: message,
        createdAt: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email || null,
        inviteCode: inviteCode,
      })
      setMessage('')
    } finally {
      setSending(false)
    }
  }

  const formatTime = (timestamp: Timestamp) => {
    const date = timestamp.toDate()
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  return (
    <section className="bg-[#c2a87a] py-24 px-6 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-5xl border border-black/10 rounded-[36px] bg-[#f0e0c8] shadow-[inset_0_0_30px_rgba(0,0,0,0.05)] p-10 md:p-16">
        <h2 className="text-4xl md:text-6xl font-light text-black mb-12 leading-snug tracking-wide">
          留言板 ❤️
        </h2>

        {!user && !loading && (
          <div className="text-red-500 text-lg mb-4">
            👉 请先登录才能发送留言
          </div>
        )}

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder={user ? "今晚吃什么好呢..." : "请登录后再留言..."}
          disabled={!user}
          className={`w-full text-2xl p-6 bg-white border border-black/10 rounded-3xl resize-none focus:outline-none focus:ring-2 placeholder:text-gray-400
            ${!user ? 'opacity-50 cursor-not-allowed' : 'focus:ring-black/20'}`}
        />

        <button
          onClick={handleSubmit}
          disabled={!user || sending}
          className={`mt-6 w-full md:w-auto px-8 py-4 text-xl font-medium rounded-full transition
            ${!user || sending
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-black hover:bg-gray-800 text-white'
            }`}
        >
          {sending ? '发送中...' : '发送留言'}
        </button>

        <hr className="my-12 border-black/20" />

        <div className="space-y-6">
          <h3 className="text-3xl font-light text-black mb-4">她的留言</h3>
          {messages.length === 0 ? (
            <p className="text-gray-500 text-lg">暂时还没有留言，快写一条吧！</p>
          ) : (
            messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-black/10 rounded-3xl px-6 py-4 text-xl text-black/90 shadow-sm"
              >
                <p>{msg.text}</p>
                {msg.createdAt && (
                  <p className="text-right text-sm text-gray-500 mt-2">
                    {formatTime(msg.createdAt)}
                  </p>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
