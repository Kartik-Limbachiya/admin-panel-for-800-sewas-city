"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Copy, Key, Mail } from "lucide-react"

export function SetupInstructions() {
  const adminCredentials = {
    email: "admin@sewascity.com",
    password: "Admin123!",
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Admin Setup Required
          </CardTitle>
          <CardDescription>No admin users found. You need to create the first admin account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              <strong>Step 1:</strong> Run the admin setup script in the Scripts section to create the first admin user.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Step 2:</strong> Use these credentials to log in after running the script:
            </AlertDescription>
          </Alert>

          <div className="space-y-3 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="font-mono text-sm">{adminCredentials.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(adminCredentials.email)}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span className="font-mono text-sm">{adminCredentials.password}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(adminCredentials.password)}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Step 3:</strong> After logging in, you can create additional admin users from the Admin Management
              page.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
