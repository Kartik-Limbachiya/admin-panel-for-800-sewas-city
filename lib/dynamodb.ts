import { dynamoDb, APPLICATIONS_TABLE } from "./aws-config"
import type { HousingApplication, ApplicationsResponse, ApplicationStats } from "@/types/application"

const mockApplications: HousingApplication[] = [
  {
    id: "mock-1",
    fullName: "Rajesh Kumar",
    emailAddress: "rajesh.kumar@example.com",
    mobileNumber: "9876543210",
    preferredCity: "Mumbai",
    status: "Pending",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    dateOfBirth: "1985-03-15",
    occupation: "Software Engineer",
    monthlyIncome: 75000,
    familySize: 4,
    currentAddress: "Flat 302, Sunrise Apartments, Andheri East, Mumbai",
    documents: {},
  },
  {
    id: "mock-2",
    fullName: "Priya Sharma",
    emailAddress: "priya.sharma@example.com",
    mobileNumber: "9123456789",
    preferredCity: "Delhi",
    status: "Approved",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    dateOfBirth: "1990-07-22",
    occupation: "Teacher",
    monthlyIncome: 45000,
    familySize: 3,
    currentAddress: "House No. 45, Sector 15, Noida, Delhi NCR",
    documents: {},
  },
  {
    id: "mock-3",
    fullName: "Amit Patel",
    emailAddress: "amit.patel@example.com",
    mobileNumber: "9988776655",
    preferredCity: "Pune",
    status: "Rejected",
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    dateOfBirth: "1988-11-10",
    occupation: "Business Analyst",
    monthlyIncome: 60000,
    familySize: 2,
    currentAddress: "Bungalow 12, Koregaon Park, Pune",
    documents: {},
  },
  {
    id: "mock-4",
    fullName: "Sunita Reddy",
    emailAddress: "sunita.reddy@example.com",
    mobileNumber: "9445566778",
    preferredCity: "Bangalore",
    status: "Pending",
    createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    updatedAt: new Date(Date.now() - 345600000).toISOString(),
    dateOfBirth: "1992-01-05",
    occupation: "Marketing Manager",
    monthlyIncome: 55000,
    familySize: 3,
    currentAddress: "Apartment 5B, Tech Park Residency, Whitefield, Bangalore",
    documents: {},
  },
]

export async function getAllApplications(limit = 50, lastEvaluatedKey?: any): Promise<ApplicationsResponse> {
  if (!dynamoDb) {
    console.log("[v0] AWS not configured, returning mock data")
    return {
      applications: mockApplications.slice(0, limit),
      lastEvaluatedKey: undefined,
    }
  }

  try {
    const { ScanCommand } = await import("@aws-sdk/lib-dynamodb")

    const command = new ScanCommand({
      TableName: APPLICATIONS_TABLE,
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey,
    })

    const result = await dynamoDb.send(command)

    return {
      applications: (result.Items as HousingApplication[]) || [],
      lastEvaluatedKey: result.LastEvaluatedKey,
    }
  } catch (error) {
    console.error("Error fetching applications:", error)
    return {
      applications: mockApplications.slice(0, limit),
      lastEvaluatedKey: undefined,
    }
  }
}

export async function getApplicationById(id: string): Promise<HousingApplication | null> {
  if (!dynamoDb) {
    return mockApplications.find((app) => app.id === id) || null
  }

  try {
    const { GetCommand } = await import("@aws-sdk/lib-dynamodb")

    const command = new GetCommand({
      TableName: APPLICATIONS_TABLE,
      Key: { id },
    })

    const result = await dynamoDb.send(command)
    return (result.Item as HousingApplication) || null
  } catch (error) {
    console.error("Error fetching application:", error)
    return mockApplications.find((app) => app.id === id) || null
  }
}

export async function updateApplicationStatus(id: string, status: "Pending" | "Approved" | "Rejected"): Promise<void> {
  if (!dynamoDb) {
    console.log("[v0] AWS not configured, skipping status update")
    return
  }

  try {
    const { UpdateCommand } = await import("@aws-sdk/lib-dynamodb")

    const command = new UpdateCommand({
      TableName: APPLICATIONS_TABLE,
      Key: { id },
      UpdateExpression: "SET #status = :status, updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": status,
        ":updatedAt": new Date().toISOString(),
      },
    })

    await dynamoDb.send(command)
  } catch (error) {
    console.error("Error updating application status:", error)
    throw new Error("Failed to update application status")
  }
}

export async function getApplicationStats(): Promise<ApplicationStats> {
  try {
    const { applications } = await getAllApplications(1000) // Get more for stats

    const stats: ApplicationStats = {
      total: applications.length,
      pending: 0,
      approved: 0,
      rejected: 0,
      byCity: {},
    }

    applications.forEach((app) => {
      // Count by status
      const status = app.status || "Pending"
      if (status === "Pending") stats.pending++
      else if (status === "Approved") stats.approved++
      else if (status === "Rejected") stats.rejected++

      // Count by city
      const city = app.preferredCity
      stats.byCity[city] = (stats.byCity[city] || 0) + 1
    })

    return stats
  } catch (error) {
    console.error("Error fetching application stats:", error)
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      byCity: {},
    }
  }
}

export async function searchApplications(
  searchTerm?: string,
  cityFilter?: string,
  statusFilter?: string,
  limit = 50,
): Promise<ApplicationsResponse> {
  try {
    // For simplicity, we'll scan and filter client-side
    // In production, you'd want to use GSI or other indexing strategies
    const { applications } = await getAllApplications(1000)

    let filtered = applications

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (app) =>
          app.fullName.toLowerCase().includes(term) ||
          app.emailAddress.toLowerCase().includes(term) ||
          app.mobileNumber.includes(term),
      )
    }

    if (cityFilter) {
      filtered = filtered.filter((app) => app.preferredCity === cityFilter)
    }

    if (statusFilter) {
      filtered = filtered.filter((app) => (app.status || "Pending") === statusFilter)
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return {
      applications: filtered.slice(0, limit),
      totalCount: filtered.length,
    }
  } catch (error) {
    console.error("Error searching applications:", error)
    throw new Error("Failed to search applications")
  }
}
