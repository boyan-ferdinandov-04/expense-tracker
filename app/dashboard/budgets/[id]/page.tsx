import { notFound } from "next/navigation"
import { getBudgetById } from "@/lib/budgets"
import { BudgetForm } from "@/components/budget-form"

interface BudgetPageProps {
  params: {
    id: string
  }
}

export default async function BudgetPage({ params }: BudgetPageProps) {
  const budget = await getBudgetById(params.id)

  if (!budget) {
    notFound()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Edit Budget</h2>
      <BudgetForm budget={budget} />
    </div>
  )
}

