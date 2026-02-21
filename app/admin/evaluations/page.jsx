"use client"

import { useState } from "react"
import { useData } from "@/lib/data-store"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { ClipboardCheck, MoreHorizontal, Plus, Pencil, Trash2, Eye, CheckCircle, Send } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"

export default function EvaluationsPage() {
  const { evaluations, addEvaluation, updateEvaluation, deleteEvaluation, activities, employees, skills, updateEmployeeSkill } = useData()
  const { user } = useAuth()

  const [evalDialog, setEvalDialog] = useState({ open: false, mode: "add" })
  const [deleteDialog, setDeleteDialog] = useState({ open: false })

  // Form state
  const [employeeId, setEmployeeId] = useState("")
  const [activityId, setActivityId] = useState("")
  const [evaluationType, setEvaluationType] = useState("post-activity")
  const [feedback, setFeedback] = useState("")
  const [recommendations, setRecommendations] = useState("")
  const [skillEvaluations, setSkillEvaluations] = useState([])

  const getScoreLevel = (score) => {
    if (score >= 90) return "expert"
    if (score >= 75) return "high"
    if (score >= 50) return "medium"
    return "low"
  }

  const openEvalDialog = (mode, evaluation) => {
    if ((mode === "edit" || mode === "view") && evaluation) {
      setEmployeeId(evaluation.employeeId)
      setActivityId(evaluation.activityId)
      setEvaluationType(evaluation.evaluationType)
      setFeedback(evaluation.feedback)
      setRecommendations(evaluation.recommendations || "")
      setSkillEvaluations(evaluation.skillEvaluations)
    } else {
      setEmployeeId("")
      setActivityId("")
      setEvaluationType("post-activity")
      setFeedback("")
      setRecommendations("")
      setSkillEvaluations([])
    }
    setEvalDialog({ open: true, mode, evaluation })
  }

  const handleEmployeeChange = (empId) => {
    setEmployeeId(empId)
    const employee = employees.find(e => e.id === empId)
    if (employee) {
      setSkillEvaluations(employee.skills.map(s => ({
        skillId: s.skillId,
        previousScore: s.score || 0,
        newScore: s.score || 0,
        previousLevel: s.level || "low",
        newLevel: s.level || "low",
      })))
    }
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
    const totalNewScore = skillEvaluations.reduce((sum, se) => sum + se.newScore, 0)
    return Math.round(totalNewScore / skillEvaluations.length)
  }

  const handleSaveEvaluation = (status) => {
    if (!employeeId || !activityId) {
      toast.error("Please select an operative and protocol")
      return
    }

    const evaluationData = {
      employeeId,
      activityId,
      evaluatorId: user?.id || "u1",
      evaluationType,
      date: new Date(),
      skillEvaluations,
      overallScore: calculateOverallScore(),
      feedback,
      recommendations: recommendations || undefined,
      status
    }

    if (evalDialog.mode === "add") {
      addEvaluation(evaluationData)
      toast.success(status === "submitted" ? "Evaluation uploaded to neural core" : "Draft saved to buffer")
    } else if (evalDialog.evaluation) {
      updateEvaluation(evalDialog.evaluation.id, { ...evaluationData, status })
      toast.success("Neural record updated")
    }

    // If submitted, update employee skills
    if (status === "submitted" || status === "approved") {
      skillEvaluations.forEach(se => {
        updateEmployeeSkill(employeeId, se.skillId, {
          score: se.newScore,
          level: se.newLevel,
          progression: se.newScore - se.previousScore
        })
      })
    }

    setEvalDialog({ open: false, mode: "add" })
  }

  const handleApproveEvaluation = (evaluation) => {
    updateEvaluation(evaluation.id, { status: "approved" })
    // Update employee skills
    evaluation.skillEvaluations.forEach(se => {
      updateEmployeeSkill(evaluation.employeeId, se.skillId, {
        score: se.newScore,
        level: se.newLevel,
        progression: se.newScore - se.previousScore
      })
    })
    toast.success("Protocol approved. Operative neural profiles synchronized.")
  }

  const handleDeleteEvaluation = () => {
    if (deleteDialog.evaluation) {
      deleteEvaluation(deleteDialog.evaluation.id)
      toast.success("Intelligence record purged")
    }
    setDeleteDialog({ open: false })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "draft": return <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500 border-none px-2 py-0.5 italic">Draft Buffer</Badge>
      case "submitted": return <Badge className="text-[8px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-500 border-none px-2 py-0.5 italic">Synchronizing</Badge>
      case "approved": return <Badge className="text-[8px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border-none px-2 py-0.5 italic">Active Profile</Badge>
      default: return null
    }
  }

  const getTypeBadge = (type) => {
    switch (type) {
      case "pre-activity": return <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest bg-[#EEEEEE] text-[#222222] border-none px-2 py-0.5 italic">Pre-Protocol</Badge>
      case "post-activity": return <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest bg-[#EEEEEE] text-[#222222] border-none px-2 py-0.5 italic">Post-Protocol</Badge>
      case "periodic": return <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest bg-[#EEEEEE] text-[#222222] border-none px-2 py-0.5 italic">Cycle Sync</Badge>
      case "self-assessment": return <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest bg-[#EEEEEE] text-[#222222] border-none px-2 py-0.5 italic">Self Assessment</Badge>
      default: return null
    }
  }

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen">
      <DashboardHeader title="Dashboard" description="Professional workspace interface" />

      <div className="flex-1 p-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-8">
          <div>
            <h2 className="text-[10px] font-bold text-[#F28C1B] uppercase tracking-[0.4em] mb-2">Audit Stream</h2>
            <h1 className="text-4xl font-bold text-[#222222] uppercase tracking-tighter italic">Evaluation Registry</h1>
          </div>
          <button
            onClick={() => openEvalDialog("add")}
            className="px-10 h-14 bg-[#222222] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-[4px] hover:bg-[#F28C1B] transition-all flex items-center gap-3 active:scale-95 italic shadow-lg shadow-[#222222]/10"
          >
            <Plus className="h-4 w-4" /> INITIALIZE EVALUATION
          </button>
        </div>

        <div className="bg-white border border-[#EEEEEE] rounded-[4px] shadow-sm overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F28C1B]/[0.02] rounded-full -mr-32 -mt-32 pointer-events-none group-hover:bg-[#F28C1B]/[0.05] transition-all"></div>
          {evaluations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center relative">
              <div className="p-6 rounded-full bg-[#EEEEEE] mb-8 text-[#F28C1B]/20">
                <ClipboardCheck className="h-16 w-16" />
              </div>
              <h3 className="text-xl font-bold text-[#222222] uppercase tracking-tighter italic mb-2">Registry Silent</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">No tactical assessments identified in sector</p>
              <button
                onClick={() => openEvalDialog("add")}
                className="px-8 h-12 bg-[#F28C1B] text-white text-[10px] font-bold uppercase tracking-widest rounded-[4px] hover:bg-[#D97812] transition-all italic active:scale-95"
              >
                DEPLOY FIRST PROBE
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto relative">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#EEEEEE] hover:bg-transparent">
                    <TableHead className="text-[10px] font-bold text-[#222222] uppercase tracking-widest py-8 px-10 italic">Operative Unit</TableHead>
                    <TableHead className="text-[10px] font-bold text-[#222222] uppercase tracking-widest py-8 italic">Protocol Reference</TableHead>
                    <TableHead className="text-[10px] font-bold text-[#222222] uppercase tracking-widest py-8 italic">Logic Type</TableHead>
                    <TableHead className="text-[10px] font-bold text-[#222222] uppercase tracking-widest py-8 italic">Transmission Date</TableHead>
                    <TableHead className="text-[10px] font-bold text-[#222222] uppercase tracking-widest py-8 italic text-right pr-20">Neural Load</TableHead>
                    <TableHead className="text-[10px] font-bold text-[#222222] uppercase tracking-widest py-8 italic">Status</TableHead>
                    <TableHead className="w-[80px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluations.map((evaluation) => {
                    const employee = employees.find(e => e.id === evaluation.employeeId)
                    const activity = activities.find(a => a.id === evaluation.activityId)
                    return (
                      <TableRow key={evaluation.id} className="border-b border-[#EEEEEE] hover:bg-[#F8FAFC] transition-colors group/row">
                        <TableCell className="py-8 px-10">
                          <div className="flex items-center gap-5">
                            <Avatar className="h-12 w-12 rounded-[4px] border border-[#EEEEEE] group-hover/row:border-[#F28C1B]/30 transition-colors">
                              <AvatarImage src={employee?.avatar} className="object-cover" />
                              <AvatarFallback className="bg-[#EEEEEE] text-[#F28C1B] font-black italic">{employee?.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-bold text-[#222222] italic leading-none mb-2 uppercase tracking-tighter group-hover/row:text-[#F28C1B] transition-colors">{employee?.name}</p>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{employee?.position.toUpperCase()}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-8">
                          <p className="text-[10px] font-bold text-[#222222] uppercase tracking-widest italic">{activity?.title || "GENERAL SECTOR"}</p>
                        </TableCell>
                        <TableCell className="py-8">{getTypeBadge(evaluation.evaluationType)}</TableCell>
                        <TableCell className="py-8">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">{new Date(evaluation.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}</p>
                        </TableCell>
                        <TableCell className="py-8 text-right pr-20">
                          <span className="text-xl font-black text-[#222222] tracking-tighter italic">{evaluation.overallScore}%</span>
                        </TableCell>
                        <TableCell className="py-8">{getStatusBadge(evaluation.status)}</TableCell>
                        <TableCell className="py-8 pr-12 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-3 hover:bg-[#EEEEEE] rounded-[4px] transition-colors text-gray-400 hover:text-[#222222]">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border-[#EEEEEE] rounded-[4px] shadow-xl p-2 min-w-[180px]">
                              <DropdownMenuItem onClick={() => openEvalDialog("view", evaluation)} className="text-[9px] font-bold uppercase tracking-widest py-3 px-4 hover:bg-[#F28C1B] hover:text-white transition-colors cursor-pointer rounded-[2px] mb-1 italic">
                                <Eye className="mr-3 h-4 w-4" /> Analyze Logic
                              </DropdownMenuItem>
                              {evaluation.status === "draft" && (
                                <DropdownMenuItem onClick={() => openEvalDialog("edit", evaluation)} className="text-[9px] font-bold uppercase tracking-widest py-3 px-4 hover:bg-[#F28C1B] hover:text-white transition-colors cursor-pointer rounded-[2px] mb-1 italic">
                                  <Pencil className="mr-3 h-4 w-4" /> Edit Parameters
                                </DropdownMenuItem>
                              )}
                              {evaluation.status === "submitted" && (
                                <DropdownMenuItem onClick={() => handleApproveEvaluation(evaluation)} className="text-[9px] font-bold uppercase tracking-widest py-3 px-4 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer rounded-[2px] mb-1 italic">
                                  <CheckCircle className="mr-3 h-4 w-4" /> Finalize Sync
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-[9px] font-bold uppercase tracking-widest py-3 px-4 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer rounded-[2px] italic text-rose-500"
                                onClick={() => setDeleteDialog({ open: true, evaluation })}
                              >
                                <Trash2 className="mr-3 h-4 w-4" /> Purge Record
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

      {/* Evaluation Dialog */}
      <Dialog open={evalDialog.open} onOpenChange={(open) => setEvalDialog({ ...evalDialog, open })}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-none rounded-[4px] p-0 shadow-2xl">
          <div className="p-10 space-y-10">
            <div className="border-b border-[#EEEEEE] pb-8">
              <h2 className="text-[10px] font-bold text-[#F28C1B] uppercase tracking-[0.4em] mb-2 italic">Neural Calibration</h2>
              <h1 className="text-3xl font-bold text-[#222222] uppercase tracking-tighter italic">
                {evalDialog.mode === "add" ? "Initialize Assessment" : evalDialog.mode === "edit" ? "Modify Parameters" : "Deep Analysis"}
              </h1>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-3">
                <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] italic ml-1">Target Operative</Label>
                {evalDialog.mode === "view" ? (
                  <div className="p-4 bg-[#F8FAFC] border border-[#EEEEEE] rounded-[4px] text-xs font-bold text-[#222222] italic uppercase tracking-widest">{employees.find(e => e.id === employeeId)?.name.toUpperCase()}</div>
                ) : (
                  <Select value={employeeId} onValueChange={handleEmployeeChange}>
                    <SelectTrigger className="h-14 bg-[#F8FAFC] border-[#EEEEEE] rounded-[4px] text-xs font-bold uppercase tracking-widest hover:border-[#F28C1B]/30 transition-all">
                      <SelectValue placeholder="SELECT OPERATIVE" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#EEEEEE] rounded-[4px]">
                      {employees.map(emp => (
                        <SelectItem key={emp.id} value={emp.id} className="text-[10px] font-bold uppercase tracking-widest py-4 italic">{emp.name.toUpperCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-3">
                <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] italic ml-1">Protocol Ref</Label>
                {evalDialog.mode === "view" ? (
                  <div className="p-4 bg-[#F8FAFC] border border-[#EEEEEE] rounded-[4px] text-xs font-bold text-[#222222] italic uppercase tracking-widest">{activities.find(a => a.id === activityId)?.title.toUpperCase() || "GENERAL"}</div>
                ) : (
                  <Select value={activityId} onValueChange={setActivityId}>
                    <SelectTrigger className="h-14 bg-[#F8FAFC] border-[#EEEEEE] rounded-[4px] text-xs font-bold uppercase tracking-widest hover:border-[#F28C1B]/30 transition-all">
                      <SelectValue placeholder="SELECT PROTOCOL" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#EEEEEE] rounded-[4px]">
                      <SelectItem value="general" className="text-[10px] font-bold uppercase tracking-widest py-4 italic">GENERAL PROTOCOL</SelectItem>
                      {activities.map(act => (
                        <SelectItem key={act.id} value={act.id} className="text-[10px] font-bold uppercase tracking-widest py-4 italic">{act.title.toUpperCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-3">
                <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] italic ml-1">Logic Flux</Label>
                {evalDialog.mode === "view" ? (
                  <div className="pt-2">{getTypeBadge(evaluationType)}</div>
                ) : (
                  <Select value={evaluationType} onValueChange={setEvaluationType}>
                    <SelectTrigger className="h-14 bg-[#F8FAFC] border-[#EEEEEE] rounded-[4px] text-xs font-bold uppercase tracking-widest hover:border-[#F28C1B]/30 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#EEEEEE] rounded-[4px]">
                      <SelectItem value="pre-activity" className="text-[10px] font-bold uppercase tracking-widest py-4 italic">PRE-PROTOCOL</SelectItem>
                      <SelectItem value="post-activity" className="text-[10px] font-bold uppercase tracking-widest py-4 italic">POST-PROTOCOL</SelectItem>
                      <SelectItem value="periodic" className="text-[10px] font-bold uppercase tracking-widest py-4 italic">CYCLE SYNC</SelectItem>
                      <SelectItem value="self-assessment" className="text-[10px] font-bold uppercase tracking-widest py-4 italic">SELF ASSESSMENT</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {skillEvaluations.length > 0 && (
              <div className="space-y-8 p-10 bg-[#F8FAFC] border border-[#EEEEEE] rounded-[4px] relative overflow-hidden group/skills">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#F28C1B]/[0.02] rounded-full -mr-24 -mt-24 pointer-events-none group-hover/skills:bg-[#F28C1B]/[0.05] transition-all"></div>
                <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-6 relative">
                  <div>
                    <Label className="text-[10px] font-bold text-[#F28C1B] uppercase tracking-[0.3em] italic">Neural Competency Matrix</Label>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Calibrate individual skill nodes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-1 italic">Composite Load</p>
                    <span className="text-2xl font-black text-[#222222] tracking-tighter italic">
                      {calculateOverallScore()}%
                    </span>
                  </div>
                </div>
                <div className="space-y-10 relative">
                  {skillEvaluations.map((se) => {
                    const skill = skills.find(s => s.id === se.skillId)
                    const change = se.newScore - se.previousScore
                    return (
                      <div key={se.skillId} className="space-y-5 group/item">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="w-10 h-10 rounded-[4px] bg-[#EEEEEE] text-[#F28C1B] flex items-center justify-center font-black italic group-hover/item:bg-[#F28C1B] group-hover/item:text-white transition-all text-xs">
                              {skill?.name[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#222222] uppercase tracking-tighter italic group-hover/item:text-[#F28C1B] transition-colors">{skill?.name}</p>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1 italic">
                                PREVIOUS: {se.previousScore}% <span className="mx-2 text-[#EEEEEE]">|</span> {se.previousLevel.toUpperCase()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-6">
                            {change !== 0 && (
                              <div className={cn("px-2 py-1 rounded-[2px] text-[9px] font-black uppercase tracking-widest italic animate-in fade-in zoom-in duration-500",
                                change > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                              )}>
                                {change > 0 ? "+" : ""}{change}% FLUX
                              </div>
                            )}
                            <div className="h-10 w-[1px] bg-[#EEEEEE]"></div>
                            <div className="min-w-[80px]">
                              <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-1 italic">NEW LOAD</p>
                              <p className="text-xl font-black text-[#222222] tracking-tighter italic">{se.newScore}%</p>
                            </div>
                          </div>
                        </div>
                        {evalDialog.mode !== "view" ? (
                          <div className="px-1">
                            <Slider
                              value={[se.newScore]}
                              onValueChange={([value]) => handleSkillScoreChange(se.skillId, value)}
                              max={100}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        ) : (
                          <div className="h-1.5 w-full rounded-full bg-[#EEEEEE] overflow-hidden">
                            <div
                              className="h-full bg-[#F28C1B] transition-all duration-1000 origin-left"
                              style={{ width: `${se.newScore}%` }}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-4">
                <Label className="text-[10px] font-bold text-[#F28C1B] uppercase tracking-[0.3em] italic ml-1">Neural Feedback</Label>
                {evalDialog.mode === "view" ? (
                  <p className="text-[11px] p-6 rounded-[4px] bg-[#F8FAFC] border border-[#EEEEEE] font-medium italic text-gray-500 leading-relaxed">"{feedback || "ZERO LOGS RECORDED"}"</p>
                ) : (
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="ENTER DEEP OBSERVATIONAL DATA..."
                    rows={4}
                    className="w-full p-6 bg-[#F8FAFC] border border-[#EEEEEE] rounded-[4px] text-[11px] font-medium italic text-[#222222] placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#F28C1B]/50 transition-all resize-none shadow-sm"
                  />
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-bold text-[#F28C1B] uppercase tracking-[0.3em] italic ml-1">Growth Directives</Label>
                {evalDialog.mode === "view" ? (
                  <p className="text-[11px] p-6 rounded-[4px] bg-[#F8FAFC] border border-[#EEEEEE] font-medium italic text-gray-500 leading-relaxed">"{recommendations || "ZERO DIRECTIVES IDENTIFIED"}"</p>
                ) : (
                  <textarea
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                    placeholder="ENTER FUTURE CALIBRATION STRATEGY..."
                    rows={4}
                    className="w-full p-6 bg-[#F8FAFC] border border-[#EEEEEE] rounded-[4px] text-[11px] font-medium italic text-[#222222] placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#F28C1B]/50 transition-all resize-none shadow-sm"
                  />
                )}
              </div>
            </div>

            <div className="pt-10 border-t border-[#EEEEEE] flex justify-end gap-5">
              <button
                onClick={() => setEvalDialog({ open: false, mode: "view" })}
                className="px-10 h-14 bg-[#EEEEEE] text-[#222222] text-[10px] font-bold uppercase tracking-widest rounded-[4px] hover:bg-gray-200 transition-all italic"
              >
                {evalDialog.mode === "view" ? "DISCONNECT" : "ABORT"}
              </button>
              {evalDialog.mode !== "view" && (
                <>
                  <button
                    onClick={() => handleSaveEvaluation("draft")}
                    className="px-10 h-14 bg-[#222222] text-white text-[10px] font-bold uppercase tracking-widest rounded-[4px] hover:bg-black transition-all italic active:scale-95"
                  >
                    SAVE TO BUFFER
                  </button>
                  <button
                    onClick={() => handleSaveEvaluation("submitted")}
                    className="px-10 h-14 bg-[#F28C1B] text-white text-[10px] font-bold uppercase tracking-widest rounded-[4px] hover:bg-[#D97812] transition-all flex items-center gap-4 active:scale-95 italic shadow-xl shadow-[#F28C1B]/10"
                  >
                    <Send className="h-4 w-4" /> SUBMIT TO CORE
                  </button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent className="bg-white border-none rounded-[4px] p-10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#222222] uppercase tracking-tighter italic">Purge record?</DialogTitle>
            <DialogDescription className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
              This intelligence data will be permanently erased from the neural core.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-10 gap-4">
            <button onClick={() => setDeleteDialog({ open: false })} className="px-8 h-12 bg-[#EEEEEE] text-[#222222] text-[10px] font-bold uppercase tracking-widest rounded-[4px] hover:bg-gray-200 transition-all italic">ABORT</button>
            <button onClick={handleDeleteEvaluation} className="px-8 h-12 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-[4px] hover:bg-rose-600 transition-all italic active:scale-95 shadow-lg shadow-rose-500/20">CONFIRM PURGE</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}






