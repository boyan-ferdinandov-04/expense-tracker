import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { formatDate, formatCurrency } from "@/lib/utils"

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const period = searchParams.get("period") || "month"
    const category = searchParams.get("category")
    const fromDate = searchParams.get("fromDate")
    const toDate = searchParams.get("toDate")

    const { db } = await connectToDatabase()

    // Build query
    const query: any = { userId: session.user.id }

    if (category) {
      query.category = category
    }

    if (period === "custom" && fromDate && toDate) {
      query.date = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      }
    } else {
      const now = new Date()
      const startDate = new Date()

      switch (period) {
        case "week":
          startDate.setDate(now.getDate() - 7)
          break
        case "month":
          startDate.setMonth(now.getMonth() - 1)
          break
        case "quarter":
          startDate.setMonth(now.getMonth() - 3)
          break
        case "year":
          startDate.setFullYear(now.getFullYear() - 1)
          break
        default:
          startDate.setMonth(now.getMonth() - 1) // Default to month
      }

      query.date = {
        $gte: startDate,
        $lte: now,
      }
    }

    // Get expenses
    const expenses = await db.collection("expenses").find(query).sort({ date: -1 }).toArray()

    // Get categories for lookup
    const categories = await db.collection("categories").find({ userId: session.user.id }).toArray()

    const categoryMap = categories.reduce(
      (acc, cat) => {
        acc[cat._id.toString()] = cat.name
        return acc
      },
      {} as Record<string, string>,
    )

    // Generate CSV
    const headers = ["Date", "Title", "Category", "Amount", "Description"]
    const rows = expenses.map((expense) => [
      formatDate(expense.date),
      expense.title,
      categoryMap[expense.category] || expense.category,
      formatCurrency(expense.amount).replace("$", ""),
      expense.description || "",
    ])

    const csv = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="expense-report-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error exporting report:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

