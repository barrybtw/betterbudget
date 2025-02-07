"use client";

import { useState } from "react";
import MonthSelector from "./MonthSelector";
import IncomeExpenseList from "./IncomeExpenseList";
import FinancialSummary from "./FinancialSummary";
import GoalTracker from "./GoalTracker";
import Charts from "./Charts";
import AddEditItemModal from "./AddEditItemModal";
import { t } from "../utils/translations";
import { useFinance } from "../hooks/useFinance";
import { IncomeExpense } from "@/contexts/FinanceContext";

export default function Dashboard() {
  const { financeData } = useFinance();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IncomeExpense>(
    null as any as IncomeExpense
  );

  console.log("Dashboard financeData:", financeData);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{t("Financial Dashboard")}</h1>
      <MonthSelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <IncomeExpenseList
            selectedDate={selectedDate}
            onAddItem={() => setIsModalOpen(true)}
            onEditItem={(item) => {
              setEditingItem(item);
              setIsModalOpen(true);
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
            setIsModalOpen(false);
            setEditingItem(null as any as IncomeExpense);
          }}
          editingItem={editingItem}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}
