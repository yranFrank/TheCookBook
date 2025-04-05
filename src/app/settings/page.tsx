'use client'

import { useState, useEffect } from 'react'
import { db, auth } from '@/lib/firebase'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
} from 'firebase/firestore'
import { updatePassword, updateEmail } from 'firebase/auth'
import { v4 as uuidv4 } from 'uuid'

export default function SettingsPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [inviteInput, setInviteInput] = useState('')
  const [teamUsers, setTeamUsers] = useState<string[]>([])
  const [message, setMessage] = useState('')

  const user = auth.currentUser

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

      const userRef = doc(db, 'users', user.uid)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const data = userSnap.data()
        setUsername(data.username || '')
        setEmail(user.email || '')

        // 设置或生成邀请码
        if (data.inviteCode) {
          setInviteCode(data.inviteCode)
          fetchTeamMembers(data.inviteCode)
        } else {
          const newCode = uuidv4().slice(0, 8)
          await updateDoc(userRef, { inviteCode: newCode })
          setInviteCode(newCode)
          fetchTeamMembers(newCode)
        }
      }
    }

    const fetchTeamMembers = async (code: string) => {
      const snapshot = await getDocs(collection(db, 'users'))
      const team = snapshot.docs
        .filter(doc => doc.data().inviteCode === code)
        .map(doc => doc.data().username || doc.data().email || '未知用户')
      setTeamUsers(team)
    }

    fetchUserData()
  }, [user])

  const handleSave = async () => {
    if (!user) return
    const userRef = doc(db, 'users', user.uid)

    await setDoc(userRef, {
      username,
      inviteCode,
      email: user.email,
    }, { merge: true })

    if (newEmail) {
      try {
        await updateEmail(user, newEmail)
        setMessage('✅ 邮箱已更新')
      } catch (err) {
        setMessage('❌ 邮箱更新失败')
      }
    }

    if (newPassword) {
      try {
        await updatePassword(user, newPassword)
        setMessage('✅ 密码已更新')
      } catch (err) {
        setMessage('❌ 密码更新失败')
      }
    }

    setMessage('✅ 设置已保存')
  }

  const handleInvite = async () => {
    setMessage('')
    const usersRef = collection(db, 'users')
    const snapshot = await getDocs(usersRef)

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data()
      if (data.email === inviteInput || data.username === inviteInput) {
        await updateDoc(doc(db, 'users', docSnap.id), {
          inviteCode,
        })
        setMessage(`✅ 成功邀请 ${inviteInput} 加入团队`)
        return
      }
    }

    setMessage('❌ 用户不存在或未注册')
  }

  const handleJoinTeam = async () => {
    if (!inviteInput) return
    const usersRef = collection(db, 'users')
    const snapshot = await getDocs(usersRef)

    const matched = snapshot.docs.find(doc => doc.data().inviteCode === inviteInput)

    if (matched && user) {
      await updateDoc(doc(db, 'users', user.uid), {
        inviteCode: inviteInput,
      })
      setInviteCode(inviteInput)
      setMessage('✅ 已加入团队')
    } else {
      setMessage('❌ 无效的邀请码')
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-6">⚙️ 账户设置</h1>

      <div className="space-y-6">
        <div>
          <label className="font-medium">用户名</label>
          <input
            type="text"
            className="block w-full border px-4 py-2 rounded mt-1"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="font-medium">当前邮箱</label>
          <input
            type="email"
            disabled
            className="block w-full border px-4 py-2 rounded mt-1 bg-gray-100"
            value={email}
          />
        </div>

        <div>
          <label className="font-medium">新邮箱（可选）</label>
          <input
            type="email"
            className="block w-full border px-4 py-2 rounded mt-1"
            placeholder="填写新邮箱以更新"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="font-medium">新密码（可选）</label>
          <input
            type="password"
            className="block w-full border px-4 py-2 rounded mt-1"
            placeholder="输入新密码"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="font-medium">我的邀请码（用于邀请他人）</label>
          <input
            type="text"
            disabled
            className="block w-full border px-4 py-2 rounded mt-1 bg-gray-100"
            value={inviteCode}
          />
        </div>

        <div>
          <label className="font-medium">邀请他人加入团队</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              placeholder="输入对方邮箱或用户名"
              className="flex-1 border px-4 py-2 rounded"
              value={inviteInput}
              onChange={e => setInviteInput(e.target.value)}
            />
            <button
              onClick={handleInvite}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              发送邀请
            </button>
          </div>
        </div>

        <div>
          <label className="font-medium">加入他人团队（输入邀请码）</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              placeholder="填写邀请码"
              className="flex-1 border px-4 py-2 rounded"
              value={inviteInput}
              onChange={e => setInviteInput(e.target.value)}
            />
            <button
              onClick={handleJoinTeam}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              加入团队
            </button>
          </div>
        </div>

        <div>
          <label className="font-medium">已关联用户</label>
          <ul className="list-disc list-inside mt-2 text-sm text-gray-700">
            {teamUsers.map((u, idx) => (
              <li key={idx}>{u}</li>
            ))}
          </ul>
        </div>

        {message && <p className="text-green-600 font-medium mt-2">{message}</p>}

        <div className="text-right mt-6">
          <button
            onClick={handleSave}
            className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
          >
            保存设置
          </button>
        </div>
      </div>
    </main>
  )
}
