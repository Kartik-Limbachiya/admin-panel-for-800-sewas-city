import { type NextRequest, NextResponse } from "next/server"
import { getAllApplications, searchApplications } from "@/lib/dynamodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const city = searchParams.get("city")
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let result
    if (search || city || status) {
      result = await searchApplications(search || undefined, city || undefined, status || undefined, limit)
    } else {
      result = await getAllApplications(limit)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
