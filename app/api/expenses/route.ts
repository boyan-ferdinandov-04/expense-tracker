import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { z } from "zod"

const expenseSchema = z.object({
  title: z.string().min(2),
  amount: z.number().positive(),
  date: z.string().transform((val) => new Date(val)), 
  category: z.string(),
  description: z.string().optional(),
})

export async function GET() {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const { db } = await connectToDatabase()
    
    const expenses = await db
      .collection("expenses")
      .find({ userId: session.user.id })
      .sort({ date: -1 })
      .toArray()
    
    return NextResponse.json(expenses)
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const body = await req.json()
    console.log("Received expense data:", body)
    
    try {
      const validatedData = expenseSchema.parse(body)
      console.log("Validation passed:", validatedData)
      
      const { db } = await connectToDatabase()
      
      const result = await db.collection("expenses").insertOne({
        ...validatedData,
        userId: session.user.id,
        createdAt: new Date(),
      })
      
      console.log("Expense created with ID:", result.insertedId)
      
      return NextResponse.json(
        { message: "Expense created successfully", id: result.insertedId },
        { status: 201 }
      )
    } catch (validationError) {
      console.error("Validation error:", validationError)
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { message: "Invalid request data", errors: validationError.errors },
          { status: 400 }
        )
      }
      throw validationError
    }
  } catch (error) {
    console.error("Error creating expense:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

