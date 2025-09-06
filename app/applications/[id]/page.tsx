"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DocumentViewer } from "@/components/document-viewer"
import { StatusUpdateModal } from "@/components/status-update-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Edit,
  User,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Home,
  Calendar,
} from "lucide-react"
import type { HousingApplication } from "@/types/application"

export default function ApplicationDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [application, setApplication] = useState<HousingApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [showStatusModal, setShowStatusModal] = useState(false)

  useEffect(() => {
    async function fetchApplication() {
      try {
        const createdAt = searchParams.get("createdAt")
        if (!createdAt) {
          console.error("❌ Missing createdAt in query params")
          router.push("/applications")
          return
        }

        const response = await fetch(
          `/api/applications/${params.id}?createdAt=${encodeURIComponent(createdAt)}`
        )

        if (response.ok) {
          const data = await response.json()
          setApplication(data.application)
        } else {
          console.error("❌ Failed to fetch application:", await response.text())
          router.push("/applications")
        }
      } catch (error) {
        console.error("Error fetching application:", error)
        router.push("/applications")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchApplication()
    }
  }, [params.id, router, searchParams])

  const handleStatusUpdate = (newStatus: string) => {
    if (application) {
      setApplication({ ...application, status: newStatus as any })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded animate-pulse w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-muted rounded animate-pulse" />
            <div className="h-96 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!application) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground">Application Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The requested application could not be found.
          </p>
          <Button className="mt-4" onClick={() => router.push("/applications")}>
            Back to Applications
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {application.fullName || "Unknown Applicant"}
              </h1>
              <p className="text-muted-foreground">Application Details</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className={getStatusColor(application.status || "Pending")}
            >
              {application.status || "Pending"}
            </Badge>
            <Button onClick={() => setShowStatusModal(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Update Status
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </label>
                  <p className="font-medium">{application.fullName || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Father's Name
                  </label>
                  <p className="font-medium">{application.fatherName || "Not provided"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Date of Birth
                  </label>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {application.dateOfBirth && application.dateOfBirth !== "" 
                      ? (() => {
                          try {
                            return new Date(application.dateOfBirth).toLocaleDateString()
                          } catch (e) {
                            return application.dateOfBirth
                          }
                        })()
                      : "Not provided"
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Gender
                  </label>
                  <p className="font-medium">
                    {application.gender && application.gender !== "" 
                      ? application.gender.charAt(0).toUpperCase() + application.gender.slice(1) 
                      : "Not provided"
                    }
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Mobile Number
                  </label>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {application.mobileNumber || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email Address
                  </label>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {application.emailAddress || "Not provided"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Occupation
                  </label>
                  <p className="font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {application.occupation || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Monthly Income
                  </label>
                  <p className="font-medium">
                    {(() => {
                      if (!application.monthlyIncome || application.monthlyIncome === "NaN" || application.monthlyIncome === "") {
                        return "Not provided"
                      }
                      
                      // Handle different income range formats
                      const income = application.monthlyIncome.toString()
                      
                      if (income.includes('₹')) {
                        return income
                      }
                      
                      // Map income range values to display text
                      const incomeRanges: Record<string, string> = {
                        'below-25000': 'Below ₹25,000',
                        '25000-50000': '₹25,000 - ₹50,000',
                        '50000-100000': '₹50,000 - ₹1,00,000',
                        'above-100000': 'Above ₹1,00,000'
                      }
                      
                      return incomeRanges[income] || `₹${income}`
                    })()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address & Housing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address & Housing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Permanent Address
                </label>
                <p className="font-medium">
                  {application.permanentAddress || "Not provided"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Current Address
                </label>
                <p className="font-medium">
                  {application.currentAddress || "Same as permanent address"}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Preferred City
                  </label>
                  <p className="font-medium flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    {application.preferredCity || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Housing Preference
                  </label>
                  <p className="font-medium">
                    {(() => {
                      if (!application.housingPreference) return "Not provided"
                      
                      // Format housing preference display
                      const housing = application.housingPreference.toLowerCase()
                      if (housing === "2bhk") return "2 BHK - 540 sq. ft."
                      if (housing === "3bhk") return "3 BHK - 720 sq. ft."
                      return application.housingPreference
                    })()}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Application Date
                </label>
                <p className="font-medium">
                  {application.createdAt 
                    ? new Date(application.createdAt).toLocaleDateString()
                    : "Not available"
                  }
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Agreements
                </label>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        application.legalAcknowledgment ? "default" : "secondary"
                      }
                      className={
                        application.legalAcknowledgment 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {application.legalAcknowledgment ? "✓" : "✗"}
                    </Badge>
                    <span className="text-sm">Legal Acknowledgment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={application.termsAgreement ? "default" : "secondary"}
                      className={
                        application.termsAgreement 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {application.termsAgreement ? "✓" : "✗"}
                    </Badge>
                    <span className="text-sm">Terms Agreement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        application.marketingConsent ? "default" : "secondary"
                      }
                      className={
                        application.marketingConsent 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {application.marketingConsent ? "✓" : "✗"}
                    </Badge>
                    <span className="text-sm">Marketing Consent (Optional)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents */}
        <DocumentViewer 
          userId={application.id} 
          documents={application.documents || {}} 
        />

        {/* Status Update Modal */}
        <StatusUpdateModal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          currentStatus={application.status || "Pending"}
          applicationId={application.id}
          applicantName={application.fullName || "Unknown Applicant"}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </DashboardLayout>
  )
}