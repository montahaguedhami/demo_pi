"use client"

import { FileText, Download, Filter, Search, FileCode, FileSpreadsheet, ChevronRight } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/header"
import { toast } from "sonner"


export default function AdminReportsPage() {
    const handleGenerate = () => {
        toast.promise(new Promise(r => setTimeout(r, 2000)), {
            loading: 'COMPILING STRATEGIC DATASET...',
            success: 'TACTICAL EXTRACT SYNCHRONIZED',
            error: 'DATA CORRUPTION DETECTED',
        })
    }

    const handleDownload = (name) => {
        toast.success(`ARCHIVE TRANSFER INITIATED`, {
            description: `DOWNLOADING: ${name.toUpperCase()}`
        })
    }

    const reports = [
        { id: 1, name: "Quarterly Skill Audit", type: "PDF", size: "2.4MB", date: "2026-02-15", status: "STABLE" },
        { id: 2, name: "Workforce Mobility Matrix", type: "XLSX", size: "1.1MB", date: "2026-02-10", status: "UPDATING" },
        { id: 3, name: "Training ROI Analysis", type: "PDF", size: "4.8MB", date: "2026-02-01", status: "ARCHIVED" },
        { id: 4, name: "Neural Alignment Delta", type: "JSON", size: "0.5MB", date: "2026-01-20", status: "LOCKED" },
    ]

    return (
        <div className="flex flex-col bg-[#F8FAFC] min-h-screen">
      <DashboardHeader title="Dashboard" description="Professional workspace interface" />

      <div className="flex-1 p-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[#EEEEEE] pb-8">
                    <div>
                        <h2 className="text-[10px] font-bold text-[#F28C1B] uppercase tracking-[0.4em] mb-2">Central Node</h2>
                        <h1 className="text-4xl font-bold text-[#222222] uppercase tracking-tighter italic">Intelligence Logs</h1>
                    </div>
                    <button
                        onClick={handleGenerate}
                        className="bg-[#222222] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-[4px] py-4 px-10 hover:bg-[#F28C1B] transition-all flex items-center gap-4 active:scale-95 italic shadow-lg shadow-[#222222]/10"
                    >
                        <Download className="h-4 w-4 text-[#F28C1B]" /> GENERATE NEW EXTRACT
                    </button>
                </div>

                <div className="bg-white border border-[#EEEEEE] rounded-[4px] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-700">
                    <div className="p-10 border-b border-[#EEEEEE] flex flex-col md:flex-row md:items-center justify-between gap-8 bg-[#F8FAFC]">
                        <div className="flex items-center gap-6 bg-[#EEEEEE] rounded-[4px] px-8 py-4 flex-1 max-w-xl group focus-within:ring-1 focus-within:ring-[#F28C1B] transition-all">
                            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-[#F28C1B] transition-colors" />
                            <input
                                type="text"
                                placeholder="PROBE SECURE ARCHIVES..."
                                className="bg-transparent border-none outline-none text-[10px] font-bold text-[#222222] tracking-[0.2em] placeholder:text-gray-300 w-full italic"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button className="bg-white border border-[#EEEEEE] p-4 rounded-[4px] text-gray-400 hover:text-[#F28C1B] hover:border-[#F28C1B]/30 transition-all shadow-sm group">
                                <Filter className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#EEEEEE] bg-[#F8FAFC]">
                                    <th className="px-10 py-8 text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] italic">Report Identity</th>
                                    <th className="px-8 py-8 text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] italic">Protocol Code</th>
                                    <th className="px-8 py-8 text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] italic">Data Weight</th>
                                    <th className="px-8 py-8 text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] italic text-center">Status Flux</th>
                                    <th className="px-8 py-8 text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] italic text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((report, idx) => (
                                    <tr
                                        key={report.id}
                                        className="border-b border-[#EEEEEE] hover:bg-[#F28C1B]/[0.02] transition-colors group"
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-[4px] bg-[#EEEEEE] flex items-center justify-center group-hover:bg-[#F28C1B] group-hover:text-white transition-all text-gray-400 shadow-sm relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    {report.type === 'XLSX' ? <FileSpreadsheet className="w-6 h-6" /> : report.type === 'JSON' ? <FileCode className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-black text-[#222222] uppercase tracking-tighter italic group-hover:text-[#F28C1B] transition-colors leading-tight">"{report.name}"</span>
                                                    <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest mt-1">ID: ARCHIVE-SEC-00{report.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-[#EEEEEE] px-4 py-1.5 rounded-[2px] italic group-hover:bg-[#F28C1B]/10 group-hover:text-[#F28C1B] transition-colors">{report.type} EXTRACT</span>
                                        </td>
                                        <td className="px-8 py-8">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic group-hover:text-[#222222] transition-colors">{report.size}</span>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex justify-center">
                                                <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-[2px] italic ${report.status === 'STABLE' ? 'bg-emerald-500/10 text-emerald-500' :
                                                        report.status === 'UPDATING' ? 'bg-amber-500/10 text-amber-500' :
                                                            'bg-gray-400/10 text-gray-400'
                                                    }`}>
                                                    {report.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            <div className="flex items-center justify-end gap-2 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                <button
                                                    onClick={() => handleDownload(report.name)}
                                                    className="p-4 bg-[#EEEEEE] text-gray-400 hover:bg-[#F28C1B] hover:text-white rounded-[4px] transition-all shadow-sm hover:shadow-lg hover:shadow-[#F28C1B]/20 active:scale-90"
                                                >
                                                    <Download className="w-5 h-5" />
                                                </button>
                                                <button className="p-4 bg-[#222222] text-white hover:bg-black rounded-[4px] transition-all shadow-sm active:scale-90">
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-10 bg-gray-50/50 flex items-center justify-between border-t border-[#EEEEEE]">
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">Encrypted Secure Socket Layer: ACTIVE</p>
                        <div className="flex items-center gap-4">
                            <span className="text-[9px] font-black text-[#F28C1B] uppercase tracking-widest italic animate-pulse">SYSTEM NOMINAL</span>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}





