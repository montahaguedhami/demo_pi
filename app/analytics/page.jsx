"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from "recharts"
import { departmentStats, skillGaps, skills, employees } from "@/lib/mock-data"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

// Mock data for charts
const skillProgressionData = [
  { month, knowledge: 65, knowHow: 58, softSkill: 62 },
  { month, knowledge: 67, knowHow: 61, softSkill: 64 },
  { month, knowledge: 69, knowHow: 63, softSkill: 66 },
  { month, knowledge: 71, knowHow: 66, softSkill: 68 },
  { month, knowledge: 73, knowHow: 69, softSkill: 70 },
  { month, knowledge: 75, knowHow: 72, softSkill: 74 },
]

const activityCompletionData = [
  { name, completed: 45, enrolled: 12, dropped: 3 },
  { name, completed: 28, enrolled: 8, dropped: 2 },
  { name, completed: 15, enrolled: 5, dropped: 1 },
  { name, completed: 8, enrolled: 3, dropped: 0 },
  { name, completed: 12, enrolled: 2, dropped: 1 },
]

const radarData = [
  { subject, Engineering: 72, DataScience: 85, Finance: 65, fullMark: 100 },
  { subject, Engineering: 58, DataScience: 52, Finance: 70, fullMark: 100 },
  { subject, Engineering: 65, DataScience: 60, Finance: 75, fullMark: 100 },
  { subject, Engineering: 88, DataScience: 78, Finance: 45, fullMark: 100 },
  { subject, Engineering: 82, DataScience: 80, Finance: 68, fullMark: 100 },
]

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export default function AnalyticsPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 transition-all duration-300">
        <Header
          title="Analytics"
          description="Insights and trends across your organization"
        />
        <div className="p-6 space-y-6">
          {/* Filters */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Organizational Insights</h2>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departmentStats.map((dept) => (
                  <SelectItem key={dept.department} value={dept.department}>
                    {dept.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              title="Skill Coverage"
              value="78%"
              change="+5.2%"
              trend="up"
              description="Organization-wide"
              icon={Target}
            />
            <MetricCard
              title="Training Completion"
              value="89%"
              change="+3.1%"
              trend="up"
              description="Last 30 days"
              icon={CheckCircle2}
            />
            <MetricCard
              title="Skills at Risk"
              value="12"
              change="-2"
              trend="down"
              description="Below target level"
              icon={AlertTriangle}
              negative
            />
            <MetricCard
              title="Avg. Progression"
              value="+6.4%"
              change="+1.2%"
              trend="up"
              description="Monthly average"
              icon={TrendingUp}
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Skill Progression Over Time */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Skill Progression Trend</CardTitle>
                <CardDescription>Average scores by skill type over 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-chart-1" />
                    <span className="text-xs text-muted-foreground">Knowledge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-chart-2" />
                    <span className="text-xs text-muted-foreground">Know-how</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-chart-3" />
                    <span className="text-xs text-muted-foreground">Soft Skills</span>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={skillProgressionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fill, fontSize: 12 }}
                        axisLine={{ stroke }}
                      />
                      <YAxis 
                        domain={[50, 80]}
                        tick={{ fill, fontSize: 12 }}
                        axisLine={{ stroke }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor,
                          border,
                          borderRadius,
                          color
                        }}
                      />
                      <Line type="monotone" dataKey="knowledge" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ fill }} />
                      <Line type="monotone" dataKey="knowHow" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ fill }} />
                      <Line type="monotone" dataKey="softSkill" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ fill }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Activity Completion Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Activity Performance</CardTitle>
                <CardDescription>Completion rates by activity type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-success" />
                    <span className="text-xs text-muted-foreground">Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-chart-1" />
                    <span className="text-xs text-muted-foreground">In Progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-destructive" />
                    <span className="text-xs text-muted-foreground">Dropped</span>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityCompletionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill, fontSize: 12 }}
                        axisLine={{ stroke }}
                      />
                      <YAxis 
                        tick={{ fill, fontSize: 12 }}
                        axisLine={{ stroke }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor,
                          border,
                          borderRadius,
                          color
                        }}
                      />
                      <Bar dataKey="completed" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="enrolled" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="dropped" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Department Comparison Radar */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-foreground">Department Skill Comparison</CardTitle>
                <CardDescription>Skill competencies across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill, fontSize: 11 }}
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]}
                        tick={{ fill, fontSize: 10 }}
                      />
                      <Radar name="Engineering" dataKey="Engineering" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.2} />
                      <Radar name="Data Science" dataKey="DataScience" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.2} />
                      <Radar name="Finance" dataKey="Finance" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.2} />
                      <Legend 
                        formatter={(value) => (
                          <span style={{ color, fontSize }}>{value}</span>
                        )}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Department Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Department Overview</CardTitle>
                <CardDescription>Performance by department</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {departmentStats.map((dept, index) => (
                  <div key={dept.department} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium text-foreground">{dept.department}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{dept.avgSkillScore}%</span>
                    </div>
                    <Progress value={dept.avgSkillScore} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{dept.employeeCount} employees</span>
                      <span>{dept.skillGaps.length} skill gaps</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Skill Gaps Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    Priority Skill Gaps
                  </CardTitle>
                  <CardDescription>Skills requiring immediate attention</CardDescription>
                </div>
                <Badge variant="outline" className="text-warning border-warning">
                  {skillGaps.length} gaps identified
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillGaps.map((gap) => (
                  <div key={gap.skillId} className="flex items-center gap-4 p-4 rounded-lg border border-border">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-foreground">{gap.skill.name}</p>
                        <Badge variant="secondary" className="text-xs">
                          {gap.skill.type === "knowledge" ? "Knowledge" : gap.skill.type === "knowHow" ? "Know-how" : "Soft Skill"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {gap.affectedEmployees} employees affected
                      </p>
                    </div>
                    <div className="w-48">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Current: {gap.currentAvg}%</span>
                        <span className="text-foreground font-medium">Target: {gap.targetLevel}%</span>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="absolute h-full bg-warning rounded-full"
                          style={{ width: `${gap.currentAvg}%` }}
                        />
                        <div 
                          className="absolute top-0 h-full w-0.5 bg-primary"
                          style={{ left: `${gap.targetLevel}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-warning">-{gap.gap}%</p>
                      <p className="text-xs text-muted-foreground">Gap</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function MetricCard({
  title,
  value,
  change,
  trend,
  description,
  icon,
  negative = false,
}) {
  const isPositive = negative ? trend === "down" : trend === "up"
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">{title}</span>
          <div className={cn(
            "rounded-lg p-1.5",
            isPositive ? "bg-success/10" : "bg-warning/10"
          )}>
            <Icon className={cn("h-4 w-4", isPositive ? "text-success" : "text-warning")} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          <span className={cn(
            "flex items-center text-xs font-medium",
            isPositive ? "text-success" : "text-warning"
          )}>
            {trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {change}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}



