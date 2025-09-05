"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Shield, ShieldCheck, Trash2, Users } from "lucide-react"
import type { AdminUser } from "@/lib/admin"

interface AdminTableProps {
  admins: AdminUser[]
  currentUserUid: string
  isSuperAdmin: boolean
  loading?: boolean
  onRoleUpdate: (uid: string, newRole: "admin" | "super-admin") => void
  onRemoveAdmin: (uid: string) => void
}

export function AdminTable({
  admins,
  currentUserUid,
  isSuperAdmin,
  loading,
  onRoleUpdate,
  onRemoveAdmin,
}: AdminTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [adminToDelete, setAdminToDelete] = useState<AdminUser | null>(null)

  const handleDeleteClick = (admin: AdminUser) => {
    setAdminToDelete(admin)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (adminToDelete) {
      onRemoveAdmin(adminToDelete.uid)
      setDeleteDialogOpen(false)
      setAdminToDelete(null)
    }
  }

  const getRoleColor = (role: string) => {
    return role === "super-admin"
      ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
      : "bg-blue-100 text-blue-800 hover:bg-blue-100"
  }

  const getRoleIcon = (role: string) => {
    return role === "super-admin" ? ShieldCheck : Shield
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Admin Users ({admins.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No admin users found
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin) => {
                    const RoleIcon = getRoleIcon(admin.role)
                    const isCurrentUser = admin.uid === currentUserUid
                    const canModify = isSuperAdmin && !isCurrentUser

                    return (
                      <TableRow key={admin.uid}>
                        <TableCell>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {admin.displayName || admin.email.split("@")[0]}
                              {isCurrentUser && (
                                <Badge variant="outline" className="text-xs">
                                  You
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{admin.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getRoleColor(admin.role)}>
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {admin.role === "super-admin" ? "Super Admin" : "Admin"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{admin.createdBy || "System"}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          {canModify ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {admin.role === "admin" ? (
                                  <DropdownMenuItem onClick={() => onRoleUpdate(admin.uid, "super-admin")}>
                                    <ShieldCheck className="h-4 w-4 mr-2" />
                                    Promote to Super Admin
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => onRoleUpdate(admin.uid, "admin")}>
                                    <Shield className="h-4 w-4 mr-2" />
                                    Demote to Admin
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleDeleteClick(admin)} className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove Admin
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {isCurrentUser ? "Current User" : "No Actions"}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Admin User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{adminToDelete?.email}</strong> as an admin? This action cannot be
              undone and they will lose access to the admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Admin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
