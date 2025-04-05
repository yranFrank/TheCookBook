import { useContext } from 'react'
import { AuthContext } from '@/components/RootLayoutClient'



export function useAuth() {
  return useContext(AuthContext)
}
