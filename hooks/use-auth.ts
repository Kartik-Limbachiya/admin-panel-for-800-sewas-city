"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { checkUserRole, type AdminUser } from "@/lib/auth"
import { isFirebaseConfigured } from "@/lib/firebase"

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setError("Firebase configuration required")
      setLoading(false)
      return
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          if (firebaseUser) {
            const role = await checkUserRole(firebaseUser)
            setUser({ ...firebaseUser, role } as AdminUser)
          } else {
            setUser(null)
          }
          setError(null)
        } catch (err: any) {
          console.error("Error checking user role:", err)
          setError("Failed to verify user permissions")
          setUser(null)
        }
        setLoading(false)
      })

      return unsubscribe
    } catch (err: any) {
      console.error("Firebase auth error:", err)
      setError("Firebase authentication error")
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      return { success: false, error: "Firebase is not configured. Please set up environment variables." }
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const role = await checkUserRole(result.user)

      if (role !== "admin") {
        await signOut(auth)
        throw new Error("Access denied. Admin privileges required.")
      }

      setError(null)
      return { success: true }
    } catch (error: any) {
      let errorMessage = error.message
      if (error.code === "auth/invalid-api-key") {
        errorMessage = "Firebase configuration error. Please contact support."
      } else if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password."
      }

      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    if (!isFirebaseConfigured) {
      return { success: false, error: "Firebase not configured" }
    }

    try {
      await signOut(auth)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAdmin: user?.role === "admin",
  }
}
