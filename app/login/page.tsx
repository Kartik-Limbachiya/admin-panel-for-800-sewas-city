"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, AlertCircle } from "lucide-react"
import { FirebaseSetupBanner } from "@/components/firebase-setup-banner"
import { SetupInstructions } from "@/components/setup-instructions"
import { CreateAdminButton } from "@/components/create-admin-button"
import { isFirebaseConfigured } from "@/lib/firebase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, user, isAdmin, error: authError } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && isAdmin) {
      router.push("/dashboard")
    }
  }, [user, isAdmin, router])

  useEffect(() => {
    if (authError) {
      setError(authError)
    }
  }, [authError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFirebaseConfigured) {
      setError("Firebase is not configured. Please set up environment variables.")
      return
    }

    setIsLoading(true)
    setError("")

    const result = await login(email, password)

    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error || "Login failed")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-4">
        <FirebaseSetupBanner />

        {isFirebaseConfigured && <SetupInstructions />}

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary rounded-full">
                <Building2 className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">800 SEWAS CITY</CardTitle>
            <CardDescription>Admin Panel Login</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@sewascity.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading || !isFirebaseConfigured}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Admin123!"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || !isFirebaseConfigured}
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isLoading || !isFirebaseConfigured}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {isFirebaseConfigured && (
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground text-center">
                  <p>
                    <strong>Default Admin:</strong> admin@sewascity.com
                  </p>
                  <p>
                    <strong>Password:</strong> Admin123!
                  </p>
                  <p className="text-xs mt-1">Create the admin user if this is your first time</p>
                </div>
                <CreateAdminButton />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
