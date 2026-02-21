"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { activities, getActivityTypeLabel } from "@/lib/mock-data"
import {
  Brain,
  Sparkles,
  Loader2,
  Settings2,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
  Shield,
  Cpu
} from "lucide-react"
import { cn } from "@/lib/utils"

export function RecommendationEngine({
  selectedActivity,
  onActivityChange,
  onGenerateRecommendations,
  isGenerating,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [customDescription, setCustomDescription] = useState("")
  const [seatsToFill, setSeatsToFill] = useState([5])
  const [priorityWeight, setPriorityWeight] = useState([50])

  return (
    <div className="card-premium p-10 bg-white border-none shadow-premium relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/[0.02] rounded-full -mr-32 -mt-32 transition-all group-hover:bg-orange-500/[0.05]"></div>

      <div className="relative z-10 space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Cpu className="h-6 w-6 text-white" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-display font-black text-slate-900 italic uppercase italic tracking-tight leading-none">Matchmaking Core</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
              <Zap className="h-3 w-3 text-orange-500" />
              Neural Alignment Optimizer
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Activity Selection */}
          <div className="space-y-4">
            <Label className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] italic flex items-center gap-3">
              <Target className="h-4 w-4 text-orange-500" />
              Target Mission Protocol
            </Label>
            <Select
              value={selectedActivity?.id || ""}
              onValueChange={(value) => {
                const activity = activities.find((a) => a.id === value) || null
                onActivityChange(activity)
              }}
            >
              <SelectTrigger className="h-16 bg-slate-50 border-none rounded-2xl px-6 text-[13px] font-bold text-slate-900 focus:ring-2 focus:ring-orange-500 shadow-inner group-hover:bg-white transition-all">
                <SelectValue placeholder="CHOOSE OPERATIONAL NODE..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-none rounded-2xl shadow-2xl p-2 animate-in zoom-in-95">
                <p className="px-4 py-3 text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">Available Protocols</p>
                {activities.map((activity) => (
                  <SelectItem key={activity.id} value={activity.id} className="rounded-xl py-3 px-4 font-bold text-[11px] uppercase italic focus:bg-orange-500 focus:text-white mb-1 last:mb-0">
                    <div className="flex items-center gap-3">
                      <span className="text-orange-500 group-focus:text-white">•</span>
                      <span>{activity.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Prompt Area */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] italic flex items-center gap-3">
                <Brain className="h-4 w-4 text-orange-500" />
                Context Intelligence Prompt
              </Label>
              <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest bg-slate-50 border-none text-slate-400 italic">Optional Payload</Badge>
            </div>
            <div className="relative">
              <Textarea
                placeholder="INPUT SPECIFIC MISSION CONTEXT, PERSONNEL PREFERENCES, OR OPERATIONAL CONSTRAINTS..."
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                className="min-h-[140px] bg-slate-50 border-none rounded-2xl p-8 text-sm font-medium italic text-slate-700 placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-orange-500 shadow-inner resize-none transition-all"
              />
              <div className="absolute bottom-4 right-4 text-[9px] font-bold text-slate-300 uppercase tracking-widest italic pointer-events-none">
                AI-POWERED SENSOR
              </div>
            </div>
            <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic px-2">
              The neural engine will synthesize this payload with the activity metadata to refine matching accuracy.
            </p>
          </div>

          {/* Advanced Accordion Styled as Premium Panel */}
          <div className={cn(
            "rounded-2xl border border-slate-50 overflow-hidden transition-all duration-500",
            showAdvanced ? "bg-slate-50/50" : "bg-white"
          )}>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
            >
              <span className="flex items-center gap-3 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] italic">
                <Settings2 className="h-4 w-4 text-orange-500" />
                Advanced Matrix Tuning
              </span>
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {showAdvanced && (
              <div className="p-8 pt-0 space-y-10 animate-in slide-in-from-top-4 duration-500">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Asset Saturation Target</Label>
                    <span className="text-xl font-display font-black text-orange-500 italic">{seatsToFill[0]}</span>
                  </div>
                  <Slider
                    value={seatsToFill}
                    onValueChange={setSeatsToFill}
                    max={selectedActivity?.availableSeats || 20}
                    min={1}
                    step={1}
                    className="py-2"
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Skills vs. Growth Vector</Label>
                    <span className="text-[11px] font-black text-slate-900 italic uppercase">
                      {priorityWeight[0]}% SKILLS / {100 - priorityWeight[0]}% GROWTH
                    </span>
                  </div>
                  <Slider
                    value={priorityWeight}
                    onValueChange={setPriorityWeight}
                    max={100}
                    min={0}
                    step={10}
                    className="py-2"
                  />
                  <div className="flex justify-between text-[9px] font-black text-slate-300 uppercase tracking-widest italic">
                    <span>Expertise Dominance</span>
                    <span>Potential Dominance</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onGenerateRecommendations}
            disabled={!selectedActivity || isGenerating}
            className="w-full btn-premium h-16 rounded-2xl flex items-center justify-center gap-4 italic shadow-orange-500/10 group/btn overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
            {isGenerating ? (
              <div className="flex items-center gap-4 relative z-10">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Synthesizing Matrix...</span>
              </div>
            ) : (
              <div className="flex items-center gap-4 relative z-10">
                <Sparkles className="h-5 w-5" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">{selectedActivity ? "INITIATE NEURAL SYNC" : "AWAITING TARGET"}</span>
              </div>
            )}
          </button>
        </div>

        {/* Neural Logic Summary */}
        <div className="pt-8 border-t border-slate-50">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2 italic">
            <Cpu className="h-3 w-3" />
            Neural Logic Distribution
          </p>
          <ul className="grid grid-cols-1 gap-4">
            {[
              "Semantic skill extraction via multidimensional NLP",
              "Real-time personnel proximity & availability sync",
              "Historical growth velocity & potential delta analysis",
              "Contextual priority weighting for team optimization"
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3 group/li">
                <span className="text-orange-500 font-bold mt-0.5 group-hover/li:translate-x-1 transition-transform">›</span>
                <p className="text-[10px] font-medium text-slate-500 m-0 italic group-hover/li:text-slate-900 transition-colors uppercase">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
