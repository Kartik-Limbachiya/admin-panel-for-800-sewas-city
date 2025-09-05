"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"

interface StatusUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  currentStatus: string
  applicationId: string
  applicantName: string
  onStatusUpdate: (newStatus: string) => void
}

export function StatusUpdateModal({
  isOpen,
  onClose,
  currentStatus,
  applicationId,
  applicantName,
  onStatusUpdate,
}: StatusUpdateModalProps) {
  const [newStatus, setNewStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)

  const statusOptions = [
    { value: "Pending", label: "Pending", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
    { value: "Approved", label: "Approved", icon: CheckCircle, color: "bg-green-100 text-green-800" },
    { value: "Rejected", label: "Rejected", icon: XCircle, color: "bg-red-100 text-red-800" },
  ]

  const handleUpdate = async () => {
    if (newStatus === currentStatus) {
      onClose()
      return
    }

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        onStatusUpdate(newStatus)
        onClose()
      } else {
        alert("Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Error updating status")
    } finally {
      setIsUpdating(false)
    }
  }

  const currentStatusOption = statusOptions.find((option) => option.value === currentStatus)
  const newStatusOption = statusOptions.find((option) => option.value === newStatus)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Application Status</DialogTitle>
          <DialogDescription>
            Change the status for <strong>{applicantName}</strong>'s application
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Current Status</label>
            <div className="mt-1">
              {currentStatusOption && (
                <Badge variant="secondary" className={currentStatusOption.color}>
                  <currentStatusOption.icon className="h-3 w-3 mr-1" />
                  {currentStatusOption.label}
                </Badge>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">New Status</label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {newStatus !== currentStatus && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">
                Status will be changed from{" "}
                <Badge variant="secondary" className={currentStatusOption?.color}>
                  {currentStatus}
                </Badge>{" "}
                to{" "}
                <Badge variant="secondary" className={newStatusOption?.color}>
                  {newStatus}
                </Badge>
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUpdating}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isUpdating || newStatus === currentStatus}>
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
