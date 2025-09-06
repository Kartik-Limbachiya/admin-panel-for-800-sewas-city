// File: admin-panel/app/api/documents/[userId]/[documentType]/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,  // sewas-admin-user credentials
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function GET(
  request: NextRequest, 
  { params }: { params: { userId: string; documentType: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const download = searchParams.get("download") === "true"

    // First, get the document URL from DynamoDB to find the actual S3 key
    const applicationResponse = await fetch(`${request.nextUrl.origin}/api/applications?search=${params.userId}`)
    
    if (!applicationResponse.ok) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const applicationData = await applicationResponse.json()
    const application = applicationData.applications?.find((app: any) => app.id === params.userId)
    
    if (!application || !application.documents || !application.documents[params.documentType]) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Extract S3 key from the stored URL
    const documentUrl = application.documents[params.documentType]
    const s3Key = extractS3KeyFromUrl(documentUrl)
    
    if (!s3Key) {
      return NextResponse.json({ error: "Invalid document URL" }, { status: 400 })
    }

    // Generate pre-signed URL for secure access
    const command = new GetObjectCommand({
      Bucket: process.env.S3_DOCUMENTS_BUCKET!,
      Key: s3Key,
      ...(download && {
        ResponseContentDisposition: `attachment; filename="${params.documentType}-${params.userId}"`
      })
    })

    const signedUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 3600 // 1 hour
    })

    return NextResponse.json({ 
      url: signedUrl,
      expiresIn: 3600,
      documentType: params.documentType,
      userId: params.userId
    })

  } catch (error) {
    console.error("Document access error:", error)
    return NextResponse.json({ error: "Failed to generate document access URL" }, { status: 500 })
  }
}

// Helper function to extract S3 key from full URL
function extractS3KeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    // Remove leading slash from pathname to get the key
    return urlObj.pathname.slice(1)
  } catch (error) {
    console.error("Error parsing S3 URL:", error)
    return null
  }
}