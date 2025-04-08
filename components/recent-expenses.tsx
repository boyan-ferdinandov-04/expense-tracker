import { formatCurrency, formatDate } from "@/lib/utils"
import { getExpenses } from "@/lib/expenses"
import { Badge } from "@/components/ui/badge"

export async function RecentExpenses() {
  const expenses = await getExpenses()
  const recentExpenses = expenses.slice(0, 5)

  if (!recentExpenses.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No expenses found.</p>
        <p className="text-sm text-muted-foreground">Add an expense to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recentExpenses.map((expense) => (
        <div key={expense.id} className="flex items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{expense.title}</p>
            <p className="text-sm text-muted-foreground">{formatDate(expense.date)}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline">{expense.category}</Badge>
            <span className="font-medium">{formatCurrency(expense.amount)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

