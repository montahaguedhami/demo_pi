"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { employees } from "@/lib/mock-data"
import {
  Trophy,
  TrendingUp,
  Target,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Forward,
  Loader2,
  Check,
  Zap,
  Cpu,
  ShieldCheck,
  ChevronRight,
  Info,
  Activity,
  Brain
} from "lucide-react"
import { cn } from "@/lib/utils"

// Enhanced reasoning generator
const generateNeuralReasoning = (rec, activity) => {
  const parts = []
  if (rec.skillMatch > 85) parts.push("EXCEPTIONAL SKILL SYNERGY DETECTED.")
  else if (rec.skillMatch > 70) parts.push("STRONG CORE COMPETENCY ALIGNMENT.")

  if (rec.growthPotential > 80) parts.push("HIGH VELOCITY DEVELOPMENT TRAJECTORY.")

  if (rec.contextFit > 85) parts.push(`OPTIMIZED FOR ${activity.priorityContext.toUpperCase()} PARADIGM.`)

  return parts.length > 0 ? parts.join(" ") : "OPERATIONAL PARAMETERS MEET NEURAL BASELINE."
}

// Generate mock recommendations based on activity
export function generateRecommendations(activity) {
  if (!activity) return []

  return employees.map((employee) => {
    // Calculate skill match
    let skillMatchTotal = 0
    let skillMatchCount = 0

    if (activity.requiredSkills) {
      activity.requiredSkills.forEach((req) => {
        const empSkill = employee.skills.find((s) => s.skillId === req.skillId)
        if (empSkill) {
          const levelScore = { low: 25, medium: 50, high: 75, expert: 100 }
          const reqScore = levelScore[req.requiredLevel] || 50
          const empScore = empSkill.score
          skillMatchTotal += Math.min(100, (empScore / reqScore) * 100) * (req.weight || 1)
          skillMatchCount += (req.weight || 1)
        }
      })
    }

    const skillMatch = skillMatchCount > 0 ? Math.round(skillMatchTotal / skillMatchCount) : 45

    // Calculate experience match
    const expYears = employee.yearsOfExperience || 0
    let experienceMatch = 50
    if (activity.priorityContext === "expertise") {
      experienceMatch = Math.min(100, expYears * 15)
    } else if (activity.priorityContext === "upskilling") {
      experienceMatch = Math.max(20, 100 - expYears * 12)
    } else {
      experienceMatch = 70 - Math.abs(expYears - 3) * 10
    }

    // Calculate growth potential
    const avgProgression = employee.skills?.length > 0
      ? employee.skills.reduce((sum, s) => sum + (s.progression || 0), 0) / employee.skills.length
      : 0
    const growthPotential = Math.min(100, Math.round(avgProgression * 8 + 30))

    // Calculate context fit
    const avgLevel = employee.skills?.length > 0
      ? employee.skills.reduce((sum, s) => sum + (s.score || 0), 0) / employee.skills.length
      : 0
    let contextFit = 50
    if (activity.priorityContext === "expertise" && avgLevel > 80) contextFit = 90
    else if (activity.priorityContext === "upskilling" && avgLevel < 50) contextFit = 85
    else if (activity.priorityContext === "consolidation" && avgLevel >= 50 && avgLevel <= 80) contextFit = 88
    else contextFit = 60

    // Overall score
    const overallScore = Math.round(
      skillMatch * 0.4 + experienceMatch * 0.2 + growthPotential * 0.2 + contextFit * 0.2
    ) || 50

    // Generate reasoning
    const reasonings = []
    if (skillMatch > 70) reasonings.push("Strong skill alignment with requirements")
    if (growthPotential > 60) reasonings.push("High learning trajectory")
    if (contextFit > 80) reasonings.push(`Well-suited for ${activity.priorityContext} context`)
    if (experienceMatch > 70) reasonings.push("Experience level matches activity needs")

    return {
      employee,
      overallScore,
      skillMatch,
      experienceMatch,
      growthPotential,
      contextFit,
      reasoning: reasonings.join(". ") || "Meets basic requirements for consideration",
    }
  }).sort((a, b) => b.overallScore - a.overallScore)
}

