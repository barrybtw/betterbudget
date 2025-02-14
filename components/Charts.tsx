"use client"

import { useEffect, useState } from "react"
import useFinanceStore from "../hooks/useFinanceStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { t } from "../utils/translations"

type ChartsProps = {
  selectedDate: Date
}

const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#2dd4bf"]

export default function Charts({ selectedDate }: ChartsProps) {
  const { getMonthlyData, items } = useFinanceStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth()

  const incomeData = items
    .filter((item) => {
      const itemDate = new Date(item.startDate)
      return (
        item.type === "income" &&
        ((itemDate.getFullYear() === year && itemDate.getMonth() === month) ||
          item.recurrence === "monthly" ||
          (item.recurrence === "yearly" && itemDate.getMonth() === month)) &&
        (!item.endDate || new Date(item.endDate) >= selectedDate)
      )
    })
    .map((income) => ({
      name: income.name,
      value: income.amount,
    }))

  const expenseData = items
    .filter((item) => {
      const itemDate = new Date(item.startDate)
      return (
        item.type === "expense" &&
        ((itemDate.getFullYear() === year && itemDate.getMonth() === month) ||
          item.recurrence === "monthly" ||
          (item.recurrence === "yearly" && itemDate.getMonth() === month)) &&
        (!item.endDate || new Date(item.endDate) >= selectedDate)
      )
    })
    .map((expense) => ({
      name: expense.name,
      value: expense.amount,
    }))

  const formatCurrency = (value: number) => {
    return isClient
      ? value.toLocaleString("da-DK", {
          style: "currency",
          currency: "DKK",
        })
      : "0,00 kr."
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <Card className="dark:bg-black">
        <CardHeader>
          <CardTitle className="dark:text-white">{t("Income Distribution")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incomeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {incomeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="dark:bg-black">
        <CardHeader>
          <CardTitle className="dark:text-white">{t("Expense Distribution")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#82ca9d"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

