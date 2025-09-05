import { type NextRequest, NextResponse } from "next/server"
import { updateAdminRole, removeAdmin, checkSuperAdminPermission } from "@/lib/admin"

export async function PATCH(request: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const { role, currentUserUid } = await request.json()

    // Check if current user is super admin
    const isSuperAdmin = await checkSuperAdminPermission(currentUserUid)
    if (!isSuperAdmin) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Prevent users from modifying their own role
    if (params.uid === currentUserUid) {
      return NextResponse.json({ error: "Cannot modify your own role" }, { status: 400 })
    }

    await updateAdminRole(params.uid, role)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to update admin role" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const { currentUserUid } = await request.json()

    // Check if current user is super admin
    const isSuperAdmin = await checkSuperAdminPermission(currentUserUid)
    if (!isSuperAdmin) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Prevent users from deleting themselves
    if (params.uid === currentUserUid) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 })
    }

    await removeAdmin(params.uid)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to remove admin" }, { status: 500 })
  }
}
