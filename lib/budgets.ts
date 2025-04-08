import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"
import { auth } from "@/lib/auth"
import type { Budget } from "@/lib/types"

export async function getBudgets(): Promise<Budget[]> {
  const session = await auth()

  if (!session) {
    return []
  }

  const { db } = await connectToDatabase()

  const budgets = await db.collection("budgets").find({ userId: session.user.id }).sort({ startDate: -1 }).toArray()

  return budgets.map((budget) => ({
    id: budget._id.toString(),
    categoryId: budget.categoryId,
    amount: budget.amount,
    period: budget.period,
    startDate: budget.startDate,
    endDate: budget.endDate,
    isActive: budget.isActive,
  }))
}

export async function getBudgetById(id: string): Promise<Budget | null> {
  const session = await auth()

  if (!session) {
    return null
  }

  const { db } = await connectToDatabase()

  const budget = await db.collection("budgets").findOne({ _id: new ObjectId(id), userId: session.user.id })

  if (!budget) {
    return null
  }

  return {
    id: budget._id.toString(),
    categoryId: budget.categoryId,
    amount: budget.amount,
    period: budget.period,
    startDate: budget.startDate,
    endDate: budget.endDate,
    isActive: budget.isActive,
  }
}

export async function getBudgetByCategory(categoryId: string): Promise<Budget | null> {
  const session = await auth()

  if (!session) {
    return null
  }

  const { db } = await connectToDatabase()

  const budget = await db.collection("budgets").findOne({
    categoryId,
    userId: session.user.id,
    isActive: true,
  })

  if (!budget) {
    return null
  }

  return {
    id: budget._id.toString(),
    categoryId: budget.categoryId,
    amount: budget.amount,
    period: budget.period,
    startDate: budget.startDate,
    endDate: budget.endDate,
    isActive: budget.isActive,
  }
}

