"use client"

import { useState } from "react"
import { useData } from "@/lib/data-store"
import { DashboardHeader } from "@/components/dashboard/header"
import { EmployeeTable } from "@/components/employees/employee-table"
import { EmployeeProfile } from "@/components/employees/employee-profile"
import { cn } from "@/lib/utils"

export default function AdminEmployeesPage() {
  const { employees } = useData()
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen page-transition">
      <DashboardHeader title="Personnel Registry" description="Comprehensive Database of Organizational Talent & Neural Profiles" />
      <div className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-10">
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          <div className={cn(
            "transition-all duration-700",
            selectedEmployee ? "lg:col-span-8" : "lg:col-span-12"
          )}>
            <div className="card-premium p-0 border-none">
              <EmployeeTable
                employees={employees}
                onSelectEmployee={setSelectedEmployee}
                selectedEmployeeId={selectedEmployee?.id}
              />
            </div>
          </div>
          {selectedEmployee && (
            <div className="lg:col-span-4 animate-in slide-in-from-right-10 duration-700">
              <EmployeeProfile
                employee={selectedEmployee}
                onClose={() => setSelectedEmployee(null)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


