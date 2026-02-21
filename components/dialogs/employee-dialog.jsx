"use client"

import React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useData } from "@/lib/data-store"
import { toast } from "sonner"
import { Sparkles, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function EmployeeDialog({ open, onOpenChange, employee, mode }) {
  const { addEmployee, updateEmployee, departments } = useData()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    matricule: "",
    email: "",
    telephone: "",
    department: "",
    departement_id: "",
    position: "",
    jobDescription: "",
    yearsOfExperience: 0,
    status: "active",
  })

  useEffect(() => {
    if (employee && mode === "edit") {
      setFormData({
        name: employee.name,
        matricule: employee.matricule,
        email: employee.email,
        telephone: employee.telephone,
        department: employee.department,
        departement_id: employee.departement_id,
        position: employee.position,
        jobDescription: employee.jobDescription,
        yearsOfExperience: employee.yearsOfExperience,
        status: employee.status,
      })
    } else {
      setFormData({
        name: "",
        matricule: "",
        email: "",
        telephone: "",
        department: "",
        departement_id: "",
        position: "",
        jobDescription: "",
        yearsOfExperience: 0,
        status: "active",
      })
    }
  }, [employee, mode, open])

  const handleDepartmentChange = (deptId) => {
    const dept = departments.find(d => d.id === deptId)
    if (dept) {
      setFormData(prev => ({
        ...prev,
        department: dept.name,
        departement_id: dept.id,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.departement_id || !formData.position) {
      toast.error("MISSING DATA", {
        description: "All core neural parameters must be defined."
      })
      return
    }

    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))

    if (mode === "create") {
      const generatedMatricule = formData.matricule || `MAT-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`
      addEmployee({
        userId: `u${Date.now()}`,
        name: formData.name,
        matricule: generatedMatricule,
        email: formData.email,
        telephone: formData.telephone,
        department: formData.department,
        departement_id: formData.departement_id,
        position: formData.position,
        jobDescription: formData.jobDescription,
        yearsOfExperience: formData.yearsOfExperience,
        date_embauche: new Date(),
        status: formData.status,
        en_ligne: false,
        skills: [],
        activityHistory: [],
      })
      toast.success("OPERATOR INITIALIZED", {
        description: `${formData.name.toUpperCase()} has been registered in the systemic database.`
      })
    } else if (employee) {
      updateEmployee(employee.id, formData)
      toast.success("PROFILE SYNCHRONIZED", {
        description: `${formData.name.toUpperCase()} parameters have been updated.`
      })
    }

    setSaving(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] bg-white border-none rounded-[4px] p-0 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Fixed Header */}
        <div className="bg-[#222222] px-10 py-10 relative overflow-hidden group shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F28C1B]/[0.05] rounded-full -mr-32 -mt-32 blur-[60px] animate-pulse"></div>
          <DialogHeader className="relative z-10 text-left">
            <p className="text-[9px] font-bold text-[#F28C1B] uppercase tracking-[0.4em] mb-3">Operator Protocol</p>
            <DialogTitle className="text-3xl font-black text-white uppercase tracking-tighter italic">
              {mode === "create" ? "Initialize Operator" : "Update Profile"}
            </DialogTitle>
            <DialogDescription className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 leading-loose opacity-70">
              {mode === "create"
                ? "Register a new neural asset in the systemic database."
                : "Modify existing operator parameters."}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <form id="employee-form" onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Full Designation *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="EX: JOHN DRAKE"
                    className="bg-[#EEEEEE] border-none rounded-[4px] h-12 text-sm font-bold text-[#222222] placeholder:text-gray-300 focus-visible:ring-1 focus-visible:ring-[#F28C1B] italic"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="matricule" className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">System ID</Label>
                  <Input
                    id="matricule"
                    value={formData.matricule}
                    onChange={(e) => setFormData(prev => ({ ...prev, matricule: e.target.value }))}
                    placeholder="ID-2026-X"
                    className="bg-[#EEEEEE] border-none rounded-[4px] h-12 text-sm font-bold text-[#222222] placeholder:text-gray-300 focus-visible:ring-1 focus-visible:ring-[#F28C1B] italic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Neural Key (Email) *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="USER@SYSTEM.COM"
                    className="bg-[#EEEEEE] border-none rounded-[4px] h-12 text-sm font-bold text-[#222222] placeholder:text-gray-300 focus-visible:ring-1 focus-visible:ring-[#F28C1B] italic"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telephone" className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Comm Link</Label>
                  <Input
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                    placeholder="+SYSTEM +000"
                    className="bg-[#EEEEEE] border-none rounded-[4px] h-12 text-sm font-bold text-[#222222] placeholder:text-gray-300 focus-visible:ring-1 focus-visible:ring-[#F28C1B] italic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="department" className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Operational Hub *</Label>
                  <Select
                    value={formData.departement_id}
                    onValueChange={handleDepartmentChange}
                  >
                    <SelectTrigger className="bg-[#EEEEEE] border-none rounded-[4px] h-12 font-bold text-[#222222] focus:ring-1 focus:ring-[#F28C1B] italic">
                      <SelectValue placeholder="Select hub" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 rounded-[4px] shadow-2xl">
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id} className="font-bold text-[10px] uppercase italic">
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status" className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Asset Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="bg-[#EEEEEE] border-none rounded-[4px] h-12 font-bold text-[#222222] focus:ring-1 focus:ring-[#F28C1B] italic">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 rounded-[4px] shadow-2xl">
                      <SelectItem value="active" className="text-emerald-500 font-bold uppercase text-[10px] italic">Active</SelectItem>
                      <SelectItem value="inactive" className="text-gray-400 font-bold uppercase text-[10px] italic">Inactive</SelectItem>
                      <SelectItem value="suspended" className="text-rose-500 font-bold uppercase text-[10px] italic">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="position" className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Tactical Role *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="LEAD OPERATOR"
                    className="bg-[#EEEEEE] border-none rounded-[4px] h-12 text-sm font-bold text-[#222222] placeholder:text-gray-300 focus-visible:ring-1 focus-visible:ring-[#F28C1B] italic"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="experience" className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Service Duration (years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      yearsOfExperience: parseInt(e.target.value) || 0
                    }))}
                    className="bg-[#EEEEEE] border-none rounded-[4px] h-12 text-sm font-bold text-[#222222] focus-visible:ring-1 focus-visible:ring-[#F28C1B] italic"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="jobDescription" className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Role Objectives</Label>
                <Textarea
                  id="jobDescription"
                  value={formData.jobDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                  placeholder="DEFINE TACTICAL RESPONSIBILITIES..."
                  rows={4}
                  className="bg-[#EEEEEE] border-none rounded-[4px] py-4 text-sm font-bold text-[#222222] placeholder:text-gray-300 focus-visible:ring-1 focus-visible:ring-[#F28C1B] italic min-h-[120px]"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Vertical Stacked Footer */}
        <DialogFooter className="flex flex-col gap-3 bg-[#F8FAFC]/50 p-10 border-t border-[#EEEEEE] shrink-0">
          <button
            form="employee-form"
            type="submit"
            disabled={saving}
            className="w-full bg-[#222222] text-white font-black py-5 px-8 rounded-[12px] uppercase tracking-[0.4em] text-[10px] shadow-xl hover:bg-[#F28C1B] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 italic"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 text-[#F28C1B] animate-spin" />
                <span>Syncing...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-[#F28C1B]" />
                <span>{mode === "create" ? "Initialize Asset" : "Update Profile"}</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full bg-transparent border border-[#EEEEEE] hover:bg-white text-gray-400 font-black py-5 px-8 rounded-[12px] uppercase tracking-[0.4em] text-[10px] transition-all italic flex items-center justify-center gap-4"
          >
            <X className="w-4 h-4" />
            Abort Mission
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
