import { notFound } from "next/navigation"
import { getExpenseById } from "@/lib/expenses"
import { ExpenseForm } from "@/components/expense-form"

interface ExpensePageProps {
  params: {
    id: string
  }
}

export default async function ExpensePage({ params }: ExpensePageProps) {
  const expense = await getExpenseById(params.id)

  if (!expense) {
    notFound()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Edit Expense</h2>
      <ExpenseForm expense={expense} />
    </div>
  )
}

