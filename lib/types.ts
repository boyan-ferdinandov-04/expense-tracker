export interface Expense {
  id: string
  title: string
  amount: number
  date: Date
  category: string
  description?: string
}

export interface Category {
  id: string
  name: string
  color?: string
}

export interface Budget {
  id: string
  categoryId: string
  amount: number
  period: "monthly" | "yearly"
  startDate: Date
  endDate?: Date
  isActive: boolean
}

export interface User {
  id: string
  name: string
  email: string
  image?: string
}

