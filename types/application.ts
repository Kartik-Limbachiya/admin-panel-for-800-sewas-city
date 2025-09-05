export interface ApplicationDocument {
  aadhar?: string
  pan?: string
  incomeProof?: string
  photo?: string
}

export interface HousingApplication {
  id: string
  fullName: string
  fatherName: string
  dateOfBirth: string
  gender: "Male" | "Female" | "Other"
  mobileNumber: string
  emailAddress: string
  occupation: string
  monthlyIncome: number
  permanentAddress: string
  currentAddress: string
  housingPreference: string
  preferredCity: string
  documents: ApplicationDocument
  createdAt: string
  legalAcknowledgment: boolean
  termsAgreement: boolean
  marketingConsent: boolean
  status?: "Pending" | "Approved" | "Rejected"
}

export interface ApplicationsResponse {
  applications: HousingApplication[]
  lastEvaluatedKey?: any
  totalCount?: number
}

export interface ApplicationStats {
  total: number
  pending: number
  approved: number
  rejected: number
  byCity: Record<string, number>
}
