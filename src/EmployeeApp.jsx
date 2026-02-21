import { Routes, Route, Navigate } from "react-router-dom"
import EmployeeDashboard from "../app/employee/page"
import EmployeeActivitiesPage from "../app/employee/activities/page"
import EmployeeRecommendationsPage from "../app/employee/recommendations/page"
import EmployeeProfilePage from "../app/employee/profile/page"
import { PortalLayout } from "@/components/PortalLayout"

export default function EmployeeApp() {
  return (
    <PortalLayout role="employee">
      <Routes>
        <Route path="/" element={<EmployeeDashboard />} />
        <Route path="/activities" element={<EmployeeActivitiesPage />} />
        <Route path="/recommendations" element={<EmployeeRecommendationsPage />} />
        <Route path="/profile" element={<EmployeeProfilePage />} />
        <Route path="/progress" element={<EmployeeProgress />} />
        <Route path="*" element={<Navigate to="/employee" replace />} />
      </Routes>
    </PortalLayout>
  )
}

function EmployeeProgress() {
  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen">
      <div className="flex-1 p-8 space-y-10 animate-in fade-in duration-700">
        <div className="border-b border-slate-200 pb-6">
          <h2 className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Growth Journey</h2>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Progress Tracker</h1>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-8">Professional Development Timeline</h3>
          <div className="space-y-8 relative">
            <div className="absolute left-6 top-2 bottom-2 w-px bg-slate-100" />
            {[
              { title: "Lead Architect Certification", date: "Currently Active", status: "80%", active: true },
              { title: "Neural Network Workshop", date: "Jan 12, 2026", status: "Completed", active: false },
            ].map((item, i) => (
              <div key={i} className="flex gap-8 relative pl-14">
                <div className={`absolute left-0 w-12 h-12 rounded-xl flex items-center justify-center z-10 shadow-sm transition-all
                  ${item.active ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-400 border border-slate-100"}`}
                >
                  <span className="text-sm font-bold">{i + 1}</span>
                </div>
                <div className="flex-1 pb-8 border-b border-slate-50 last:border-none">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-slate-900 tracking-tight">{item.title}</h4>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg
                      ${item.active ? "bg-orange-50 text-orange-600 border border-orange-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Current Level</h3>
              <p className="text-xs font-medium text-slate-500 mt-1">Based on competency assessments</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold text-slate-900 tracking-tighter">04</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-1">Level</span>
            </div>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-gradient-to-r from-[#F28C1B] to-[#E37D0B] rounded-full transition-all duration-1000" style={{ width: "85%" }} />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-slate-500">85% progress to next tier</p>
            <p className="text-[11px] font-bold text-primary">15% Remaining</p>
          </div>
        </div>
      </div>
    </div>
  )
}
