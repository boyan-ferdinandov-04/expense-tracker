import type React from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a href="/dashboard" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">ExpenseTracker</span>
            </a>
            <nav className="flex items-center space-x-4 text-sm font-medium">
              <a href="/dashboard" className="transition-colors hover:text-foreground/80">
                Dashboard
              </a>
              <a href="/dashboard/expenses" className="transition-colors hover:text-foreground/80">
                Expenses
              </a>
              <a href="/dashboard/categories" className="transition-colors hover:text-foreground/80">
                Categories
              </a>
              <a href="/dashboard/reports" className="transition-colors hover:text-foreground/80">
                Reports
              </a>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <UserNav user={session.user} />
          </div>
        </div>
      </header>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="hidden md:block md:w-1/5">
            <DashboardNav />
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  )
}

