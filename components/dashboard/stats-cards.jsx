"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Sparkles, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    title: "Total Employees",
    value: "156",
    change: "+12",
    changePercent: "+8.2%",
    trend: "up",
    icon: Users,
    description: "Total workforce across all departments",
  },
  {
    title: "Active Activities",
    value: "42",
    change: "+5",
    changePercent: "+13.5%",
    trend: "up",
    icon: Calendar,
    description: "Trainings, workshops and projects",
  },
  {
    title: "AI Recommendations",
    value: "28",
    change: "-3",
    changePercent: "-4.2%",
    trend: "down",
    icon: Sparkles,
    description: "Pending HR review and approval",
  },
  {
    title: "Completion Rate",
    value: "94.2%",
    change: "+2.1%",
    changePercent: "+2.1%",
    trend: "up",
    icon: TrendingUp,
    description: "Overall activity success rate",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        const isPositive = stat.trend === "up"

        return (
          <Card key={stat.title} className="relative overflow-hidden bg-white border border-[#EEEEEE] rounded-[4px] shadow-sm group hover:border-[#F28C1B]/30 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                {stat.title}
              </CardTitle>
              <div className="rounded-[4px] bg-[#EEEEEE] p-2 text-gray-400 group-hover:text-[#F28C1B] transition-colors">
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#222222] tracking-tighter">{stat.value}</span>
                <div className={cn(
                  "flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-widest",
                  isPositive ? "text-emerald-500" : "text-rose-500"
                )}>
                  {isPositive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.changePercent}
                </div>
              </div>
              <p className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-60">{stat.description}</p>

              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#EEEEEE] group-hover:bg-[#F28C1B] transition-colors"></div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
