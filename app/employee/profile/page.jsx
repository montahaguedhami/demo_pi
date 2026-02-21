"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-store"
import { employees } from "@/lib/mock-data"
import { DashboardHeader } from "@/components/dashboard/header"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Download, Edit, Hash, Mail, Briefcase, Calendar, CircleDot,
  Trophy, Shield, Zap, Sparkles
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function EmployeeProfilePage() {
  const { getEmployeeProfile } = useAuth()
  const { updateEmployee } = useData()
  const employeeProfile = getEmployeeProfile()

  // For demo, use first employee if no profile found
  const employee = employeeProfile || employees[0]

  const [editDialog, setEditDialog] = useState(false)
  const [formData, setFormData] = useState({
    name: employee.name,
    email: employee.email,
    position: employee.position,
    jobDescription: employee.jobDescription,
  })

  const getInitials = (name) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U"
  }

  const handleOpenEdit = () => {
    setFormData({
      name: employee.name,
      email: employee.email,
      position: employee.position,
      jobDescription: employee.jobDescription,
    })
    setEditDialog(true)
  }

  const handleSaveProfile = () => {
    updateEmployee(employee.id, formData)
    toast.success("PROFILE SYNCHRONIZED", {
      description: "Neural core identity has been updated."
    })
    setEditDialog(false)
  }

  const handleExportCV = () => {
    const cvContent = `
CURRICULUM VITAE - NEURAL CORE PROFILE

IDENTITY: ${employee.name}
MATRICULE: ${employee.matricule}
EMAIL: ${employee.email}
COMM-LINK: ${employee.telephone}
ROLE: ${employee.position}
DIVISION: ${employee.department}
SYNC-DATE: ${new Date(employee.date_embauche).toLocaleDateString()}
EXPERIENCE: ${employee.yearsOfExperience} YEARS
STATUS: ${employee.status.toUpperCase()}

MISSION PARAMETERS:
${employee.jobDescription}

NEURAL CAPABILITIES:
${employee.skills.map(s => `- ${s.skill.name}: ${s.level} (CALIB: ${s.proficiencyScore || s.score}%)`).join('\n')}
    `.trim()

    const blob = new Blob([cvContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `SYNC_${employee.name.replace(/\s+/g, '_')}_CORE.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("INTEL EXPORTED", {
      description: "Personnel synchronization data downloaded."
    })
  }

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen page-transition">
      <DashboardHeader title="Personnel Terminal" description="Neural identity calibration and professional status monitor" />

      <div className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-12 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row items-end justify-between border-b border-slate-100 pb-12 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em] font-sans">Core Identity</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight italic uppercase">Personnel File</h1>
            <p className="text-slate-400 font-medium text-sm">Full neural calibration and capability matrix synchronization.</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleExportCV}
              className="h-14 px-8 rounded-2xl bg-white border border-slate-100 text-slate-600 font-bold uppercase text-[10px] tracking-widest hover:border-orange-500/30 hover:text-orange-500 transition-all duration-300 shadow-sm flex items-center gap-3"
            >
              <Download className="h-4 w-4" />
              Intelligence Export
            </button>
            <button
              onClick={handleOpenEdit}
              className="btn-premium h-14 px-8 rounded-2xl flex items-center gap-3 shadow-orange-500/10 italic"
            >
              <Edit className="h-4 w-4" />
              Recalibrate Profile
            </button>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="lg:col-span-1 card-premium border-none shadow-premium bg-white group overflow-hidden">
            <div className="h-32 bg-slate-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/[0.03] rounded-full -mr-24 -mt-24 group-hover:bg-orange-500/[0.06] transition-all duration-700"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/[0.02] rounded-full -ml-16 -mb-16"></div>
            </div>
            <div className="px-10 pb-12 pt-0 -mt-16 relative flex flex-col items-center">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-tr from-orange-500 to-amber-300 rounded-[2.5rem] opacity-20 group-hover:opacity-40 transition-all duration-700 blur-lg"></div>
                <Avatar className="h-36 w-36 rounded-[2.5rem] border-4 border-white shadow-2xl relative transition-transform duration-700 group-hover:scale-105">
                  <AvatarImage src={employee.avatar || `https://i.pravatar.cc/300?u=${employee.id}`} />
                  <AvatarFallback className="bg-slate-900 text-white text-4xl font-display font-black">
                    {getInitials(employee.name)}
                  </AvatarFallback>
                </Avatar>
                {employee.en_ligne && (
                  <div className="absolute bottom-2 right-2 h-6 w-6 rounded-xl bg-white border-2 border-white shadow-lg flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                )}
              </div>

              <div className="text-center mt-8 w-full">
                <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight leading-none mb-3 italic">{employee.name}</h2>
                <div className="flex flex-col items-center gap-3">
                  <span className="text-[11px] font-bold text-orange-500 uppercase tracking-[0.2em]">{employee.position}</span>
                  <div className="badge-premium bg-slate-50 text-slate-400 border-none px-4 py-1.5 text-[10px] italic">
                    Department: {employee.department}
                  </div>
                </div>
              </div>

              <div className="w-full mt-12 pt-10 border-t border-slate-50 space-y-6">
                <div className="flex items-center justify-between group/item">
                  <div className="flex items-center gap-4 text-slate-300 group-hover/item:text-orange-500 transition-colors">
                    <Hash className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Protocol ID</span>
                  </div>
                  <span className="text-[11px] font-black text-slate-900 italic font-display">{employee.matricule}</span>
                </div>
                <div className="flex items-center justify-between group/item">
                  <div className="flex items-center gap-4 text-slate-300 group-hover/item:text-orange-500 transition-colors">
                    <Mail className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Comm-Link</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 lowercase">{employee.email}</span>
                </div>
                <div className="flex items-center justify-between group/item">
                  <div className="flex items-center gap-4 text-slate-300 group-hover/item:text-orange-500 transition-colors">
                    <Briefcase className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Seniority</span>
                  </div>
                  <span className="text-[11px] font-black text-slate-900 italic font-display">{employee.yearsOfExperience} YEARS</span>
                </div>
                <div className="flex items-center justify-between group/item">
                  <div className="flex items-center gap-4 text-slate-300 group-hover/item:text-orange-500 transition-colors">
                    <Calendar className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Entry Sync</span>
                  </div>
                  <span className="text-[11px] font-black text-slate-900 italic font-display">{new Date(employee.date_embauche).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-4 text-slate-300">
                    <CircleDot className="h-4 w-4 text-emerald-500/50" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">System Status</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest italic">{employee.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-10">
            <div className="card-premium border-none shadow-premium bg-white p-12 group">
              <div className="flex items-center gap-3 mb-8">
                <Shield className="h-5 w-5 text-orange-500" />
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">Operational Directives</h3>
              </div>
              <p className="text-lg font-medium text-slate-800 leading-relaxed italic border-l-4 border-orange-500/10 pl-10 py-4 group-hover:border-orange-500/40 transition-all duration-700">
                "{employee.jobDescription}"
              </p>
            </div>

            <div className="grid gap-10 md:grid-cols-2">
              <div className="card-premium border-none shadow-premium bg-white p-12 group">
                <div className="flex items-center gap-3 mb-10">
                  <Target className="h-5 w-5 text-orange-500" />
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">Capability Matrix</h3>
                </div>
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <div className="text-5xl font-display font-black text-slate-900 italic tracking-tighter group-hover:scale-110 transition-transform duration-500 origin-left">{employee.skills.length}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Nodes</div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-5xl font-display font-black text-orange-500 italic tracking-tighter">
                      {Math.round(employee.skills.reduce((acc, s) => acc + (s.proficiencyScore || s.score || 0), 0) / (employee.skills.length || 1))}%
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mean Calibration</div>
                  </div>
                </div>
                <div className="mt-12 space-y-6">
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4">Apex Capability Nodes</p>
                  <div className="flex flex-wrap gap-3">
                    {employee.skills
                      .sort((a, b) => (b.proficiencyScore || b.score) - (a.proficiencyScore || a.score))
                      .slice(0, 5)
                      .map((skill) => (
                        <div key={skill.skillId} className="badge-premium bg-slate-50 text-slate-500 border-none px-4 py-2 text-[10px] italic hover:bg-orange-500 hover:text-white transition-all cursor-default">
                          {skill.skill.name}
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="card-premium border-none shadow-premium bg-white p-12 group">
                <div className="flex items-center gap-3 mb-10">
                  <Trophy className="h-5 w-5 text-orange-500" />
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">Career Chronology</h3>
                </div>
                <div className="relative pl-10 border-l-2 border-slate-50 space-y-12">
                  <div className="relative">
                    <div className="absolute -left-[45px] top-1.5 h-6 w-6 rounded-xl bg-orange-500 border-4 border-white shadow-xl shadow-orange-500/30 z-10 animate-pulse" />
                    <div className="space-y-2">
                      <p className="text-lg font-display font-bold text-slate-900 italic group-hover:translate-x-1 transition-transform">{employee.position}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Operative Protocol</p>
                      <div className="pt-2">
                        <span className="bg-slate-50 px-4 py-1.5 text-[10px] font-black text-slate-600 uppercase tracking-widest italic rounded-lg">
                          INITIATED: {new Date(employee.date_embauche).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="relative group/step opacity-50 hover:opacity-100 transition-opacity">
                    <div className="absolute -left-[45px] top-1.5 h-6 w-6 rounded-xl bg-slate-200 border-4 border-white z-10 group-hover/step:bg-indigo-500 transition-colors" />
                    <div className="space-y-2">
                      <p className="text-lg font-display font-bold text-slate-500 italic">Entry Level Induction</p>
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">System Integration Phase</p>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                        {new Date(employee.date_embauche).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Dialog */}
        <Dialog open={editDialog} onOpenChange={setEditDialog}>
          <DialogContent className="max-w-xl bg-white border-none rounded-[2rem] p-12 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/[0.03] rounded-full -mr-32 -mt-32"></div>

            <DialogHeader className="mb-12 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-5 w-5 text-orange-500" />
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em]">Protocol Adjustment</span>
              </div>
              <DialogTitle className="text-4xl font-display font-black italic uppercase text-slate-900 tracking-tight">Recalibrate Profile</DialogTitle>
              <DialogDescription className="text-sm font-medium text-slate-500 mt-2">Adjust your neural identity matrix and mission parameters.</DialogDescription>
            </DialogHeader>

            <div className="space-y-8 py-4 relative z-10">
              <div className="space-y-4">
                <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Neural Identifier</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-16 bg-slate-50 border-none rounded-2xl text-base font-bold text-slate-900 focus-visible:ring-2 focus-visible:ring-orange-500 placeholder:text-slate-300 px-6 shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Comm-Link Channel</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-16 bg-slate-50 border-none rounded-2xl text-base font-bold text-slate-900 focus-visible:ring-2 focus-visible:ring-orange-500 placeholder:text-slate-300 px-6 shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="jobDescription" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Mission Directive Objectives</Label>
                <Textarea
                  id="jobDescription"
                  value={formData.jobDescription}
                  onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                  rows={4}
                  className="bg-slate-50 border-none rounded-2xl text-base font-medium italic text-slate-700 focus-visible:ring-2 focus-visible:ring-orange-500 p-8 shadow-inner resize-none"
                />
              </div>
            </div>

            <DialogFooter className="mt-12 gap-5 relative z-10">
              <button
                onClick={() => setEditDialog(false)}
                className="flex-1 bg-white border border-slate-100 hover:bg-slate-50 text-slate-400 font-black py-5 px-10 rounded-2xl uppercase tracking-[0.1em] text-xs italic transition-all"
              >
                Abort Changes
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 btn-premium py-5 px-10 rounded-2xl flex items-center justify-center gap-4 italic"
              >
                <Shield className="h-4 w-4" />
                Commit Sync
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
