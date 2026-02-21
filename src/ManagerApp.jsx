import { Routes, Route, Navigate } from "react-router-dom"
import { PortalLayout } from "@/components/PortalLayout"
import ManagerDashboardPage from "../app/manager/page"
import ManagerSkillsPage from "../app/manager/skills/page"
import ManagerTeamPage from "../app/manager/team/page"
import ManagerAssignmentsPage from "../app/manager/assignments/page"
import ManagerActivitiesPage from "../app/manager/activities/page"
import ManagerEvaluationsPage from "../app/manager/evaluations/page"
import ManagerProfilePage from "../app/manager/profile/page"

export default function ManagerApp() {
    return (
        <PortalLayout role="manager">
            <Routes>
                <Route path="/" element={<ManagerDashboardPage />} />
                <Route path="/employees" element={<ManagerTeamPage />} />
                <Route path="/skills" element={<ManagerSkillsPage />} />
                <Route path="/assignments" element={<ManagerAssignmentsPage />} />
                <Route path="/activities" element={<ManagerActivitiesPage />} />
                <Route path="/evaluations" element={<ManagerEvaluationsPage />} />
                <Route path="/performance" element={<ManagerDashboardPage />} />
                <Route path="/profile" element={<ManagerProfilePage />} />
                <Route path="*" element={<Navigate to="/manager" replace />} />
            </Routes>
        </PortalLayout>
    )
}
