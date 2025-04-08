import { Skeleton } from "@/components/ui/skeleton"

export function ExpenseSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Skeleton className="h-5 w-[70px]" />
            <Skeleton className="h-5 w-[60px]" />
          </div>
        </div>
      ))}
    </div>
  )
}

