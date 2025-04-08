"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card } from "@/components/ui/card"

// Mock data - in a real app, this would come from the database
const data = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 900 },
  { name: "Mar", total: 1500 },
  { name: "Apr", total: 1100 },
  { name: "May", total: 1800 },
  { name: "Jun", total: 1300 },
  { name: "Jul", total: 1700 },
  { name: "Aug", total: 1400 },
  { name: "Sep", total: 2000 },
  { name: "Oct", total: 1800 },
  { name: "Nov", total: 1600 },
  { name: "Dec", total: 2200 },
]

export function Overview() {
  const { theme } = useTheme()

  const isDark = theme === "dark"
  const textColor = isDark ? "#f8fafc" : "#0f172a"
  const gridColor = isDark ? "#334155" : "#e2e8f0"

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
        <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke={textColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="p-2 shadow-md">
                  <div className="text-sm font-bold">{payload[0].payload.name}</div>
                  <div className="text-sm font-semibold">${payload[0].value}</div>
                </Card>
              )
            }
            return null
          }}
        />
        <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

