"use client"

import { useState } from "react"
import { useData } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Bell,
  UserPlus,
  Filter,
  Search,
  ChevronRight,
  Forward,
  Send,
  UserCheck,
  RefreshCcw,
  Sparkles,
  Briefcase,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

export default function ManagerAssignmentsPage() {
  const {
    assignments,
    updateAssignment,
    addNotification,
    activities,
    employees,
    departments,
    enrollEmployee,
  } = useData()
  const { user } = useAuth()

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    activityId: null,
    selectedIds: [],
    removedIds: []
  })

  // Get manager's department
  const managerDept = departments.find((d) => d.manager_id === user?.id)
  const deptName = managerDept?.name || "Engineering"

  // Get assignments for this manager's department
  const deptAssignments = assignments.filter((a) => {
    const emp = employees.find((e) => e.id === a.employeeId)
    return emp?.department === deptName
  })

  // Group by activity
  const assignmentsByActivity = deptAssignments.reduce(
    (acc, assignment) => {
      if (!acc[assignment.activityId]) {
        acc[assignment.activityId] = []
      }
      acc[assignment.activityId].push(assignment)
      return acc
    },
    {},
  )

  // Track local selection state per activity
  const [selections, setSelections] = useState({})

  const getSelectionsForActivity = (activityId) => {
    if (selections[activityId] !== undefined) return selections[activityId]
    // Default: all pending_manager assignments are selected
    return (assignmentsByActivity[activityId] || [])
      .filter((a) => a.status === "pending_manager")
      .map((a) => a.employeeId)
  }

  const toggleSelection = (activityId, employeeId) => {
    const current = getSelectionsForActivity(activityId)
    if (current.includes(employeeId)) {
      setSelections((prev) => ({
        ...prev,
        [activityId]: current.filter((id) => id !== employeeId),
      }))
    } else {
      setSelections((prev) => ({
        ...prev,
        [activityId]: [...current, employeeId],
      }))
    }
  }

  const handleConfirmAndNotify = (activityId) => {
    const activityAssignments = assignmentsByActivity[activityId] || []
    const selected = getSelectionsForActivity(activityId)
    const removed = activityAssignments
      .filter((a) => a.status === "pending_manager" && !selected.includes(a.employeeId))
      .map((a) => a.employeeId)

    setConfirmDialog({
      open: true,
      activityId,
      selectedIds: selected,
      removedIds: removed,
    })
  }

  const executeConfirmAndNotify = () => {
    if (!confirmDialog.activityId || !confirmDialog.selectedIds || !user) return

    const activityId = confirmDialog.activityId
    const selectedIds = confirmDialog.selectedIds
    const activity = activities.find((a) => a.id === activityId)
    const activityAssignments = assignmentsByActivity[activityId] || []

    // Update selected assignments
    activityAssignments.forEach((assignment) => {
      if (selectedIds.includes(assignment.employeeId)) {
        updateAssignment(assignment.id, {
          status: "notified",
          managerConfirmed: true,
          managerConfirmedDate: new Date(),
          employeeNotified: true,
          employeeNotifiedDate: new Date(),
        })

        // Enroll the employee
        enrollEmployee(activityId, assignment.employeeId)

        // Find the employee's userId to send notification
        const emp = employees.find((e) => e.id === assignment.employeeId)
        if (emp) {
          addNotification({
            userId: emp.userId,
            type: "assignment",
            title: "New Protocol Assignment",
            message: `You have been assigned to "${activity?.title}". Please review the activity details and confirm your participation.`,
            date: new Date(),
            read: false,
            link: "/employee/recommendations",
            metadata: { activityId, assignmentId: assignment.id },
          })
        }
      } else {
        // Remove non-selected assignments
        updateAssignment(assignment.id, {
          status: "declined",
          managerConfirmed: false,
        })
      }
    })

    toast.success(
      `${selectedIds.length} employees confirmed and notified for "${activity?.title}"`,
    )
    setConfirmDialog({ open: false, activityId: null, selectedIds: [], removedIds: [] })
  }

  const pendingActivities = Object.entries(assignmentsByActivity).filter(
    ([, assgns]) => assgns.some((a) => a.status === "pending_manager"),
  )

  const confirmedActivities = Object.entries(assignmentsByActivity).filter(
    ([, assgns]) => assgns.every((a) => a.status !== "pending_manager"),
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending_manager":
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 rounded-[4px] font-bold uppercase text-[9px] italic">
            <Clock className="mr-1 h-3 w-3" />
            Pending Review
          </Badge>
        )
      case "confirmed":
      case "notified":
        return (
          <Badge variant="outline" className="text-[#F28C1B] border-[#F28C1B]/30 bg-[#F28C1B]/5 rounded-[4px] font-bold uppercase text-[9px] italic">
            <Bell className="mr-1 h-3 w-3" />
            Notified
          </Badge>
        )
      case "accepted":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 rounded-[4px] font-bold uppercase text-[9px] italic border">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Accepted
          </Badge>
        )
      case "declined":
        return (
          <Badge variant="outline" className="text-rose-500 border-rose-500/30 bg-rose-50 rounded-[4px] font-bold uppercase text-[9px] italic">
            <XCircle className="mr-1 h-3 w-3" />
            Declined
          </Badge>
        )
      default:
        return <Badge variant="secondary" className="rounded-[4px] font-bold uppercase text-[9px] italic">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen page-transition">
      <DashboardHeader title="Management Hub" description="Personnel assignments and sectoral deployment control" />

      <div className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-12">
        {pendingActivities.length === 0 && confirmedActivities.length === 0 && (
          <div className="glass-panel p-24 text-center group">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-orange-50 transition-colors duration-500">
              <Forward className="h-10 w-10 text-slate-300 group-hover:text-orange-500 transition-all duration-500" />
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">No Assignments Detected</h3>
            <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
              The communication queue is clear. HR has not yet forwarded personnel recommendations for your sector.
            </p>
          </div>
        )}

        {/* Pending Review */}
        {pendingActivities.length > 0 && (
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">Deployment Control</span>
              <h1 className="text-3xl font-display font-bold text-slate-900">Pending Evaluations</h1>
            </div>

            <div className="grid gap-10">
              {pendingActivities.map(([activityId, activityAssignments]) => {
                const activity = activities.find((a) => a.id === activityId)
                if (!activity) return null

                const selected = getSelectionsForActivity(activityId)
                const pendingOnes = activityAssignments.filter(
                  (a) => a.status === "pending_manager",
                )

                return (
                  <div key={activityId} className="card-premium p-0 border-none bg-white">
                    <div className="p-8 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                      <div>
                        <h3 className="text-xl font-display font-bold text-slate-900 leading-tight">{activity.title}</h3>
                        <p className="text-sm text-slate-500 font-medium mt-2 max-w-2xl leading-relaxed">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-6 mt-6">
                          <span className="flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                            <Calendar className="h-4 w-4 text-orange-500" />
                            {new Date(activity.startDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                            <Users className="h-4 w-4 text-orange-500" />
                            {activity.availableSeats - activity.enrolledCount} UNITS REMAINING
                          </span>
                        </div>
                      </div>
                      <div className="badge-premium px-4 py-2">
                        {pendingOnes.length} Pending Nodes
                      </div>
                    </div>

                    <div className="p-8 space-y-6">
                      {activityAssignments
                        .filter((a) => a.status === "pending_manager")
                        .sort((a, b) => b.scores.overallScore - a.scores.overallScore)
                        .map((assignment) => {
                          const emp = employees.find((e) => e.id === assignment.employeeId)
                          if (!emp) return null

                          const isSelected = selected.includes(assignment.employeeId)

                          return (
                            <div
                              key={assignment.id}
                              className={cn(
                                "flex items-start gap-6 p-6 rounded-2xl border transition-all duration-500",
                                isSelected
                                  ? "border-orange-500/30 bg-orange-500/[0.02] shadow-sm shadow-orange-500/5"
                                  : "border-slate-100 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 bg-slate-50/30 hover:bg-white",
                              )}
                            >
                              <div className="pt-1.5">
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() =>
                                    toggleSelection(activityId, assignment.employeeId)
                                  }
                                  className="h-6 w-6 border-slate-200 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 rounded-lg transition-all duration-300"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-6">
                                  <div className="flex items-center gap-5">
                                    <Avatar className="h-14 w-14 rounded-xl border border-slate-100 shadow-sm">
                                      <AvatarImage src={emp.avatar || `https://i.pravatar.cc/150?u=${emp.id}`} className="object-cover" />
                                      <AvatarFallback className="bg-slate-100 text-orange-500 font-bold">{emp.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-lg font-bold text-slate-900 leading-none">
                                        {emp.name}
                                      </p>
                                      <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mt-2 opacity-80">
                                        {emp.position}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-3xl font-display font-black text-slate-900 tracking-tight leading-none">
                                      {assignment.scores.overallScore}<span className="text-base ml-0.5">%</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1 opacity-60">
                                      MATCH INDEX
                                    </p>
                                  </div>
                                </div>

                                {/* Score breakdown */}
                                <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
                                  <ScoreMetric label="NEURAL SKILLS" value={assignment.scores.skillMatch} icon={Sparkles} />
                                  <ScoreMetric label="SERVICE EXP" value={assignment.scores.experienceMatch} icon={Briefcase} />
                                  <ScoreMetric label="GROWTH PATH" value={assignment.scores.growthPotential} icon={TrendingUp} />
                                  <ScoreMetric label="UNIT FIT" value={assignment.scores.contextFit} icon={Target} />
                                </div>

                                {/* Reasoning */}
                                <div className="mt-8 flex items-start gap-4 p-5 rounded-xl bg-slate-50 border border-slate-100 hover:border-orange-500/20 transition-all duration-300">
                                  <Info className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                                  <p className="text-xs font-medium text-slate-500 leading-relaxed italic m-0">
                                    "{assignment.reasoning}"
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                    </div>

                    <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] m-0">
                        {selected.length} OF {pendingOnes.length} UNITS SELECTED FOR DEPLOYMENT
                      </p>
                      <button
                        onClick={() => handleConfirmAndNotify(activityId)}
                        disabled={selected.length === 0}
                        className="btn-premium px-8 h-12 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        COMMIT SELECTION ({selected.length})
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Already Processed */}
        {confirmedActivities.length > 0 && (
          <div className="space-y-8 pt-8 border-t border-slate-100">
            <div className="flex flex-col gap-2 opacity-60">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">History Archive</span>
              <h1 className="text-3xl font-display font-bold text-slate-900">Processed Protocols</h1>
            </div>

            <div className="grid gap-6">
              {confirmedActivities.map(([activityId, activityAssignments]) => {
                const activity = activities.find((a) => a.id === activityId)
                if (!activity) return null

                return (
                  <div key={activityId} className="card-premium p-6 flex flex-col md:flex-row items-center justify-between gap-8 opacity-80 group hover:opacity-100">
                    <div className="flex items-center gap-8">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-500/20 transition-all duration-500">
                        <CheckCircle2 className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 leading-tight m-0">{activity.title}</h3>
                        <div className="flex items-center gap-3 mt-1.5 px-0.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{activityAssignments.length} UNITS ASSIGNED</span>
                          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                            {new Date(activity.startDate).toLocaleDateString("en-US", { month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex -space-x-3">
                      {activityAssignments.slice(0, 5).map((a, i) => {
                        const emp = employees.find(e => e.id === a.employeeId)
                        return (
                          <Avatar key={i} className="w-11 h-11 border-[3px] border-white rounded-xl shadow-sm grayscale group-hover:grayscale-0 transition-all duration-500">
                            <AvatarImage src={emp?.avatar || `https://i.pravatar.cc/150?u=${a.id}`} className="object-cover" />
                            <AvatarFallback>{emp?.name[0]}</AvatarFallback>
                          </Avatar>
                        )
                      })}
                      {activityAssignments.length > 5 && (
                        <div className="w-11 h-11 rounded-xl bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center border-[3px] border-white shadow-sm">
                          +{activityAssignments.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
      >
        <DialogContent className="max-w-[500px] bg-white border-none rounded-3xl p-0 overflow-hidden shadow-2xl">
          <div className="bg-slate-900 px-10 py-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -mr-32 -mt-32 blur-[80px] animate-pulse"></div>
            <DialogHeader className="relative z-10">
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.4em] mb-4 block">Selection Protocol</span>
              <DialogTitle className="text-3xl font-display font-bold text-white tracking-tight">Deploy Personnel</DialogTitle>
              <DialogDescription className="text-sm text-slate-400 font-medium mt-3 leading-relaxed">
                You are about to authorize the deployment of {confirmDialog.selectedIds?.length || 0} candidates. This will update their training rosters and trigger immediate notifications.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-10">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-display font-black text-slate-900 tracking-tighter">
                {confirmDialog.selectedIds?.length || 0}
              </span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3 m-0">Units ready for synchronization</p>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-4 px-10 pb-10 pt-0 border-none">
            <button
              type="button"
              onClick={() => setConfirmDialog({ open: false, activityId: null, selectedIds: [], removedIds: [] })}
              className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold h-14 rounded-2xl uppercase tracking-widest text-[10px] transition-all duration-300"
            >
              Cancel Operation
            </button>
            <button
              onClick={executeConfirmAndNotify}
              className="btn-premium flex-1 h-14 rounded-2xl"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Confirm Deployment
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ScoreMetric({ label, value, icon: Icon }) {
  return (
    <div className="space-y-3 group/metric">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover/metric:text-orange-500 transition-colors duration-300">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </span>
        <span className="text-xs font-bold text-slate-700">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(242,140,27,0.3)]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}






