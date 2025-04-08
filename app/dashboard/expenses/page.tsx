import { Suspense } from "react"
import { ExpenseList } from "@/components/expense-list"
import { ExpenseSkeleton } from "@/components/expense-skeleton"
import { ExpenseFilters } from "@/components/expense-filters"
import { AddExpenseButton } from "@/components/add-expense-button"

export default function ExpensesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Expenses</h2>
        <AddExpenseButton />
      </div>
      <ExpenseFilters />
      <Suspense fallback={<ExpenseSkeleton />}>
        <ExpenseList />
      </Suspense>
    </div>
  )
}

