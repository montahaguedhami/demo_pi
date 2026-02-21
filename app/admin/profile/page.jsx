"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-store"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Mail,
    Building,
    Briefcase,
    Calendar,
    Shield,
    Zap,
    Star,
    Brain,
    TrendingUp,
    Clock,
    MapPin,
    CheckCircle2,
    ShieldCheck,
    Cpu,
    Lock,
    Key,
    Activity,
    Target,
    ChevronRight,
    Terminal
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminProfilePage() {
    const { user, getRoleLabel, getRoleDescription } = useAuth()
    const { employees, activities } = useData()

    // Find the employee profile associated with the admin user
    const profile = employees.find(e => e.userId === user?.id) || {
        name: user?.name,
        email: user?.email,
        department: "Executive Headquarters",
        position: "System Administrator",
        skills: [],
        activityHistory: []
    }

    const avgScore = profile.skills.length > 0
        ? Math.round(profile.skills.reduce((sum, s) => sum + (s.score || 0), 0) / profile.skills.length)
        : 98 // Admin default excellence

    return (
        <div className="flex flex-col bg-[#F8FAFC] min-h-screen page-transition">
            <DashboardHeader title="Command Intelligence" description="Strategic oversight and organizational talent matrix" />

            <div className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-12 animate-in fade-in duration-700">
                {/* Header Stats */}
                <div className="flex flex-col md:flex-row items-end justify-between border-b border-slate-100 pb-12 gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em] font-sans">Access Level 10</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                        </div>
                        <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight italic uppercase">Personnel File</h1>
                        <p className="text-slate-400 font-medium text-sm italic">Synchronizing administrative credentials and operational proficiency.</p>
                    </div>

                    <div className="flex items-center gap-8 px-8 py-5 bg-white rounded-2xl border border-slate-100 shadow-sm shadow-orange-500/5 transition-all hover:shadow-orange-500/10">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic leading-none mb-2">Sync Status</span>
                            <span className="text-xs font-black text-emerald-500 uppercase tracking-widest italic flex items-center gap-2">
                                Online <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                            </span>
                        </div>
                        <div className="w-px h-8 bg-slate-100"></div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                                <Shield className="h-4 w-4 text-orange-500" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic leading-none mb-1">Clearance</span>
                                <span className="text-[10px] font-black text-slate-900 uppercase italic">Maximum Restricted</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-12 lg:grid-cols-12">
                    {/* Sidebar / Profile Card */}
                    <div className="lg:col-span-4 space-y-10">
                        <Card className="card-premium p-10 bg-white border-none shadow-premium relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/[0.02] rounded-full -mr-32 -mt-32 transition-all group-hover:bg-orange-500/[0.05]"></div>

                            <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                                <div className="relative pt-2">
                                    <div className="absolute -inset-1.5 bg-gradient-to-tr from-orange-500 to-amber-300 rounded-[2.5rem] opacity-20 blur-md group-hover:opacity-40 transition-all"></div>
                                    <Avatar className="h-32 w-32 rounded-[2.5rem] border-4 border-white shadow-2xl relative transition-transform duration-700 group-hover:scale-105">
                                        <AvatarImage src={user?.avatar || `https://i.pravatar.cc/150?u=admin`} />
                                        <AvatarFallback className="bg-slate-900 text-white text-3xl font-display font-black">
                                            {profile.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white border-4 border-white shadow-lg">
                                        <ShieldCheck className="w-5 h-5 text-orange-500" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-3xl font-display font-black text-slate-900 italic uppercase italic tracking-tighter">{profile.name}</h2>
                                    <div className="flex items-center justify-center gap-3">
                                        <Badge className="bg-orange-500/[0.08] text-orange-600 text-[10px] font-black px-4 py-1.5 rounded-full border border-orange-500/20 uppercase tracking-widest italic">
                                            {getRoleLabel()}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="w-full pt-10 border-t border-slate-50 space-y-6">
                                    <AttributeField icon={Mail} label="Matrix ID" value={profile.email} />
                                    <AttributeField icon={Building} label="Sector" value={profile.department} />
                                    <AttributeField icon={Briefcase} label="Designation" value={profile.position} />
                                </div>

                                <div className="w-full pt-10 border-t border-slate-50 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">System Proficiency</span>
                                        <span className="text-2xl font-display font-black text-orange-500 italic">{avgScore}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
                                        <div
                                            className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-1000 animate-pulse"
                                            style={{ width: `${avgScore}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="card-premium p-10 bg-slate-900 border-none shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500 opacity-5 blur-[80px]"></div>
                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20">
                                        <Lock className="h-5 w-5 text-orange-500" />
                                    </div>
                                    <span className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic">System Privileges</span>
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        "Global Protocol Override",
                                        "Neural Matrix Recalibration",
                                        "Asset Metadata Cleansing",
                                        "Secure Signal Broadcasting"
                                    ].map((priv, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <Zap className="h-3 w-3 text-orange-500" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{priv}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full w-full bg-orange-500/50"></div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Competencies Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                        <Brain className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-display font-black text-slate-900 uppercase italic tracking-tight italic">Skill Matrix</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                                            <TrendingUp className="h-3 w-3 text-orange-500" />
                                            Administrative Mastery Index
                                        </p>
                                    </div>
                                </div>
                                <button className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic flex items-center gap-2 hover:translate-x-1 transition-transform">
                                    Matrix Audit <ChevronRight className="h-3 w-3" />
                                </button>
                            </div>

                            <div className="grid gap-6">
                                {profile.skills.length > 0 ? profile.skills.map((skill, index) => (
                                    <Card key={index} className="card-premium p-8 bg-white border-none shadow-premium hover:bg-slate-50 transition-all duration-300">
                                        <div className="flex items-center justify-between gap-12">
                                            <div className="flex items-center gap-6 flex-1">
                                                <div className="w-14 h-14 bg-slate-50 flex items-center justify-center rounded-2xl border border-slate-100 group-hover:border-orange-500/20 transition-all">
                                                    <Star className="w-6 h-6 text-orange-500" />
                                                </div>
                                                <div className="space-y-1 flex-1">
                                                    <h4 className="text-xl font-display font-black text-slate-900 uppercase italic tracking-tight">{skill.name}</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{skill.category}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-12">
                                                <div className="flex flex-col items-end gap-2 px-10 border-x border-slate-50">
                                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Signal Accuracy</span>
                                                    <span className="text-3xl font-display font-black text-orange-500 italic leading-none">{skill.score}%</span>
                                                </div>
                                                <div className="w-40 space-y-2">
                                                    <div className="flex justify-between text-[9px] font-black text-slate-300 uppercase tracking-widest italic">
                                                        <span>Baseline</span>
                                                        <span>Peak</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
                                                        <div className="h-full bg-orange-500" style={{ width: `${skill.score}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                )) : (
                                    <Card className="card-premium p-20 flex flex-col items-center justify-center text-center bg-white/50 border-dashed">
                                        <div className="w-16 h-16 rounded-[1.25rem] bg-slate-100 flex items-center justify-center mb-6">
                                            <Cpu className="h-8 w-8 text-slate-300" />
                                        </div>
                                        <h3 className="text-xl font-display font-black text-slate-400 uppercase italic">No Matrix Data Found</h3>
                                        <p className="text-xs text-slate-300 font-bold uppercase tracking-widest mt-2">Initialize neural training to propagate competency signals.</p>
                                    </Card>
                                )}
                            </div>
                        </div>

                        {/* Recent History Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-black/20">
                                        <Activity className="h-6 w-6 text-orange-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-display font-black text-slate-900 uppercase italic tracking-tight italic">Operational History</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                                            <Clock className="h-3 w-3 text-orange-500" />
                                            Recent Command Sequence
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Card className="card-premium p-10 bg-white border-none shadow-premium relative overflow-hidden">
                                <div className="space-y-8">
                                    {profile.activityHistory.length > 0 ? profile.activityHistory.slice(0, 5).map((activity, index) => (
                                        <div key={index} className="flex items-center gap-8 group">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-500">
                                                    <CheckCircle2 className="w-5 h-5 text-slate-300 group-hover:text-white" />
                                                </div>
                                                {index !== profile.activityHistory.length - 1 && <div className="w-px h-12 bg-slate-100"></div>}
                                            </div>
                                            <div className="flex-1 pb-8 group-last:pb-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-lg font-display font-black text-slate-900 uppercase italic tracking-tight group-hover:text-orange-500 transition-colors">{activity.title}</h4>
                                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">{activity.date}</span>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest italic bg-slate-50 border-none text-slate-500">
                                                        Status: {activity.status}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest italic text-orange-500 border-none">
                                                        Priority Alpha
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-10 opacity-30">
                                            <Terminal className="w-12 h-12 mx-auto mb-4" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Command History Purged</p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AttributeField({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-6">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                <Icon className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-left space-y-0.5">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">{label}</p>
                <p className="text-[11px] font-black text-slate-900 uppercase italic tracking-tight">{value}</p>
            </div>
        </div>
    )
}
