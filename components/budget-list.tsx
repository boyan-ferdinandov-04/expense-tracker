import { getBudgets } from "@/lib/budgets"
import { getCategories } from "@/lib/categories"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { DeleteBudgetButton } from "@/components/delete-budget-button"

export async function BudgetList() {
  const budgets = await getBudgets()
  const categories = await getCategories()

  // Create a map of category IDs to names for easy lookup
  const categoryMap = categories.reduce(
    (acc, category) => {
      acc[category.id] = {
        name: category.name,
        color: category.color,
      }
      return acc
    },
    {} as Record<string, { name: string; color?: string }>,
  )

  if (!budgets.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No budgets found.</p>
        <p className="text-sm text-muted-foreground">Add a budget to start tracking your spending limits.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {budgets.map((budget) => {
        // Calculate progress percentage (mock data for now)
        const spent = Math.floor(Math.random() * budget.amount) // This would be calculated from actual expenses
        const percentage = Math.min(Math.round((spent / budget.amount) * 100), 100)
        const isOverBudget = spent > budget.amount

        return (
          <Card key={budget.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  <div className="flex items-center gap-2">
                    {categoryMap[budget.categoryId]?.color && (
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: categoryMap[budget.categoryId].color }}
                      />
                    )}
                    {categoryMap[budget.categoryId]?.name || "Unknown Category"}
                  </div>
                </CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`/dashboard/budgets/${budget.id}`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </a>
                  </Button>
                  <DeleteBudgetButton id={budget.id} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Budget</span>
                  <span className="font-medium">{formatCurrency(budget.amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Spent</span>
                  <span className={`font-medium ${isOverBudget ? "text-destructive" : ""}`}>
                    {formatCurrency(spent)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Remaining</span>
                  <span className={`font-medium ${isOverBudget ? "text-destructive" : ""}`}>
                    {formatCurrency(budget.amount - spent)}
                  </span>
                </div>
                <Progress
                  value={percentage}
                  className={isOverBudget ? "bg-red-200" : ""}
                  indicatorClassName={isOverBudget ? "bg-destructive" : ""}
                />
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <p className="text-xs text-muted-foreground">
                {budget.period === "monthly" ? "Monthly" : "Yearly"} budget
              </p>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

