"use client"

import { useState } from "react"
import { useFinance } from "../contexts/FinanceContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2 } from "lucide-react"
import { t } from "../utils/translations"

export default function GoalTracker() {
  const { goals, addGoal, editGoal, deleteGoal } = useFinance()
  const [newGoal, setNewGoal] = useState({ name: "", amount: "", targetDate: "" })
  const [editingGoal, setEditingGoal] = useState(null)

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.amount && newGoal.targetDate) {
      addGoal({
        id: Date.now().toString(),
        ...newGoal,
        amount: Number.parseFloat(newGoal.amount),
      })
      setNewGoal({ name: "", amount: "", targetDate: "" })
    }
  }

  const handleEditGoal = (goal) => {
    setEditingGoal(goal)
    setNewGoal(goal)
  }

  const handleUpdateGoal = () => {
    if (editingGoal) {
      editGoal({
        ...editingGoal,
        ...newGoal,
        amount: Number.parseFloat(newGoal.amount),
      })
      setEditingGoal(null)
      setNewGoal({ name: "", amount: "", targetDate: "" })
    }
  }

  const handleDeleteGoal = (id) => {
    deleteGoal(id)
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{t("Goal Tracker")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder={t("Goal name")}
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder={t("Amount")}
              value={newGoal.amount}
              onChange={(e) => setNewGoal({ ...newGoal, amount: e.target.value })}
            />
            <Input
              type="date"
              value={newGoal.targetDate}
              onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
            />
            <Button onClick={editingGoal ? handleUpdateGoal : handleAddGoal}>
              {editingGoal ? t("Update Goal") : t("Add Goal")}
            </Button>
          </div>
          <ul className="space-y-2">
            {goals.map((goal) => (
              <li key={goal.id} className="flex justify-between items-center bg-blue-100 p-2 rounded">
                <span>{goal.name}</span>
                <div>
                  <span className="mr-4">
                    {goal.amount.toLocaleString("da-DK", { style: "currency", currency: "DKK" })} {t("by")}{" "}
                    {new Date(goal.targetDate).toLocaleDateString("da-DK")}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => handleEditGoal(goal)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteGoal(goal.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

