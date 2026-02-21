"use client"

import { useState } from "react"
import { useData } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"
import { DashboardHeader } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Zap,
  Target,
  Trophy
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function EmployeeActivitiesPage() {
  const { activities, enrollments, enrollEmployee, unenrollEmployee } = useData()
  const { getEmployeeProfile } = useAuth()
  const employee = getEmployeeProfile ? getEmployeeProfile() : { id: "e1", name: "Mike Johnson" }
  const employeeId = employee?.id || "e1"

  const enrolledActivityIds = Object.entries(enrollments)
    .filter(([, empIds]) => empIds.includes(employeeId))
    .map(([actId]) => actId)

  const enrolledActivities = activities.filter(a => enrolledActivityIds.includes(a.id))
  const availableActivities = activities.filter(a => !enrolledActivityIds.includes(a.id) && a.status === "upcoming")

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen page-transition">
      <DashboardHeader title="Personnel Terminal" description="Neural development tracking and protocol synchronization" />

      <div className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-12 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row items-end justify-between border-b border-slate-100 pb-12 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em] font-sans">Operation Log</span>
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></span>
            </div>
            <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight italic uppercase">Mission Roster</h1>
            <p className="text-slate-400 font-medium text-sm">Review your active protocols and available training nodes.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-premium p-8 group hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Active Missions</span>
              <Target className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-4xl font-display font-black text-slate-900 tracking-tighter italic">{enrolledActivities.length}</div>
          </div>
          <div className="card-premium p-8 group hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Neural Hours</span>
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-4xl font-display font-black text-slate-900 tracking-tighter italic">184</div>
          </div>
          <div className="card-premium p-8 group hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Operational Rank</span>
              <Trophy className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="text-4xl font-display font-black text-orange-500 tracking-tighter italic">SIGMA-IV</div>
          </div>
        </div>

        <Tabs defaultValue="enrolled" className="space-y-10">
          <TabsList className="bg-slate-100 p-1.5 rounded-2xl h-14 w-fit inline-flex">
            <TabsTrigger value="enrolled" className="px-8 rounded-xl font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all italic">Active Protocols ({enrolledActivities.length})</TabsTrigger>
            <TabsTrigger value="available" className="px-8 rounded-xl font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all italic">Available Ops ({availableActivities.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="enrolled" className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in slide-in-from-bottom-4 duration-500 p-0">
            {enrolledActivities.length === 0 ? (
              <div className="col-span-full card-premium py-24 text-center border-none shadow-premium bg-white italic font-bold text-slate-300 uppercase tracking-widest">Buffer empty: No active missions detected.</div>
            ) : (
              enrolledActivities.map(activity => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  enrolled
                  employeeId={employeeId}
                  enrollEmployee={enrollEmployee}
                  unenrollEmployee={unenrollEmployee}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="available" className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in slide-in-from-bottom-4 duration-500 p-0">
            {availableActivities.length === 0 ? (
              <div className="col-span-full card-premium py-24 text-center border-none shadow-premium bg-white italic font-bold text-slate-300 uppercase tracking-widest">No matching operational nodes available in range.</div>
            ) : (
              availableActivities.map(activity => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  employeeId={employeeId}
                  enrollEmployee={enrollEmployee}
                  unenrollEmployee={unenrollEmployee}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ActivityCard({ activity, enrolled, employeeId, enrollEmployee, unenrollEmployee }) {
  const [processing, setProcessing] = useState(null)

  const handleEnroll = async () => {
    setProcessing('enroll')
    await new Promise(r => setTimeout(r, 1000))
    enrollEmployee(activity.id, employeeId)
    toast.success("MISSION COMMITTED", {
      description: `Target ${activity.title} synchronized.`
    })
    setProcessing(null)
  }

  const handleUnenroll = async () => {
    setProcessing('unenroll')
    await new Promise(r => setTimeout(r, 1000))
    unenrollEmployee(activity.id, employeeId)
    toast.error("MISSION ABORTED", {
      description: `Protocol synchronization for ${activity.title} cancelled.`
    })
    setProcessing(null)
  }

  return (
    <div className="card-premium p-10 group hover:border-orange-500/30 transition-all duration-500 bg-white border-none shadow-premium relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/[0.01] rounded-full -mr-24 -mt-24 group-hover:bg-orange-500/[0.03] transition-all duration-700"></div>

      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="badge-premium bg-slate-50 text-slate-400 border-none px-4 py-1.5 text-[10px] italic">
          {activity.type.toUpperCase()} NODE
        </div>
        {enrolled && (
          <div className="flex items-center gap-3 text-emerald-500">
            <span className="text-[10px] font-black uppercase tracking-widest italic">Sync Active</span>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        )}
      </div>

      <h3 className="text-2xl font-display font-bold text-slate-900 italic tracking-tight uppercase group-hover:translate-x-1 transition-transform mb-8">{activity.title}</h3>

      <div className="grid grid-cols-2 gap-8 mb-12 relative z-10">
        <div className="flex items-center gap-4 group/item">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-orange-500/10 transition-colors">
            <Calendar className="h-5 w-5 text-slate-300 group-hover/item:text-orange-500 transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Protocol Date</span>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">{new Date(activity.startDate).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 group/item">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-blue-500/10 transition-colors">
            <Clock className="h-5 w-5 text-slate-300 group-hover/item:text-blue-500 transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Duration</span>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">{activity.duration || "90 MINS"}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 group/item">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-indigo-500/10 transition-colors">
            <MapPin className="h-5 w-5 text-slate-300 group-hover/item:text-indigo-500 transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Deployment</span>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">{activity.location}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 group/item">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-emerald-500/10 transition-colors">
            <Users className="h-5 w-5 text-slate-300 group-hover/item:text-emerald-500 transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Saturation</span>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest italic">{activity.enrolledCount} / {activity.availableSeats}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 pt-10 border-t border-slate-50 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex -space-x-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-11 h-11 rounded-2xl border-4 border-white bg-slate-50 overflow-hidden grayscale hover:grayscale-0 transition-all cursor-crosshair">
                <img src={`https://i.pravatar.cc/150?u=${i + activity.id}`} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-11 h-11 rounded-2xl border-4 border-white bg-slate-900 flex items-center justify-center text-[10px] font-black text-white shadow-xl relative z-10 transition-transform hover:scale-110">+5</div>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">Personnel Active</span>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={handleEnroll}
            disabled={processing === 'enroll' || enrolled}
            className={cn(
              "btn-premium h-16 w-full rounded-2xl flex items-center justify-center gap-4 italic shadow-orange-500/10",
              enrolled && "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-none opacity-100 hover:scale-100 bg-none cursor-default"
            )}
          >
            {processing === 'enroll' ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
            <span className="font-black tracking-[0.1em] text-xs">
              {enrolled ? "PROTOCOL COMMITTED" : "INITIALIZE SYNC"}
            </span>
          </button>

          {enrolled && (
            <button
              onClick={handleUnenroll}
              disabled={processing === 'unenroll'}
              className="h-14 w-full rounded-2xl border border-rose-100 bg-white text-rose-500 hover:bg-rose-50 font-black uppercase tracking-[0.1em] text-[10px] italic transition-all flex items-center justify-center gap-4"
            >
              {processing === 'unenroll' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
              Abort Mission
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
