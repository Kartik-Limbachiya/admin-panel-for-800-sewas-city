"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, FileText, AlertCircle } from "lucide-react"
import type { ApplicationDocument } from "@/types/application"

interface DocumentViewerProps {
  userId: string
  documents: ApplicationDocument
}

export function DocumentViewer({ userId, documents }: DocumentViewerProps) {
  const [loadingDocs, setLoadingDocs] = useState<Record<string, boolean>>({})

  const documentTypes = [
    { key: "aadhar", label: "Aadhar Card", required: true },
    { key: "pan", label: "PAN Card", required: true },
    { key: "incomeProof", label: "Income Proof", required: true },
    { key: "photo", label: "Photograph", required: true },
  ]

  const handleViewDocument = async (docType: string) => {
    setLoadingDocs((prev) => ({ ...prev, [docType]: true }))
    try {
      const response = await fetch(`/api/documents/${userId}/${docType}`)
      const data = await response.json()

      if (data.url) {
        window.open(data.url, "_blank")
      } else {
        alert("Document not found")
      }
    } catch (error) {
      console.error("Error viewing document:", error)
      alert("Error loading document")
    } finally {
      setLoadingDocs((prev) => ({ ...prev, [docType]: false }))
    }
  }

  const handleDownloadDocument = async (docType: string) => {
    setLoadingDocs((prev) => ({ ...prev, [docType]: true }))
    try {
      const response = await fetch(`/api/documents/${userId}/${docType}?download=true`)
      const data = await response.json()

      if (data.url) {
        const link = document.createElement("a")
        link.href = data.url
        link.download = `${docType}-${userId}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        alert("Document not found")
      }
    } catch (error) {
      console.error("Error downloading document:", error)
      alert("Error downloading document")
    } finally {
      setLoadingDocs((prev) => ({ ...prev, [docType]: false }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documentTypes.map((docType) => {
            const hasDocument = documents[docType.key as keyof ApplicationDocument]
            const isLoading = loadingDocs[docType.key]

            return (
              <div key={docType.key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{docType.label}</h4>
                    {docType.required && (
                      <Badge variant="secondary" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                  {hasDocument ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Uploaded
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-100 text-red-800 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Missing
                    </Badge>
                  )}
                </div>

                {hasDocument ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(docType.key)}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {isLoading ? "Loading..." : "View"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadDocument(docType.key)}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Document not uploaded</p>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
