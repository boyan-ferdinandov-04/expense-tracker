"use client"

import { useTheme } from "next-themes"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card } from "@/components/ui/card"

// Mock data - in a real app, this would come from the database
const data = [
  { name: "Groceries", value: 500, color: "#10b981" },
  { name: "Utilities", value: 300, color: "#3b82f6" },
  { name: "Entertainment", value: 200, color: "#8b5cf6" },
  { name: "Transportation", value: 150, color: "#f59e0b" },
  { name: "Dining", value: 250, color: "#ef4444" },
  { name: "Shopping", value: 180, color: "#ec4899" },
  { name: "Health", value: 120, color: "#06b6d4" },
  { name: "Other", value: 100, color: "#6b7280" },
]

export function CategoryChart() {
  const { theme } = useTheme()

  const isDark = theme === "dark"
  const textColor = isDark ? "#f8fafc" : "#0f172a"

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="p-2 shadow-md">
                  <div className="text-sm font-bold">{payload[0].name}</div>
                  <div className="text-sm font-semibold">${payload[0].value}</div>
                </Card>
              )
            }
            return null
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

