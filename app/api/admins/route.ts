import { type NextRequest, NextResponse } from "next/server"
import { getAllAdmins, createAdminUser, checkSuperAdminPermission } from "@/lib/admin"

export async function GET() {
  try {
    const admins = await getAllAdmins()
    return NextResponse.json({ admins })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, role, currentUserUid } = await request.json()

    // Check if current user is super admin
    const isSuperAdmin = await checkSuperAdminPermission(currentUserUid)
    if (!isSuperAdmin) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const result = await createAdminUser(email, password, role, currentUserUid)

    if (result.success) {
      return NextResponse.json({ success: true, uid: result.uid })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 })
  }
}
