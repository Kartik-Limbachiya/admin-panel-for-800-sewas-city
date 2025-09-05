"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCards } from "@/components/stats-cards"
import { ApplicationsChart } from "@/components/applications-chart"
import { RecentApplications } from "@/components/recent-applications"
import type { ApplicationStats, HousingApplication } from "@/types/application"

export default function DashboardPage() {
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    byCity: {},
  })
  const [recentApplications, setRecentApplications] = useState<HousingApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch stats
        const statsResponse = await fetch("/api/stats")
        const statsData = await statsResponse.json()
        setStats(statsData)

        // Fetch recent applications
        const applicationsResponse = await fetch("/api/applications?limit=5")
        const applicationsData = await applicationsResponse.json()
        setRecentApplications(applicationsData.applications || [])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Overview of housing applications and system statistics</p>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} loading={loading} />

        {/* Charts and Recent Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ApplicationsChart stats={stats} loading={loading} />
          <RecentApplications applications={recentApplications} loading={loading} />
        </div>
      </div>
    </DashboardLayout>
  )
}
