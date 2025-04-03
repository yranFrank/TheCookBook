'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import GlobalLoading from './GlobalLoading'

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 700)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <>
      <Navbar />
      {loading && <GlobalLoading />}
      {!loading && <main>{children}</main>}
    </>
  )
}
