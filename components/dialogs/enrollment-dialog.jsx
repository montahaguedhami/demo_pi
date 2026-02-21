"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useData } from "@/lib/data-store"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Search, Users, ShieldCheck, Loader2, X } from "lucide-react"

export function EnrollmentDialog({ open, onOpenChange, activity }) {
  const { employees, enrollments, enrollEmployee, unenrollEmployee } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [saving, setSaving] = useState(false)
  const [selectedEmployees, setSelectedEmployees] = useState(
    new Set(enrollments[activity.id] || [])
  )

  const getInitials = (name) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase()
  }

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleEmployee = (employeeId) => {
    const newSelected = new Set(selectedEmployees)
    if (newSelected.has(employeeId)) {
      newSelected.delete(employeeId)
    } else {
      if (newSelected.size >= activity.availableSeats) {
        toast.error(`CAPACITY REACHED`, { description: `Maximum ${activity.availableSeats} seats available.` })
        return
      }
      newSelected.add(employeeId)
    }
    setSelectedEmployees(newSelected)
  }

  const handleSave = async () => {
    setSaving(true)
    const currentEnrolled = new Set(enrollments[activity.id] || [])

    // Simulation for premium feel
    await new Promise(r => setTimeout(r, 800))

    // Unenroll removed employees
    currentEnrolled.forEach(empId => {
      if (!selectedEmployees.has(empId)) {
        unenrollEmployee(activity.id, empId)
      }
    })

    // Enroll new employees
    selectedEmployees.forEach(empId => {
      if (!currentEnrolled.has(empId)) {
        enrollEmployee(activity.id, empId)
      }
    })

    toast.success(`DEPLOYMENT SYNCHRONIZED`, { description: `${selectedEmployees.size} personnel nodes assigned to mission.` })
    setSaving(false)
    onOpenChange(false)
  }

  const seatsRemaining = activity.availableSeats - selectedEmployees.size

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] bg-white border-none rounded-[4px] p-0 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="bg-[#222222] px-10 py-10 relative overflow-hidden group shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F28C1B]/[0.05] rounded-full -mr-32 -mt-32 blur-[60px] animate-pulse"></div>
          <DialogHeader className="relative z-10 text-left">
            <p className="text-[9px] font-bold text-[#F28C1B] uppercase tracking-[0.4em] mb-3">Deployment Protocol</p>
            <DialogTitle className="text-3xl font-black text-white uppercase tracking-tighter italic">Tactical Deployment</DialogTitle>
            <DialogDescription className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 leading-loose opacity-70">
              Assigning personnel to: <span className="text-[#F28C1B]">{activity.title.toUpperCase()}</span>
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Search & Stats - Fixed below header */}
        <div className="px-10 py-6 bg-[#F8FAFC] border-b border-slate-100 space-y-4 shrink-0">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100 border border-slate-200/50">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Users className="h-5 w-5 text-[#F28C1B]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Selected Units</span>
                <span className="text-sm font-black text-[#222222] italic">{selectedEmployees.size} / {activity.availableSeats}</span>
              </div>
            </div>
            <Badge variant="secondary" className={cn(
              "rounded-lg text-[9px] font-black uppercase py-2 px-4 border shadow-sm italic transition-colors",
              seatsRemaining <= 3
                ? "bg-rose-50 border-rose-200 text-rose-600"
                : "bg-white border-slate-200 text-[#F28C1B]"
            )}>
              {seatsRemaining} Seats Open
            </Badge>
          </div>

          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#F28C1B] transition-colors" />
            <input
              placeholder="SEARCH ASSET MATRIX..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 bg-white border border-slate-200 rounded-xl h-12 text-[10px] font-black text-[#222222] uppercase tracking-widest placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#F28C1B] italic transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
          <div className="p-10 space-y-2">
            {filteredEmployees.map((employee) => (
              <label
                key={employee.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group/item",
                  selectedEmployees.has(employee.id)
                    ? "bg-[#F28C1B]/5 border-[#F28C1B]/20"
                    : "bg-white border-slate-50 hover:border-slate-200 hover:bg-slate-50/50"
                )}
              >
                <div className="relative">
                  <Checkbox
                    checked={selectedEmployees.has(employee.id)}
                    onCheckedChange={() => toggleEmployee(employee.id)}
                    className="border-slate-300 data-[state=checked]:bg-[#F28C1B] data-[state=checked]:border-[#F28C1B] h-6 w-6 rounded-lg transition-all"
                  />
                </div>
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm ring-1 ring-slate-100 rounded-xl">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${employee.id}`} className="rounded-xl" />
                  <AvatarFallback className="text-[10px] font-black bg-slate-100 text-slate-400 rounded-xl uppercase italic">
                    {getInitials(employee.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-black text-slate-900 uppercase tracking-tight truncate italic group-hover/item:text-[#F28C1B] transition-colors">
                    {employee.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate italic">
                      {employee.position}
                    </span>
                    <span className="text-slate-200">•</span>
                    <span className="text-[9px] font-black text-[#F28C1B] uppercase tracking-widest truncate italic">
                      {employee.department}
                    </span>
                  </div>
                </div>
                {selectedEmployees.has(employee.id) && (
                  <ShieldCheck className="h-5 w-5 text-[#F28C1B] animate-in zoom-in-50 duration-300" />
                )}
              </label>
            ))}
            {filteredEmployees.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="p-4 bg-slate-50 rounded-full">
                  <Search className="h-8 w-8 text-slate-200" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
                  Node not found in local matrix
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Vertical Stacked */}
        <DialogFooter className="flex flex-col gap-3 bg-[#F8FAFC]/50 p-10 border-t border-slate-100 shrink-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#222222] text-white font-black py-5 px-8 rounded-[12px] uppercase tracking-[0.4em] text-[10px] shadow-xl hover:bg-[#F28C1B] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 italic"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-[#F28C1B]" />
                <span>Syncing...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4 text-[#F28C1B]" />
                <span>Commit Deployment</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full bg-transparent border border-slate-200 hover:bg-white text-slate-400 font-black py-5 px-8 rounded-[12px] uppercase tracking-[0.4em] text-[10px] transition-all italic flex items-center justify-center gap-4"
          >
            <X className="w-4 h-4" />
            Abort Protocol
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
