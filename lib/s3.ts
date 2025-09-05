import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3Client, S3_BUCKET } from "./aws-config"

export async function getDocumentUrl(userId: string, documentType: string): Promise<string | null> {
  try {
    const key = `documents/${userId}/${documentType}`

    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    })

    // Generate a signed URL that expires in 1 hour
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    return signedUrl
  } catch (error) {
    console.error(`Error generating signed URL for ${documentType}:`, error)
    return null
  }
}

export async function getDocumentUrls(userId: string, documents: Record<string, string>) {
  const urls: Record<string, string | null> = {}

  for (const [docType, docPath] of Object.entries(documents)) {
    if (docPath) {
      urls[docType] = await getDocumentUrl(userId, docType)
    }
  }

  return urls
}

export function getDocumentDownloadUrl(signedUrl: string): string {
  // Add response-content-disposition to force download
  const url = new URL(signedUrl)
  url.searchParams.set("response-content-disposition", "attachment")
  return url.toString()
}
