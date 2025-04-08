"use client"

import { useState, useEffect } from "react"
import type { Budget } from "@/lib/types"

export function useBudgetsData() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchBudgets() {
      try {
        const response = await fetch("/api/budgets")

        if (!response.ok) {
          throw new Error("Failed to fetch budgets")
        }

        const data = await response.json()

        // Convert date strings to Date objects
        const formattedBudgets = data.map((budget: any) => ({
          ...budget,
          id: budget._id,
          startDate: new Date(budget.startDate),
          endDate: budget.endDate ? new Date(budget.endDate) : undefined,
        }))

        setBudgets(formattedBudgets)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchBudgets()
  }, [])

  return { budgets, isLoading, error }
}

