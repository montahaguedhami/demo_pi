"use client"

import { useState } from "react"
import { useData } from "@/lib/data-store"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Settings, Users, Zap, Save, Shield, Bell, Lock, Database, Globe, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function SettingsPage() {
  const { settings, updateSettings, users, departments } = useData()
  const [localSettings, setLocalSettings] = useState(settings)

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen">
      <DashboardHeader title="Dashboard" description="Professional workspace interface" />

      <div className="flex-1 p-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[#EEEEEE] pb-8">
          <div>
            <h2 className="text-[10px] font-bold text-[#F28C1B] uppercase tracking-[0.4em] mb-2">Global Flux</h2>
            <h1 className="text-4xl font-bold text-[#222222] uppercase tracking-tighter italic">Engine Settings</h1>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-10">
          <TabsList className="bg-[#EEEEEE] border-none p-1.5 rounded-[4px] h-auto flex flex-wrap gap-2 w-fit">
            <TabsTrigger value="general" className="gap-3 text-[9px] font-black uppercase tracking-widest py-3 px-8 rounded-[2px] data-[state=active]:bg-[#222222] data-[state=active]:text-white transition-all italic">
              <Settings className="h-4 w-4" /> GENERAL
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-3 text-[9px] font-black uppercase tracking-widest py-3 px-8 rounded-[2px] data-[state=active]:bg-[#222222] data-[state=active]:text-white transition-all italic">
              <Users className="h-4 w-4" /> ACCOUNT MATRIX
            </TabsTrigger>
            <TabsTrigger value="departments" className="gap-3 text-[9px] font-black uppercase tracking-widest py-3 px-8 rounded-[2px] data-[state=active]:bg-[#222222] data-[state=active]:text-white transition-all italic">
              <Building2 className="h-4 w-4" /> DIVISIONS
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-3 text-[9px] font-black uppercase tracking-widest py-3 px-8 rounded-[2px] data-[state=active]:bg-[#222222] data-[state=active]:text-white transition-all italic">
              <Lock className="h-4 w-4" /> FIREWALL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500 outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Card className="bg-white border-[#EEEEEE] rounded-[4px] p-10 shadow-sm relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F28C1B]/[0.02] rounded-full -mr-16 -mt-16 group-hover:bg-[#F28C1B]/[0.05] transition-all"></div>
                <CardHeader className="px-0 pt-0 mb-10 flex flex-row items-center justify-between border-b border-[#EEEEEE] pb-6 relative">
                  <div>
                    <CardTitle className="text-xl font-black text-[#222222] uppercase tracking-tighter italic leading-none">Enterprise Identity</CardTitle>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 italic">BRAND CALIBRATION</p>
                  </div>
                  <Globe className="text-[#F28C1B] h-6 w-6" />
                </CardHeader>
                <CardContent className="px-0 space-y-8 relative">
                  <div className="space-y-4">
                    <Label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">Global Organization Name</Label>
                    <input
                      value={localSettings.companyName}
                      onChange={(e) => setLocalSettings({ ...localSettings, companyName: e.target.value })}
                      className="w-full bg-[#EEEEEE] border-none py-5 px-6 rounded-[4px] text-[11px] font-black text-[#222222] uppercase tracking-widest focus:ring-1 focus:ring-[#F28C1B] italic"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#EEEEEE] rounded-[4px] p-10 shadow-sm relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F28C1B]/[0.02] rounded-full -mr-16 -mt-16 group-hover:bg-[#F28C1B]/[0.05] transition-all"></div>
                <CardHeader className="px-0 pt-0 mb-10 flex flex-row items-center justify-between border-b border-[#EEEEEE] pb-6 relative">
                  <div>
                    <CardTitle className="text-xl font-black text-[#222222] uppercase tracking-tighter italic leading-none">Evaluation Cycles</CardTitle>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 italic">TEMPORAL SYNC</p>
                  </div>
                  <Zap className="text-amber-500 h-6 w-6" />
                </CardHeader>
                <CardContent className="px-0 space-y-8 relative">
                  <div className="space-y-4">
                    <Label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">Neural Calibration Frequency</Label>
                    <Select value={localSettings.evaluationFrequency} onValueChange={(v) => setLocalSettings({ ...localSettings, evaluationFrequency: v })}>
                      <SelectTrigger className="bg-[#EEEEEE] border-none h-[64px] rounded-[4px] text-[11px] font-black text-[#222222] uppercase tracking-widest focus:ring-1 focus:ring-[#F28C1B] italic px-6">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#EEEEEE] rounded-[4px] shadow-2xl">
                        <SelectItem value="monthly" className="text-[10px] font-black uppercase tracking-widest italic py-3">MONTHLY DEPLOYMENT</SelectItem>
                        <SelectItem value="quarterly" className="text-[10px] font-black uppercase tracking-widest italic py-3">QUARTERLY SYNC</SelectItem>
                        <SelectItem value="annual" className="text-[10px] font-black uppercase tracking-widest italic py-3">ANNUAL RESET</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border border-[#EEEEEE] rounded-[4px] p-10 shadow-sm border-l-8 border-l-[#F28C1B] group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#F28C1B]/[0.02] rounded-full -mr-24 -mt-24 pointer-events-none group-hover:bg-[#F28C1B]/[0.05] transition-all"></div>
              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-[#222222] uppercase tracking-tighter italic">AI Consensus Mode</h3>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest italic leading-relaxed max-w-lg">Allow engine to push recommendations without manual operative review.</p>
                </div>
                <Switch
                  checked={localSettings.autoRecommendations}
                  onCheckedChange={(v) => setLocalSettings({ ...localSettings, autoRecommendations: v })}
                  className="data-[state=checked]:bg-[#F28C1B] scale-125"
                />
              </div>
            </Card>

            <div className="flex justify-end pt-10">
              <button
                onClick={() => { updateSettings(localSettings); toast.success("CENTRAL HIVE SYNCHRONIZED"); }}
                className="bg-[#222222] text-white text-[11px] font-black py-6 px-16 rounded-[4px] uppercase tracking-[0.3em] shadow-xl shadow-[#222222]/10 hover:bg-[#F28C1B] transition-all flex items-center gap-4 active:scale-95 italic"
              >
                <Save className="h-5 w-5 text-[#F28C1B]" /> FINALIZE CALIBRATION
              </button>
            </div>
          </TabsContent>

          <TabsContent value="users" className="animate-in fade-in slide-in-from-right-4 duration-500 outline-none">
            <div className="bg-white rounded-[4px] border border-[#EEEEEE] shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-[#F8FAFC]">
                  <TableRow className="border-b border-[#EEEEEE] hover:bg-transparent">
                    <TableHead className="py-8 px-10 text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] italic">Agent Identity</TableHead>
                    <TableHead className="py-8 text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] italic">Access Protocol</TableHead>
                    <TableHead className="py-8 text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] italic text-right px-10">Clearance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(u => (
                    <TableRow key={u.id} className="border-b border-[#EEEEEE] hover:bg-[#F28C1B]/[0.02] transition-all group">
                      <TableCell className="py-8 px-10">
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <Avatar className="h-14 w-14 border border-[#EEEEEE] rounded-[4px] grayscale group-hover:grayscale-0 transition-all duration-500">
                              <AvatarImage src={`https://i.pravatar.cc/150?u=${u.id}`} className="object-cover" />
                              <AvatarFallback className="bg-[#EEEEEE] font-black text-[#222222]">{u.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#222222] border-2 border-white rounded-full flex items-center justify-center">
                              <Shield className="h-2.5 w-2.5 text-[#F28C1B]" />
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-lg text-[#222222] uppercase tracking-tighter italic group-hover:text-[#F28C1B] transition-colors">{u.name}</span>
                            <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest mt-1">OPERATIVE-ID: {u.id.toUpperCase()}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-gray-500 tracking-widest uppercase italic">{u.email}</span>
                          <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-1">SECURE CONDUIT ACTIVE</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-10">
                        <Badge className={cn(
                          "py-1.5 px-4 text-[9px] font-black uppercase tracking-[0.2em] rounded-[2px] italic border-none",
                          u.role === 'admin' ? 'bg-[#F28C1B] text-white' :
                            u.role === 'hr' ? 'bg-[#222222] text-white' :
                              'bg-[#EEEEEE] text-gray-400'
                        )}>{u.role.toUpperCase()}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}






