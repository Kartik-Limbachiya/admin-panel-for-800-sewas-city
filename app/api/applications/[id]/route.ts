import { type NextRequest, NextResponse } from "next/server"
import { getApplicationById, updateApplicationStatus } from "@/lib/dynamodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const application = await getApplicationById(params.id)

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    await updateApplicationStatus(params.id, status)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to update application status" }, { status: 500 })
  }
}
