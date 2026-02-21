import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const data = [
  { name: "React Dept", knowledge: 75, type: "knowledge" },
  { name: "Node.js Dept", knowledge: 68, type: "knowledge" },
  { name: "Proj Mgmt", knowHow: 82, type: "knowHow" },
  { name: "Leadership", softSkill: 74, type: "softSkill" },
  { name: "Communication", softSkill: 65, type: "softSkill" },
  { name: "Git Workflow", knowHow: 72, type: "knowHow" },
  { name: "Teamwork", softSkill: 80, type: "softSkill" },
]

const getBarColor = (type) => {
  switch (type) {
    case "knowledge": return "#F28C1B"
    case "knowHow": return "#222222"
    case "softSkill": return "#999999"
    default: return "#F28C1B"
  }
}

export function SkillDistributionChart() {
  return (
    <Card className="col-span-2 bg-white border border-[#EEEEEE] rounded-[4px] shadow-sm overflow-hidden group">
      <CardHeader className="p-8 pb-4 border-b border-[#EEEEEE]">
        <CardTitle className="text-xl font-bold text-[#222222] uppercase tracking-tighter italic">Neural Distribution</CardTitle>
        <CardDescription className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Average scores across top skills by protocol type</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="mb-8 flex gap-8">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-[2px] bg-[#F28C1B]" />
            <span className="text-[9px] font-bold text-[#222222] uppercase tracking-widest italic">Knowledge</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-[2px] bg-[#222222]" />
            <span className="text-[9px] font-bold text-[#222222] uppercase tracking-widest italic">Know-how</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-[2px] bg-[#999999]" />
            <span className="text-[9px] font-bold text-[#222222] uppercase tracking-widest italic">Soft Skills</span>
          </div>
        </div>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 60, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#EEEEEE" horizontal={true} vertical={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "#999999", fontSize: 9, fontWeight: 'bold' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: "#222222", fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #EEEEEE",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  padding: "12px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
                }}
                itemStyle={{ color: "#222222" }}
                cursor={{ fill: "#F28C1B", fillOpacity: 0.03 }}
                formatter={(value) => [`${value}%`, 'Neural Score']}
              />
              <Bar
                dataKey={(entry) => entry.knowledge || entry.knowHow || entry.softSkill}
                radius={[0, 2, 2, 0]}
                barSize={12}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.type)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
