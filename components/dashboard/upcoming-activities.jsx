import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import { activities, getActivityTypeLabel, getStatusColor } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

export function UpcomingActivities() {
  const upcomingActivities = activities.filter(a => a.status === "upcoming" || a.status === "ongoing").slice(0, 4)

  return (
    <Card className="bg-white border border-[#EEEEEE] rounded-[4px] shadow-sm overflow-hidden group">
      <CardHeader className="flex flex-row items-center justify-between p-8 pb-4 border-b border-[#EEEEEE]">
        <div>
          <CardTitle className="text-xl font-bold text-[#222222] uppercase tracking-tighter italic">Protocol Queue</CardTitle>
          <CardDescription className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Pending deployments & activations</CardDescription>
        </div>
        <Link to="/admin/activities">
          <button className="flex items-center gap-2 text-[10px] font-bold text-[#F28C1B] uppercase tracking-widest hover:translate-x-1 transition-transform italic">
            SECTOR VIEW
            <ArrowRight className="h-4 w-4" />
          </button>
        </Link>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        {upcomingActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-5 rounded-[4px] bg-[#F8FAFC] border border-[#EEEEEE] transition-all hover:border-[#F28C1B]/30 hover:shadow-lg hover:shadow-[#F28C1B]/5 group/item"
          >
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-[#222222] uppercase tracking-tighter italic group-hover/item:text-[#F28C1B] transition-colors">{activity.title}</h4>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest rounded-[2px] bg-[#EEEEEE] text-gray-500 border-none px-2 py-0.5 italic">
                      {getActivityTypeLabel(activity.type).toUpperCase()}
                    </Badge>
                    <Badge className={cn("text-[8px] font-bold uppercase tracking-widest rounded-[2px] border-none px-2 py-0.5 italic",
                      activity.status === "upcoming" ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                    )}>
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <span className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">
                  <Calendar className="h-3 w-3 text-[#F28C1B]" />
                  {new Date(activity.startDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric' }).toUpperCase()}
                </span>
                <span className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">
                  <MapPin className="h-3 w-3 text-[#F28C1B]" />
                  {activity.location.toUpperCase()}
                </span>
                <span className="flex items-center gap-2 text-[9px] font-bold text-[#222222] uppercase tracking-widest italic bg-[#EEEEEE] px-2 py-0.5 rounded-[2px]">
                  <Users className="h-3 w-3" />
                  {activity.enrolledCount}/{activity.availableSeats} LOAD
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
