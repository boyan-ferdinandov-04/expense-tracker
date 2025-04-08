import { notFound } from "next/navigation"
import { getCategoryById } from "@/lib/categories"
import { CategoryForm } from "@/components/category-form"

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryById(params.id)

  if (!category) {
    notFound()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Edit Category</h2>
      <CategoryForm category={category} />
    </div>
  )
}