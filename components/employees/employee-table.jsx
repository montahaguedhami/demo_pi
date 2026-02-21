"use client"

import React, { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useData } from "@/lib/data-store"
import { getSkillLevelColor } from "@/lib/mock-data"
import { Search, MoreHorizontal, Eye, Edit, Trash2, Filter, Plus, ChevronRight, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { EmployeeDialog } from "@/components/dialogs/employee-dialog"

export function EmployeeTable({ onSelectEmployee, selectedEmployeeId }) {
  const { employees, deleteEmployee } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState("create")
  const [editingEmployee, setEditingEmployee] = useState(null)

  const departments = [...new Set(employees.map((e) => e.department))]

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment =
      departmentFilter === "all" || employee.department === departmentFilter

    return matchesSearch && matchesDepartment
  })

  const getInitials = (name) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U"
  }

  const handleDelete = (id, name, e) => {
    e.stopPropagation()
    deleteEmployee(id)
    toast.success(`${name} removed from registry`)
  }

  const handleCreate = () => {
    setDialogMode("create")
    setEditingEmployee(null)
    setDialogOpen(true)
  }

  const handleEdit = (employee, e) => {
    e.stopPropagation()
    setDialogMode("edit")
    setEditingEmployee(employee)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-10">
      {/* Search & Filters */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between pb-10 border-b border-[#EEEEEE]">
        <div className="relative flex-1 max-w-xl group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#F28C1B] transition-colors" />
          <input
            placeholder="FILTER PERSONNEL MISSION..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#EEEEEE] border-none rounded-[4px] py-4 pl-14 pr-6 text-[10px] font-bold text-[#222222] tracking-widest uppercase focus:outline-none focus:ring-1 focus:ring-[#F28C1B]/50 transition-all placeholder:text-gray-300"
          />
        </div>
        <div className="flex items-center gap-6">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[220px] h-14 bg-white border-[#EEEEEE] rounded-[4px] text-[10px] font-bold uppercase tracking-widest hover:border-[#F28C1B]/30 transition-all">
              <SelectValue placeholder="UNIT: ALL" />
            </SelectTrigger>
            <SelectContent className="bg-white border-[#EEEEEE] rounded-[4px]">
              <SelectItem value="all" className="text-[10px] font-bold uppercase tracking-widest py-4">UNIT: GLOBAL</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept} className="text-[10px] font-bold uppercase tracking-widest py-4">{dept.toUpperCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            onClick={handleCreate}
            className="h-14 px-10 bg-[#222222] text-white rounded-[4px] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#F28C1B] transition-all flex items-center gap-3 active:scale-95 italic"
          >
            <Plus className="h-4 w-4" /> DEPLOY AGENT
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-[#EEEEEE] hover:bg-transparent">
              <TableHead className="py-6 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Operator Identity</TableHead>
              <TableHead className="py-6 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Matricule</TableHead>
              <TableHead className="py-6 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Division</TableHead>
              <TableHead className="py-6 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</TableHead>
              <TableHead className="py-6 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow
                key={employee.id}
                className={cn(
                  "group/row cursor-pointer border-b border-[#EEEEEE] transition-all duration-300",
                  selectedEmployeeId === employee.id ? "bg-[#F28C1B]/5 border-l-4 border-l-[#F28C1B]" : "hover:bg-[#F8FAFC]"
                )}
                onClick={() => onSelectEmployee?.(employee)}
              >
                <TableCell className="py-8 px-4">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-[4px] border border-[#EEEEEE] overflow-hidden group-hover/row:border-[#F28C1B]/30 transition-all duration-500">
                        <img src={employee.avatar || "https://i.pravatar.cc/150?u=" + employee.id} alt="" className="w-full h-full object-cover" />
                      </div>
                      {employee.en_ligne && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>}
                    </div>
                    <div>
                      <p className="font-bold text-[#222222] uppercase tracking-tighter text-base italic">{employee.name}</p>
                      <p className="text-[9px] text-gray-400 font-bold tracking-widest uppercase">{employee.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4">
                  <span className="font-mono text-[10px] text-[#222222] bg-[#EEEEEE] px-3 py-1.5 rounded-[2px] font-bold uppercase">{employee.matricule}</span>
                </TableCell>
                <TableCell className="px-4">
                  <Badge variant="outline" className="text-[9px] font-bold border-[#F28C1B]/20 text-[#F28C1B] bg-[#F28C1B]/5 py-1.5 px-4 uppercase tracking-widest italic rounded-[2px]">
                    {employee.department}
                  </Badge>
                </TableCell>
                <TableCell className="px-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      employee.status === "active" ? "bg-emerald-500" :
                        employee.status === "suspended" ? "bg-rose-500" : "bg-gray-300"
                    )} />
                    <span className="text-[10px] font-bold text-[#222222] uppercase tracking-widest italic">{employee.status}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right px-4">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover/row:opacity-100 transition-opacity">
                    <button
                      className="p-3 rounded-[4px] hover:bg-[#EEEEEE] text-gray-400 hover:text-[#F28C1B] transition-all"
                      onClick={(e) => handleEdit(employee, e)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="p-3 rounded-[4px] hover:bg-rose-500/10 hover:text-rose-500 text-gray-400 transition-all"
                      onClick={(e) => handleDelete(employee.id, employee.name, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="w-10 h-10 rounded-[4px] bg-[#EEEEEE] border border-[#EEEEEE] flex items-center justify-center text-[#222222] group-hover/row:bg-[#F28C1B] group-hover/row:text-white transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between pt-10 border-t border-[#EEEEEE]">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
          Registry Counter: <span className="text-[#222222]">{filteredEmployees.length}</span> / {employees.length} Agents
        </p>
        <div className="flex gap-3">
          {[1, 2, 3].map(p => (
            <button key={p} className={cn("w-10 h-10 rounded-[4px] text-[10px] font-bold transition-all border", p === 1 ? "bg-[#222222] text-white border-[#222222]" : "bg-white text-gray-400 border-[#EEEEEE] hover:border-[#F28C1B]/30 hover:text-[#F28C1B]")}>{p}</button>
          ))}
        </div>
      </div>

      <EmployeeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={editingEmployee}
        mode={dialogMode}
      />
    </div>
  )
}
