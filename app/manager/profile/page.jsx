"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-store"
import { users, departments } from "@/lib/mock-data"
import { toast } from "sonner"
import { DashboardHeader } from "@/components/dashboard/header"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import {
    Edit, Mail, Briefcase, Calendar, Hash, Users,
    Download, Shield, Target, Activity, ChevronRight,
    Phone, Building2, CircleDot, Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ManagerProfilePage() {
    const { user } = useAuth()
    const { employees, activities } = useData()

    // Resolve manager's user record from the mock users list
    const managerUser = user || users.find(u => u.role === "manager")

    // Get the department managed by this manager
    const department = departments.find(d => d.manager_id === managerUser?.id)
        || departments.find(d => d.id === managerUser?.departement_id)
        || departments[1] // fallback to HR if none found

    // Team members that belong to the manager's department
    const teamMembers = employees.filter(e =>
        e.departmentId === department?.id || e.department === department?.name
    )

    // Upcoming activities count
    const upcomingActivities = activities.filter(a => a.status === "upcoming").length

    // Average skill score across team
    const avgSkillScore = teamMembers.length > 0
        ? Math.round(
            teamMembers.reduce((acc, emp) => {
                const empAvg = emp.skills && emp.skills.length > 0
                    ? emp.skills.reduce((s, sk) => s + (sk.proficiencyScore || sk.score || 0), 0) / emp.skills.length
                    : 0
                return acc + empAvg
            }, 0) / teamMembers.length
        )
        : 74

    const [editDialog, setEditDialog] = useState(false)
    const [formData, setFormData] = useState({
        name: managerUser?.name || "Jane Smith",
        email: managerUser?.email || "jane.smith@company.com",
        bio: "Strategic workforce architect driving departmental excellence through data-driven talent alignment programs.",
        phone: managerUser?.telephone || "+212 6 23456789",
    })
    const [savedBio, setSavedBio] = useState(formData.bio)

    const getInitials = (name) =>
        name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "MG"

    const handleOpenEdit = () => {
        setFormData(f => ({ ...f }))
        setEditDialog(true)
    }

    const handleSaveProfile = () => {
        setSavedBio(formData.bio)
        toast.success("PROFILE SYNCHRONIZED", {
            description: "Management identity matrix has been updated."
        })
        setEditDialog(false)
    }

    const handleExportBrief = () => {
        const brief = `
MANAGEMENT COMMAND BRIEF
========================

IDENTITY:    ${formData.name}
MATRICULE:   ${managerUser?.matricule || "MAT-2024-002"}
COMM-LINK:   ${formData.email}
PHONE:       ${formData.phone}
ROLE:        Department Manager
DIVISION:    ${department?.name || "HR Department"}
ENTRY DATE:  ${managerUser?.date_embauche ? new Date(managerUser.date_embauche).toLocaleDateString() : "01/06/2017"}

MISSION BRIEF:
${savedBio}

COMMAND STATISTICS:
- Team Size:          ${teamMembers.length > 0 ? teamMembers.length : 8} Operatives
- Avg. Skill Index:   ${avgSkillScore}%
- Active Programs:    ${upcomingActivities}
- Division:           ${department?.name || "HR Department"} (${department?.code || "HR"})
    `.trim()

        const blob = new Blob([brief], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `CMD_BRIEF_${(formData.name).replace(/\s+/g, "_").toUpperCase()}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success("Command brief exported")
    }

    const stats = [
        { label: "Team Operatives", value: teamMembers.length > 0 ? teamMembers.length : 8, unit: "", icon: Users, accent: false },
        { label: "Avg Skill Index", value: avgSkillScore, unit: "%", icon: Target, accent: true },
        { label: "Active Programs", value: upcomingActivities, unit: "", icon: Activity, accent: false },
        { label: "Division Code", value: department?.code || "HR", unit: "", icon: Building2, accent: false },
    ]

    return (
        <div className="flex flex-col bg-[#F8FAFC] min-h-screen">
      <DashboardHeader title="Dashboard" description="Professional workspace interface" />

      <div className="flex-1 p-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">

                {/* Page Header */}
                <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-8">
                    <div>
                        <h2 className="text-[10px] font-bold text-[#F28C1B] uppercase tracking-[0.4em] mb-2">
                            Management Console
                        </h2>
                        <h1 className="text-4xl font-black font-display text-[#222222] uppercase tracking-tighter italic">
                            My Profile
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleExportBrief}
                            className="bg-transparent border border-[#EEEEEE] hover:border-[#222222] text-[#222222] font-bold py-4 px-8 rounded-[4px] uppercase tracking-widest text-[10px] transition-all flex items-center gap-3"
                        >
                            <Download className="h-4 w-4" />
                            Export Brief
                        </button>
                        <button
                            onClick={handleOpenEdit}
                            className="btn-premium"
                        >
                            <Edit className="h-4 w-4 text-[#F28C1B]" />
                            Modify Profile
                        </button>
                    </div>
                </div>

                {/* Stat Bar */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="bg-white border border-[#EEEEEE] rounded-[4px] p-8 shadow-sm group hover:border-[#F28C1B]/30 hover:shadow-xl hover:shadow-[#F28C1B]/5 transition-all border-l-4 border-l-[#F28C1B]"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 rounded-[4px] bg-[#EEEEEE] group-hover:bg-[#F28C1B] transition-colors">
                                    <stat.icon className="w-4 h-4 text-[#222222] group-hover:text-white transition-colors" />
                                </div>
                            </div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                            <p className={cn(
                                "text-3xl font-black font-display tracking-tighter italic leading-none",
                                stat.accent ? "text-[#F28C1B]" : "text-[#222222]"
                            )}>
                                {stat.value}{stat.unit}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid gap-10 lg:grid-cols-3">

                    {/* Identity Card */}
                    <Card className="lg:col-span-1 bg-white border border-[#EEEEEE] rounded-[4px] shadow-sm overflow-hidden">
                        <div className="h-24 bg-[#EEEEEE] relative">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-[#F28C1B]/10 rounded-full -mr-20 -mt-20 pointer-events-none" />
                            <div className="absolute bottom-4 left-6">
                                <span className="text-[9px] font-bold text-[#F28C1B] uppercase tracking-[0.4em]">
                                    ◈ COMMAND AUTHORITY
                                </span>
                            </div>
                        </div>
                        <CardContent className="pt-0 -mt-12 relative flex flex-col items-center px-8 pb-10">
                            <div className="relative">
                                <Avatar className="h-28 w-28 rounded-[4px] border-4 border-white shadow-xl">
                                    <AvatarImage src={managerUser?.avatar || `https://i.pravatar.cc/150?u=${managerUser?.email || "manager"}`} />
                                    <AvatarFallback className="bg-[#222222] text-white text-3xl font-black font-display rounded-[4px]">
                                        {getInitials(formData.name)}
                                    </AvatarFallback>
                                </Avatar>
                                {/* Online indicator */}
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full shadow-md" />
                            </div>

                            <div className="text-center mt-6 w-full">
                                <h2 className="text-2xl font-black font-display text-[#222222] uppercase tracking-tighter italic leading-none mb-2">
                                    {formData.name}
                                </h2>
                                <p className="text-[10px] font-bold text-[#F28C1B] uppercase tracking-widest mb-1">
                                    Department Manager
                                </p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                                    {department?.name || "HR Department"}
                                </p>
                                <div className="flex justify-center gap-2 flex-wrap">
                                    <Badge className="bg-[#EEEEEE] text-[#222222] border-none text-[9px] font-bold uppercase tracking-widest py-1.5 px-3 italic">
                                        {department?.code || "HR"} Division
                                    </Badge>
                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[9px] font-bold uppercase tracking-widest py-1.5 px-3 italic">
                                        Active
                                    </Badge>
                                </div>
                            </div>

                            {/* Info rows */}
                            <div className="w-full mt-10 pt-8 border-t border-[#EEEEEE] space-y-5">
                                {[
                                    { icon: Hash, label: "Matricule", value: managerUser?.matricule || "MAT-2024-002" },
                                    { icon: Mail, label: "Comm-Link", value: formData.email },
                                    { icon: Phone, label: "Channel", value: formData.phone },
                                    { icon: Calendar, label: "Entry Date", value: managerUser?.date_embauche ? new Date(managerUser.date_embauche).toLocaleDateString() : "01/06/2017" },
                                    { icon: Shield, label: "Clearance", value: "L2 — Manager" },
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 text-gray-400 shrink-0">
                                            <row.icon className="h-4 w-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{row.label}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-[#222222] italic text-right truncate">
                                            {row.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Mission Brief */}
                        <Card className="bg-white border border-[#EEEEEE] rounded-[4px] p-10 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F28C1B]/[0.02] rounded-full -mr-16 -mt-16 group-hover:bg-[#F28C1B]/[0.05] transition-all pointer-events-none" />
                            <CardTitle className="text-[10px] font-black font-display text-gray-400 uppercase tracking-[0.3em] mb-6 block">
                                Mission Brief
                            </CardTitle>
                            <p className="text-sm font-medium text-[#222222] leading-relaxed italic border-l-2 border-[#F28C1B] pl-8 py-2">
                                "{savedBio}"
                            </p>
                        </Card>

                        {/* Two cards */}
                        <div className="grid gap-10 md:grid-cols-2">

                            {/* Command Authority */}
                            <Card className="bg-white border border-[#EEEEEE] rounded-[4px] p-10 shadow-sm group hover:shadow-xl hover:border-[#F28C1B]/20 transition-all">
                                <CardTitle className="text-[10px] font-black font-display text-gray-400 uppercase tracking-[0.3em] mb-8 block">
                                    Authority Scope
                                </CardTitle>
                                <div className="grid grid-cols-2 gap-8 mb-10">
                                    <div className="space-y-2">
                                        <div className="text-4xl font-black font-display text-[#222222] italic tracking-tighter">
                                            {teamMembers.length > 0 ? teamMembers.length : 8}
                                        </div>
                                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Team Size</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-4xl font-black font-display text-[#F28C1B] italic tracking-tighter">
                                            {avgSkillScore}%
                                        </div>
                                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Team Avg Score</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Access Modules</p>
                                    {[
                                        "Team Performance Analytics",
                                        "Skill Gap Reports",
                                        "Activity Assignments",
                                        "Training Approvals",
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-[10px] font-bold text-[#222222] uppercase tracking-widest">
                                            <ChevronRight className="h-3 w-3 text-[#F28C1B]" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Career Timeline */}
                            <Card className="bg-white border border-[#EEEEEE] rounded-[4px] p-10 shadow-sm">
                                <CardTitle className="text-[10px] font-black font-display text-gray-400 uppercase tracking-[0.3em] mb-8 block">
                                    Career Timeline
                                </CardTitle>
                                <div className="relative pl-8 border-l border-[#EEEEEE] space-y-10">
                                    <div className="relative">
                                        <div className="absolute -left-[36.5px] top-1 h-4 w-4 rounded-full border-2 border-white bg-[#F28C1B] shadow-lg shadow-[#F28C1B]/30" />
                                        <div>
                                            <p className="text-sm font-black font-display text-[#222222] uppercase tracking-tighter italic mb-1">
                                                Department Manager
                                            </p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Command</p>
                                            <div className="mt-3 inline-block bg-[#EEEEEE] px-3 py-1 text-[8px] font-bold text-[#222222] uppercase tracking-widest italic rounded-[2px]">
                                                SINCE {managerUser?.date_embauche
                                                    ? new Date(managerUser.date_embauche).toLocaleDateString()
                                                    : "01/06/2017"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[36.5px] top-1 h-4 w-4 rounded-full border-2 border-white bg-[#F28C1B]/40" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter italic mb-1">
                                                Senior Analyst
                                            </p>
                                            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Prior Assignment</p>
                                            <div className="mt-3 inline-block bg-[#F8FAFC] border border-[#EEEEEE] px-3 py-1 text-[8px] font-bold text-gray-400 uppercase tracking-widest italic rounded-[2px]">
                                                2014 — 2017
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[36.5px] top-1 h-4 w-4 rounded-full border-2 border-white bg-[#EEEEEE]" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-300 uppercase tracking-tighter italic mb-1">
                                                Initial Sync
                                            </p>
                                            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Entry Protocol</p>
                                            <div className="mt-3 inline-block bg-[#F8FAFC] border border-[#EEEEEE] px-3 py-1 text-[8px] font-bold text-gray-300 uppercase tracking-widest italic rounded-[2px]">
                                                2012 — 2014
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* AI Insight Banner */}
                        <div className="bg-[#222222] rounded-[4px] p-8 flex items-center gap-6 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-48 h-48 bg-white/[0.03] rounded-full -mr-16 -mt-16 group-hover:bg-white/[0.06] transition-all" />
                            <div className="w-14 h-14 rounded-[4px] bg-[#F28C1B]/10 border border-[#F28C1B]/20 flex items-center justify-center shrink-0">
                                <Sparkles className="h-6 w-6 text-[#F28C1B]" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[9px] font-bold text-[#F28C1B] uppercase tracking-[0.4em] mb-1">Neural Insight</p>
                                <p className="text-sm font-bold text-white italic leading-relaxed">
                                    "Your team is performing in the top 15% of all departments.
                                    3 members are ready for skill advancement protocols."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Dialog */}
            <Dialog open={editDialog} onOpenChange={setEditDialog}>
                <DialogContent className="max-w-xl bg-white border-none rounded-[4px] p-10">
                    <DialogHeader className="mb-10">
                        <DialogTitle className="text-3xl font-black font-display uppercase tracking-tighter italic text-[#222222]">
                            Calibrate Profile
                        </DialogTitle>
                        <DialogDescription className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Update management identity matrix parameters.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-8 py-4">
                        <div className="space-y-3">
                            <Label htmlFor="mgr-name" className="text-[10px] font-bold uppercase tracking-widest text-[#222222]">
                                Full Identity
                            </Label>
                            <Input
                                id="mgr-name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="h-14 bg-[#EEEEEE] border-none rounded-[4px] text-sm font-bold uppercase tracking-widest text-[#222222] focus-visible:ring-1 focus-visible:ring-[#F28C1B]"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="mgr-email" className="text-[10px] font-bold uppercase tracking-widest text-[#222222]">
                                Comm-Link Protocol
                            </Label>
                            <Input
                                id="mgr-email"
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="h-14 bg-[#EEEEEE] border-none rounded-[4px] text-sm font-bold uppercase tracking-widest text-[#222222] focus-visible:ring-1 focus-visible:ring-[#F28C1B]"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="mgr-phone" className="text-[10px] font-bold uppercase tracking-widest text-[#222222]">
                                Secure Channel
                            </Label>
                            <Input
                                id="mgr-phone"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="h-14 bg-[#EEEEEE] border-none rounded-[4px] text-sm font-bold uppercase tracking-widest text-[#222222] focus-visible:ring-1 focus-visible:ring-[#F28C1B]"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="mgr-bio" className="text-[10px] font-bold uppercase tracking-widest text-[#222222]">
                                Mission Brief
                            </Label>
                            <Textarea
                                id="mgr-bio"
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                rows={4}
                                className="bg-[#EEEEEE] border-none rounded-[4px] text-sm font-bold italic text-[#222222] focus-visible:ring-1 focus-visible:ring-[#F28C1B] p-6"
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-12 gap-4">
                        <button
                            onClick={() => setEditDialog(false)}
                            className="bg-transparent border border-[#EEEEEE] hover:bg-gray-50 text-gray-400 font-bold py-4 px-10 rounded-[4px] uppercase tracking-widest text-[10px] transition-all"
                        >
                            Abort
                        </button>
                        <button
                            onClick={handleSaveProfile}
                            className="btn-premium"
                        >
                            Sync Profile
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}




