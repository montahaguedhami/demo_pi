"use client"

import { useState } from "react"
import { useData } from "@/lib/data-store"
import { Badge } from "@/components/ui/badge"
import { Search, Brain, Plus, BookOpen, Heart, ArrowRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { DashboardHeader } from "@/components/dashboard/header"
import { AddSkillDialog } from "@/components/skills/add-skill-dialog"
import { EditSkillDialog } from "@/components/skills/edit-skill-dialog"

export default function AdminSkillsPage() {
  const { skills, employees } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [addSkillOpen, setAddSkillOpen] = useState(false)
  const [editSkillOpen, setEditSkillOpen] = useState(false)

  const filteredSkills = skills.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const typeConfig = {
    knowledge: { icon: BookOpen, label: "Knowledge", color: "bg-blue-50 text-blue-700" },
    knowHow: { icon: Brain, label: "Know-How", color: "bg-purple-50 text-purple-700" },
    softSkill: { icon: Heart, label: "Soft Skill", color: "bg-pink-50 text-pink-700" },
  }

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen">
      <DashboardHeader title="Skills Library" description="Manage and organize the organizational skills repository" />

      <div className="flex-1 p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex justify-end">
          <button onClick={() => setAddSkillOpen(true)} className="btn-premium">
            <Plus className="h-4 w-4" />
            Add Skill
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Search + Skill Cards */}
          <div className="lg:col-span-2 space-y-6">

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search skills by name or category..."
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F28C1B]/20 focus:border-[#F28C1B] transition-all placeholder:text-gray-400 shadow-sm"
              />
            </div>

            {/* Skill Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSkills.map(skill => {
                const cfg = typeConfig[skill.type] || typeConfig.knowledge
                const Icon = cfg.icon
                const activeEmployees = employees.filter(e => e.skills.some(s => s.skillId === skill.id)).length
                return (
                  <div
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill)}
                    className={cn(
                      "bg-white border rounded-xl p-6 hover:border-[#F28C1B]/40 transition-all group cursor-pointer shadow-sm hover:shadow-md",
                      selectedSkill?.id === skill.id
                        ? "border-[#F28C1B] ring-2 ring-[#F28C1B]/10 shadow-md"
                        : "border-gray-200"
                    )}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={cn("p-2.5 rounded-lg", cfg.color.replace("text-", "text-").replace("bg-", "bg-"))}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <Badge variant="outline" className="text-xs text-gray-500 border-gray-200 bg-gray-50">{skill.category}</Badge>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-[#F28C1B] transition-colors">{skill.name}</h3>
                    <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed">{skill.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-400">{activeEmployees} employee{activeEmployees !== 1 ? "s" : ""}</span>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#F28C1B] transition-all group-hover:translate-x-0.5" />
                    </div>
                  </div>
                )
              })}

              {filteredSkills.length === 0 && (
                <div className="col-span-2 py-16 text-center">
                  <p className="text-sm text-gray-400">No skills found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Skill Detail Panel */}
          <div className="lg:col-span-1">
            {selectedSkill ? (
              <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Detail Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs font-medium text-[#F28C1B] uppercase tracking-widest mb-1">Skill Details</p>
                    <h2 className="text-xl font-semibold text-gray-900 leading-tight">{selectedSkill.name}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Badges */}
                <div className="flex gap-2 mb-6">
                  <Badge variant="outline" className="text-xs font-medium border-gray-200 text-gray-600">{selectedSkill.category}</Badge>
                  <Badge variant="outline" className={cn("text-xs font-medium border-0", typeConfig[selectedSkill.type]?.color || "bg-gray-50 text-gray-600")}>
                    {typeConfig[selectedSkill.type]?.label || selectedSkill.type}
                  </Badge>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Description</p>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-4">{selectedSkill.description}</p>
                </div>

                {/* Proficiency Breakdown */}
                <div className="mb-6">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Proficiency Distribution</p>
                  <div className="space-y-3">
                    {["expert", "high", "medium", "low"].map(level => {
                      const count = employees.filter(e =>
                        e.skills.some(s => s.skillId === selectedSkill.id && s.level === level)
                      ).length
                      const pct = employees.length ? (count / employees.length) * 100 : 0
                      const colors = { expert: "bg-emerald-500", high: "bg-blue-500", medium: "bg-amber-400", low: "bg-gray-300" }
                      return (
                        <div key={level}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-gray-700 capitalize">{level}</span>
                            <span className="text-xs text-gray-400">{count} employee{count !== 1 ? "s" : ""}</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={cn("h-full rounded-full transition-all duration-700", colors[level])} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={() => setEditSkillOpen(true)}
                  className="btn-premium w-full justify-center"
                >
                  Edit Skill
                </button>
              </div>
            ) : (
              <div className="bg-white border border-dashed border-gray-200 rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                  <Brain className="w-7 h-7 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-400">Select a skill to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddSkillDialog open={addSkillOpen} onOpenChange={setAddSkillOpen} />
      <EditSkillDialog open={editSkillOpen} onOpenChange={setEditSkillOpen} skill={selectedSkill} />
    </div>
  )
}


