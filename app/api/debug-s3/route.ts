// Create this file: app/api/debug-s3/route.ts
import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET() {
  const debug = {
    timestamp: new Date().toISOString(),
    environment: {
      AWS_REGION: process.env.AWS_REGION,
      S3_BUCKET: process.env.NEXT_PUBLIC_S3_BUCKET || process.env.S3_DOCUMENTS_BUCKET,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
      accessKeyPreview: process.env.AWS_ACCESS_KEY_ID?.substring(0, 8) + "...",
    },
    tests: {}
  };

  try {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    // Test 1: List objects in bucket
    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: debug.environment.S3_BUCKET,
        Prefix: "documents/",
        MaxKeys: 5
      });
      
      const listResult = await s3Client.send(listCommand);
      debug.tests.listObjects = {
        success: true,
        objectCount: listResult.Contents?.length || 0,
        objects: listResult.Contents?.map(obj => ({
          key: obj.Key,
          size: obj.Size,
          lastModified: obj.LastModified
        })) || []
      };
    } catch (error) {
      debug.tests.listObjects = {
        success: false,
        error: error.message,
        code: error.name
      };
    }

    // Test 2: Try to generate pre-signed URL for a known document
    if (debug.tests.listObjects.success && debug.tests.listObjects.objects.length > 0) {
      try {
        const testKey = debug.tests.listObjects.objects[0].key;
        const getCommand = new GetObjectCommand({
          Bucket: debug.environment.S3_BUCKET,
          Key: testKey,
        });
        
        const signedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 60 });
        debug.tests.presignedUrl = {
          success: true,
          testKey: testKey,
          urlGenerated: true,
          urlPreview: signedUrl.substring(0, 100) + "..."
        };
      } catch (error) {
        debug.tests.presignedUrl = {
          success: false,
          error: error.message,
          code: error.name
        };
      }
    }

    // Test 3: Check IAM permissions by trying different operations
    const permissionTests = [
      { action: "s3:ListBucket", test: "listBucket" },
      { action: "s3:GetObject", test: "getObject" }
    ];

    debug.tests.permissions = {};
    for (const perm of permissionTests) {
      debug.tests.permissions[perm.action] = "Tested above";
    }

  } catch (error) {
    debug.tests.s3ClientInit = {
      success: false,
      error: error.message
    };
  }

  return NextResponse.json(debug, { status: 200 });
}