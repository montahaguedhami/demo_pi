"use client"

import { useState } from "react"
import { useData } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { Calendar, MapPin, Users, Clock, BookOpen, Award, Briefcase, Eye, UserPlus, Sparkles, Filter } from "lucide-react"
import { getActivityTypeLabel } from "@/lib/mock-data"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

export default function ManagerActivitiesPage() {
  const { activities, employees, enrollments, enrollEmployee, unenrollEmployee, departments } = useData()
  const { user } = useAuth()

  const [selectedActivity, setSelectedActivity] = useState(null)
  const [enrollDialog, setEnrollDialog] = useState({ open: false, activity: null })
  const [selectedEmployees, setSelectedEmployees] = useState([])

  const managerDept = departments.find(d => d.manager_id === user?.id)
  const deptName = managerDept?.name || "Engineering"
  const deptEmployees = employees.filter(e => e.department === deptName)

  const getTypeIcon = (type) => {
    switch (type) {
      case "training": return <BookOpen className="h-5 w-5" />
      case "certification": return <Award className="h-5 w-5" />
      case "project": return <Briefcase className="h-5 w-5" />
      default: return <Calendar className="h-5 w-5" />
    }
  }

  const openEnrollDialog = (activity) => {
    const currentEnrolled = enrollments[activity.id] || []
    setSelectedEmployees(currentEnrolled.filter(id => deptEmployees.some(e => e.id === id)))
    setEnrollDialog({ open: true, activity })
  }

  const handleEnrollmentChange = (employeeId, enrolled) => {
    if (enrolled) {
      setSelectedEmployees([...selectedEmployees, employeeId])
    } else {
      setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId))
    }
  }

  const handleSaveEnrollments = () => {
    if (!enrollDialog.activity) return

    const activity = enrollDialog.activity
    const currentEnrolled = (enrollments[activity.id] || []).filter(id => deptEmployees.some(e => e.id === id))

    const newlyEnrolled = selectedEmployees.filter(id => !currentEnrolled.includes(id))
    const unenrolled = currentEnrolled.filter(id => !selectedEmployees.includes(id))

    newlyEnrolled.forEach(id => enrollEmployee(activity.id, id))
    unenrolled.forEach(id => unenrollEmployee(activity.id, id))

    toast.success("Enrollment Updated", {
      description: `Team participation for ${activity.title} has been synchronized.`
    })
    setEnrollDialog({ open: false, activity: null })
  }

  const upcomingActivities = activities.filter(a => a.status === "upcoming")
  const ongoingActivities = activities.filter(a => a.status === "ongoing")
  const completedActivities = activities.filter(a => a.status === "completed")

  const ActivityCard = ({ activity }) => {
    const enrolled = (enrollments[activity.id] || []).filter(id => deptEmployees.some(e => e.id === id))

    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all group overflow-hidden flex flex-col h-full">
        <div className="p-6 border-b border-slate-100 relative bg-slate-50/30">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                {getTypeIcon(activity.type)}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">{activity.title}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{getActivityTypeLabel(activity.type)}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-bold bg-white border-slate-200 text-slate-500 rounded-md">
              {activity.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col gap-5">
          <p className="text-sm text-slate-500 leading-relaxed font-medium line-clamp-2">
            {activity.description}
          </p>

          <div className="grid grid-cols-2 gap-y-3 gap-x-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Calendar className="h-4 w-4 text-slate-400" />
              {new Date(activity.startDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Clock className="h-4 w-4 text-slate-400" />
              {activity.duration}
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span className="truncate">{activity.location}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Users className="h-4 w-4 text-slate-400" />
              {activity.enrolledCount}/{activity.availableSeats} Enrolled
            </div>
          </div>

          {enrolled.length > 0 && (
            <div className="pt-4 border-t border-slate-100 mt-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Team Participation ({enrolled.length} members)</p>
              <div className="flex -space-x-2">
                {enrolled.slice(0, 5).map(empId => {
                  const emp = deptEmployees.find(e => e.id === empId)
                  return (
                    <Avatar key={empId} className="h-8 w-8 border-2 border-white rounded-lg shadow-sm">
                      <AvatarImage src={emp?.avatar || `https://i.pravatar.cc/150?u=${empId}`} />
                      <AvatarFallback className="bg-slate-100 text-slate-500 font-bold text-[10px]">{emp?.name[0]}</AvatarFallback>
                    </Avatar>
                  )
                })}
                {enrolled.length > 5 && (
                  <div className="h-8 w-8 rounded-lg bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-sm">
                    +{enrolled.length - 5}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2 mt-auto">
            <button
              onClick={() => setSelectedActivity(activity)}
              className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Eye className="h-4 w-4" />
              Details
            </button>
            {activity.status !== "completed" && (
              <button
                onClick={() => openEnrollDialog(activity)}
                className="flex-1 bg-primary text-white text-xs font-semibold py-2.5 px-4 rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <UserPlus className="h-4 w-4" />
                Enroll Team
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen">
      <DashboardHeader title="Dashboard" description="Professional workspace interface" />

      <div className="flex-1 p-8 space-y-8 animate-in fade-in duration-500">
        <Tabs defaultValue="upcoming" className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-200 pb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-200">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Active Programs</h1>
                <p className="text-sm text-slate-500">Coordinate team development activities.</p>
              </div>
            </div>
            <TabsList className="bg-slate-100 p-1 rounded-xl h-12">
              <TabsTrigger value="upcoming" className="px-6 h-10 text-xs font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                Upcoming ({upcomingActivities.length})
              </TabsTrigger>
              <TabsTrigger value="ongoing" className="px-6 h-10 text-xs font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                Active ({ongoingActivities.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="px-6 h-10 text-xs font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                History ({completedActivities.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upcoming" className="mt-0 outline-none">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingActivities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
              {upcomingActivities.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white border border-slate-200 rounded-xl">
                  <p className="text-sm text-slate-400 italic">No upcoming programs currently scheduled.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ongoing" className="mt-0 outline-none">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ongoingActivities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
              {ongoingActivities.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white border border-slate-200 rounded-xl">
                  <p className="text-sm text-slate-400 italic">No active programs at this time.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-0 outline-none">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {completedActivities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
              {completedActivities.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white border border-slate-200 rounded-xl">
                  <p className="text-sm text-slate-400 italic">No completed activities in record.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Activity Details */}
      <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent className="max-w-[600px] bg-white border-none rounded-xl p-0 overflow-hidden shadow-2xl">
          <div className="bg-slate-900 px-8 py-10">
            <DialogHeader>
              <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/30 uppercase tracking-wider mb-2 bg-primary/5">Program Details</Badge>
              <DialogTitle className="text-2xl font-bold text-white tracking-tight">
                {selectedActivity?.title}
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-sm">
                Full specifications and requirements for this program.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-8">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {selectedActivity?.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Duration" value={selectedActivity?.duration} icon={Clock} />
              <DetailItem label="Location" value={selectedActivity?.location} icon={MapPin} />
              <DetailItem label="Start Date" value={selectedActivity ? new Date(selectedActivity.startDate).toLocaleDateString() : ""} icon={Calendar} />
              <DetailItem label="Availability" value={selectedActivity ? `${selectedActivity.availableSeats - selectedActivity.enrolledCount} slots remaining` : ""} icon={Users} />
            </div>

            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Required Core Skills</p>
              <div className="flex flex-wrap gap-2">
                {selectedActivity?.requiredSkills.map(rs => (
                  <div key={rs.skillId} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2 shadow-sm">
                    <span className="text-xs font-bold text-slate-700">{rs.skill.name}</span>
                    <Badge variant="secondary" className="text-[9px] px-1.5 h-4 bg-primary/10 text-primary border-none">{rs.requiredLevel}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setSelectedActivity(null)}
              className="bg-slate-900 text-white font-semibold py-2 px-6 rounded-lg text-sm hover:bg-slate-800 transition-all shadow-sm"
            >
              Close Details
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enrollment Dialog */}
      <Dialog open={enrollDialog.open} onOpenChange={(open) => setEnrollDialog({ ...enrollDialog, open, activity: open ? enrollDialog.activity : null })}>
        <DialogContent className="max-w-[450px] bg-white border-none rounded-2xl p-0 overflow-hidden shadow-2xl">
          <div className="bg-white px-8 pt-8 pb-4">
            <DialogHeader>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
              <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">Team Enrollment</DialogTitle>
              <DialogDescription className="text-slate-500 text-sm">
                Select members from the {deptName} department to enroll.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-8 pb-8 space-y-2 max-h-[400px] overflow-y-auto">
            {deptEmployees.map((employee) => (
              <div
                key={employee.id}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer",
                  selectedEmployees.includes(employee.id)
                    ? "border-primary bg-primary/5"
                    : "border-slate-100 hover:border-slate-200 bg-white"
                )}
                onClick={() => handleEnrollmentChange(employee.id, !selectedEmployees.includes(employee.id))}
              >
                <Checkbox
                  id={`enroll-${employee.id}`}
                  checked={selectedEmployees.includes(employee.id)}
                  onCheckedChange={(checked) => handleEnrollmentChange(employee.id, checked)}
                  className="rounded-md border-slate-300 data-[state=checked]:bg-primary"
                />
                <Avatar className="h-9 w-9 border border-slate-100 shadow-sm">
                  <AvatarImage src={employee.avatar || `https://i.pravatar.cc/150?u=${employee.id}`} />
                  <AvatarFallback className="bg-slate-100 text-slate-500 font-bold text-[10px]">{employee.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{employee.name}</p>
                  <p className="text-xs text-slate-400">{employee.position}</p>
                </div>
              </div>
            ))}
            {deptEmployees.length === 0 && (
              <div className="text-center py-10">
                <p className="text-sm text-slate-400">No members found in department.</p>
              </div>
            )}
          </div>

          <DialogFooter className="p-6 bg-slate-50 flex gap-3 border-t border-slate-100">
            <button
              onClick={() => setEnrollDialog({ open: false, activity: null })}
              className="flex-1 bg-white border border-slate-200 text-slate-600 font-semibold py-2 rounded-lg text-sm hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEnrollments}
              className="flex-1 bg-primary text-white font-semibold py-2 rounded-lg text-sm shadow-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DetailItem({ label, value, icon: Icon }) {
  return (
    <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-primary shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-slate-700 truncate">{value}</p>
      </div>
    </div>
  )
}





