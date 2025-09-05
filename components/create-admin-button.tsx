"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Loader2 } from "lucide-react"

export function CreateAdminButton() {
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState("")

  const createAdmin = async () => {
    setIsCreating(true)
    setMessage("")

    try {
      const adminEmail = "admin@sewascity.com"
      const adminPassword = "Admin123!"

      // Create the user account
      const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword)
      const user = userCredential.user

      // Add admin role to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: adminEmail,
        role: "admin",
        createdAt: new Date().toISOString(),
        name: "System Administrator",
      })

      setMessage("✅ Admin user created! You can now log in with the credentials above.")
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setMessage("✅ Admin user already exists! You can log in with the credentials above.")
      } else {
        setMessage(`❌ Error: ${error.message}`)
      }
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={createAdmin} disabled={isCreating} variant="outline" className="w-full bg-transparent">
        {isCreating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Admin...
          </>
        ) : (
          "Create Admin User"
        )}
      </Button>
      {message && <p className={`text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>{message}</p>}
    </div>
  )
}
