"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AdminTable } from "@/components/admin-table"
import { AddAdminDialog } from "@/components/add-admin-dialog"
import { useAuth } from "@/hooks/use-auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"
import type { AdminUser } from "@/lib/admin"

export default function AdminsPage() {
  const { user } = useAuth()
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  useEffect(() => {
    async function fetchAdmins() {
      try {
        const response = await fetch("/api/admins")
        const data = await response.json()
        setAdmins(data.admins || [])

        // Check if current user is super admin
        const currentUserAdmin = data.admins?.find((admin: AdminUser) => admin.uid === user?.uid)
        setIsSuperAdmin(currentUserAdmin?.role === "super-admin")
      } catch (error) {
        console.error("Error fetching admins:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchAdmins()
    }
  }, [user])

  const handleAddAdmin = async (email: string, password: string, role: "admin" | "super-admin") => {
    try {
      const response = await fetch("/api/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role,
          currentUserUid: user?.uid,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Refresh admin list
        const refreshResponse = await fetch("/api/admins")
        const refreshData = await refreshResponse.json()
        setAdmins(refreshData.admins || [])
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error("Error adding admin:", error)
      return { success: false, error: "Failed to add admin" }
    }
  }

  const handleRoleUpdate = async (uid: string, newRole: "admin" | "super-admin") => {
    try {
      const response = await fetch(`/api/admins/${uid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: newRole,
          currentUserUid: user?.uid,
        }),
      })

      if (response.ok) {
        // Update local state
        setAdmins((prev) => prev.map((admin) => (admin.uid === uid ? { ...admin, role: newRole } : admin)))
      } else {
        const data = await response.json()
        alert(data.error || "Failed to update role")
      }
    } catch (error) {
      console.error("Error updating role:", error)
      alert("Failed to update role")
    }
  }

  const handleRemoveAdmin = async (uid: string) => {
    try {
      const response = await fetch(`/api/admins/${uid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUserUid: user?.uid,
        }),
      })

      if (response.ok) {
        // Remove from local state
        setAdmins((prev) => prev.filter((admin) => admin.uid !== uid))
      } else {
        const data = await response.json()
        alert(data.error || "Failed to remove admin")
      }
    } catch (error) {
      console.error("Error removing admin:", error)
      alert("Failed to remove admin")
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Management</h1>
            <p className="text-muted-foreground mt-2">Manage admin users and their permissions</p>
          </div>
          {isSuperAdmin && <AddAdminDialog onAddAdmin={handleAddAdmin} />}
        </div>

        {/* Permission Notice */}
        {!isSuperAdmin && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              You have admin access but cannot manage other admin users. Only super admins can add, remove, or modify
              admin accounts.
            </AlertDescription>
          </Alert>
        )}

        {/* Admin Table */}
        <AdminTable
          admins={admins}
          currentUserUid={user?.uid || ""}
          isSuperAdmin={isSuperAdmin}
          loading={loading}
          onRoleUpdate={handleRoleUpdate}
          onRemoveAdmin={handleRemoveAdmin}
        />
      </div>
    </DashboardLayout>
  )
}
