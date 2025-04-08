import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"
import { auth } from "@/lib/auth"
import type { Category } from "@/lib/types"

export async function getCategories(): Promise<Category[]> {
  const session = await auth()

  if (!session) {
    return []
  }

  const { db } = await connectToDatabase()

  const categories = await db.collection("categories").find({ userId: session.user.id }).sort({ name: 1 }).toArray()

  return categories.map((category) => ({
    id: category._id.toString(),
    name: category.name,
    color: category.color,
  }))
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const session = await auth()

  if (!session) {
    return null
  }

  const { db } = await connectToDatabase()

  const category = await db.collection("categories").findOne({ _id: new ObjectId(id), userId: session.user.id })

  if (!category) {
    return null
  }

  return {
    id: category._id.toString(),
    name: category.name,
    color: category.color,
  }
}

