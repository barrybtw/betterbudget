"use client";

import { useState, useEffect } from "react";
import MonthSelector from "./MonthSelector";
import IncomeExpenseList from "./IncomeExpenseList";
import FinancialSummary from "./FinancialSummary";
import GoalTracker from "./GoalTracker";
import Charts from "./Charts";
import AddEditItemModal from "./AddEditItemModal";
import { t } from "../utils/translations";
import { useFinance } from "../hooks/useFinance";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function Dashboard() {
  const { financeData, updateGoalProgress } = useFinance();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lastUpdatedDate, setLastUpdatedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { theme, toggleTheme } = useTheme();

  console.log("Dashboard financeData:", financeData);

  useEffect(() => {
    // Initialize lastUpdatedDate from localStorage or use current date
    const storedLastUpdated = localStorage.getItem("lastUpdatedDate");
    if (storedLastUpdated) {
      setLastUpdatedDate(new Date(storedLastUpdated));
    } else {
      const currentDate = new Date();
      setLastUpdatedDate(currentDate);
      localStorage.setItem("lastUpdatedDate", currentDate.toISOString());
    }
  }, []);

  const handleDateChange = (newDate: Date) => {
    const currentYear = lastUpdatedDate.getFullYear();
    const currentMonth = lastUpdatedDate.getMonth();
    const newYear = newDate.getFullYear();
    const newMonth = newDate.getMonth();

    if (
      newYear > currentYear ||
      (newYear === currentYear && newMonth > currentMonth)
    ) {
      // Calculate the number of months to update
      const monthDiff =
        (newYear - currentYear) * 12 + (newMonth - currentMonth);

      // Update goal progress for each month
      for (let i = 1; i <= monthDiff; i++) {
        const updateDate = new Date(currentYear, currentMonth + i, 1);
        const updateYear = updateDate.getFullYear().toString();
        const updateMonth = (updateDate.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        updateGoalProgress(updateYear, updateMonth);
      }

      // Update lastUpdatedDate and store in localStorage
      setLastUpdatedDate(newDate);
      localStorage.setItem("lastUpdatedDate", newDate.toISOString());
    }

    setSelectedDate(newDate);
  };

  return (
    <div className="container mx-auto p-4 dark:bg-black dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("Financial Dashboard")}</h1>
        <Button onClick={toggleTheme} variant="outline" size="icon">
          {theme === "light" ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>
      </div>
      <MonthSelector
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
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
            setEditingItem(null);
          }}
          editingItem={editingItem}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}
