import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { z } from "zod"

const categorySchema = z.object({
  name: z.string().min(2),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
})

export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    const categories = await db.collection("categories").find({ userId: session.user.id }).sort({ name: 1 }).toArray()

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
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
    const validatedData = categorySchema.parse(body)

    const { db } = await connectToDatabase()

    // Check if category already exists
    const existingCategory = await db.collection("categories").findOne({
      name: validatedData.name,
      userId: session.user.id,
    })

    if (existingCategory) {
      return NextResponse.json({ message: "Category with this name already exists" }, { status: 409 })
    }

    const result = await db.collection("categories").insertOne({
      ...validatedData,
      userId: session.user.id,
      createdAt: new Date(),
    })

    return NextResponse.json({ message: "Category created successfully", id: result.insertedId }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid request data", errors: error.errors }, { status: 400 })
    }

    console.error("Error creating category:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

