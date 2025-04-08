import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReportFilters } from "@/components/report-filters"
import { CategoryChart } from "@/components/category-chart"
import { MonthlyChart } from "@/components/monthly-chart"
import { ExportReportButton } from "@/components/export-report-button"

export default function ReportsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
        <ExportReportButton />
      </div>
      <ReportFilters />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Distribution of expenses across categories</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Suspense fallback={<div>Loading chart...</div>}>
              <CategoryChart />
            </Suspense>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
            <CardDescription>Expense trends over the past months</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Suspense fallback={<div>Loading chart...</div>}>
              <MonthlyChart />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

