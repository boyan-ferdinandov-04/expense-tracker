import { Suspense } from "react"
import { CategoryList } from "@/components/category-list"
import { CategorySkeleton } from "@/components/category-skeleton"
import { AddCategoryButton } from "@/components/add-category-button"

export default function CategoriesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
        <AddCategoryButton />
      </div>
      <Suspense fallback={<CategorySkeleton />}>
        <CategoryList />
      </Suspense>
    </div>
  )
}

