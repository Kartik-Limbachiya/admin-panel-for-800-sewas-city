// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Eye, Download, FileText, AlertCircle } from "lucide-react"
// import type { ApplicationDocument } from "@/types/application"

// interface DocumentViewerProps {
//   userId: string
//   documents: ApplicationDocument
// }

// export function DocumentViewer({ userId, documents }: DocumentViewerProps) {
//   const [loadingDocs, setLoadingDocs] = useState<Record<string, boolean>>({})

//   const documentTypes = [
//     { key: "aadhar", label: "Aadhar Card", required: true },
//     { key: "pan", label: "PAN Card", required: true },
//     { key: "incomeProof", label: "Income Proof", required: true },
//     { key: "photo", label: "Photograph", required: true },
//   ]

//   const handleViewDocument = async (docType: string) => {
//     setLoadingDocs((prev) => ({ ...prev, [docType]: true }))
//     try {
//       const response = await fetch(`/api/documents/${userId}/${docType}`)
//       const data = await response.json()

//       if (data.url) {
//         window.open(data.url, "_blank")
//       } else {
//         alert("Document not found")
//       }
//     } catch (error) {
//       console.error("Error viewing document:", error)
//       alert("Error loading document")
//     } finally {
//       setLoadingDocs((prev) => ({ ...prev, [docType]: false }))
//     }
//   }

//   const handleDownloadDocument = async (docType: string) => {
//     setLoadingDocs((prev) => ({ ...prev, [docType]: true }))
//     try {
//       const response = await fetch(`/api/documents/${userId}/${docType}?download=true`)
//       const data = await response.json()

