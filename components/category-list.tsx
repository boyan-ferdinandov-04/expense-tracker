import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { DeleteCategoryButton } from "@/components/delete-category-button"
import { getCategories } from "@/lib/categories" // Import the real getCategories function

export async function CategoryList() {
  const categories = await getCategories()

  if (!categories.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No categories found.</p>
        <p className="text-sm text-muted-foreground">Add a category to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                {category.name}
              </div>
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" asChild>
                <a href={`/dashboard/categories/${category.id}`}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </a>
              </Button>
              <DeleteCategoryButton id={category.id} />
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>Used in 12 expenses</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

