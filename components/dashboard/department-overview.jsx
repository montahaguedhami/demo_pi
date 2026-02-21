import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { departmentStats } from "@/lib/mock-data"

const COLORS = [
  "#F28C1B", // Primary Orange
  "#222222", // Deep Charcoal
  "#666666", // Medium Gray
  "#999999", // Light Gray
  "#CCCCCC", // Subtle Gray
]

const data = departmentStats.map((dept, index) => ({
  name: dept.department,
  value: dept.employeeCount,
  avgScore: dept.avgSkillScore,
  color: COLORS[index % COLORS.length],
}))

export function DepartmentOverview() {
  return (
    <Card className="bg-white border border-[#EEEEEE] rounded-[4px] shadow-sm overflow-hidden group">
      <CardHeader className="p-8 pb-4 border-b border-[#EEEEEE]">
        <CardTitle className="text-xl font-bold text-[#222222] uppercase tracking-tighter italic">Organizational Structure</CardTitle>
        <CardDescription className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Cross-departmental unit allocation</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="h-[320px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
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
                itemStyle={{ color: "#222222", padding: "2px 0" }}
                cursor={{ fill: "transparent" }}
                formatter={(value, name, props) => [
                  `${value} UNITS (STR: ${props.payload.avgScore}%)`,
                  name.toUpperCase(),
                ]}
              />
              <Legend
                verticalAlign="bottom"
                height={60}
                iconType="rect"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest italic ml-2">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-12">
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest italic">Total Units</p>
            <p className="text-3xl font-black text-[#222222] tracking-tighter italic leading-none">
              {data.reduce((acc, curr) => acc + curr.value, 0)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