//       if (data.url) {
//         const link = document.createElement("a")
//         link.href = data.url
//         link.download = `${docType}-${userId}`
//         document.body.appendChild(link)
//         link.click()
//         document.body.removeChild(link)
//       } else {
//         alert("Document not found")
//       }
//     } catch (error) {
//       console.error("Error downloading document:", error)
//       alert("Error downloading document")
//     } finally {
//       setLoadingDocs((prev) => ({ ...prev, [docType]: false }))
//     }
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <FileText className="h-5 w-5" />
//           Documents
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {documentTypes.map((docType) => {
//             const hasDocument = documents[docType.key as keyof ApplicationDocument]
//             const isLoading = loadingDocs[docType.key]

//             return (
//               <div key={docType.key} className="border rounded-lg p-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-2">
//                     <h4 className="font-medium">{docType.label}</h4>
//                     {docType.required && (
//                       <Badge variant="secondary" className="text-xs">
//                         Required
//                       </Badge>
//                     )}
//                   </div>
//                   {hasDocument ? (
//                     <Badge variant="secondary" className="bg-green-100 text-green-800">
//                       Uploaded
//                     </Badge>
//                   ) : (
//                     <Badge variant="secondary" className="bg-red-100 text-red-800 flex items-center gap-1">
//                       <AlertCircle className="h-3 w-3" />
//                       Missing
//                     </Badge>
//                   )}
//                 </div>

//                 {hasDocument ? (
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handleViewDocument(docType.key)}
//                       disabled={isLoading}
//                       className="flex-1"
//                     >
//                       <Eye className="h-4 w-4 mr-2" />
//                       {isLoading ? "Loading..." : "View"}
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handleDownloadDocument(docType.key)}
//                       disabled={isLoading}
//                       className="flex-1"
//                     >
//                       <Download className="h-4 w-4 mr-2" />
//                       Download
//                     </Button>
//                   </div>
//                 ) : (
//                   <p className="text-sm text-muted-foreground">Document not uploaded</p>
//                 )}
//               </div>
//             )
//           })}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }


// Fix 3: Update Document Viewer to handle the correct document structure
// File: components/document-viewer.tsx

// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Eye, Download, FileText, AlertCircle } from "lucide-react"
// import type { ApplicationDocument } from "@/types/application"

// interface DocumentViewerProps {
//   userId: string
//   documents: ApplicationDocument | Record<string, string> // ✅ FIXED: Allow both types
// }

// export function DocumentViewer({ userId, documents }: DocumentViewerProps) {
//   const [loadingDocs, setLoadingDocs] = useState<Record<string, boolean>>({})

//   // ✅ FIXED: Map the document keys correctly
//   const documentTypes = [
//     { key: "aadhar", label: "Aadhar Card", required: true },
//     { key: "panCard", label: "PAN Card", required: true }, // ✅ Changed from "pan" to "panCard"
//     { key: "incomeProof", label: "Income Proof", required: true },
//     { key: "photo", label: "Photograph", required: true },
//   ]

//   const handleViewDocument = async (docType: string) => {
//     setLoadingDocs((prev) => ({ ...prev, [docType]: true }))
//     try {
//       // ✅ FIXED: Check if document URL exists
//       const documentUrl = documents[docType as keyof typeof documents] as string
      
//       if (documentUrl && documentUrl.startsWith('http')) {
//         // Document is stored as direct URL, open it
//         window.open(documentUrl, "_blank")
//       } else {
//         // Try the API endpoint
//         const response = await fetch(`/api/documents/${userId}/${docType}`)
//         const data = await response.json()

//         if (data.url) {
//           window.open(data.url, "_blank")
//         } else {
//           alert("Document not found")
//         }
//       }
//     } catch (error) {
//       console.error("Error viewing document:", error)
//       alert("Error loading document")
//     } finally {
//       setLoadingDocs((prev) => ({ ...prev, [docType]: false }))
//     }
//   }

//   const handleDownloadDocument = async (docType: string) => {
//     setLoadingDocs((prev) => ({ ...prev, [docType]: true }))
//     try {
//       const documentUrl = documents[docType as keyof typeof documents] as string
      
//       if (documentUrl && documentUrl.startsWith('http')) {
//         // Direct download from URL
//         const link = document.createElement("a")
//         link.href = documentUrl
//         link.download = `${docType}-${userId}`
//         document.body.appendChild(link)
//         link.click()
//         document.body.removeChild(link)
//       } else {
//         // Try the API endpoint
//         const response = await fetch(`/api/documents/${userId}/${docType}?download=true`)
//         const data = await response.json()

//         if (data.url) {
//           const link = document.createElement("a")
//           link.href = data.url
//           link.download = `${docType}-${userId}`
//           document.body.appendChild(link)
//           link.click()
//           document.body.removeChild(link)
//         } else {
//           alert("Document not found")
//         }
//       }
//     } catch (error) {
//       console.error("Error downloading document:", error)
//       alert("Error downloading document")
//     } finally {
//       setLoadingDocs((prev) => ({ ...prev, [docType]: false }))
//     }
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <FileText className="h-5 w-5" />
//           Documents
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {documentTypes.map((docType) => {
//             // ✅ FIXED: Check for document existence properly
//             const documentUrl = documents[docType.key as keyof typeof documents] as string
//             const hasDocument = documentUrl && documentUrl.trim() !== ""
//             const isLoading = loadingDocs[docType.key]

//             return (
//               <div key={docType.key} className="border rounded-lg p-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-2">
//                     <h4 className="font-medium">{docType.label}</h4>
//                     {docType.required && (
//                       <Badge variant="secondary" className="text-xs">
//                         Required
//                       </Badge>
//                     )}
//                   </div>
//                   {hasDocument ? (
//                     <Badge variant="secondary" className="bg-green-100 text-green-800">
//                       Uploaded
//                     </Badge>
//                   ) : (
//                     <Badge variant="secondary" className="bg-red-100 text-red-800 flex items-center gap-1">
//                       <AlertCircle className="h-3 w-3" />
//                       Missing
//                     </Badge>
//                   )}
//                 </div>

//                 {hasDocument ? (
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handleViewDocument(docType.key)}
//                       disabled={isLoading}
//                       className="flex-1"
//                     >
//                       <Eye className="h-4 w-4 mr-2" />
//                       {isLoading ? "Loading..." : "View"}
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handleDownloadDocument(docType.key)}
//                       disabled={isLoading}
//                       className="flex-1"
//                     >
//                       <Download className="h-4 w-4 mr-2" />
//                       Download
//                     </Button>
//                   </div>
//                 ) : (
//                   <p className="text-sm text-muted-foreground">Document not uploaded</p>
//                 )}
                
//                 {/* ✅ ADDED: Debug info for development */}
//                 {process.env.NODE_ENV === 'development' && (
//                   <p className="text-xs text-gray-400 mt-2 break-all">
//                     URL: {documentUrl || 'Not found'}
//                   </p>
//                 )}
//               </div>
//             )
//           })}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, FileText, AlertCircle } from "lucide-react"

interface DocumentViewerProps {
  userId: string
  documents: Record<string, string> | any
}

export function DocumentViewer({ userId, documents = {} }: DocumentViewerProps) {
  const [loadingDocs, setLoadingDocs] = useState<Record<string, boolean>>({})

  // Map the correct document keys from your DynamoDB structure
  const documentTypes = [
    { key: "aadhar", label: "Aadhar Card", required: true },
    { key: "panCard", label: "PAN Card", required: true },
    { key: "incomeProof", label: "Income Proof", required: true },
    { key: "photo", label: "Photograph", required: true },
  ]

  const handleViewDocument = async (docType: string) => {
    setLoadingDocs((prev) => ({ ...prev, [docType]: true }))
    try {
      // Check if document URL exists in the documents object
      const documentUrl = documents[docType] as string
      
      console.log(`📄 Trying to view document: ${docType}`, {
        url: documentUrl,
        allDocs: documents
      })

      if (documentUrl && (documentUrl.startsWith('http') || documentUrl.startsWith('https'))) {
        // Document is stored as direct URL, open it
        window.open(documentUrl, "_blank")
      } else {
        // Try the API endpoint as fallback
        const response = await fetch(`/api/documents/${userId}/${docType}`)
        const data = await response.json()

        if (data.url) {
          window.open(data.url, "_blank")
        } else {
          alert("Document not found or URL is invalid")
        }
      }
    } catch (error) {
      console.error("❌ Error viewing document:", error)
      alert("Error loading document")
    } finally {
      setLoadingDocs((prev) => ({ ...prev, [docType]: false }))
    }
  }

  const handleDownloadDocument = async (docType: string) => {
    setLoadingDocs((prev) => ({ ...prev, [docType]: true }))
    try {
      const documentUrl = documents[docType] as string
      
      if (documentUrl && (documentUrl.startsWith('http') || documentUrl.startsWith('https'))) {
        // Direct download from URL
        const link = document.createElement("a")
        link.href = documentUrl
        link.download = `${docType}-${userId}`
        link.target = "_blank"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        // Try the API endpoint
        const response = await fetch(`/api/documents/${userId}/${docType}?download=true`)
        const data = await response.json()

        if (data.url) {
          const link = document.createElement("a")
          link.href = data.url
          link.download = `${docType}-${userId}`
          link.target = "_blank"
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else {
          alert("Document not found")
        }
      }
    } catch (error) {
      console.error("❌ Error downloading document:", error)
      alert("Error downloading document")
    } finally {
      setLoadingDocs((prev) => ({ ...prev, [docType]: false }))
    }
  }

  // Debug: Log the documents structure
  console.log("📁 Documents received in DocumentViewer:", {
    userId,
    documents,
    documentsType: typeof documents,
    documentsKeys: Object.keys(documents || {})
  })

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
            // Check for document existence properly
            const documentUrl = documents[docType.key] as string
            const hasDocument = documentUrl && documentUrl.trim() !== "" && documentUrl !== "undefined"
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
                
                {/* Debug info for development */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                    <p className="text-gray-600 break-all">
                      <strong>URL:</strong> {documentUrl || 'Not found'}
                    </p>
                    <p className="text-gray-600">
                      <strong>Has Document:</strong> {hasDocument ? 'Yes' : 'No'}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {/* Overall debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="font-medium text-yellow-800 mb-2">Debug Information</h4>
            <pre className="text-xs text-yellow-700 overflow-auto">
              {JSON.stringify({ userId, documents }, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}