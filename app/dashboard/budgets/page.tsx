import { Suspense } from "react"
import { BudgetList } from "@/components/budget-list"
import { BudgetSkeleton } from "@/components/budget-skeleton"
import { AddBudgetButton } from "@/components/add-budget-button"
import { BudgetOverview } from "@/components/budget-overview"

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Budgets</h2>
        <AddBudgetButton />
      </div>

      <Suspense fallback={<div>Loading overview...</div>}>
        <BudgetOverview />
      </Suspense>

      <div>
        <h3 className="text-lg font-medium mb-4">Your Budgets</h3>
        <Suspense fallback={<BudgetSkeleton />}>
          <BudgetList />
        </Suspense>
      </div>
    </div>
  )
}

