"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Link } from "react-router-dom"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import {
  Brain,
  Users,
  Calendar,
  TrendingUp,
  Sparkles,
  ArrowRight
} from "lucide-react"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { SkillDistributionChart } from "@/components/dashboard/skill-distribution-chart"
import { DepartmentOverview } from "@/components/dashboard/department-overview"
import { UpcomingActivities } from "@/components/dashboard/upcoming-activities"
import { SkillGapsOverview } from "@/components/dashboard/skill-gaps-overview"

export default function AdminDashboard() {
  const { user } = useAuth()

  const quickLinks = [
    { to: "/admin/employees", icon: Users, label: "Employees", desc: "Manage employee profiles and records" },
    { to: "/admin/activities", icon: Calendar, label: "Activities", desc: "Manage training sessions and programs" },
    { to: "/admin/recommendations", icon: Brain, label: "Recommendations", desc: "AI-driven talent matching engine" },
    { to: "/admin/analytics", icon: TrendingUp, label: "Analytics", desc: "Growth metrics and skill gap tracking" },
  ]

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen page-transition">
      <DashboardHeader title="Command Intelligence" description="Strategic oversight and organizational talent matrix" />

      <div className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-12 animate-in fade-in duration-700">
        <div className="flex items-center justify-between border-b border-slate-100 pb-10">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em]">System Overview</span>
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Executive Dashboard</h2>
          </div>
          <div className="bg-orange-500/[0.03] border border-orange-500/10 py-5 px-10 rounded-2xl flex items-center gap-5 shadow-sm">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Sector Authorization</span>
              <span className="text-sm font-bold text-slate-900 leading-none">{user?.role?.toUpperCase() || "ADMIN"} LEVEL ACCESS</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="w-full">
          <StatsCards />
        </div>

        {/* Quick Actions */}
        {(user?.role === "hq" || user?.role === "hr" || user?.role === "admin") && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-display font-bold text-slate-900">Priority Gateways</h3>
              <div className="h-[1px] flex-1 bg-slate-100"></div>
            </div>
            <div className="grid gap-6 md:grid-cols-4">
              {quickLinks.map(({ to, icon: Icon, label, desc }, idx) => (
                <Link key={to} to={to} className="h-full">
                  <div className="card-premium p-8 hover:bg-white h-full group border-slate-100 hover:border-orange-500/30 transition-all duration-500">
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-lg transition-all duration-500",
                      idx === 0 ? "bg-orange-500/10 text-orange-500 shadow-orange-500/10" :
                        idx === 1 ? "bg-blue-500/10 text-blue-500 shadow-blue-500/10" :
                          idx === 2 ? "bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10" :
                            "bg-purple-500/10 text-purple-500 shadow-purple-500/10"
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-500 transition-colors">{label}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed m-0">{desc}</p>
                    <div className="flex items-center gap-2 mt-6 text-slate-400 group-hover:text-orange-500 transition-colors">
                      <span className="text-[10px] font-bold uppercase tracking-widest">Access Module</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <div className="card-premium p-1 border-none shadow-premium bg-white">
              <SkillDistributionChart />
            </div>
            <div className="card-premium p-1 border-none shadow-premium bg-white">
              <DepartmentOverview />
            </div>
          </div>
          <div className="space-y-10">
            <div className="card-premium p-1 border-none shadow-premium bg-white">
              <UpcomingActivities />
            </div>
            <div className="card-premium p-1 border-none shadow-premium bg-white">
              <SkillGapsOverview />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


