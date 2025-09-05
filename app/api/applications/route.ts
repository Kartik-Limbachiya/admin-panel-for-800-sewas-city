// ADMIN SIDE
// File: admin-panel-for-800-sewas-city/app/api/applications/route.ts

import { NextResponse } from "next/server";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export async function GET() {
  try {
    // Fetch all records from DynamoDB
    const command = new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE!, // Same table as customer website
    });

    const response = await client.send(command);

    // Convert DynamoDB format -> normal JSON
    const items =
      response.Items?.map((item) => ({
        id: item.id.S,
        createdAt: item.createdAt.S,
        fullName: item.fullName?.S,
        fatherName: item.fatherName?.S,
        dateOfBirth: item.dateOfBirth?.S,
        gender: item.gender?.S,
        mobileNumber: item.mobileNumber?.S,
        emailAddress: item.emailAddress?.S,
        permanentAddress: item.permanentAddress?.S,
        currentAddress: item.currentAddress?.S,
        occupation: item.occupation?.S,
        monthlyIncome: item.monthlyIncome?.S,
        housingPreference: item.housingPreference?.S,
        preferredCity: item.preferredCity?.S,
        documents: item.documents ? JSON.parse(item.documents.S ?? "{}") : {},
        legalAcknowledgment: item.legalAcknowledgment?.BOOL ?? false,
        termsAgreement: item.termsAgreement?.BOOL ?? false,
        marketingConsent: item.marketingConsent?.BOOL ?? false,
      })) || [];

    return NextResponse.json({ success: true, applications: items });
  } catch (error: any) {
    console.error("Admin fetch error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
