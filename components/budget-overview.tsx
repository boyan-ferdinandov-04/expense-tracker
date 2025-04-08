"use client"

import { useTheme } from "next-themes"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useBudgetsData } from "@/hooks/use-budgets-data"
import { useCategoriesData } from "@/hooks/use-categories-data"

export function BudgetOverview() {
  const { theme } = useTheme()
  const { budgets, isLoading: isBudgetsLoading } = useBudgetsData()
  const { categories, isLoading: isCategoriesLoading } = useCategoriesData()

  const isDark = theme === "dark"
  const textColor = isDark ? "#f8fafc" : "#0f172a"
  const gridColor = isDark ? "#334155" : "#e2e8f0"

  if (isBudgetsLoading || isCategoriesLoading) {
    return <div>Loading budget data...</div>
  }

  if (!budgets.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>No budgets found. Add a budget to see your spending overview.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Create a map of category IDs to names for easy lookup
  const categoryMap = categories.reduce(
    (acc, category) => {
      acc[category.id] = {
        name: category.name,
        color: category.color || "#6b7280",
      }
      return acc
    },
    {} as Record<string, { name: string; color: string }>,
  )

  // Prepare data for charts
  const budgetData = budgets.map((budget) => {
    // Mock spent data - in a real app, this would be calculated from actual expenses
    const spent = Math.floor(Math.random() * budget.amount)

    return {
      name: categoryMap[budget.categoryId]?.name || "Unknown",
      budget: budget.amount,
      spent: spent,
      remaining: budget.amount - spent,
      color: categoryMap[budget.categoryId]?.color || "#6b7280",
    }
  })

  const pieData = budgets.map((budget) => ({
    name: categoryMap[budget.categoryId]?.name || "Unknown",
    value: budget.amount,
    color: categoryMap[budget.categoryId]?.color || "#6b7280",
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
        <CardDescription>View your budget allocation and spending across categories</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar">
          <TabsList className="mb-4">
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="pie">Pie Chart</TabsTrigger>
          </TabsList>
          <TabsContent value="bar" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData}>
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
                          <div className="text-sm">Budget: ${payload[0].payload.budget}</div>
                          <div className="text-sm">Spent: ${payload[0].payload.spent}</div>
                          <div className="text-sm">Remaining: ${payload[0].payload.remaining}</div>
                        </Card>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
                <Bar dataKey="budget" name="Budget" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" name="Spent" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="pie" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

