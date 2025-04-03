// src/lib/auth.ts
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "./firebase"

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider)
}

export const loginWithEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const registerWithEmail = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password)
}
