import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import {
    Users,
    LayoutDashboard,
    Brain,
    Calendar,
    Target,
    FileText,
    BarChart3,
    Settings,
    LogOut,
    Bell,
    Search,
    Sparkles,
    ChevronRight,
    Menu,
    Command,
    Briefcase,
    Clock,
    TrendingUp as TrendingUpIcon,
    X,
    User
} from "lucide-react"

export function PortalLayout({ children, role = "admin" }) {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [scrolled, setScrolled] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useAuth()
    const currentPath = location.pathname

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const config = {
        admin: {
            color: "orange",
            label: "Administration",
            icon: Command,
            nav: [
                { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
                { name: "Employees", href: "/admin/employees", icon: Users, badge: "24" },
                { name: "Skills", href: "/admin/skills", icon: Brain, badge: "156" },
                { name: "Activities", href: "/admin/activities", icon: Calendar, badge: "48" },
                { name: "Sessions", href: "/admin/sessions", icon: Clock },
                { name: "AI Matchmaking", href: "/admin/recommendations", icon: Target, badge: "12" },
                { name: "Reports", href: "/admin/reports", icon: FileText },
                { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
            ]
        },
        manager: {
            color: "orange",
            label: "Management Hub",
            icon: Briefcase,
            nav: [
                { name: "Team Overview", href: "/manager", icon: LayoutDashboard },
                { name: "Personnel", href: "/manager/employees", icon: Users },
                { name: "Analytics", href: "/manager/performance", icon: BarChart3 },
                { name: "Skill Registry", href: "/manager/skills", icon: Brain },
                { name: "Assignments", href: "/manager/assignments", icon: Target, badge: "3" },
                { name: "Profile", href: "/manager/profile", icon: User },
            ]
        },
        employee: {
            color: "orange",
            label: "Learning Portal",
            icon: Brain,
            nav: [
                { name: "Summary", href: "/employee", icon: LayoutDashboard },
                { name: "Training", href: "/employee/activities", icon: Calendar, badge: "3" },
                { name: "Opportunities", href: "/employee/recommendations", icon: Target, badge: "5" },
                { name: "My Progress", href: "/employee/progress", icon: TrendingUpIcon },
            ]
        }
    }

    const activeConfig = config[role] || config.admin

    return (
        <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
            {/* Sidebar Overlay for Mobile */}
            {!sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setSidebarOpen(true)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:relative lg:translate-x-0 shadow-2xl",
                sidebarOpen ? "translate-x-0" : "-translate-x-full lg:w-24"
            )}>
                <div className="flex flex-col h-full overflow-hidden">
                    {/* Logo Section */}
                    <div className="px-6 py-10 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-4 overflow-hidden">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-[#F28C1B] to-[#E37D0B] shadow-orange-500/20 shrink-0 transform hover:rotate-6 transition-transform duration-300">
                                <activeConfig.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className={cn("flex flex-col transition-all duration-500", !sidebarOpen && "lg:opacity-0 lg:hidden")}>
                                <h1 className="text-white font-display text-lg tracking-tight font-bold m-0 leading-tight">SkillMatch</h1>
                                <p className="text-slate-500 text-[11px] font-medium tracking-wide m-0 mt-0.5 uppercase">{activeConfig.label}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                            className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-all duration-300 border border-transparent hover:border-slate-700 focus:ring-2 focus:ring-orange-500/50 outline-none"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 px-4 py-8 overflow-y-auto space-y-2 custom-scrollbar">
                        <div className={cn("px-4 mb-4 transition-all duration-300", !sidebarOpen && "lg:opacity-0 lg:h-0 overflow-hidden")}>
                            <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Main Menu</span>
                        </div>
                        {activeConfig.nav.map((item) => {
                            const isActive = currentPath === item.href || (item.href !== `/${role}` && currentPath.startsWith(item.href))
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => navigate(item.href)}
                                    aria-current={isActive ? "page" : undefined}
                                    aria-label={item.name}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group relative mb-1 outline-none text-left",
                                        isActive
                                            ? "bg-gradient-to-r from-[#F28C1B] to-[#E37D0B] text-white shadow-lg shadow-orange-500/20"
                                            : "text-slate-400 hover:bg-slate-800/50 hover:text-white focus:bg-slate-800/30"
                                    )}
                                    title={!sidebarOpen ? item.name : ""}
                                >
                                    <div className="flex items-center gap-4">
                                        <item.icon className={cn(
                                            "w-5 h-5 transition-all duration-300",
                                            isActive ? "text-white scale-110" : "text-slate-500 group-hover:text-orange-400 group-hover:scale-110"
                                        )} aria-hidden="true" />
                                        <span className={cn(
                                            "font-semibold text-sm tracking-wide transition-all duration-300",
                                            !sidebarOpen && "lg:opacity-0 lg:hidden"
                                        )}>
                                            {item.name}
                                        </span>
                                    </div>
                                    {item.badge && sidebarOpen && (
                                        <span className={cn(
                                            "px-2.5 py-0.5 text-[10px] font-bold rounded-lg min-w-[24px] text-center transition-all",
                                            isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400 group-hover:bg-orange-500 group-hover:text-white"
                                        )}>
                                            {item.badge}
                                        </span>
                                    )}
                                    {isActive && !sidebarOpen && (
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-orange-400 rounded-full shadow-lg"></div>
                                    )}
                                </button>
                            )
                        })}
                    </nav>

                    {/* Footer / User Profile */}
                    <div className="p-6 bg-slate-900 border-t border-slate-800 transition-all">
                        <button
                            onClick={() => navigate(`/${role}/profile`)}
                            role="link"
                            aria-label={`View ${user?.name || "Professional"} profile`}
                            className={cn(
                                "w-full flex items-center gap-4 p-3 rounded-2xl bg-slate-800/40 border border-slate-800 group hover:border-orange-500/30 hover:bg-slate-800 transition-all duration-300 cursor-pointer shadow-sm overflow-hidden outline-none text-left",
                                !sidebarOpen && "lg:p-1.5 lg:justify-center lg:border-none lg:bg-transparent"
                            )}
                        >
                            <div className="relative shrink-0">
                                <img src={`https://i.pravatar.cc/150?u=${user?.email || role}`} alt={`${user?.name || "User"} avatar`} className="w-10 h-10 rounded-xl border border-slate-700 shadow-xl object-cover transition-all group-hover:scale-105" />
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-[3px] border-slate-900 rounded-full shadow-lg pulse-green"></div>
                            </div>
                            <div className={cn("min-w-0 flex-1 transition-all duration-300", !sidebarOpen && "lg:hidden")}>
                                <p className="text-white text-sm font-bold truncate m-0">{user?.name || "Professional"}</p>
                                <p className="text-orange-500 text-[10px] font-bold tracking-widest uppercase m-0 mt-1">{user?.role || role}</p>
                            </div>
                        </button>
                        <button
                            onClick={logout}
                            aria-label="Sign out of the platform"
                            className={cn(
                                "w-full flex items-center justify-center gap-2 mt-6 p-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 rounded-2xl hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-300 border border-slate-800 hover:border-rose-500/20 group outline-none",
                                !sidebarOpen && "lg:p-3 lg:border-none lg:bg-transparent"
                            )}
                            title={!sidebarOpen ? "Sign Out" : ""}
                        >
                            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                            {sidebarOpen && <span>Sign Out</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] overflow-hidden relative">
                {/* Decorative background blobs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                {/* Mobile Header Toggle */}
                <div className="lg:hidden flex items-center h-20 px-8 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-30 shrink-0">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-600 hover:text-slate-900 transition-colors">
                        <Menu className="w-7 h-7" />
                    </button>
                    <div className="ml-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F28C1B] to-[#E37D0B] flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <activeConfig.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-display font-bold text-slate-900 tracking-tight text-lg">SkillMatch</span>
                    </div>
                </div>

                <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10 scroll-smooth page-transition">
                    <article className="min-h-full">
                        {children}
                    </article>
                </main>
            </div>
        </div>
    )
}
