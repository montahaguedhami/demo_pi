import { useNavigate } from "react-router-dom"
import { useData } from "../../../lib/data-store"
import { useAuth } from "../../../lib/auth-context"
import {
  BookOpen,
  Target,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Settings,
  LogOut,
  Home,
  Activity,
  Sparkles,
  ChevronRight,
  Zap,
  Star as StarIcon
} from "lucide-react"
import { cn } from "../../../lib/utils"
import { toast } from "sonner"

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const { activities, employees } = useData()
  const navigate = useNavigate()

  const handlePlaceholderAction = (action) => {
    toast.info(`${action} Pipeline Initialized`, {
      description: "Neural network is synchronizing this data stream."
    })
  }

  const employeeData = employees.find(e => e.userId === user?.id) || employees[0]

  const myActivities = activities.slice(0, 3)
  const recommendedActivities = activities.slice(3, 6)
  const upcomingDirect = activities.filter(a => a.status === "upcoming").slice(0, 3)

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#121214] border border-white/5 p-8 lg:p-12 shadow-2xl">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-teal-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-[0.2em]">
              <Sparkles className="w-4 h-4" />
              <span>Personalized For You</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Ready to elevate your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">career growth, {user?.name?.split(" ")[0]}?</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl font-light">
              You've completed 85% of your quarterly goals. Explore new AI-suggested activities to reach the next level.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => navigate("/employee/recommendations")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
              >
                View Recommendations
              </button>
              <button
                onClick={() => handlePlaceholderAction("Progress Calibration")}
                className="bg-white/5 hover:bg-white/10 text-white px-8 py-3.5 rounded-2xl font-bold border border-white/10 transition-all active:scale-95"
              >
                My Progress
              </button>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-md rounded-3xl border border-white/10 p-8 flex flex-col items-center text-center lg:min-w-[280px]">
            <div className="relative mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={364 * 0.15} className="text-emerald-500 transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">Lvl 4</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Expert</span>
              </div>
            </div>
            <p className="text-sm font-medium text-emerald-100">850 / 1000 XP</p>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">To next level</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Activities", value: "4", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Skills Gained", value: "12", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Hours Learned", value: "48h", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Achievements", value: "8", icon: Award, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-[#121214] p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-2xl group-hover:scale-110 transition-transform", stat.bg, stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-emerald-500 text-xs font-bold">+2 this week</span>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Ongoing Training */}
          <div className="bg-[#121214] rounded-3xl border border-white/5 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Ongoing Training</h3>
              <button onClick={() => navigate("/employee/activities")} className="text-sm text-emerald-400 hover:text-emerald-300 font-bold transition-colors">Browse Marketplace</button>
            </div>
            <div className="p-6 space-y-4">
              {myActivities.map((activity, i) => (
                <div key={activity.id} className="group flex items-center justify-between p-5 bg-white/5 hover:bg-white/[0.08] rounded-2xl border border-white/5 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{activity.title || activity.name}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-3">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {activity.duration}</span>
                        <span className="flex items-center gap-1"><StarIcon className="w-3 h-3 text-amber-500 fill-amber-500" /> {activity.difficulty || "Intermediate"}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:block w-32">
                      <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-tighter">
                        <span>Progress</span>
                        <span className="text-emerald-400">{i === 0 ? '80%' : i === 1 ? '45%' : '12%'}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: i === 0 ? '80%' : i === 1 ? '45%' : '12%' }}></div>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePlaceholderAction(`Resuming ${activity.title || activity.name}`)}
                      className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all active:scale-95"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#121214] rounded-3xl border border-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-6">Skill Analysis</h3>
              <div className="space-y-6">
                {[
                  { name: 'Architecture', level: 85, color: 'bg-indigo-500' },
                  { name: 'AI Engineering', level: 42, color: 'bg-emerald-500' },
                  { name: 'Leadership', level: 68, color: 'bg-amber-500' },
                ].map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-bold text-white">{skill.name}</span>
                      <span className="text-[10px] font-bold text-gray-500 tracking-widest">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", skill.color)} style={{ width: `${skill.level}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handlePlaceholderAction("Skill Audit")}
                className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all text-sm active:scale-95"
              >
                Full Skills Audit
              </button>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                <Sparkles className="w-32 h-32 text-white" />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">AI Mentorship</h3>
                  <p className="text-indigo-100/70 text-sm leading-relaxed">
                    "Based on your recent React success, I recommend focusing on <span className="text-white font-bold">Node.js Performance Tuning</span> to become a Full Stack expert."
                  </p>
                </div>
                <button
                  onClick={() => handlePlaceholderAction("Neural Mentorship")}
                  className="bg-white text-indigo-900 font-bold py-3 px-6 rounded-2xl mt-8 shadow-xl hover:bg-indigo-50 transition-all w-fit active:scale-95"
                >
                  Talk to Mentor
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          <div className="bg-[#121214] rounded-3xl border border-white/5 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Upcoming Schedule</h3>
            </div>
            <div className="p-6 space-y-6">
              {upcomingDirect.map((activity, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="text-[10px] font-bold text-emerald-400 mb-1 uppercase tracking-tighter">OCT</div>
                    <div className="text-xl font-bold text-white leading-none">{12 + i * 2}</div>
                  </div>
                  <div className="flex-1 border-l border-white/5 pl-4 pb-1">
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors mb-0.5">{activity.title || activity.name}</h4>
                    <p className="text-[10px] text-gray-500 font-medium">10:00 AM • Remote Workshop</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => handlePlaceholderAction("Calendar Synchronization")}
              className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-400 transition-all border-t border-white/5 text-xs font-bold uppercase tracking-widest active:scale-95"
            >
              Open Calendar
            </button>
          </div>

          <div className="bg-[#121214] rounded-3xl border border-white/5 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Global Leaderboard</h3>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="space-y-4">
              {[
                { name: 'Alex Rivera', xp: '12,450', img: '10' },
                { name: 'Sarah Chen', xp: '10,120', img: '11' },
                { name: 'You', xp: '850', img: '12', highlight: true },
              ].map((player, i) => (
                <div key={i} className={cn(
                  "flex items-center justify-between p-3 rounded-2xl transition-all",
                  player.highlight ? "bg-emerald-500/10 border border-emerald-500/20" : "hover:bg-white/5"
                )}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-600 w-4">{i + 1}</span>
                    <img src={`https://i.pravatar.cc/150?u=${player.img}`} className="w-8 h-8 rounded-full border border-white/10" alt="" />
                    <span className={cn("text-sm font-bold", player.highlight ? "text-white" : "text-gray-400")}>{player.name}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">{player.xp} XP</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600/10 to-teal-700/10 rounded-3xl border border-emerald-500/20 p-6 shadow-xl">
            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Special Offer
            </h4>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              Unlock the <span className="text-white">Senior Leadership</span> certification for free by completing two more soft-skill activities this month.
            </p>
            <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-emerald-500" style={{ width: '40%' }}></div>
            </div>
            <button className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] hover:text-emerald-300 transition-colors">Track Progress</button>
          </div>
        </div>
      </div>
    </div>
  )
}



