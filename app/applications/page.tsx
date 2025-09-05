"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ApplicationsTable } from "@/components/applications-table"
import type { HousingApplication } from "@/types/application"

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<HousingApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [cityFilter, setCityFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (cityFilter) params.append("city", cityFilter)
      if (statusFilter) params.append("status", statusFilter)

      const response = await fetch(`/api/applications?${params.toString()}`)
      const data = await response.json()
      setApplications(data.applications || [])
    } catch (error) {
      console.error("Error fetching applications:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [searchTerm, cityFilter, statusFilter])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleFilter = (city: string, status: string) => {
    setCityFilter(city)
    setStatusFilter(status)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Applications</h1>
          <p className="text-muted-foreground mt-2">Manage and review housing applications</p>
        </div>

        <ApplicationsTable
          applications={applications}
          loading={loading}
          onSearch={handleSearch}
          onFilter={handleFilter}
        />
      </div>
    </DashboardLayout>
  )
}
