"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { employees, activities } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardHeader } from "@/components/dashboard/header"
import {
  Target, TrendingUp, Star, Calendar, Clock, ArrowRight,
  CheckCircle2, Award, BookOpen
} from "lucide-react"

const getSkillTypeLabel = (type) => {
  return type?.toUpperCase() || "CORE"
}

export default function EmployeeDashboard() {
  const { user, getEmployeeProfile } = useAuth()
  const employeeProfile = getEmployeeProfile()
  const navigate = useNavigate()

  // For demo, use first employee if no profile found
  const employee = employeeProfile || employees[0]

  // Calculate stats
  const avgSkillScore = Math.round(
    employee.skills.reduce((acc, s) => acc + (s.score || s.proficiencyScore || 0), 0) / employee.skills.length
  )
  const expertSkills = employee.skills.filter(s => s.level === "expert").length
  const improvingSkills = employee.skills.filter(s => (s.progression || 0) > 5).length

  // Get recommended activities (mock)
  const recommendedActivities = activities.filter(a => a.status === "upcoming").slice(0, 3)

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen page-transition">
      <DashboardHeader title="Personal Terminal" description="Neural development tracking and professional status monitor" />

      <div className="flex-1 space-y-12 p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-700">
        {/* Welcome Section */}
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-12">
          <div className="flex items-center gap-10">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#F28C1B] to-amber-300 rounded-[2rem] opacity-20 group-hover:opacity-40 transition-all duration-700 blur-lg"></div>
              <div className="relative h-28 w-28 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl transition-transform duration-700 group-hover:scale-105 group-hover:rotate-2">
                <Avatar className="h-full w-full rounded-none">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${employee.id}`} className="object-cover" />
                  <AvatarFallback className="bg-slate-100 text-slate-400 text-3xl font-display font-black">
                    {getInitials(employee.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em] font-sans">Status: Active Protocol</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight">
                Greetings, {user?.name?.split(" ")[0] || employee.name.split(" ")[0]}
              </h1>
              <div className="flex items-center gap-4">
                <div className="badge-premium bg-slate-100 text-slate-600 border-none px-4 py-1.5">
                  {employee.department}
                </div>
                <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                <span className="text-sm font-bold text-slate-400 font-sans tracking-wide">{employee.position}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/employee/profile")}
              className="h-14 px-8 rounded-2xl bg-white border border-slate-100 text-slate-600 font-bold uppercase text-[10px] tracking-widest hover:border-orange-500/30 hover:text-orange-500 transition-all duration-300 shadow-sm"
            >
              System Profile
            </button>
            <button
              onClick={() => navigate("/employee/activity-history")}
              className="btn-premium h-14 px-8 rounded-2xl shadow-orange-500/10"
            >
              Mission Log
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-8 md:grid-cols-4">
          <div className="card-premium p-8 group hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neural Score</span>
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
                <Target className="h-5 w-5 text-orange-500 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="text-4xl font-display font-black text-slate-900 mb-6 italic">{avgSkillScore}%</div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-orange-500 transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(242,140,27,0.3)]"
                style={{ width: `${avgSkillScore}%` }}
              />
            </div>
          </div>

          <div className="card-premium p-8 group hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mastery Nodes</span>
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                <Star className="h-5 w-5 text-indigo-500 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="text-4xl font-display font-black text-slate-900 mb-2 italic">{expertSkills}</div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4">Level: Expert / {employee.skills.length} Total</p>
          </div>

          <div className="card-premium p-8 group hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth Index</span>
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                <TrendingUp className="h-5 w-5 text-emerald-500 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="text-4xl font-display font-black text-emerald-500 mb-2 italic">+{improvingSkills}</div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4">Trending Positive &gt;5%</p>
          </div>

          <div className="card-premium p-8 group hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assignments</span>
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                <Calendar className="h-5 w-5 text-blue-500 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="text-4xl font-display font-black text-slate-900 mb-2 italic">{recommendedActivities.length}</div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4">Pending System Match</p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Skills Overview */}
          <div className="lg:col-span-2 card-premium border-none shadow-premium bg-white">
            <div className="flex items-center justify-between p-10 border-b border-slate-50">
              <div className="space-y-1">
                <h3 className="text-xl font-display font-bold text-slate-900">Neural Matrix Overview</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time proficiency tracking</p>
              </div>
              <div className="flex items-center gap-3 bg-emerald-500/5 px-4 py-2 rounded-xl">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Live Sync</span>
              </div>
            </div>
            <div className="p-10">
              <div className="space-y-10">
                {employee.skills.slice(0, 5).map((employeeSkill) => (
                  <div key={employeeSkill.skillId} className="group/skill">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-5">
                        <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(242,140,27,0.4)]"></div>
                        <span className="text-sm font-bold text-slate-900 font-display tracking-tight">{employeeSkill.skill.name}</span>
                        <div className="badge-premium bg-slate-50 text-slate-400 border-none px-2 py-0.5 text-[9px] opacity-70">
                          {getSkillTypeLabel(employeeSkill.skill.type)}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        {(employeeSkill.progression || 0) > 0 && (
                          <div className="flex items-center gap-1.5 text-emerald-500">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span className="text-[11px] font-bold">+{employeeSkill.progression}%</span>
                          </div>
                        )}
                        <span className={cn("px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-transparent shadow-sm",
                          employeeSkill.level === "expert" ? "bg-emerald-500 text-white shadow-emerald-500/20" :
                            employeeSkill.level === "high" ? "bg-orange-500 text-white shadow-orange-500/20" :
                              "bg-slate-100 text-slate-500")}>
                          {employeeSkill.level}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500/60 to-orange-500 rounded-full transition-all duration-1500 ease-out shadow-[0_0_10px_rgba(242,140,27,0.2)]"
                        style={{ width: `${employeeSkill.score || employeeSkill.proficiencyScore || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Activities */}
          <div className="card-premium border-none shadow-premium bg-white flex flex-col">
            <div className="p-10 border-b border-slate-50">
              <h3 className="text-xl font-display font-bold text-slate-900">Recommended Nodes</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">AI Matchmaking Index</p>
            </div>
            <div className="p-10 space-y-8 flex-1">
              {recommendedActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-2xl border border-slate-50 p-6 hover:border-orange-500/30 hover:bg-white hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-500 group/node bg-slate-50/50"
                >
                  <div className="flex flex-col gap-4 mb-6">
                    <h4 className="text-sm font-bold text-slate-900 group-hover/node:text-orange-500 transition-colors leading-snug">{activity.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed italic border-l-2 border-slate-200 pl-4">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      <span className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-orange-500/50" />
                        {activity.duration}
                      </span>
                    </div>
                    <button className="text-[10px] font-bold text-orange-500 uppercase tracking-widest hover:text-orange-600 transition-colors">
                      Intel Matrix
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => navigate("/employee/recommendations")}
                className="btn-secondary w-full h-14 rounded-2xl border-slate-100 font-bold uppercase text-[10px] tracking-widest italic flex items-center justify-center gap-3 group/matrix"
              >
                Expand Match Matrix
                <ArrowRight className="w-4 h-4 group-hover/matrix:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Operational Log */}
        <div className="card-premium border-none shadow-premium bg-white">
          <div className="p-10 border-b border-slate-50 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-display font-bold text-slate-900">Operational Log</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chronological achievement history</p>
            </div>
            <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-orange-500 transition-colors">Export Clear</button>
          </div>
          <div className="p-10">
            <div className="space-y-12 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
              <div className="flex items-start gap-8 relative group/log">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 relative z-10 transition-all duration-500 group-hover/log:bg-emerald-500 group-hover/log:text-white group-hover/log:shadow-lg group-hover/log:shadow-emerald-500/20">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 group-hover/log:text-white transition-colors" />
                </div>
                <div className="flex-1 pt-2">
                  <p className="text-sm font-bold text-slate-900">Completed Strategic Training node</p>
                  <p className="text-xs font-medium text-slate-500 mt-2">Python Fundamentals Increase: <span className="text-emerald-500 font-bold">+15%</span></p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3">TIMESTAMP: 24H_AGO</p>
                </div>
              </div>
              <div className="flex items-start gap-8 relative group/log">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 border border-orange-100 relative z-10 transition-all duration-500 group-hover/log:bg-orange-500 group-hover/log:text-white group-hover/log:shadow-lg group-hover/log:shadow-orange-500/20">
                  <Award className="h-6 w-6 text-orange-500 group-hover/log:text-white transition-colors" />
                </div>
                <div className="flex-1 pt-2">
                  <p className="text-sm font-bold text-slate-900">Node Elevation: Expert Status Achieved</p>
                  <p className="text-xs font-medium text-slate-500 mt-2">Capability: Problem Solving Matrix</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3">TIMESTAMP: 7D_AGO</p>
                </div>
              </div>
              <div className="flex items-start gap-8 relative group/log">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 relative z-10 transition-all duration-500 group-hover/log:bg-blue-500 group-hover/log:text-white group-hover/log:shadow-lg group-hover/log:shadow-blue-500/20">
                  <BookOpen className="h-6 w-6 text-blue-500 group-hover/log:text-white transition-colors" />
                </div>
                <div className="flex-1 pt-2">
                  <p className="text-sm font-bold text-slate-900">Deployment Enrollment: AWS Cloud Architecture</p>
                  <p className="text-xs font-medium text-slate-500 mt-2">Initiation Target: March 10, 2024</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3">TIMESTAMP: 14D_AGO</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
