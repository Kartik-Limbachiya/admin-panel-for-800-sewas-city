import { NextResponse } from "next/server"
import { getApplicationStats } from "@/lib/dynamodb"

export async function GET() {
  try {
    const stats = await getApplicationStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
