import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"
import { auth } from "@/lib/auth"
import type { Expense } from "@/lib/types"

export async function getExpenses(): Promise<Expense[]> {
  const session = await auth()

  if (!session) {
    return []
  }

  const { db } = await connectToDatabase()

  const expenses = await db.collection("expenses").find({ userId: session.user.id }).sort({ date: -1 }).toArray()

  return expenses.map((expense) => ({
    id: expense._id.toString(),
    title: expense.title,
    amount: expense.amount,
    date: expense.date,
    category: expense.category,
    description: expense.description || "",
  }))
}

export async function getExpenseById(id: string): Promise<Expense | null> {
  const session = await auth()

  if (!session) {
    return null
  }

  const { db } = await connectToDatabase()

  const expense = await db.collection("expenses").findOne({ _id: new ObjectId(id), userId: session.user.id })

  if (!expense) {
    return null
  }

  return {
    id: expense._id.toString(),
    title: expense.title,
    amount: expense.amount,
    date: expense.date,
    category: expense.category,
    description: expense.description || "",
  }
}

