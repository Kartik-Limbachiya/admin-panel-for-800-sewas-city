const hasValidCredentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY

let dynamoDb: any = null
let s3Client: any = null

// Only import and initialize AWS SDK when credentials are available
if (hasValidCredentials) {
  try {
    const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
    const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb")
    const { S3Client } = require("@aws-sdk/client-s3")

    const dynamoClient = new DynamoDBClient({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })

    dynamoDb = DynamoDBDocumentClient.from(dynamoClient)

    s3Client = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })

    console.log("[v0] AWS SDK initialized successfully")
  } catch (error) {
    console.error("[v0] Failed to initialize AWS SDK:", error)
    dynamoDb = null
    s3Client = null
  }
} else {
  console.log("[v0] AWS credentials not found, using mock mode")
}

export { dynamoDb, s3Client }

export const APPLICATIONS_TABLE = process.env.DYNAMODB_APPLICATIONS_TABLE || "housing-applications"
export const S3_BUCKET = process.env.S3_DOCUMENTS_BUCKET || "sewas-city-documents"
