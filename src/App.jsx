import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import AdminApp from "./AdminApp"
import EmployeeApp from "./EmployeeApp"
import ManagerApp from "./ManagerApp"
import { useAuth } from "../lib/auth-context"
import {
    BarChart3,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Shield,
    Briefcase,
    Users,
    Brain,
    ChevronRight,
    Sparkles,
    ArrowRight,
    CheckCircle2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "../lib/utils"
import { AccessibilityWidget } from "../components/accessibility/AccessibilityWidget"

// Login Component
function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { login, isAuthenticated, user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated && user) {
            navigate(`/${user.role}`, { replace: true })
        }
    }, [isAuthenticated, user, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const success = await login(email, password)
        if (!success) {
            toast.error("Authentication Failed", {
                description: "The credentials provided do not match our records.",
                className: "font-sans font-medium"
            })
        } else {
            toast.success("Welcome Back", {
                description: "Initializing your professional workspace.",
                className: "font-sans font-medium"
            })
        }
        setTimeout(() => setIsLoading(false), 800)
    }

    const handleDemoLogin = async (role) => {
        setIsLoading(true)
        const credentials = {
            admin: { email: "john.doe@company.com", password: "hr123" },
            manager: { email: "jane.smith@company.com", password: "manager123" },
            employee: { email: "mike.johnson@company.com", password: "emp123" }
        }
        await login(credentials[role].email, credentials[role].password)
        toast.success("Demo Access Granted", { description: `Signed in as ${role === 'admin' ? 'Administrator' : role.charAt(0).toUpperCase() + role.slice(1)}.` })
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 lg:p-6 relative overflow-hidden">
            {/* Animated Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-[#F28C1B]/[0.05] rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/[0.03] rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-[1100px] grid lg:grid-cols-2 bg-white rounded-3xl border border-slate-200/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-1000">
                {/* Left Side: Premium Branding & Visuals */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-[#0F172A] relative overflow-hidden group">
                    {/* Abstract Decorative Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-48 -mt-48 blur-[100px] transition-transform duration-1000 group-hover:scale-110"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-32 -mb-32 blur-[80px]"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-20 animate-in slide-in-from-left-8 duration-700">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#F28C1B] to-[#E37D0B] rounded-xl flex items-center justify-center shadow-xl shadow-orange-500/30">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold font-display text-white tracking-tight leading-none">SkillMatch</span>
                                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mt-1">Enterprise AI</span>
                            </div>
                        </div>

                        <h1 className="text-6xl font-bold font-display text-white italic leading-[1.1] mb-8 tracking-tight animate-in slide-in-from-left-12 duration-1000">
                            The future of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F28C1B] to-[#FFB76B]">Talent Matrix.</span>
                        </h1>
                        <p className="text-lg text-slate-400 mb-14 max-w-md font-medium leading-relaxed opacity-90 animate-in slide-in-from-left-16 duration-1000">
                            Harmonize your workforce with AI-powered competency mapping, real-time analytics, and intelligent growth paths.
                        </p>
                    </div>
                </div>

                {/* Right Side: Elegant Form */}
                <div className="p-10 lg:p-20 flex flex-col justify-center bg-white relative">
                    <div className="max-w-[400px] mx-auto w-full">
                        <div className="mb-14 text-center lg:text-left">
                            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary px-3 py-1 font-bold text-[10px] uppercase tracking-widest italic rounded-full">Secure Entry Gateway</Badge>
                            <h2 className="text-4xl font-bold font-display text-slate-900 mb-3 tracking-tight">Professional Sync</h2>
                            <p className="text-slate-500 font-medium text-base">Enter your credentials to access the platform.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="group space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-primary">Corporate Identity</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@company.com"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="group space-y-2">
                                <div className="flex items-center justify-between mb-1 px-1">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest transition-colors group-focus-within:text-primary">Access Token</label>
                                    <button type="button" className="text-[11px] font-bold text-primary hover:underline transition-all">Forgot Policy?</button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-12 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors p-2"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold py-4.5 rounded-xl shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-4 text-base flex items-center justify-center gap-3 group/btn hover:translate-y-[-2px]"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Initialize Protocol
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-16">
                            <div className="relative flex items-center justify-center mb-10">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-100"></div>
                                </div>
                                <span className="relative px-6 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-widest italic opacity-80">Rapid Access Simulation</span>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { role: "admin", icon: Shield, label: "Admin", color: "text-orange-600 bg-orange-50" },
                                    { role: "manager", icon: Briefcase, label: "Manager", color: "text-blue-600 bg-blue-50" },
                                    { role: "employee", icon: Users, label: "Unit", color: "text-emerald-600 bg-emerald-50" }
                                ].map((item) => (
                                    <button
                                        key={item.role}
                                        onClick={() => handleDemoLogin(item.role)}
                                        className="flex flex-col items-center gap-3 p-4 bg-white border border-slate-100/80 rounded-2xl hover:border-primary/40 hover:bg-slate-50 transition-all group shadow-sm hover:shadow-md active:scale-95"
                                    >
                                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110", item.color)}>
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-600 tracking-tight">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <p className="absolute bottom-8 text-[11px] font-semibold text-slate-400/80 uppercase tracking-[0.2em] italic">© 2026 SkillMatch Corporation · Intelligence Beyond Boundaries</p>
        </div>
    )
}

function ProtectedRoute({ children, requiredRole }) {
    const { user, isAuthenticated } = useAuth()
    const location = useLocation()

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to={`/${user.role}`} replace />
    }

    return children
}

function AppContent() {
    return (
        <>
            <AccessibilityWidget />
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/admin/*" element={
                    <ProtectedRoute requiredRole="admin">
                        <AdminApp />
                    </ProtectedRoute>
                } />
                <Route path="/employee/*" element={
                    <ProtectedRoute requiredRole="employee">
                        <EmployeeApp />
                    </ProtectedRoute>
                } />
                <Route path="/manager/*" element={
                    <ProtectedRoute requiredRole="manager">
                        <ManagerApp />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </>
    )
}

function App() {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppContent />
        </BrowserRouter>
    )
}

export default App
