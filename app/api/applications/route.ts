// // ADMIN SIDE
// // File: admin-panel-for-800-sewas-city/app/api/applications/route.ts

// import { NextResponse } from "next/server";
// import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

// const client = new DynamoDBClient({ region: process.env.AWS_REGION });

// export async function GET() {
//   try {
//     // Fetch all records from DynamoDB
//     const command = new ScanCommand({
//       TableName: process.env.DYNAMODB_TABLE!, // Same table as customer website
//     });

//     const response = await client.send(command);

//     // Convert DynamoDB format -> normal JSON
//     const items =
//       response.Items?.map((item) => ({
//         id: item.id.S,
//         createdAt: item.createdAt.S,
//         fullName: item.fullName?.S,
//         fatherName: item.fatherName?.S,
//         dateOfBirth: item.dateOfBirth?.S,
//         gender: item.gender?.S,
//         mobileNumber: item.mobileNumber?.S,
//         emailAddress: item.emailAddress?.S,
//         permanentAddress: item.permanentAddress?.S,
//         currentAddress: item.currentAddress?.S,
//         occupation: item.occupation?.S,
//         monthlyIncome: item.monthlyIncome?.S,
//         housingPreference: item.housingPreference?.S,
//         preferredCity: item.preferredCity?.S,
//         documents: item.documents ? JSON.parse(item.documents.S ?? "{}") : {},
//         legalAcknowledgment: item.legalAcknowledgment?.BOOL ?? false,
//         termsAgreement: item.termsAgreement?.BOOL ?? false,
//         marketingConsent: item.marketingConsent?.BOOL ?? false,
//       })) || [];

//     return NextResponse.json({ success: true, applications: items });
//   } catch (error: any) {
//     console.error("Admin fetch error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

// Fix 2: Update the applications list API as well
// File: app/api/applications/route.ts

import { NextResponse } from "next/server";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export async function GET() {
  try {
    const command = new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE!,
    });

    const response = await client.send(command);

    const items =
      response.Items?.map((item) => {
        // ✅ FIXED: Properly handle documents parsing
        let documents = {};
        if (item.documents?.M) {
          documents = Object.fromEntries(
            Object.entries(item.documents.M).map(([k, v]) => [k, (v as any).S])
          );
        } else if (item.documents?.S) {
          try {
            documents = JSON.parse(item.documents.S);
          } catch (e) {
            documents = {};
          }
        }

        return {
          id: item.id.S,
          createdAt: item.createdAt.S,
          fullName: item.fullName?.S || "",
          fatherName: item.fatherName?.S || "",
          dateOfBirth: item.dateOfBirth?.S || "", // ✅ FIXED
          gender: item.gender?.S || "", // ✅ FIXED
          mobileNumber: item.mobileNumber?.S || "",
          emailAddress: item.emailAddress?.S || "",
          permanentAddress: item.permanentAddress?.S || "", // ✅ FIXED
          currentAddress: item.currentAddress?.S || "", // ✅ FIXED
          occupation: item.occupation?.S || "", // ✅ FIXED
          monthlyIncome: item.monthlyIncome?.S || "", // ✅ FIXED
          housingPreference: item.housingPreference?.S || "",
          preferredCity: item.preferredCity?.S || "",
          documents, // ✅ FIXED
          legalAcknowledgment: item.legalAcknowledgment?.BOOL ?? false,
          termsAgreement: item.termsAgreement?.BOOL ?? false,
          marketingConsent: item.marketingConsent?.BOOL ?? false,
          status: item.status?.S || "Pending",
        };
      }) || [];

    return NextResponse.json({ success: true, applications: items });
  } catch (error: any) {
    console.error("Admin fetch error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}