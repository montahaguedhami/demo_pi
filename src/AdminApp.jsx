import { Routes, Route, Navigate } from "react-router-dom"
import AdminEmployeesPage from "../app/admin/employees/page"
import AdminRecommendationsPage from "../app/admin/recommendations/page"
import AdminActivitiesPage from "../app/admin/activities/page"
import AdminSessionsPage from "../app/admin/sessions/page"
import AdminSkillsPage from "../app/admin/skills/page"
import AdminSettingsPage from "../app/admin/settings/page"
import AdminReportsPage from "../app/admin/reports/page"
import AdminAnalyticsPage from "../app/admin/analytics/page"
import AdminDashboardPage from "../app/admin/page"
import AdminProfilePage from "../app/admin/profile/page"
import { PortalLayout } from "@/components/PortalLayout"

export default function AdminApp() {
  return (
    <PortalLayout role="admin">
      <Routes>
        <Route path="/" element={<AdminDashboardPage />} />
        <Route path="/employees" element={<AdminEmployeesPage />} />
        <Route path="/skills" element={<AdminSkillsPage />} />
        <Route path="/activities" element={<AdminActivitiesPage />} />
        <Route path="/sessions" element={<AdminSessionsPage />} />
        <Route path="/recommendations" element={<AdminRecommendationsPage />} />
        <Route path="/profile" element={<AdminProfilePage />} />
        <Route path="/settings" element={<AdminSettingsPage />} />
        <Route path="/reports" element={<AdminReportsPage />} />
        <Route path="/analytics" element={<AdminAnalyticsPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </PortalLayout>
  )
}
