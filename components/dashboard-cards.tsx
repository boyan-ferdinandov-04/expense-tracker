import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ArrowDownIcon, ArrowUpIcon, CreditCard, DollarSign } from "lucide-react"
import { auth } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"

async function getExpenseSummary() {
  const session = await auth()
  
  if (!session) {
    return {
      totalExpenses: 0,
      monthlyExpenses: 0,
      averageExpense: 0,
      expenseCount: 0,
      monthlyChange: 0,
    }
  }
  
  const { db } = await connectToDatabase()
  const expenses = await db
    .collection("expenses")
    .find({ userId: session.user.id })
    .toArray()
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  
  // Calculate expense count
  const expenseCount = expenses.length
  
  // Calculate average expense
  const averageExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0
  
  // Get current month expenses
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getMonth() === currentMonth && 
           expenseDate.getFullYear() === currentYear
  })
  
  const monthlyExpenses = currentMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount, 
    0
  )
  
  // Calculate previous month expenses for comparison
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear
  
  const previousMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getMonth() === previousMonth && 
           expenseDate.getFullYear() === previousYear
  })
  
  const prevMonthTotal = previousMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount, 
    0
  )
  
  // Calculate month-over-month change
  let monthlyChange = 0
  if (prevMonthTotal > 0) {
    monthlyChange = ((monthlyExpenses - prevMonthTotal) / prevMonthTotal) * 100
  }
  
  return {
    totalExpenses,
    monthlyExpenses,
    averageExpense,
    expenseCount,
    monthlyChange,
  }
}

export async function DashboardCards() {
  const summary = await getExpenseSummary()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalExpenses)}</div>
          <p className="text-xs text-muted-foreground">Lifetime total</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.monthlyExpenses)}</div>
          <div className="flex items-center pt-1">
            {summary.monthlyChange > 0 ? (
              <ArrowUpIcon className="h-3 w-3 text-destructive mr-1" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 text-green-500 mr-1" />
            )}
            <p className={`text-xs ${summary.monthlyChange > 0 ? "text-destructive" : "text-green-500"}`}>
              {Math.abs(summary.monthlyChange).toFixed(1)}% from last month
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.averageExpense)}</div>
          <p className="text-xs text-muted-foreground">Per transaction</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.expenseCount}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>
    </div>
  )
}

