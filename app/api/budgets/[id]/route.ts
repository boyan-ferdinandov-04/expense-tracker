import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
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

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    const budget = await db.collection("budgets").findOne({
      _id: new ObjectId(params.id),
      userId: session.user.id,
    })

    if (!budget) {
      return NextResponse.json({ message: "Budget not found" }, { status: 404 })
    }

    return NextResponse.json(budget)
  } catch (error) {
    console.error("Error fetching budget:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = budgetSchema.parse(body)

    const { db } = await connectToDatabase()

    // Check if another budget for this category already exists
    if (validatedData.isActive) {
      const existingBudget = await db.collection("budgets").findOne({
        categoryId: validatedData.categoryId,
        userId: session.user.id,
        _id: { $ne: new ObjectId(params.id) },
        isActive: true,
      })

      if (existingBudget) {
        return NextResponse.json({ message: "Another active budget for this category already exists" }, { status: 409 })
      }
    }

    const result = await db.collection("budgets").updateOne(
      {
        _id: new ObjectId(params.id),
        userId: session.user.id,
      },
      {
        $set: {
          ...validatedData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Budget not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Budget updated successfully" }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid request data", errors: error.errors }, { status: 400 })
    }

    console.error("Error updating budget:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("budgets").deleteOne({
      _id: new ObjectId(params.id),
      userId: session.user.id,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Budget not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Budget deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting budget:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

