"use client"

import { useFinance } from "../contexts/FinanceContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { t } from "../utils/translations"

type ChartsProps = {
  selectedDate: Date
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export default function Charts({ selectedDate }: ChartsProps) {
  const { financeData } = useFinance()

  const year = selectedDate.getFullYear().toString()
  const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0")
  const monthData = financeData[year]?.[month] || { incomes: [], expenses: [] }

  const incomeData = monthData.incomes.map((income) => ({
    name: income.name,
    value: income.amount,
  }))

  const expenseData = monthData.expenses.map((expense) => ({
    name: expense.name,
    value: expense.amount,
  }))

  const monthlyData = Object.entries(financeData[year] || {}).map(([month, data]) => {
    const totalIncome = data.incomes.reduce((sum, income) => sum + income.amount, 0)
    const totalExpense = data.expenses.reduce((sum, expense) => sum + expense.amount, 0)
    return {
      name: month,
      income: totalIncome,
      expense: totalExpense,
      savings: totalIncome - totalExpense,
    }
  })

  const formatCurrency = (value: number) => {
    return value.toLocaleString("da-DK", { style: "currency", currency: "DKK" })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("Monthly Overview")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={formatCurrency} />
              <Legend />
              <Line type="monotone" dataKey="income" name={t("Income")} stroke="#8884d8" />
              <Line type="monotone" dataKey="expense" name={t("Expense")} stroke="#82ca9d" />
              <Line type="monotone" dataKey="savings" name={t("Savings")} stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("Income Distribution")}</CardTitle>
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
      <Card>
        <CardHeader>
          <CardTitle>{t("Expense Distribution")}</CardTitle>
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

