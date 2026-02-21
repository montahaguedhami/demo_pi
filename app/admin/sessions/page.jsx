"use client"

import { useState } from "react"
import { useData } from "@/lib/data-store"
import { DashboardHeader } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Calendar,
  Clock,
  MapPin,
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  Users,
  UserPlus,
  Target,
  Shield,
  Zap
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { SessionDialog } from "@/components/dialogs/session-dialog"
import { EnrollmentDialog } from "@/components/dialogs/enrollment-dialog"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"

export default function SessionsPage() {
  const { sessions, deleteSession, activities } = useData()

  const [sessionDialogOpen, setSessionDialogOpen] = useState(false)
  const [sessionDialogMode, setSessionDialogMode] = useState("create")
  const [currentSession, setCurrentSession] = useState(null)

  const [enrollmentDialogOpen, setEnrollmentDialogOpen] = useState(false)
  const [selectedSessionForEnroll, setSelectedSessionForEnroll] = useState(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState(null)

  const openSessionDialog = (mode, session) => {
    setSessionDialogMode(mode)
    setCurrentSession(session)
    setSessionDialogOpen(true)
  }

  const openEnrollDialog = (session) => {
    setSelectedSessionForEnroll(session)
    setEnrollmentDialogOpen(true)
  }

  const handleDeleteClick = (session) => {
    setSessionToDelete(session)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (sessionToDelete) {
      deleteSession(sessionToDelete.id)
      toast.success("SESSION TERMINATED", {
        description: `"${sessionToDelete.title.toUpperCase()}" has been purged from the temporal stack.`
      })
      setSessionToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: "bg-blue-500/10 text-blue-500",
      "in-progress": "bg-[#F28C1B]/10 text-[#F28C1B]",
      completed: "bg-emerald-500/10 text-emerald-500",
      cancelled: "bg-rose-500/10 text-rose-500",
    }
    return (
      <Badge variant="outline" className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1 border-none italic", styles[status])}>
        {status?.replace("-", " ")}
      </Badge>
    )
  }

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen page-transition">
      <DashboardHeader title="Command Intelligence" description="Strategic oversight and organizational talent matrix" />

      <div className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-12 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row items-end justify-between border-b border-slate-100 pb-12 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em] font-sans">Temporal Management</span>
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></span>
            </div>
            <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight italic uppercase">Session Control</h1>
            <p className="text-slate-400 font-medium text-sm">Orchestrate tactical training sessions and personnel deployment.</p>
          </div>
          <button
            onClick={() => openSessionDialog("create")}
            className="btn-premium h-14 px-8 rounded-2xl flex items-center gap-3 shadow-orange-500/10 italic"
          >
            <Plus className="h-4 w-4" />
            Initialize Session
          </button>
        </div>

        {/* Sessions Data Table */}
        <div className="card-premium border-none shadow-premium bg-white overflow-hidden">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center group">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 border border-slate-100 group-hover:rotate-12 transition-transform duration-500">
                <Calendar className="w-8 h-8 text-slate-200" />
              </div>
              <h3 className="text-xl font-display font-black text-slate-900 uppercase italic">Temporal Stack Empty</h3>
              <p className="text-sm font-medium text-slate-400 mt-2 mb-10 max-w-xs mx-auto">
                No active training sessions detected in the primary archives.
              </p>
              <button onClick={() => openSessionDialog("create")} className="btn-premium h-12 px-8 rounded-xl italic">
                Schedule First Session
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Session Descriptor</TableHead>
                    <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Operational Node</TableHead>
                    <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Temporal Matrix</TableHead>
                    <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Vector</TableHead>
                    <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Personnel</TableHead>
                    <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-center">Status</TableHead>
                    <TableHead className="w-[80px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => {
                    const activity = activities.find(a => a.id === session.activityId)
                    return (
                      <TableRow key={session.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors group">
                        <TableCell className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-[15px] font-display font-black text-slate-900 italic tracking-tight uppercase group-hover:text-orange-500 transition-colors">{session.title}</span>
                            {session.instructor && (
                              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Lead: {session.instructor}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-slate-200 bg-white">
                            {activity?.title || "UNLINKED"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                              <Calendar className="h-3.5 w-3.5 text-orange-500/50" />
                              {new Date(session.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                              <Clock className="h-3 w-3" />
                              {session.startTime} — {session.endTime}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase italic">
                            <MapPin className="h-3.5 w-3.5 text-indigo-500/50" />
                            {session.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-16 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
                              <span className="text-[11px] font-black text-slate-900 italic tracking-tighter">
                                {session.enrolledParticipants?.length || 0} / {session.maxParticipants}
                              </span>
                            </div>
                            <div className="flex -space-x-3">
                              {[1, 2, 3].map(i => (
                                <div key={i} className="w-6 h-6 rounded-lg border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                                  <img src={`https://i.pravatar.cc/150?u=${i + session.id}`} alt="" />
                                </div>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{getStatusBadge(session.status)}</TableCell>
                        <TableCell className="pr-8">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-400 hover:text-orange-500 border border-transparent hover:border-slate-100">
                                <MoreHorizontal className="h-5 w-5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border-none rounded-[1.5rem] shadow-2xl p-3 min-w-[220px] animate-in zoom-in-95 duration-200">
                              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] px-3 pt-2 pb-4 italic">Operational Protocol</p>
                              <DropdownMenuItem
                                onClick={() => openEnrollDialog(session)}
                                className="flex items-center gap-3.5 text-[11px] font-black text-slate-900 uppercase italic px-4 py-3.5 rounded-xl cursor-pointer hover:bg-orange-500/5 hover:text-orange-500 focus:bg-orange-500/5 focus:text-orange-500 transition-colors"
                              >
                                <UserPlus className="h-4 w-4" /> Manage Personnel
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openSessionDialog("edit", session)}
                                className="flex items-center gap-3.5 text-[11px] font-black text-slate-900 uppercase italic px-4 py-3.5 rounded-xl cursor-pointer hover:bg-blue-500/5 hover:text-blue-500 focus:bg-blue-500/5 focus:text-blue-500 transition-colors"
                              >
                                <Pencil className="h-4 w-4" /> Modify Matrix
                              </DropdownMenuItem>
                              <div className="h-px bg-slate-50 my-2" />
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(session)}
                                className="flex items-center gap-3.5 text-[11px] font-black text-rose-500 uppercase italic px-4 py-3.5 rounded-xl cursor-pointer hover:bg-rose-500/5 focus:bg-rose-500/5 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" /> Purge Session
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <SessionDialog
        open={sessionDialogOpen}
        onOpenChange={setSessionDialogOpen}
        session={currentSession}
        mode={sessionDialogMode}
      />

      {selectedSessionForEnroll && (
        <EnrollmentDialog
          open={enrollmentDialogOpen}
          onOpenChange={setEnrollmentDialogOpen}
          activity={activities.find(a => a.id === selectedSessionForEnroll.activityId) || { id: selectedSessionForEnroll.activityId, title: selectedSessionForEnroll.title, availableSeats: selectedSessionForEnroll.maxParticipants }}
        />
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Protocol Termination"
        description={`Confirm permanent purging of "${sessionToDelete?.title.toUpperCase()}" target from the system?`}
        confirmText="Confirm Purge"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />
    </div>
  )
}
