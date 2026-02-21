import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { skillGaps, getSkillTypeLabel } from "@/lib/mock-data"
import { AlertTriangle, TrendingUp } from "lucide-react"

export function SkillGapsOverview() {
  return (
    <Card className="bg-white border border-[#EEEEEE] rounded-[4px] shadow-sm overflow-hidden group">
      <CardHeader className="p-8 pb-4 border-b border-[#EEEEEE]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-[4px]">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-[#222222] uppercase tracking-tighter italic">Critical Gaps</CardTitle>
            <CardDescription className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">High-priority deficiency analysis</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        {skillGaps.slice(0, 5).map((gap) => (
          <div key={gap.skillId} className="space-y-3 group/item">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#222222] uppercase tracking-tighter italic group-hover/item:text-[#F28C1B] transition-colors">{gap.skill.name}</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{getSkillTypeLabel(gap.skill.type).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-2 text-[10px] font-bold">
                  <span className="text-gray-300 italic">{gap.currentAvg}%</span>
                  <TrendingUp className="h-3 w-3 text-[#F28C1B]" />
                  <span className="text-[#222222] bg-[#EEEEEE] px-2 py-0.5 rounded-[2px]">{gap.targetLevel}% TARGET</span>
                </div>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1 italic">{gap.affectedEmployees} UNITS AFFECTED</p>
              </div>
            </div>
            <div className="relative pt-1">
              <div className="h-1.5 w-full bg-[#EEEEEE] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F28C1B] transition-all duration-1000 origin-left"
                  style={{ width: `${gap.currentAvg}%` }}
                />
              </div>
              <div
                className="absolute top-0 h-3.5 w-[2px] bg-[#222222] z-10"
                style={{ left: `${gap.targetLevel}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
