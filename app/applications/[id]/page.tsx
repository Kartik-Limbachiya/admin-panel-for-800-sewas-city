"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DocumentViewer } from "@/components/document-viewer"
import { StatusUpdateModal } from "@/components/status-update-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, User, MapPin, Phone, Mail, Briefcase, Home, Calendar } from "lucide-react"
import type { HousingApplication } from "@/types/application"

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [application, setApplication] = useState<HousingApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [showStatusModal, setShowStatusModal] = useState(false)

  useEffect(() => {
    async function fetchApplication() {
      try {
        const response = await fetch(`/api/applications/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setApplication(data)
        } else {
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
  }, [params.id, router])

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
          <p className="text-muted-foreground mt-2">The requested application could not be found.</p>
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
              <h1 className="text-3xl font-bold text-foreground">{application.fullName}</h1>
              <p className="text-muted-foreground">Application Details</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className={getStatusColor(application.status || "Pending")}>
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
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="font-medium">{application.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Father's Name</label>
                  <p className="font-medium">{application.fatherName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(application.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Gender</label>
                  <p className="font-medium">{application.gender}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Mobile Number</label>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {application.mobileNumber}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {application.emailAddress}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                  <p className="font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {application.occupation}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Monthly Income</label>
                  <p className="font-medium">₹{application.monthlyIncome.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address & Housing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address & Housing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Permanent Address</label>
                <p className="font-medium">{application.permanentAddress}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Current Address</label>
                <p className="font-medium">{application.currentAddress}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Preferred City</label>
                  <p className="font-medium flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    {application.preferredCity}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Housing Preference</label>
                  <p className="font-medium">{application.housingPreference}</p>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground">Application Date</label>
                <p className="font-medium">{new Date(application.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Agreements</label>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={application.legalAcknowledgment ? "default" : "secondary"}>
                      {application.legalAcknowledgment ? "✓" : "✗"}
                    </Badge>
                    <span className="text-sm">Legal Acknowledgment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={application.termsAgreement ? "default" : "secondary"}>
                      {application.termsAgreement ? "✓" : "✗"}
                    </Badge>
                    <span className="text-sm">Terms Agreement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={application.marketingConsent ? "default" : "secondary"}>
                      {application.marketingConsent ? "✓" : "✗"}
                    </Badge>
                    <span className="text-sm">Marketing Consent</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents */}
        <DocumentViewer userId={application.id} documents={application.documents} />

        {/* Status Update Modal */}
        <StatusUpdateModal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          currentStatus={application.status || "Pending"}
          applicationId={application.id}
          applicantName={application.fullName}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </DashboardLayout>
  )
}
