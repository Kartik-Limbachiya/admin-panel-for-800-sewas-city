import type { User } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "./firebase"

export interface AdminUser extends User {
  role?: string
}

export async function checkUserRole(user: User): Promise<string | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid))
    if (userDoc.exists()) {
      const userData = userDoc.data()
      return userData.role || null
    }
    return null
  } catch (error) {
    console.error("Error checking user role:", error)
    return null
  }
}

export function isAdmin(role: string | null): boolean {
  return role === "admin"
}
