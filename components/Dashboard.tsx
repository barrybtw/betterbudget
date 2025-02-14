"use client"

import { useState } from "react"
import MonthSelector from "./MonthSelector"
import IncomeExpenseList from "./IncomeExpenseList"
import FinancialSummary from "./FinancialSummary"
import GoalTracker from "./GoalTracker"
import Charts from "./Charts"
import AddEditItemModal from "./AddEditItemModal"
import SavingsTransactionModal from "./SavingsTransactionModal"
import { t } from "../utils/translations"
import { useTheme } from "./ThemeProvider"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false)
  const [savingsTransactionType, setSavingsTransactionType] = useState<"deposit" | "withdraw">("deposit")
  const { theme, toggleTheme } = useTheme()

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate)
  }

  const handleSavingsTransaction = (type: "deposit" | "withdraw") => {
    setSavingsTransactionType(type)
    setIsSavingsModalOpen(true)
  }

  return (
    <div className="container mx-auto p-4 dark:bg-black dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("Financial Dashboard")}</h1>
        <div className="flex space-x-2">
          <Button onClick={() => handleSavingsTransaction("deposit")} variant="outline">
            {t("Deposit to Savings")}
          </Button>
          <Button onClick={() => handleSavingsTransaction("withdraw")} variant="outline">
            {t("Withdraw from Savings")}
          </Button>
          <Button onClick={toggleTheme} variant="outline" size="icon">
            {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
        </div>
      </div>
      <MonthSelector selectedDate={selectedDate} onDateChange={handleDateChange} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <IncomeExpenseList
            selectedDate={selectedDate}
            onAddItem={() => setIsModalOpen(true)}
            onEditItem={(item) => {
              setEditingItem(item)
              setIsModalOpen(true)
            }}
          />
        </div>
        <div>
          <FinancialSummary selectedDate={selectedDate} />
          <GoalTracker />
        </div>
      </div>
      <Charts selectedDate={selectedDate} />
      {isModalOpen && (
        <AddEditItemModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingItem(null)
          }}
          editingItem={editingItem}
          selectedDate={selectedDate}
        />
      )}
      <SavingsTransactionModal
        isOpen={isSavingsModalOpen}
        onClose={() => setIsSavingsModalOpen(false)}
        type={savingsTransactionType}
        selectedDate={selectedDate}
      />
    </div>
  )
}

