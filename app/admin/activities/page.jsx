"use client"

import { useState } from "react"
import { useData } from "@/lib/data-store"
import { DashboardHeader } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Plus,
  Calendar,
  Clock,
  Users,
  Filter,
  Search,
  Target,
  Zap,
  ChevronRight,
  MoreVertical,
  Activity as ActivityIcon,
  Trash2,
  Edit2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ActivityDialog } from "@/components/dialogs/activity-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export default function AdminActivitiesPage() {
  const { activities, deleteActivity } = useData()
  const [searchQuery, setSearchQuery] = useState("")

  // Dialog State
  const [activityDialogOpen, setActivityDialogOpen] = useState(false)
  const [activityDialogMode, setActivityDialogMode] = useState("create")
  const [currentActivity, setCurrentActivity] = useState(null)

  const handleCreateActivity = () => {
    setActivityDialogMode("create")
    setCurrentActivity(null)
    setActivityDialogOpen(true)
  }

  const handleEditActivity = (activity) => {
    setActivityDialogMode("edit")
    setCurrentActivity(activity)
    setActivityDialogOpen(true)
  }

  const handleDeleteActivity = (id) => {
    deleteActivity(id)
    toast.success("ACTIVITY PURGED", {
      description: "Operational record has been successfully terminated."
    })
  }

  const filteredActivities = activities?.filter(activity =>
    activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen page-transition">
      <DashboardHeader title="Command Intelligence" description="Strategic oversight and organizational talent matrix" />

      <div className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-12 animate-in fade-in duration-700">

        {/* Management Control Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-slate-100">
          <div className="space-y-2">
            <h2 className="text-3xl font-display font-black text-slate-900 uppercase italic tracking-tighter">Strategic Protocols</h2>
            <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              <ActivityIcon className="h-3 w-3 text-orange-500" />
              {activities?.length || 0} ACTIVE OPERATIONAL NODES
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="PROBE NODE DATABASE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/20 transition-all shadow-sm"
              />
            </div>
            <Button
              onClick={handleCreateActivity}
              className="btn-premium px-8 h-12 rounded-2xl flex items-center gap-3 italic"
            >
              <Plus className="w-4 h-4 text-white" />
              INITIATE PROTOCOL
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StatCard
            label="Neural Hubs"
            value={activities?.length || 0}
            icon={Target}
            color="orange"
          />
          <StatCard
            label="Synchronized"
            value={activities?.filter(a => a.status === "active").length || 0}
            icon={Zap}
            color="emerald"
          />
          <StatCard
            label="Pending Sync"
            value={activities?.filter(a => a.status === "upcoming").length || 0}
            icon={Clock}
            color="blue"
          />
          <StatCard
            label="Archived"
            value={activities?.filter(a => a.status === "completed").length || 0}
            icon={Calendar}
            color="slate"
          />
        </div>

        {/* Protocols Canvas */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] font-sans">Active Matrix Nodes</h3>
            <button className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic flex items-center gap-2 hover:translate-x-1 transition-transform">
              Export Matrix <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="card-premium p-8 flex flex-col md:flex-row items-center justify-between gap-10 group hover:scale-[1.01]"
                >
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-2 h-10 rounded-full",
                        activity.status === "active" ? "bg-emerald-500" :
                          activity.status === "upcoming" ? "bg-orange-500" : "bg-slate-300"
                      )}></div>
                      <div>
                        <h4 className="text-xl font-display font-black text-slate-900 group-hover:text-orange-500 transition-colors uppercase italic tracking-tight">{activity.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{activity.type}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span className={cn(
                            "text-[9px] font-black uppercase tracking-widest",
                            activity.status === "active" ? "text-emerald-600" :
                              activity.status === "upcoming" ? "text-orange-600" : "text-slate-400"
                          )}>{activity.status}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 m-0 leading-relaxed font-medium italic line-clamp-2 max-w-2xl">{activity.description}</p>
                    <div className="flex items-center gap-8 pt-2">
                      <Attribute value={activity.participants?.length || 0} label="Assets" icon={Users} />
                      <Attribute value={activity.date || "TBD"} label="Window" icon={Calendar} />
                      <Attribute value={activity.duration || "N/A"} label="Delta" icon={Clock} />
                      <Attribute value={activity.availableSeats || 0} label="Core Vacancy" icon={Target} />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditActivity(activity)}
                      className="h-11 px-6 bg-slate-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest italic hover:bg-white hover:shadow-lg transition-all"
                    >
                      Configure
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl text-slate-300 hover:text-slate-900">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white border-none rounded-2xl shadow-premium p-2">
                        <DropdownMenuItem
                          onClick={() => handleEditActivity(activity)}
                          className="rounded-xl py-3 px-4 text-[10px] font-bold uppercase tracking-widest italic text-slate-600 focus:bg-orange-50 focus:text-orange-600 cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4 mr-3" />
                          Update Payload
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteActivity(activity.id)}
                          className="rounded-xl py-3 px-4 text-[10px] font-bold uppercase tracking-widest italic text-rose-500 focus:bg-rose-50 focus:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mr-3" />
                          Purge Node
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : (
              <div className="card-premium p-20 flex flex-col items-center justify-center text-center bg-white/50 border-dashed">
                <div className="w-16 h-16 rounded-[1.25rem] bg-slate-100 flex items-center justify-center mb-6">
                  <ActivityIcon className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-display font-black text-slate-400 uppercase italic">No Strategic Signals</h3>
                <p className="text-xs text-slate-300 font-bold uppercase tracking-widest mt-2">Database is awaiting operational initialization.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ActivityDialog
        open={activityDialogOpen}
        onOpenChange={setActivityDialogOpen}
        activity={currentActivity}
        mode={activityDialogMode}
      />
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color }) {
  const colors = {
    orange: "bg-orange-50 text-orange-600",
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    slate: "bg-slate-50 text-slate-600"
  }

  return (
    <Card className="card-premium border-none bg-white p-8">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{label}</p>
          <p className="text-4xl font-display font-black text-slate-900 leading-none">{value}</p>
        </div>
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-current/10", colors[color])}>
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </Card>
  )
}

function Attribute({ value, label, icon: Icon }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Icon className="w-3 h-3 text-slate-300" />
        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">{label}</span>
      </div>
      <span className="text-[11px] font-black text-slate-900 uppercase italic">{value}</span>
    </div>
  )
}

