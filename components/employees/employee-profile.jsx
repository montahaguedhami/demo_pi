"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mail,
  Building,
  Briefcase,
  Calendar,
  TrendingUp,
  X,
  Plus,
  Edit,
  Trash2,
  Phone,
  Hash,
  Brain,
  Zap,
  Star,
  Shield
} from "lucide-react"
import { useData } from "@/lib/data-store"
import { cn } from "@/lib/utils"

export function EmployeeProfile({ employee: initialEmployee, onClose }) {
  const { employees, removeEmployeeSkill } = useData()
  const employee = employees.find(e => e.id === initialEmployee.id) || initialEmployee

  const avgScore = employee.skills.length > 0
    ? Math.round(employee.skills.reduce((sum, s) => sum + (s.proficiencyScore || s.score || 0), 0) / (employee.skills.length || 1))
    : 0

  return (
    <Card className="bg-white border border-[#EEEEEE] rounded-[4px] overflow-hidden shadow-2xl sticky top-8 animate-in slide-in-from-right-10 duration-700">
      <CardHeader className="relative p-10 pb-0 border-b border-[#EEEEEE]">
        <button
          onClick={onClose}
          className="absolute right-8 top-8 p-3 bg-[#EEEEEE] rounded-[4px] hover:bg-[#F28C1B] hover:text-white text-[#222222] transition-all z-10"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center pb-10 pt-4">
          <div className="relative mb-8">
            <div className="w-28 h-28 rounded-[4px] border border-[#EEEEEE] p-1.5 bg-[#F8FAFC] shadow-inner overflow-hidden group">
              <img src={employee.avatar || "https://i.pravatar.cc/150?u=" + employee.id} alt="" className="w-full h-full object-cover rounded-[2px] transition-transform duration-1000 group-hover:scale-110" />
            </div>
            {employee.en_ligne && <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full shadow-lg"></div>}
          </div>
          <CardTitle className="text-2xl font-bold text-[#222222] uppercase tracking-tighter italic mb-2 leading-none">{employee.name}</CardTitle>
          <p className="text-[10px] font-bold text-[#F28C1B] uppercase tracking-[.4em] mb-6">Tactical Operative</p>

          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="bg-[#EEEEEE] text-[#222222] border-none text-[8px] font-bold py-1.5 px-4 uppercase tracking-widest rounded-[2px] italic">
              <Building className="mr-2 h-3 w-3" /> {employee.department}
            </Badge>
            <Badge className="bg-[#222222] text-white border-none text-[8px] font-bold py-1.5 px-4 uppercase tracking-widest rounded-[2px] italic">
              <Shield className="mr-2 h-3 w-3" /> ID-{employee.id.slice(0, 4).toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-10">
        {/* KPI Row */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          <div className="bg-[#F8FAFC] rounded-[4px] p-6 text-center border border-[#EEEEEE] relative group overflow-hidden">
            <p className="text-4xl font-bold text-[#222222] italic tracking-tighter mb-2 relative z-10 leading-none">{avgScore}%</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest relative z-10">Neural Rank</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-[4px] p-6 text-center border border-[#EEEEEE] relative group overflow-hidden">
            <p className="text-4xl font-bold text-[#222222] italic tracking-tighter mb-2 relative z-10 leading-none">{employee.skills.length}</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest relative z-10">Core Nodes</p>
          </div>
        </div>

        <Tabs defaultValue="skills" className="w-full">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-[#EEEEEE] rounded-[4px] mb-8 h-auto">
            <TabsTrigger value="skills" className="text-[10px] font-bold uppercase tracking-widest py-3 rounded-[2px] data-[state=active]:bg-white data-[state=active]:text-[#222222] transition-all italic">Capabilities</TabsTrigger>
            <TabsTrigger value="history" className="text-[10px] font-bold uppercase tracking-widest py-3 rounded-[2px] data-[state=active]:bg-white data-[state=active]:text-[#222222] transition-all italic">Missions</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-8">
            {employee.skills.slice(0, 5).map((skill, idx) => (
              <div key={idx} className="space-y-3 group">
                <div className="flex justify-between items-end text-[10px] uppercase font-bold tracking-widest">
                  <span className="text-[#222222] group-hover:text-[#F28C1B] transition-colors italic">{skill.skill.name}</span>
                  <span className="text-gray-300">{skill.proficiencyScore || skill.score || 0}%</span>
                </div>
                <div className="h-1 w-full bg-[#EEEEEE] rounded-full overflow-hidden">
                  <div className="h-full bg-[#F28C1B] transition-all duration-1000 origin-left" style={{ width: `${skill.proficiencyScore || skill.score || 0}%` }}></div>
                </div>
              </div>
            ))}
            <button className="w-full py-5 rounded-[4px] border-2 border-dashed border-[#EEEEEE] text-[#222222] hover:border-[#F28C1B]/30 hover:bg-[#F28C1B]/5 text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
              Neural Deep-Scan <Zap className="h-3 w-3 text-[#F28C1B]" />
            </button>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {employee.activityHistory.slice(0, 4).map((h, i) => (
              <div key={i} className="flex gap-5 p-5 rounded-[4px] bg-[#F8FAFC] border border-[#EEEEEE] group hover:border-[#F28C1B]/20 transition-all">
                <div className="w-12 h-12 rounded-[4px] bg-[#EEEEEE] flex items-center justify-center text-[#F28C1B] flex-shrink-0 group-hover:bg-[#F28C1B] group-hover:text-white transition-all">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#222222] uppercase tracking-tighter mb-1 italic">Protocol SM-{i + 102}</p>
                  <p className="text-[9px] text-gray-400 font-bold tracking-widest uppercase">Deployment Verified</p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <div className="mt-12 pt-10 border-t border-[#EEEEEE]">
          <h4 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-4 flex items-center gap-3">
            <Star className="h-3 w-3 text-[#F28C1B]" /> Intelligence Summary
          </h4>
          <p className="text-xs text-gray-500 font-medium leading-relaxed italic border-l-2 border-[#EEEEEE] pl-4">
            "{employee.jobDescription?.split('.')[0] || "Personnel profile calibrated for multi-vector operations and collaborative synchronization."}"
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
