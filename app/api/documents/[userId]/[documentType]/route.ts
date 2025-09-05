import { type NextRequest, NextResponse } from "next/server"
import { getDocumentUrl, getDocumentDownloadUrl } from "@/lib/s3"

export async function GET(request: NextRequest, { params }: { params: { userId: string; documentType: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const download = searchParams.get("download") === "true"

    const signedUrl = await getDocumentUrl(params.userId, params.documentType)

    if (!signedUrl) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    const finalUrl = download ? getDocumentDownloadUrl(signedUrl) : signedUrl

    return NextResponse.json({ url: finalUrl })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to get document URL" }, { status: 500 })
  }
}
