import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentExpenses } from "@/components/recent-expenses"
import { ExpenseSkeleton } from "@/components/expense-skeleton"
import { DashboardCards } from "@/components/dashboard-cards"

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <Suspense fallback={<ExpenseSkeleton />}>
        <DashboardCards />
      </Suspense>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Suspense fallback={<div>Loading chart...</div>}>
              <Overview />
            </Suspense>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your most recent expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ExpenseSkeleton />}>
              <RecentExpenses />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

