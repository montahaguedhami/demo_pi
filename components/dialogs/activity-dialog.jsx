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
import { Badge } from "@/components/ui/badge"
import { useData } from "@/lib/data-store"
import { toast } from "sonner"
import { X, Plus, Sparkles, Zap, Loader2, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export function ActivityDialog({ open, onOpenChange, activity, mode }) {
  const { addActivity, updateActivity, skills } = useData()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    type: "training",
    description: "",
    availableSeats: 10,
    location: "",
    startDate: "",
    endDate: "",
    duration: "",
    priorityContext: "upskilling",
    status: "upcoming",
  })
  const [selectedSkills, setSelectedSkills] = useState([])
  const [newSkillId, setNewSkillId] = useState("")
  const [newSkillLevel, setNewSkillLevel] = useState("medium")
  const [newSkillWeight, setNewSkillWeight] = useState(5)

  useEffect(() => {
    if (activity && mode === "edit") {
      setFormData({
        title: activity.title,
        type: activity.type,
        description: activity.description,
        availableSeats: activity.availableSeats,
        location: activity.location,
        startDate: activity.startDate instanceof Date
          ? activity.startDate.toISOString().split('T')[0]
          : new Date(activity.startDate).toISOString().split('T')[0],
        endDate: activity.endDate instanceof Date
          ? activity.endDate.toISOString().split('T')[0]
          : new Date(activity.endDate).toISOString().split('T')[0],
        duration: activity.duration,
        priorityContext: activity.priorityContext,
        status: activity.status,
      })
      setSelectedSkills(activity.requiredSkills.map(rs => ({
        skillId: rs.skillId,
        requiredLevel: rs.requiredLevel,
        weight: rs.weight,
      })))
    } else {
      setFormData({
        title: "",
        type: "training",
        description: "",
        availableSeats: 10,
        location: "",
        startDate: "",
        endDate: "",
        duration: "",
        priorityContext: "upskilling",
        status: "upcoming",
      })
      setSelectedSkills([])
    }
  }, [activity, mode, open])

  const addSkillRequirement = () => {
    if (!newSkillId) {
      toast.error("MISSING SKILL", { description: "Please select a neural node to add." })
      return
    }
    if (selectedSkills.some(s => s.skillId === newSkillId)) {
      toast.error("DUPLICATE ENTRY", { description: "This skill is already in the requirements." })
      return
    }
    setSelectedSkills(prev => [...prev, {
      skillId: newSkillId,
      requiredLevel: newSkillLevel,
      weight: newSkillWeight,
    }])
    setNewSkillId("")
    setNewSkillLevel("medium")
    setNewSkillWeight(5)
  }

  const removeSkillRequirement = (skillId) => {
    setSelectedSkills(prev => prev.filter(s => s.skillId !== skillId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.startDate) {
      toast.error("MISSING DATA", {
        description: "All core protocol parameters must be defined."
      })
      return
    }

    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))

    const requiredSkills = selectedSkills.map(ss => ({
      skillId: ss.skillId,
      skill: skills.find(s => s.id === ss.skillId),
      requiredLevel: ss.requiredLevel,
      weight: ss.weight,
    }))

    if (mode === "create") {
      addActivity({
        title: formData.title,
        type: formData.type,
        description: formData.description,
        requiredSkills,
        availableSeats: formData.availableSeats,
        enrolledCount: 0,
        location: formData.location,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate || formData.startDate),
        duration: formData.duration,
        priorityContext: formData.priorityContext,
        status: formData.status,
        createdBy: "user-1",
      })
      toast.success("PROTOCOL INITIALIZED", {
        description: `${formData.title.toUpperCase()} has been integrated into the mission stack.`
      })
    } else if (activity) {
      updateActivity(activity.id, {
        ...formData,
        requiredSkills,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate || formData.startDate),
      })
      toast.success("CONFIGURATION SYNCHRONIZED", {
        description: `${formData.title.toUpperCase()} parameters have been updated.`
      })
    }

    setSaving(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] bg-white border-none rounded-[4px] p-0 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="bg-[#222222] px-10 py-10 relative overflow-hidden group shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F28C1B]/[0.05] rounded-full -mr-32 -mt-32 blur-[60px] animate-pulse"></div>
          <DialogHeader className="relative z-10 text-left">
            <p className="text-[9px] font-bold text-[#F28C1B] uppercase tracking-[0.4em] mb-3">Activity Protocol</p>
            <DialogTitle className="text-3xl font-black text-white uppercase tracking-tighter italic">
              {mode === "create" ? "Initialize Activity" : "Modify Configuration"}
            </DialogTitle>
            <DialogDescription className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 leading-loose opacity-70">
              {mode === "create"
                ? "Define a new strategic training or tactical node."
                : "Update existing operational parameters."}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <form id="activity-form" onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Designation *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="ADVANCED NEURAL TRAINING"
                  className="bg-[#EEEEEE] border-none rounded-[4px] h-12 text-sm font-bold text-[#222222] placeholder:text-gray-300 focus-visible:ring-1 focus-visible:ring-[#F28C1B] italic"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="type" className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Protocol Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="bg-[#EEEEEE] border-none rounded-[4px] h-12 font-bold text-[#222222] focus:ring-1 focus:ring-[#F28C1B] italic">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#EEEEEE] rounded-[4px] shadow-2xl">
                      {["Training", "Certification", "Project", "Mission", "Audit"].map(t => (
                        <SelectItem key={t.toLowerCase()} value={t.toLowerCase()} className="text-[10px] font-bold uppercase italic">{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status" className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Operational Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="bg-[#EEEEEE] border-none rounded-[4px] h-12 font-bold text-[#222222] focus:ring-1 focus:ring-[#F28C1B] italic">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#EEEEEE] rounded-[4px] shadow-2xl">
                      {["Upcoming", "Ongoing", "Completed", "Cancelled"].map(s => (
                        <SelectItem key={s.toLowerCase()} value={s.toLowerCase()} className="text-[10px] font-bold uppercase italic">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description" className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Operational Objectives *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="DEFINE MISSION OBJECTIVES..."
                  rows={4}
                  className="bg-[#EEEEEE] border-none rounded-[4px] py-4 text-sm font-bold text-[#222222] placeholder:text-gray-300 focus-visible:ring-1 focus-visible:ring-[#F28C1B] min-h-[120px] italic"
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="startDate" className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Deployment *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="bg-[#EEEEEE] border-none rounded-[4px] h-12 font-bold text-[#222222] focus-visible:ring-1 focus-visible:ring-[#F28C1B] italic"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate" className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Termination</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="bg-[#EEEEEE] border-none rounded-[4px] h-12 font-bold text-[#222222] focus-visible:ring-1 focus-visible:ring-[#F28C1B] italic"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration" className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Time Delta</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="2 WEEKS"
                    className="bg-[#EEEEEE] border-none rounded-[4px] h-12 font-bold text-[#222222] placeholder:text-gray-300 focus-visible:ring-1 focus-visible:ring-[#F28C1B] italic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="location" className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Vector Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="REMOTE / HUB-A"
                    className="bg-[#EEEEEE] border-none rounded-[4px] h-12 font-bold text-[#222222] placeholder:text-gray-300 focus-visible:ring-1 focus-visible:ring-[#F28C1B] italic"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="seats" className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Max Capacity</Label>
                  <Input
                    id="seats"
                    type="number"
                    min="1"
                    value={formData.availableSeats}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      availableSeats: parseInt(e.target.value) || 1
                    }))}
                    className="bg-[#EEEEEE] border-none rounded-[4px] h-12 font-bold text-[#222222] focus-visible:ring-1 focus-visible:ring-[#F28C1B] italic"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority" className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Strategic Priority</Label>
                <Select
                  value={formData.priorityContext}
                  onValueChange={(value) =>
                    setFormData(prev => ({ ...prev, priorityContext: value }))
                  }
                >
                  <SelectTrigger className="bg-[#EEEEEE] border-none rounded-[4px] h-12 font-bold text-[#222222] focus:ring-1 focus:ring-[#F28C1B] italic">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#EEEEEE] rounded-[4px] shadow-2xl">
                    <SelectItem value="upskilling" className="text-[10px] font-bold uppercase italic">Upskilling (develop entry-level nodes)</SelectItem>
                    <SelectItem value="consolidation" className="text-[10px] font-bold uppercase italic">Consolidation (strengthen operational)</SelectItem>
                    <SelectItem value="expertise" className="text-[10px] font-bold uppercase italic">Expertise (advance high-level)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Required Skills Section */}
              <div className="grid gap-4 pt-8 border-t border-[#EEEEEE]">
                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Neural Requirements</Label>

                {/* Selected skills */}
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    {selectedSkills.map(ss => {
                      const skill = skills.find(s => s.id === ss.skillId)
                      return (
                        <Badge key={ss.skillId} variant="secondary" className="gap-2 py-2 px-4 bg-white text-slate-900 rounded-lg border border-slate-200 text-[10px] uppercase font-bold italic shadow-sm hover:border-[#F28C1B]/30 transition-all">
                          {skill?.name}
                          <span className="text-[#F28C1B] font-black">{ss.requiredLevel.toUpperCase()}</span>
                          <button
                            type="button"
                            onClick={() => removeSkillRequirement(ss.skillId)}
                            className="ml-1 text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )
                    })}
                  </div>
                )}

                {/* Add skill form */}
                <div className="flex items-end gap-3 bg-[#F8FAFC] p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex-1 space-y-2">
                    <Label className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Neural Node</Label>
                    <Select value={newSkillId} onValueChange={setNewSkillId}>
                      <SelectTrigger className="bg-[#EEEEEE] border-none rounded-[4px] h-12 font-bold text-[#222222] focus:ring-1 focus:ring-[#F28C1B] italic">
                        <SelectValue placeholder="Protocol..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 rounded-[4px] shadow-2xl">
                        {skills.filter(s => !selectedSkills.some(ss => ss.skillId === s.id)).map((skill) => (
                          <SelectItem key={skill.id} value={skill.id} className="text-[10px] font-bold uppercase italic">{skill.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32 space-y-2">
                    <Label className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Competency</Label>
                    <Select value={newSkillLevel} onValueChange={(v) => setNewSkillLevel(v)}>
                      <SelectTrigger className="bg-[#EEEEEE] border-none rounded-[4px] h-12 font-bold text-[#222222] focus:ring-1 focus:ring-[#F28C1B] italic">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 rounded-[4px] shadow-2xl">
                        {["Low", "Medium", "High", "Expert"].map(l => (
                          <SelectItem key={l.toLowerCase()} value={l.toLowerCase()} className="text-[10px] font-bold uppercase italic">{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24 space-y-2">
                    <Label className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Weight</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={newSkillWeight}
                      onChange={(e) => setNewSkillWeight(parseInt(e.target.value) || 5)}
                      className="bg-[#EEEEEE] border-none rounded-[4px] h-12 font-bold text-[#222222] focus-visible:ring-1 focus-visible:ring-[#F28C1B] italic"
                    />
                  </div>
                  <button type="button" onClick={addSkillRequirement} className="bg-[#222222] text-white h-12 w-12 rounded-[4px] hover:bg-[#F28C1B] transition-all flex items-center justify-center active:scale-95 shadow-lg group">
                    <Plus className="h-5 w-5 text-[#F28C1B] group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Vertical Stacked Footer */}
        <DialogFooter className="flex flex-col gap-3 bg-[#F8FAFC]/50 p-10 border-t border-[#EEEEEE] shrink-0">
          <button
            form="activity-form"
            type="submit"
            disabled={saving}
            className="w-full bg-[#222222] text-white font-black py-5 px-8 rounded-[12px] uppercase tracking-[0.4em] text-[10px] shadow-xl hover:bg-[#F28C1B] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 italic"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 text-[#F28C1B] animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 text-[#F28C1B]" />
                <span>{mode === "create" ? "Finalize Entry" : "Synchronize Engine"}</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full bg-transparent border border-[#EEEEEE] hover:bg-white text-gray-400 font-black py-5 px-8 rounded-[12px] uppercase tracking-[0.4em] text-[10px] transition-all italic flex items-center justify-center gap-4"
          >
            <X className="w-4 h-4" />
            Abort Protocol
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
