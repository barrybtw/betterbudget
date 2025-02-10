"use client";

import { createContext, useContext, useState, useEffect } from "react";

type IncomeExpense = {
  id: string;
  type: "income" | "expense";
  name: string;
  amount: number;
  recurrence: "once" | "monthly" | "quarterly" | "yearly";
  endDate?: string; // Optional end date for recurring items
};

type Goal = {
  id: string;
  name: string;
  amount: number;
  targetDate: string;
  monthlySavings: number;
  currentSavings: number;
};

type FinanceData = {
  [year: string]: {
    [month: string]: {
      incomes: IncomeExpense[];
      expenses: IncomeExpense[];
    };
  };
};

type FinanceContextType = {
  financeData: FinanceData;
  goals: Goal[];
  addItem: (year: string, month: string, item: IncomeExpense) => void;
  editItem: (year: string, month: string, item: IncomeExpense) => void;
  deleteItem: (
    year: string,
    month: string,
    id: string,
    type: "income" | "expense"
  ) => void;
  addGoal: (goal: Goal) => void;
  editGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  updateGoalProgress: (year: string, month: string) => void;
};

export const FinanceContext = createContext<FinanceContextType | undefined>(
  undefined
);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [financeData, setFinanceData] = useState<FinanceData>({});
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem("financeData");
    const storedGoals = localStorage.getItem("goals");
    if (storedData) {
      try {
        setFinanceData(JSON.parse(storedData));
      } catch (error) {
        console.error("Error parsing financeData from localStorage:", error);
      }
    }
    if (storedGoals) {
      try {
        setGoals(JSON.parse(storedGoals));
      } catch (error) {
        console.error("Error parsing goals from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(financeData).length > 0) {
      localStorage.setItem("financeData", JSON.stringify(financeData));
    }
  }, [financeData]);

  useEffect(() => {
    if (goals.length > 0) localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const addItem = (year: string, month: string, item: IncomeExpense) => {
    setFinanceData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      if (!newData[year]) newData[year] = {};
      if (!newData[year][month])
        newData[year][month] = { incomes: [], expenses: [] };
      newData[year][month][`${item.type}s`].push(item);

      // Handle recurring items
      if (item.recurrence !== "once") {
        const monthsToAdd =
          item.recurrence === "monthly"
            ? 1
            : item.recurrence === "quarterly"
            ? 3
            : 12;
        const nextDate = new Date(
          Number.parseInt(year),
          Number.parseInt(month) - 1,
          1
        );
        const endDate = item.endDate
          ? new Date(item.endDate)
          : new Date(2099, 11, 31); // Set a far future date if no end date

        while (nextDate <= endDate) {
          nextDate.setMonth(nextDate.getMonth() + monthsToAdd);
          if (nextDate > endDate) break;

          const nextYear = nextDate.getFullYear().toString();
          const nextMonth = (nextDate.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          if (!newData[nextYear]) newData[nextYear] = {};
          if (!newData[nextYear][nextMonth])
            newData[nextYear][nextMonth] = { incomes: [], expenses: [] };
          newData[nextYear][nextMonth][`${item.type}s`].push({
            ...item,
            id: `${item.id}-${nextYear}-${nextMonth}`,
          });
        }
      }

      return newData;
    });
  };

  const editItem = (year: string, month: string, item: IncomeExpense) => {
    setFinanceData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const items = newData[year][month][`${item.type}s`];
      const index = items.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        items[index] = item;

        // Handle recurring items
        if (item.recurrence !== "once") {
          const monthsToAdd =
            item.recurrence === "monthly"
              ? 1
              : item.recurrence === "quarterly"
              ? 3
              : 12;
          const nextDate = new Date(
            Number.parseInt(year),
            Number.parseInt(month) - 1,
            1
          );
          const endDate = item.endDate
            ? new Date(item.endDate)
            : new Date(2099, 11, 31); // Set a far future date if no end date

          // First, remove all future occurrences
          Object.keys(newData).forEach((y) => {
            Object.keys(newData[y]).forEach((m) => {
              if (y > year || (y === year && m > month)) {
                newData[y][m][`${item.type}s`] = newData[y][m][
                  `${item.type}s`
                ].filter((i) => !i.id.startsWith(item.id));
              }
            });
          });

          // Then, add updated occurrences
          while (nextDate <= endDate) {
            nextDate.setMonth(nextDate.getMonth() + monthsToAdd);
            if (nextDate > endDate) break;

            const nextYear = nextDate.getFullYear().toString();
            const nextMonth = (nextDate.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            if (!newData[nextYear]) newData[nextYear] = {};
            if (!newData[nextYear][nextMonth])
              newData[nextYear][nextMonth] = { incomes: [], expenses: [] };
            newData[nextYear][nextMonth][`${item.type}s`].push({
              ...item,
              id: `${item.id}-${nextYear}-${nextMonth}`,
            });
          }
        }
      }
      return newData;
    });
  };

  const deleteItem = (
    year: string,
    month: string,
    id: string,
    type: "income" | "expense"
  ) => {
    setFinanceData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      newData[year][month][`${type}s`] = newData[year][month][
        `${type}s`
      ].filter((item) => item.id !== id);

      // Handle recurring items
      Object.keys(newData).forEach((y) => {
        Object.keys(newData[y]).forEach((m) => {
          if (y > year || (y === year && m > month)) {
            newData[y][m][`${type}s`] = newData[y][m][`${type}s`].filter(
              (item) => !item.id.startsWith(id)
            );
          }
        });
      });

      return newData;
    });
  };

  const addGoal = (goal: Goal) => {
    setGoals((prev) => [...prev, { ...goal, currentSavings: 0 }]);
  };

  const editGoal = (goal: Goal) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goal.id ? { ...goal, currentSavings: g.currentSavings } : g
      )
    );
  };

  const deleteGoal = (id: string) => {
    const newGoals = goals.filter((g) => g.id !== id);
    localStorage.setItem("goals", JSON.stringify(newGoals));
    setGoals(newGoals);
  };

  const updateGoalProgress = (year: string, month: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        const newSavings = goal.currentSavings + goal.monthlySavings;
        return {
          ...goal,
          currentSavings: newSavings > goal.amount ? goal.amount : newSavings,
        };
      })
    );
  };

  console.log("Current financeData:", financeData);

  return (
    <FinanceContext.Provider
      value={{
        financeData,
        goals,
        addItem,
        editItem,
        deleteItem,
        addGoal,
        editGoal,
        deleteGoal,
        updateGoalProgress,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