export function RecommendationResults({ activity, recommendations, onForwardToManager, isForwarding, isForwarded }) {
  const [selectedEmployees, setSelectedEmployees] = useState([])

  if (!activity) {
    return (
      <div className="card-premium h-[600px] flex flex-col items-center justify-center text-center p-12 bg-white border-none shadow-premium group">
        <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
          <Cpu className="h-10 w-10 text-slate-200" />
        </div>
        <h3 className="text-2xl font-display font-black text-slate-900 uppercase italic mb-4">Neural Signal Missing</h3>
        <p className="text-slate-400 font-medium max-w-sm leading-relaxed uppercase text-[11px] tracking-widest italic">
          Initiate protocol selection from the matchmaking core to broadcast recommendation signal.
        </p>
      </div>
    )
  }

  const seatsAvailable = (activity.availableSeats || 0) - (activity.enrolledCount || 0)

  const toggleEmployee = (employeeId) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : prev.length < seatsAvailable
          ? [...prev, employeeId]
          : prev
    )
  }

  const getInitials = (name) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U"
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
      {/* Dynamic Header */}
      <div className="card-premium p-10 bg-white border-none shadow-premium flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.02] rounded-full -mr-32 -mt-32"></div>

        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-display font-black text-slate-900 uppercase italic tracking-tight">Neural Sync Ready</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
              {recommendations.length} MATCHES SYNTHESIZED FOR {activity.title.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 w-full md:w-auto">
          <div className="flex flex-col items-center md:items-end gap-1.5 px-6">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Selection Quota</span>
            <span className="text-sm font-black text-slate-900 italic uppercase">
              {selectedEmployees.length} / {seatsAvailable} ASSETS
            </span>
          </div>

          {isForwarded ? (
            <button disabled className="btn-premium bg-emerald-500 shadow-emerald-500/10 h-16 px-10 rounded-2xl flex items-center gap-4 italic grayscale opacity-70">
              <Check className="h-5 w-5" />
              COMMITTED
            </button>
          ) : (
            <button
              disabled={selectedEmployees.length === 0 || isForwarding}
              onClick={() => {
                if (onForwardToManager) {
                  const selectedRecs = recommendations.filter(r => selectedEmployees.includes(r.employee.id))
                  onForwardToManager(selectedEmployees, selectedRecs)
                }
              }}
              className="btn-premium h-16 px-10 rounded-2xl flex items-center gap-4 italic shadow-orange-500/10 group/btn relative overflow-hidden flex-1 sm:flex-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
              {isForwarding ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin relative z-10" />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] relative z-10">Deploying...</span>
                </>
              ) : (
                <>
                  <Forward className="h-5 w-5 relative z-10" />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] relative z-10">Deploy Selected ({selectedEmployees.length})</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Results List */}
      <div className="grid grid-cols-1 gap-6">
        {recommendations.slice(0, 8).map((rec, index) => (
          <div
            key={rec.employee.id}
            onClick={() => toggleEmployee(rec.employee.id)}
            className={cn(
              "card-premium p-10 bg-white border-none shadow-premium group cursor-pointer relative transition-all duration-500",
              selectedEmployees.includes(rec.employee.id)
                ? "ring-2 ring-orange-500/50 bg-orange-500/[0.01]"
                : "hover:bg-slate-50/50"
            )}
            style={{
              animationDelay: `${index * 100}ms`,
              opacity: selectedEmployees.includes(rec.employee.id) ? 1 : 0.85
            }}
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Profile Sec */}
              <div className="flex items-center gap-8 w-full lg:w-auto">
                <div className="relative pt-2">
                  <div className={cn(
                    "absolute -top-3 -left-3 w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black italic shadow-lg z-10 border-2 border-white",
                    index === 0 ? "bg-amber-400 text-amber-900" :
                      index === 1 ? "bg-slate-200 text-slate-800" :
                        index === 2 ? "bg-orange-600 text-white shadow-orange-500/30" :
                          "bg-slate-900 text-white"
                  )}>
                    {index === 0 ? <Trophy className="h-5 w-5" /> : `#${index + 1}`}
                  </div>
                  <div className="relative">
                    <div className="absolute -inset-1.5 bg-gradient-to-tr from-orange-500 to-amber-300 rounded-[1.8rem] opacity-0 group-hover:opacity-30 transition-all blur-md"></div>
                    <Avatar className="h-24 w-24 rounded-[1.8rem] border-4 border-white shadow-xl relative transition-transform duration-700 group-hover:scale-105">
                      <AvatarImage src={rec.employee.avatar || `https://i.pravatar.cc/150?u=${rec.employee.id}`} />
                      <AvatarFallback className="bg-slate-900 text-white text-2xl font-display font-black">
                        {getInitials(rec.employee.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h4 className="text-2xl font-display font-black text-slate-900 italic uppercase tracking-tight truncate">{rec.employee.name}</h4>
                    <div className={cn(
                      "h-2 w-2 rounded-full animate-pulse",
                      selectedEmployees.includes(rec.employee.id) ? "bg-orange-500" : "bg-slate-200"
                    )}></div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rec.employee.position}</span>
                    <span className="text-slate-200">•</span>
                    <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest italic">{rec.employee.department}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Checkbox
                      checked={selectedEmployees.includes(rec.employee.id)}
                      className="h-5 w-5 border-slate-200 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 rounded-lg pointer-events-none"
                    />
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Asset Selection Protocol</span>
                  </div>
                </div>
              </div>

              {/* Metrics Sec */}
              <div className="flex flex-1 flex-col sm:flex-row items-center justify-end gap-12 w-full lg:w-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 w-full sm:w-auto">
                  <MetricBox icon={Sparkles} label="Neural Skills" value={rec.skillMatch} color="text-indigo-500" />
                  <MetricBox icon={Briefcase} label="Core Tenure" value={rec.experienceMatch} color="text-slate-700" />
                  <MetricBox icon={TrendingUp} label="Growth Vel." value={rec.growthPotential} color="text-emerald-500" />
                  <MetricBox icon={Activity} label="Matrix Fit" value={rec.contextFit} color="text-orange-500" />
                </div>

                <div className="flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-50 min-w-[140px] transition-all duration-700 group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:shadow-2xl group-hover:shadow-orange-500/40 relative">
                  <div className="text-4xl font-display font-black text-slate-900 group-hover:text-white italic tracking-tighter flex items-start">
                    {rec.overallScore}
                    <span className="text-xs mt-1.5 ml-0.5 opacity-60">%</span>
                  </div>
                  <div className="text-[9px] font-black text-slate-300 group-hover:text-white/80 uppercase tracking-widest mt-2">Overall Sync</div>
                </div>
              </div>
            </div>

            {/* Neural Reasoning Panel */}
            <div className="mt-10 p-8 bg-slate-50/30 rounded-2xl border-l-[6px] border-orange-500 focus-within:bg-white transition-all">
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/10 shrink-0">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] font-sans">Neural Rationale</p>
                  <p className="text-[13px] font-semibold text-slate-700 leading-relaxed italic m-0">
                    "{generateNeuralReasoning(rec, activity)} {rec.reasoning.toUpperCase()}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MetricBox({ icon: Icon, label, value, color }) {
  return (
    <div className="flex flex-col gap-3 min-w-[80px]">
      <div className="flex items-center gap-2">
        <Icon className={cn("h-3.5 w-3.5", color)} />
        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-lg font-display font-black text-slate-900 italic">{value}%</span>
        <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden min-w-[40px]">
          <div
            className={cn("h-full transition-all duration-1000", color.replace('text', 'bg'))}
            style={{ width: `${value}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
