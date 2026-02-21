"use client"

import { Bell, Search, HelpCircle, CheckCheck, User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

export function DashboardHeader({ title = "Dashboard", description }) {
  const { getNotificationsForUser, getUnreadCount, markNotificationRead, markAllNotificationsRead } = useData()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const notifications = user ? getNotificationsForUser(user.id) : []
  const unreadCount = user ? getUnreadCount(user.id) : 0

  const handleNotificationClick = (notif) => {
    markNotificationRead(notif.id)
    if (notif.link) navigate(notif.link)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-100 bg-white/80 px-8 backdrop-blur-xl shrink-0">
      <div className="flex flex-col gap-1">
        <h2 className="text-slate-900 font-display text-xl tracking-tight font-bold leading-tight m-0">
          {title}
        </h2>
        {description && (
          <p className="text-slate-500 text-xs font-medium tracking-wide m-0">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden lg:block group" role="search">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" aria-hidden="true" />
          <Input
            placeholder="Search resources, skills..."
            aria-label="Search resources and skills"
            className="w-80 pl-11 bg-slate-50 border-slate-200 rounded-xl h-11 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-orange-500/10 focus-visible:border-orange-500/30 transition-all duration-300"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Help */}
          <Button variant="ghost" size="icon" aria-label="Help and Documentation" className="h-10 w-10 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all">
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-10 w-10 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white border-2 border-white shadow-lg animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 bg-white border border-slate-200 rounded-2xl mt-4 shadow-2xl p-0 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-5 bg-slate-50/50 border-b border-slate-100">
                <DropdownMenuLabel className="text-xs font-bold text-slate-900 uppercase tracking-widest">Notifications Hub</DropdownMenuLabel>
                {unreadCount > 0 && user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-[11px] font-bold text-orange-600 hover:bg-orange-50 hover:text-orange-700 rounded-lg px-3"
                    onClick={() => markAllNotificationsRead(user.id)}
                  >
                    <CheckCheck className="mr-2 h-3.5 w-3.5" />
                    Archive All
                  </Button>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCheck className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-sm text-slate-400 font-medium px-8 italic">All quiet in the neural network</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notif) => (
                    <DropdownMenuItem
                      key={notif.id}
                      className={cn(
                        "flex flex-col items-start gap-1 p-5 cursor-pointer border-b border-slate-100 last:border-0 hover:bg-orange-50/50 focus:bg-orange-50/50 transition-all outline-none",
                        !notif.read && "bg-orange-500/[0.03]"
                      )}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="flex items-start gap-4 w-full">
                        {!notif.read && (
                          <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-orange-500 shrink-0 shadow-lg" />
                        )}
                        <div className={cn("flex-1", notif.read && "pl-6")}>
                          <span className="font-bold text-sm text-slate-900 block mb-1">{notif.title}</span>
                          <span className="text-xs text-slate-500 block leading-relaxed line-clamp-2 font-medium">
                            {notif.message}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" aria-label={`User menu: ${user?.name}`} className="flex items-center gap-3 pl-2 pr-3 h-11 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
                <div className="h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform" aria-hidden="true">
                  {user?.name?.[0] || 'U'}
                </div>
                <div className="hidden md:flex flex-col items-start text-left">
                  <span className="text-sm font-bold text-slate-900 leading-none">{user?.name}</span>
                  <span className="text-[10px] font-bold text-orange-500 mt-1.5 uppercase tracking-widest">{user?.role}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white border border-slate-200 rounded-2xl mt-4 shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-5 border-b border-slate-50 bg-slate-50/30 rounded-t-xl mb-1">
                <p className="text-sm font-bold text-slate-900 truncate m-0">{user?.name}</p>
                <p className="text-[11px] text-slate-500 font-medium truncate mt-1 m-0">{user?.email}</p>
              </div>
              <div className="py-1">
                <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 rounded-xl hover:bg-orange-50 hover:text-orange-600 cursor-pointer focus:bg-orange-50 focus:text-orange-600 outline-none transition-all font-medium">
                  <User className="w-4.5 h-4.5 opacity-60" />
                  Profile Details
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 rounded-xl hover:bg-orange-50 hover:text-orange-600 cursor-pointer focus:bg-orange-50 focus:text-orange-600 outline-none transition-all font-medium">
                  <Settings className="w-4.5 h-4.5 opacity-60" />
                  System Settings
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="bg-slate-100 mx-1 my-1" />
              <div className="py-1">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 rounded-xl hover:bg-rose-50 cursor-pointer focus:bg-rose-50 outline-none transition-all font-bold"
                >
                  <LogOut className="w-4.5 h-4.5 transition-transform group-hover:-translate-x-1" />
                  Sign Out Portal
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export const Header = DashboardHeader
