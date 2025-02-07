"use client"
import { FinanceProvider } from "../contexts/FinanceContext"
import Dashboard from "../components/Dashboard"

export default function Home() {
  return (
    <FinanceProvider>
      <Dashboard />
    </FinanceProvider>
  )
}

