"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { t } from "../utils/translations";
import useFinanceStore from "@/hooks/useFinanceStore";

export default function GoalTracker() {
  const { goals, addGoal, editGoal, deleteGoal } = useFinanceStore();
  const [newGoal, setNewGoal] = useState({
    name: "",
    amount: "",
    targetDate: "",
  });
  const [editingGoal, setEditingGoal] = useState(null);

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.amount && newGoal.targetDate) {
      addGoal({
        ...newGoal,
        targetAmount: Number.parseFloat(newGoal.amount),
        targetDate: newGoal.targetDate,
        name: newGoal.name,
      });
      setNewGoal({ name: "", amount: "", targetDate: "" });
    }
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setNewGoal({
      name: goal.name,
      amount: goal.amount.toString(),
      targetDate: goal.targetDate,
    });
  };

  const handleUpdateGoal = () => {
    if (editingGoal) {
      editGoal(editingGoal.id, {
        ...editingGoal,
        ...newGoal,
        amount: Number.parseFloat(newGoal.amount),
      });
      setEditingGoal(null);
      setNewGoal({ name: "", amount: "", targetDate: "" });
    }
  };

  const handleDeleteGoal = (id: string) => {
    deleteGoal(id);
  };

  return (
    <Card className="mt-6 dark:bg-black">
      <CardHeader>
        <CardTitle className="dark:text-white">{t("Goal Tracker")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder={t("Goal name")}
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder={t("Target Amount")}
              value={newGoal.amount}
              onChange={(e) =>
                setNewGoal({ ...newGoal, amount: e.target.value })
              }
            />
            <Input
              type="date"
              value={newGoal.targetDate}
              className="col-span-2"
              onChange={(e) =>
                setNewGoal({ ...newGoal, targetDate: e.target.value })
              }
            />
          </div>
          <Button
            onClick={editingGoal ? handleUpdateGoal : handleAddGoal}
            className="w-full"
          >
            {editingGoal ? t("Update Goal") : t("Add Goal")}
          </Button>
          <ul className="space-y-4">
            {goals.map((goal) => (
              <li
                key={goal.id}
                className="bg-gray-100 dark:bg-black p-4 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold dark:text-white">
                    {goal.name}
                  </span>
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditGoal(goal)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm dark:text-gray-300 mb-2">
                  {t("Target")}:{" "}
                  {goal.targetAmount.toLocaleString("da-DK", {
                    style: "currency",
                    currency: "DKK",
                  })}{" "}
                  {t("by")}{" "}
                  {new Date(goal.targetDate).toLocaleDateString("da-DK")}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
