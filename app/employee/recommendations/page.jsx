"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-store"
import { DashboardHeader } from "@/components/dashboard/header"
import {
  Clock,
  Star,
  Target,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Trophy,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function EmployeeRecommendationsPage() {
  const { getEmployeeProfile } = useAuth()
  const { activities, enrollments, enrollEmployee, unenrollEmployee } = useData()
  const [processingId, setProcessingId] = useState(null)

  const employeeProfile = getEmployeeProfile ? getEmployeeProfile() : null
  const employee = employeeProfile || { id: "e1", name: "Mike Johnson", skills: [] }

  const handleEnroll = async (activityId, title) => {
    setProcessingId(activityId)
    await new Promise(r => setTimeout(r, 1000))
    enrollEmployee(activityId, employee.id)
    toast.success("MISSION COMMITTED", {
      description: `Training protocols for ${title} have been initialized.`
    })
    setProcessingId(null)
  }

  const handleUnenroll = async (activityId, title) => {
    setProcessingId(activityId)
    await new Promise(r => setTimeout(r, 1000))
    unenrollEmployee(activityId, employee.id)
    toast.error("MISSION ABORTED", {
      description: `Protocol synchronization for ${title} has been cancelled.`
    })
    setProcessingId(null)
  }

  const recommendedActivities = activities
    .filter(a => a.status === "upcoming")
    .map(activity => {
      let matchScore = 0
      let growthPotential = 0

      activity.requiredSkills.forEach(rs => {
        const employeeSkill = employee.skills.find(s => s.skillId === rs.skillId)
        if (employeeSkill) {
          matchScore += (employeeSkill.score || employeeSkill.proficiencyScore || 0) / 100 * rs.weight
        } else {
          growthPotential += rs.weight
        }
      })

      const totalWeight = activity.requiredSkills.reduce((acc, rs) => acc + rs.weight, 0)
      const normalizedMatch = totalWeight > 0 ? (matchScore / totalWeight) * 100 : 0
      const normalizedGrowth = totalWeight > 0 ? (growthPotential / totalWeight) * 100 : 0

      const enrolledList = enrollments[activity.id] || []
      const isEnrolled = enrolledList.includes(employee.id)

      return {
        activity,
        matchScore: Math.round(normalizedMatch),
        growthPotential: Math.round(normalizedGrowth),
        overallScore: Math.round((normalizedMatch * 0.6) + (normalizedGrowth * 0.4)),
        isEnrolled
      }
    })
    .sort((a, b) => b.overallScore - a.overallScore)

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen page-transition">
      <DashboardHeader title="Personnel Terminal" description="Neural development tracking and protocol synchronization" />

      <div className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-12 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b border-slate-100 pb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em] font-sans">Strategic Deployment</span>
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></span>
            </div>
            <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight">Recommended Missions</h1>
            <p className="text-slate-400 font-medium text-sm">AI-calibrated growth paths based on your current neural matrix profile.</p>
          </div>

          <div className="glass-panel py-6 px-10 flex items-center gap-6 border-slate-200 shadow-sm group">
            <div className="w-14 h-14 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:rotate-12 transition-transform duration-500">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">Neural Signal Calibrated</span>
              <span className="text-lg font-display font-black text-slate-900 leading-none">ID: SYS-{employee.id.substring(0, 4).toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {recommendedActivities.map(({ activity, matchScore, growthPotential, overallScore, isEnrolled }, index) => (
            <div key={activity.id} className="card-premium p-10 group hover:border-orange-500/30 transition-all duration-700 bg-white shadow-premium hover:shadow-premium-hover border-none relative overflow-hidden">
              {/* Geometric Background Accents */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/[0.02] rounded-full -mr-40 -mt-40 group-hover:bg-orange-500/[0.04] transition-all duration-1000 blur-3xl"></div>

              <div className="flex justify-between items-start mb-16 relative z-10">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(242,140,27,0.4)]"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Tier {index < 2 ? 'I' : 'II'} Priority Match</span>
                  </div>
                  <span className="text-6xl font-display font-black text-orange-500/10 tracking-tighter leading-none group-hover:text-orange-500 transition-colors duration-700">0{index + 1}</span>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Match Affinity</span>
                  <div className="relative group/score">
                    <p className="text-6xl font-display font-black text-slate-900 tracking-tighter leading-none italic group-hover:text-orange-500 transition-colors duration-500 flex items-start">
                      {overallScore}<span className="text-2xl mt-1 ml-1 font-black opacity-20 group-hover:opacity-40 transition-opacity">%</span>
                    </p>
                    <div className="absolute -bottom-2 right-0 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 w-full origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-10 relative z-10">
                <h3 className="text-3xl font-display font-bold text-slate-900 leading-tight group-hover:translate-x-2 transition-transform duration-500">{activity.title}</h3>
                <p className="text-base text-slate-500 font-medium leading-relaxed border-l-2 border-slate-100 pl-8 group-hover:border-orange-500/40 transition-all duration-700 italic group-hover:text-slate-600">
                  "{activity.description}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-12 relative z-10">
                <div className="space-y-5">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em]">
                    <span className="text-slate-400">Core Alignment</span>
                    <span className="text-slate-900">{matchScore}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner p-[2px]">
                    <div className="h-full bg-orange-500 rounded-full shadow-[0_0_12px_rgba(242,140,27,0.4)] transition-all duration-1500 ease-out" style={{ width: `${matchScore}%` }}></div>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em]">
                    <span className="text-slate-400">Growth Delta</span>
                    <span className="text-slate-900">{growthPotential}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner p-[2px]">
                    <div className="h-full bg-slate-900 rounded-full transition-all duration-1500 delay-300 ease-out" style={{ width: `${growthPotential}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-8 pt-12 border-t border-slate-100 relative z-10">
                <div className="flex gap-12">
                  <div className="flex items-center gap-4 group/info">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover/info:bg-orange-500/10 transition-colors duration-500">
                      <Clock className="h-5 w-5 text-slate-400 group-hover/info:text-orange-500 transition-colors" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Duration</span>
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">{activity.duration || "90 Minutes"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group/info">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover/info:bg-indigo-500/10 transition-colors duration-500">
                      <Zap className="h-5 w-5 text-slate-400 group-hover/info:text-indigo-500 transition-colors" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Impact</span>
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">{activity.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-5 w-full">
                  <button
                    onClick={() => handleEnroll(activity.id, activity.title)}
                    disabled={processingId === activity.id || isEnrolled}
                    className={cn(
                      "btn-premium flex-1 items-center justify-center py-6 h-auto text-sm leading-none rounded-2xl gap-4 shadow-orange-500/20",
                      isEnrolled && "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-none opacity-100 hover:scale-100 bg-none cursor-default"
                    )}
                  >
                    {processingId === activity.id && !isEnrolled ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isEnrolled ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                    <span className="tracking-[0.1em] font-black italic">
                      {isEnrolled ? "MISSION COMMITTED" : "INITIALIZE PROTOCOL"}
                    </span>
                  </button>

                  <button
                    onClick={() => handleUnenroll(activity.id, activity.title)}
                    disabled={processingId === activity.id || !isEnrolled}
                    className={cn(
                      "h-16 px-10 rounded-2xl flex items-center justify-center gap-4 transition-all duration-300 font-black uppercase tracking-[0.1em] text-[10px] italic shadow-sm",
                      !isEnrolled
                        ? "bg-slate-50 text-slate-200 border border-slate-100 opacity-50 cursor-not-allowed"
                        : "bg-white border border-rose-100 text-rose-500 hover:bg-rose-50 hover:border-rose-200 active:scale-95"
                    )}
                  >
                    {processingId === activity.id && isEnrolled ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                    Abort Sync
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
