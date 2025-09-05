import { NextResponse } from "next/server";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const createdAt = searchParams.get("createdAt");

    if (!createdAt) {
      return NextResponse.json(
        { success: false, message: "createdAt query param is required" },
        { status: 400 }
      );
    }

    const command = new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE!,
      Key: {
        id: { S: params.id },
        createdAt: { S: createdAt }, // ✅ include sort key
      },
    });

    const response = await client.send(command);

    if (!response.Item) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    const item = response.Item;
    const application = {
      id: item.id.S,
      createdAt: item.createdAt.S,
      fullName: item.fullName?.S,
      fatherName: item.fatherName?.S,
      emailAddress: item.emailAddress?.S,
      mobileNumber: item.mobileNumber?.S,
      preferredCity: item.preferredCity?.S,
      housingPreference: item.housingPreference?.S,
      documents: item.documents?.M
        ? Object.fromEntries(
            Object.entries(item.documents.M).map(([k, v]) => [k, (v as any).S])
          )
        : {},
      legalAcknowledgment: item.legalAcknowledgment?.BOOL ?? false,
      termsAgreement: item.termsAgreement?.BOOL ?? false,
      marketingConsent: item.marketingConsent?.BOOL ?? false,
    };

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error("Admin detail fetch error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
