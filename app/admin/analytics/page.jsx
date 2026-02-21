import { DashboardHeader } from "@/components/dashboard/header"
import { BarChart3, TrendingUp, Users, Target, Zap, Globe, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function AdminAnalyticsPage() {
  const handleOptimization = () => {
    toast.promise(new Promise(r => setTimeout(r, 2000)), {
      loading: "Recalculating analytics...",
      success: "Analytics updated successfully",
      error: "Update failed",
    })
  }

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen">
      <DashboardHeader title="Analytics" description="Track organizational performance, skill gaps and growth metrics" />

      <div className="flex-1 p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex justify-end">
          <button onClick={handleOptimization} className="btn-premium">
            <Zap className="h-4 w-4" />
            Refresh Data
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Growth Chart */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Growth Index</h2>
                <p className="text-sm text-gray-400 mt-0.5">Monthly performance pattern</p>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-[#F28C1B] animate-pulse" />
                <span className="text-xs font-medium text-gray-500">Live</span>
              </div>
            </div>

            <div className="h-72 flex items-end gap-3 px-2 relative">
              {[60, 45, 80, 55, 90, 70, 100, 85, 65, 95].map((h, i) => (
                <div key={i} className="flex-1 group/bar relative flex flex-col items-center">
                  <span className="text-xs text-gray-400 mb-2 opacity-0 group-hover/bar:opacity-100 transition-opacity font-medium">
                    {h}%
                  </span>
                  <div
                    style={{ height: `${h}%` }}
                    className="w-full bg-gray-100 group-hover/bar:bg-[#F28C1B] rounded-lg transition-all duration-300"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs font-medium text-gray-400 border-t border-gray-100 pt-4">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
              <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
              <span>Sep</span><span>Oct</span>
            </div>
          </div>

          {/* KPI Sidebar */}
          <div className="space-y-4">
            <StatCard title="Efficiency Rate" value="94.2%" sub="Organization-wide" icon={Zap} highlight />
            <StatCard title="Workforce Value" value="$42.8M" sub="Calculated ROI" icon={Globe} />
            <StatCard title="Attrition Risk" value="0.02%" sub="Active risk assessment" icon={Target} danger />

            {/* Status Panel */}
            <div className="bg-gray-900 rounded-xl p-6 text-white">
              <p className="text-xs font-medium text-[#F28C1B] uppercase tracking-widest mb-3">System Status</p>
              <h3 className="text-xl font-semibold text-white mb-1">Optimal</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                All systems running at peak efficiency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, sub, icon: Icon, highlight, danger }) {
  return (
    <div className={cn(
      "bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all group",
      highlight ? "border-[#F28C1B]/30" : "border-gray-200"
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "p-2.5 rounded-lg transition-colors",
          highlight ? "bg-[#F28C1B]/10" : danger ? "bg-red-50" : "bg-gray-100"
        )}>
          <Icon className={cn("w-4 h-4", highlight ? "text-[#F28C1B]" : danger ? "text-red-500" : "text-gray-500")} />
        </div>
        <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#F28C1B] transition-colors" />
      </div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{title}</p>
      <p className={cn(
        "text-2xl font-semibold leading-none mb-1",
        highlight ? "text-[#F28C1B]" : danger ? "text-red-500" : "text-gray-900"
      )}>{value}</p>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  )
}


