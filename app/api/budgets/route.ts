import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { z } from "zod"

const budgetSchema = z.object({
  categoryId: z.string().min(1),
  amount: z.number().positive(),
  period: z.enum(["monthly", "yearly"]),
  startDate: z.date(),
  isActive: z.boolean().default(true),
})

export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    const budgets = await db.collection("budgets").find({ userId: session.user.id }).sort({ startDate: -1 }).toArray()

    return NextResponse.json(budgets)
  } catch (error) {
    console.error("Error fetching budgets:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = budgetSchema.parse(body)

    const { db } = await connectToDatabase()

    // Check if a budget for this category already exists
    const existingBudget = await db.collection("budgets").findOne({
      categoryId: validatedData.categoryId,
      userId: session.user.id,
      isActive: true,
    })

    if (existingBudget) {
      return NextResponse.json({ message: "An active budget for this category already exists" }, { status: 409 })
    }

    const result = await db.collection("budgets").insertOne({
      ...validatedData,
      userId: session.user.id,
      createdAt: new Date(),
    })

    return NextResponse.json({ message: "Budget created successfully", id: result.insertedId }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid request data", errors: error.errors }, { status: 400 })
    }

    console.error("Error creating budget:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

