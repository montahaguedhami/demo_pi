"use client"

import { useState, useEffect } from "react"
import { useData } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"
import { useSearchParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { ClipboardCheck, Plus, Eye, CheckCircle2, AlertCircle, Clock, Trash2, User, Target } from "lucide-react"

export default function ManagerEvaluationsPage() {
  const { evaluations, employees, skills, addEvaluation, updateEvaluation, deleteEvaluation, departments } = useData()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()

  const [evalDialog, setEvalDialog] = useState({ open: false, mode: 'create', evaluation: null })
  const [formData, setFormData] = useState({ employeeId: "", skillId: "", score: 50, comment: "" })

  const managerDept = departments.find(d => d.manager_id === user?.id)
  const deptName = managerDept?.name || "Engineering"
  const deptEmployees = employees.filter(e => e.department === deptName)
  const deptEvaluations = evaluations.filter(ev => deptEmployees.some(e => e.id === ev.employeeId))

  useEffect(() => {
    const preselectId = searchParams.get("employee")
    if (preselectId && deptEmployees.some(e => e.id === preselectId)) {
      setFormData(prev => ({ ...prev, employeeId: preselectId }))
      setEvalDialog({ open: true, mode: 'create', evaluation: null })
    }
  }, [searchParams])

  const handleOpenCreate = () => {
    setFormData({ employeeId: "", skillId: "", score: 50, comment: "" })
    setEvalDialog({ open: true, mode: 'create', evaluation: null })
  }

  const handleOpenEdit = (evaluation) => {
    setFormData({
      employeeId: evaluation.employeeId,
      skillId: evaluation.skillId,
      score: evaluation.score,
      comment: evaluation.comment || ""
    })
    setEvalDialog({ open: true, mode: 'edit', evaluation })
  }

  const handleSave = () => {
    if (!formData.employeeId || !formData.skillId) {
      toast.error("Validation Error", { description: "Please select both an employee and a skill." })
      return
    }

    if (evalDialog.mode === 'create') {
      addEvaluation({ ...formData, managerId: user?.id, status: "completed", date: new Date().toISOString() })
      toast.success("Assessment Recorded", { description: "The skill assessment has been successfully added to the record." })
    } else {
      updateEvaluation(evalDialog.evaluation.id, { ...formData })
      toast.success("Assessment Updated", { description: "Changes to the skill assessment have been saved." })
    }
    setEvalDialog({ open: false, mode: 'create', evaluation: null })
  }

  const handleDelete = (id) => {
    deleteEvaluation(id)
    toast.success("Assessment Deleted", { description: "The assessment record has been removed." })
  }

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen font-sans">
<div className="flex-1 p-8 space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-200">
              <ClipboardCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assessments Registry</h1>
              <p className="text-sm text-slate-500">Track and calibrate team member skill levels.</p>
            </div>
          </div>
          <Button
            onClick={handleOpenCreate}
            className="bg-primary hover:bg-primary/90 text-white font-semibold py-6 px-8 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            New Assessment
          </Button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-100 h-14">
                <TableCell className="px-8 font-bold text-slate-500 text-xs uppercase tracking-wider">Employee</TableCell>
                <TableCell className="px-8 font-bold text-slate-500 text-xs uppercase tracking-wider">Skill Area</TableCell>
                <TableCell className="px-8 font-bold text-slate-500 text-xs uppercase tracking-wider">Score</TableCell>
                <TableCell className="px-8 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deptEvaluations.map((evaluation) => {
                const emp = employees.find(e => e.id === evaluation.employeeId)
                const skill = skills.find(s => s.id === evaluation.skillId)
                return (
                  <TableRow key={evaluation.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                    <TableCell className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                          <AvatarImage src={emp?.avatar || `https://i.pravatar.cc/150?u=${emp?.id}`} />
                          <AvatarFallback className="text-xs">{emp?.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 group-hover:text-primary transition-colors text-sm">{emp?.name}</span>
                          <span className="text-[11px] text-slate-500">{emp?.position}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none px-3 font-semibold text-xs">
                          {skill?.name || "Unknown"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full transition-all duration-1000",
                              evaluation.score >= 80 ? "bg-emerald-500" : evaluation.score >= 50 ? "bg-primary" : "bg-amber-500"
                            )}
                            style={{ width: `${evaluation.score}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-900 text-sm">{evaluation.score}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(evaluation)} className="h-9 w-9 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900">
                          <Eye className="h-4.5 w-4.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(evaluation.id)} className="h-9 w-9 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600">
                          <Trash2 className="h-4.5 w-4.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {deptEvaluations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-400 italic text-sm">
                    No assessments have been recorded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={evalDialog.open} onOpenChange={(open) => setEvalDialog({ ...evalDialog, open })}>
        <DialogContent className="max-w-[500px] bg-white border-none rounded-2xl p-0 overflow-hidden shadow-2xl">
          <div className="bg-slate-900 p-8">
            <DialogHeader>
              <Badge variant="outline" className="w-fit text-[10px] font-bold text-primary border-primary/30 uppercase tracking-wider mb-2 bg-primary/5">
                Assessment Workflow
              </Badge>
              <DialogTitle className="text-2xl font-bold text-white tracking-tight">
                {evalDialog.mode === 'create' ? "Record New Assessment" : "Modify Assessment Details"}
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-sm">
                Evaluate team competency and performance parameters.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <User className="h-3.5 w-3.5" /> Employee Unit
              </label>
              <Select
                value={formData.employeeId}
                onValueChange={(val) => setFormData({ ...formData, employeeId: val })}
                disabled={evalDialog.mode === 'edit'}
              >
                <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl text-slate-700 font-semibold focus:ring-primary/20">
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  {deptEmployees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id} className="font-semibold text-slate-700 py-3">
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Target className="h-3.5 w-3.5" /> Skill Competency Area
              </label>
              <Select
                value={formData.skillId}
                onValueChange={(val) => setFormData({ ...formData, skillId: val })}
              >
                <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl text-slate-700 font-semibold focus:ring-primary/20">
                  <SelectValue placeholder="Identify skill domain" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  {skills.map(skill => (
                    <SelectItem key={skill.id} value={skill.id} className="font-semibold text-slate-700 py-3">
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-4 px-2">
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Proficiency Calibration</label>
                <span className="text-xl font-bold text-primary">{formData.score}%</span>
              </div>
              <Slider
                value={[formData.score]}
                onValueChange={(vals) => setFormData({ ...formData, score: vals[0] })}
                max={100}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1">
                <span>BEGINNER</span>
                <span>PROFICIENT</span>
                <span>EXPERT</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Professional Observations</label>
              <textarea
                className="w-full h-24 bg-white border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                placeholder="Include tactical feedback or improvement paths..."
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="p-6 bg-slate-50 flex gap-3 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setEvalDialog({ open: false, mode: 'create', evaluation: null })}
              className="flex-1 bg-white hover:bg-slate-50 border-slate-200 h-12 rounded-xl text-slate-600 font-bold shadow-sm"
            >
              Abort assessment
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary/90 h-12 rounded-xl text-white font-bold shadow-md"
            >
              Commit result
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}



