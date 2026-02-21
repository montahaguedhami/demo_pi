"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-store"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
  Calendar,
  FileText,
  CheckCircle2,
  TrendingUp,
  Award,
  Plus,
  Send,
  Eye,
  Shield,
  Zap
} from "lucide-react"
import { employees } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function EmployeeEvaluationsPage() {
  const { user, getEmployeeProfile } = useAuth()
  const { evaluations, addEvaluation, skills } = useData()
  const employeeProfile = getEmployeeProfile()
  const employee = employeeProfile || employees[0]

  const [selfAssessDialog, setSelfAssessDialog] = useState(false)
  const [viewDialog, setViewDialog] = useState({ open: false, evaluation: null })
  const [feedback, setFeedback] = useState("")
  const [skillEvaluations, setSkillEvaluations] = useState([])

  const myEvaluations = evaluations.filter(e => e.employeeId === employee.id)
  const completedEvaluations = myEvaluations.filter(e => e.status === "approved" || e.status === "submitted")

  const getScoreLevel = (score) => {
    if (score >= 90) return "expert"
    if (score >= 75) return "high"
    if (score >= 50) return "medium"
    return "low"
  }

  const openSelfAssessment = () => {
    setSkillEvaluations(employee.skills.map(s => ({
      skillId: s.skillId,
      previousScore: s.score || s.proficiencyScore || 0,
      newScore: s.score || s.proficiencyScore || 0,
      previousLevel: s.level,
      newLevel: s.level,
    })))
    setFeedback("")
    setSelfAssessDialog(true)
  }

  const handleSkillScoreChange = (skillId, newScore) => {
    setSkillEvaluations(prev => prev.map(se =>
      se.skillId === skillId
        ? { ...se, newScore, newLevel: getScoreLevel(newScore) }
        : se
    ))
  }

  const calculateOverallScore = () => {
    if (skillEvaluations.length === 0) return 0
    return Math.round(skillEvaluations.reduce((sum, se) => sum + se.newScore, 0) / skillEvaluations.length)
  }

  const handleSubmitSelfAssessment = () => {
    addEvaluation({
      employeeId: employee.id,
      activityId: "manual-assessment",
      evaluatorId: user?.id || employee.id,
      evaluationType: "self-assessment",
      date: new Date(),
      skillEvaluations,
      overallScore: calculateOverallScore(),
      feedback,
      status: "submitted"
    })
    toast.success("ASSESSMENT BUFFERED", {
      description: "Neural self-calibration has been sent for verification."
    })
    setSelfAssessDialog(false)
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case "post-activity": return "Post-Mission Log"
      case "periodic": return "Cycle Alignment"
      case "self-assessment": return "Self-Calibration"
      default: return type?.toUpperCase()
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "submitted": return <span className="px-3 py-1 rounded-lg bg-orange-50 text-orange-500 text-[10px] font-bold uppercase tracking-widest italic">Syncing</span>
      case "approved": return <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-500 text-[10px] font-bold uppercase tracking-widest italic">Verified</span>
      default: return null
    }
  }

  const avgScore = completedEvaluations.length > 0
    ? Math.round(completedEvaluations.reduce((acc, e) => acc + e.overallScore, 0) / completedEvaluations.length)
    : 0

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen page-transition">
      <DashboardHeader title="Personnel Terminal" description="Neural identity calibration and professional status monitor" />

      <div className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-12 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row items-end justify-between border-b border-slate-100 pb-12 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em] font-sans">Calibration History</span>
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></span>
            </div>
            <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight italic uppercase">Neural Archives</h1>
            <p className="text-slate-400 font-medium text-sm">Comprehensive history of skill assessments and system calibrations.</p>
          </div>
          <button
            onClick={openSelfAssessment}
            className="btn-premium h-14 px-8 rounded-2xl flex items-center gap-3 shadow-orange-500/10 italic"
          >
            <Plus className="h-4 w-4" />
            Initialize Self-Sync
          </button>
        </div>

        {/* Stats */}
        <div className="grid gap-8 md:grid-cols-4">
          <div className="card-premium p-8 group hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Archive Logs</span>
              <FileText className="h-5 w-5 text-slate-300 group-hover:text-slate-900 transition-colors" />
            </div>
            <div className="text-4xl font-display font-black text-slate-900 mb-2 italic">{myEvaluations.length}</div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4">Total Records</p>
          </div>
          <div className="card-premium p-8 group hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified States</span>
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="text-4xl font-display font-black text-slate-900 mb-2 italic">{completedEvaluations.length}</div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4">Confirmed Intel</p>
          </div>
          <div className="card-premium p-8 group hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mean Index</span>
              <Award className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-4xl font-display font-black text-slate-900 mb-6 italic">{avgScore}%</div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: `${avgScore}%` }}></div>
            </div>
          </div>
          <div className="card-premium p-8 group hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calibration Drift</span>
              <TrendingUp className="h-5 w-5 text-indigo-500" />
            </div>
            <div className="text-4xl font-display font-black text-slate-900 mb-2 italic">Positive</div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4">Growth Trending</p>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-10">
          <TabsList className="bg-slate-100 p-1.5 rounded-2xl h-14 w-fit inline-flex">
            <TabsTrigger value="all" className="px-8 rounded-xl font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all italic">All Files ({myEvaluations.length})</TabsTrigger>
            <TabsTrigger value="pending" className="px-8 rounded-xl font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all italic">Buffered ({myEvaluations.filter(e => e.status === "submitted").length})</TabsTrigger>
            <TabsTrigger value="approved" className="px-8 rounded-xl font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all italic">Verified ({myEvaluations.filter(e => e.status === "approved").length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8 p-0 border-none outline-none">
            {myEvaluations.length === 0 ? (
              <div className="card-premium py-24 text-center border-none shadow-premium bg-white">
                <div className="bg-slate-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:rotate-12 transition-transform">
                  <FileText className="h-10 w-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 uppercase italic">Archives Vacant</h3>
                <p className="text-sm font-medium text-slate-400 mt-2 mb-10">No neural calibration records detected in the primary core.</p>
                <button
                  onClick={openSelfAssessment}
                  className="h-12 px-8 rounded-xl bg-orange-500/10 text-orange-500 font-bold uppercase text-[10px] tracking-widest hover:bg-orange-500 hover:text-white transition-all italic"
                >
                  Initiate Prime Sync
                </button>
              </div>
            ) : (
              myEvaluations.map((evaluation) => (
                <div key={evaluation.id} className="card-premium p-10 group hover:border-orange-500/30 transition-all duration-500 bg-white border-none shadow-premium relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/[0.01] rounded-full -mr-24 -mt-24 group-hover:bg-orange-500/[0.03] transition-all duration-700"></div>

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="badge-premium bg-slate-50 text-slate-500 border-none px-4 py-1.5 text-[10px] italic">
                          {getTypeLabel(evaluation.evaluationType)}
                        </div>
                        {getStatusBadge(evaluation.status)}
                      </div>
                      <h3 className="text-2xl font-display font-bold text-slate-900 italic tracking-tight uppercase group-hover:translate-x-1 transition-transform">
                        {evaluation.evaluationType === "self-assessment" ? "Autonomous Core Alignment" : "System Performance Vector"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-10">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-slate-300" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(evaluation.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-orange-500/5 flex items-center justify-center">
                            <Award className="h-4 w-4 text-orange-500" />
                          </div>
                          <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic tracking-tighter">INDEX: {evaluation.overallScore}%</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setViewDialog({ open: true, evaluation })}
                      className="h-16 px-10 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-900 font-black uppercase text-[10px] tracking-widest transition-all shadow-sm flex items-center justify-center gap-4 italic"
                    >
                      <Eye className="h-4 w-4" />
                      Decrypt Intel
                    </button>
                  </div>

                  <div className="mt-10 pt-10 border-t border-slate-50 flex flex-wrap gap-3 relative z-10">
                    {evaluation.skillEvaluations.slice(0, 5).map((se) => {
                      const skill = skills.find(s => s.id === se.skillId)
                      const change = se.newScore - (se.previousScore || 0)
                      return (
                        <div key={se.skillId} className="flex items-center gap-4 bg-slate-50/50 px-4 py-2 rounded-xl group/node hover:bg-white hover:shadow-md transition-all">
                          <span className="text-[10px] font-black text-slate-900 uppercase italic tracking-tighter">{skill?.name}</span>
                          <div className="h-1 w-6 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500" style={{ width: `${se.newScore}%` }}></div>
                          </div>
                          {change !== 0 && (
                            <span className={cn(
                              "text-[9px] font-black italic",
                              change > 0 ? "text-emerald-500" : "text-rose-500"
                            )}>
                              {change > 0 ? "+" : ""}{change}%
                            </span>
                          )}
                        </div>
                      )
                    })}
                    {evaluation.skillEvaluations.length > 5 && (
                      <div className="px-4 py-2 text-[9px] font-bold text-slate-300 uppercase italic tracking-widest">
                        + {evaluation.skillEvaluations.length - 5} More Nodes
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Other Tabs handled implicitly by the All Files view style */}
          <TabsContent value="pending" className="space-y-8 p-0 border-none outline-none">
            {myEvaluations.filter(e => e.status === "submitted").length === 0 ? (
              <div className="card-premium py-24 text-center border-none shadow-premium bg-white text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Buffer Empty</div>
            ) : (
              myEvaluations.filter(e => e.status === "submitted").map(evaluation => (
                <div key={evaluation.id} className="card-premium p-10 bg-white border-none shadow-premium flex items-center justify-between border-l-4 border-l-orange-500">
                  <div>
                    <h3 className="text-xl font-display font-black text-slate-900 italic uppercase">Submission Integrity Check</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Initialized: {new Date(evaluation.date).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => setViewDialog({ open: true, evaluation })} className="btn-secondary h-12 px-8 rounded-xl italic">Verify Lead</button>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-8 p-0 border-none outline-none">
            {myEvaluations.filter(e => e.status === "approved").length === 0 ? (
              <div className="card-premium py-24 text-center border-none shadow-premium bg-white text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">No Verified States Recorded</div>
            ) : (
              myEvaluations.filter(e => e.status === "approved").map(evaluation => (
                <div key={evaluation.id} className="card-premium p-10 bg-white border-none shadow-premium flex items-center justify-between border-l-4 border-l-emerald-500 group">
                  <div>
                    <h3 className="text-xl font-display font-black text-slate-900 italic uppercase">Verified Personnel Profile</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Locked Archive: {new Date(evaluation.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Final Index</span>
                      <p className="text-3xl font-display font-black text-emerald-500 italic leading-none mt-1">{evaluation.overallScore}%</p>
                    </div>
                    <button onClick={() => setViewDialog({ open: true, evaluation })} className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><Eye className="h-5 w-5" /></button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Self-Assessment Dialog */}
        <Dialog open={selfAssessDialog} onOpenChange={setSelfAssessDialog}>
          <DialogContent className="sm:max-w-2xl bg-white border-none rounded-[2.5rem] p-0 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/[0.02] rounded-full -mr-40 -mt-40"></div>

            <DialogHeader className="p-12 border-b border-slate-50 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-orange-500" />
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em] font-sans">Neural Calibration Profile</span>
              </div>
              <DialogTitle className="text-4xl font-display font-black italic uppercase text-slate-900">Core Self-Sync</DialogTitle>
              <DialogDescription className="text-sm font-medium text-slate-500 mt-3 leading-relaxed">
                Provide precise proficiency metrics for system synchronization. All data is processed for personnel optimization.
              </DialogDescription>
            </DialogHeader>

            <div className="p-12 space-y-12 overflow-y-auto max-h-[50vh] custom-scrollbar relative z-10">
              <div className="glass-panel p-8 flex items-center justify-between border-slate-100 shadow-sm border-none bg-slate-50/50">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Calculated Neural Index</span>
                  <div className="h-1 w-20 bg-orange-500/20 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-orange-500 transition-all duration-700" style={{ width: `${calculateOverallScore()}%` }}></div>
                  </div>
                </div>
                <span className="text-6xl font-display font-black text-orange-500 italic tracking-tighter">
                  {calculateOverallScore()}<span className="text-2xl ml-1 font-black opacity-30">%</span>
                </span>
              </div>

              <div className="space-y-10">
                <Label className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] italic flex items-center gap-3">
                  <Zap className="h-4 w-4 text-orange-500" />
                  Node Calibration Matrix
                </Label>
                <div className="space-y-10">
                  {skillEvaluations.map((se) => {
                    const skill = skills.find(s => s.id === se.skillId)
                    return (
                      <div key={se.skillId} className="space-y-6 group/node">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <p className="text-sm font-display font-bold text-slate-900 uppercase italic tracking-tight group-hover/node:text-orange-500 transition-colors uppercase">{skill?.name}</p>
                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1">Status: Active Sensor</span>
                          </div>
                          <p className="text-2xl font-display font-black text-slate-900 italic">{se.newScore}%</p>
                        </div>
                        <Slider
                          value={[se.newScore]}
                          onValueChange={([value]) => handleSkillScoreChange(se.skillId, value)}
                          max={100}
                          step={1}
                          className="py-2"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="feedback" className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] italic">Procedural Post-Action Intel</Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="EXPLAIN ACHIEVEMENTS, VARIANCES, AND STRATEGIC GROWTH PLANS..."
                  className="bg-slate-50 border-none rounded-2xl p-8 text-base font-medium italic text-slate-700 placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-orange-500 min-h-[160px] shadow-inner resize-none"
                />
              </div>
            </div>

            <DialogFooter className="p-12 border-t border-slate-50 bg-slate-50/20 gap-6 relative z-10">
              <button
                onClick={() => setSelfAssessDialog(false)}
                className="flex-1 h-16 bg-white border border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-slate-50 transition-all italic"
              >
                Abort Sync
              </button>
              <button
                onClick={handleSubmitSelfAssessment}
                className="flex-[1.5] btn-premium h-16 rounded-2xl flex items-center justify-center gap-4 italic"
              >
                <Send className="h-4 w-4" />
                Commit Calibration
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Evaluation Dialog */}
        <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog({ ...viewDialog, open })}>
          <DialogContent className="sm:max-w-2xl bg-white border-none rounded-[2.5rem] p-0 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/[0.02] rounded-full -mr-40 -mt-40"></div>

            <DialogHeader className="p-12 border-b border-slate-50 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-orange-500" />
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em] font-sans">Calibration Dossier</span>
                </div>
                {viewDialog.evaluation && getStatusBadge(viewDialog.evaluation.status)}
              </div>
              <DialogTitle className="text-4xl font-display font-black italic uppercase text-slate-900">Intel Decryption</DialogTitle>
              <DialogDescription className="text-sm font-medium text-slate-500 mt-3 leading-relaxed">
                Extracted performance metrics and verified capability shifts for personnel file.
              </DialogDescription>
            </DialogHeader>

            {viewDialog.evaluation && (
              <div className="p-12 space-y-12 overflow-y-auto max-h-[50vh] custom-scrollbar relative z-10">
                <div className="glass-panel p-10 flex items-center justify-between border-slate-100 shadow-sm border-none bg-slate-50/50">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Verified Neural Index</p>
                    <div className="h-1.5 w-32 bg-emerald-500/10 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${viewDialog.evaluation.overallScore}%` }}></div>
                    </div>
                  </div>
                  <p className="text-7xl font-display font-black text-slate-900 italic tracking-tighter">
                    {viewDialog.evaluation.overallScore}<span className="text-2xl ml-1 font-black opacity-20">%</span>
                  </p>
                </div>

                <div className="space-y-10">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] italic flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    Capability Delta Analysis
                  </h4>
                  <div className="space-y-10">
                    {viewDialog.evaluation.skillEvaluations.map((se) => {
                      const skill = skills.find(s => s.id === se.skillId)
                      const change = se.newScore - (se.previousScore || 0)
                      return (
                        <div key={se.skillId} className="space-y-5">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-display font-black text-slate-900 uppercase italic tracking-tight">{skill?.name}</span>
                            <div className="flex items-center gap-5">
                              <span className="text-[10px] font-bold text-slate-300 italic">{se.previousScore || 0}%</span>
                              <TrendingUp className={cn("h-4 w-4", change >= 0 ? "text-emerald-500 rotate-0" : "text-rose-500 rotate-180")} />
                              <span className={cn("text-xl font-display font-black italic", change >= 0 ? "text-emerald-500" : "text-rose-500")}>
                                {se.newScore}%
                              </span>
                            </div>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-[2px] shadow-inner">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-1500 ease-out shadow-lg",
                                change >= 0 ? "bg-emerald-500 shadow-emerald-500/20" : "bg-rose-500 shadow-rose-500/20"
                              )}
                              style={{ width: `${se.newScore}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-10 pt-4">
                  {viewDialog.evaluation.feedback && (
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] italic">Intel Observation Log</h4>
                      <div className="bg-slate-50 p-8 border-l-4 border-l-orange-500/40 rounded-2xl text-base font-medium text-slate-600 leading-relaxed italic shadow-inner">
                        "{viewDialog.evaluation.feedback}"
                      </div>
                    </div>
                  )}

                  {viewDialog.evaluation.recommendations && (
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] italic">Strategic Directives</h4>
                      <div className="bg-emerald-50/50 p-8 border-l-4 border-l-emerald-500/40 rounded-2xl text-base font-medium text-slate-600 leading-relaxed italic shadow-inner">
                        "{viewDialog.evaluation.recommendations}"
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter className="p-12 border-t border-slate-50 bg-slate-50/10 relative z-10">
              <button
                onClick={() => setViewDialog({ open: false, evaluation: null })}
                className="w-full h-16 bg-white border border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-slate-900 hover:text-white transition-all italic flex items-center justify-center gap-4"
              >
                Terminate Connection
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
