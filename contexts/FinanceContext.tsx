"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type Recurrence = "once" | "monthly" | "quarterly" | "yearly";

export type IncomeExpense = {
  id: string;
  type: "income" | "expense";
  name: string;
  amount: number;
  recurrence: Recurrence;
  endDate?: string;
};

export type Goal = {
  id: string;
  name: string;
  amount: number;
  targetDate: string;
  monthlySavings: number;
  currentSavings: number;
};

export type FinanceData = {
  [year: string]: {
    [month: string]: {
      incomes: IncomeExpense[];
      expenses: IncomeExpense[];
      balance: number;
      savings: number;
      rating: "good" | "neutral" | "bad";
    };
  };
};

export type FinanceContextType = {
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
  setInitialBalance: (balance: number) => void;
  getMonthlyRating: (year: string, month: string) => "good" | "neutral" | "bad";
  addToSavings: (year: string, month: string, amount: number) => void;
  withdrawFromSavings: (year: string, month: string, amount: number) => void;
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
        newData[year][month] = {
          incomes: [],
          expenses: [],
          balance: 0,
          savings: 0,
          rating: "neutral",
        };
      newData[year][month][`${item.type}s`].push(item);

      // Update balance for the current month and all future months
      const updateBalance = (y: string, m: string) => {
        if (!newData[y]) newData[y] = {};
        if (!newData[y][m])
          newData[y][m] = {
            incomes: [],
            expenses: [],
            balance: 0,
            savings: 0,
            rating: "neutral",
          };
        const prevBalance =
          y === year && m === month
            ? newData[y][m].balance
            : getPreviousMonthBalance(newData, y, m);
        const monthIncomes = newData[y][m].incomes.reduce(
          (sum, income) => sum + income.amount,
          0
        );
        const monthExpenses = newData[y][m].expenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );
        newData[y][m].balance = prevBalance + monthIncomes - monthExpenses;
        newData[y][m].rating = getMonthlyRating(y, m);
      };

      updateBalance(year, month);
      console.log(
        `Added item for ${year}-${month}:`,
        item,
        "Updated data:",
        newData[year][month]
      );

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
          : new Date(2099, 11, 31);

        while (nextDate <= endDate) {
          nextDate.setMonth(nextDate.getMonth() + monthsToAdd);
          if (nextDate > endDate) break;

          const nextYear = nextDate.getFullYear().toString();
          const nextMonth = (nextDate.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          if (!newData[nextYear]) newData[nextYear] = {};
          if (!newData[nextYear][nextMonth])
            newData[nextYear][nextMonth] = {
              incomes: [],
              expenses: [],
              balance: 0,
              savings: 0,
              rating: "neutral",
            };
          newData[nextYear][nextMonth][`${item.type}s`].push({
            ...item,
            id: `${item.id}-${nextYear}-${nextMonth}`,
          });

          updateBalance(nextYear, nextMonth);
        }
      }

      console.log("Updated finance data:", newData);
      return newData;
    });
  };

  const editItem = (year: string, month: string, item: IncomeExpense) => {
    setFinanceData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const items = newData[year][month][`${item.type}s`];
      const index = items.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        const oldItem = items[index];
        items[index] = item;

        // Update balance for the current month and all future months
        const updateBalance = (
          y: string,
          m: string,
          oldAmount: number,
          newAmount: number
        ) => {
          if (!newData[y]) newData[y] = {};
          if (!newData[y][m])
            newData[y][m] = {
              incomes: [],
              expenses: [],
              balance: 0,
              savings: 0,
              rating: "neutral",
            };
          const prevBalance =
            y === year && m === month
              ? newData[y][m].balance
              : getPreviousMonthBalance(newData, y, m);
          const monthIncomes = newData[y][m].incomes.reduce(
            (sum, income) => sum + income.amount,
            0
          );
          const monthExpenses = newData[y][m].expenses.reduce(
            (sum, expense) => sum + expense.amount,
            0
          );
          newData[y][m].balance = prevBalance + monthIncomes - monthExpenses;
          newData[y][m].rating = getMonthlyRating(y, m);
        };

        updateBalance(year, month, oldItem.amount, item.amount);
        console.log(
          `Edited item for ${year}-${month}:`,
          item,
          "Updated data:",
          newData[year][month]
        );

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
            : new Date(2099, 11, 31);

          // First, remove all future occurrences
          Object.keys(newData).forEach((y) => {
            Object.keys(newData[y]).forEach((m) => {
              if (y > year || (y === year && m > month)) {
                const removedItem = newData[y][m][`${item.type}s`].find((i) =>
                  i.id.startsWith(item.id)
                );
                newData[y][m][`${item.type}s`] = newData[y][m][
                  `${item.type}s`
                ].filter((i) => !i.id.startsWith(item.id));
                if (removedItem) {
                  updateBalance(y, m, removedItem.amount, 0);
                }
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
              newData[nextYear][nextMonth] = {
                incomes: [],
                expenses: [],
                balance: 0,
                savings: 0,
                rating: "neutral",
              };
            newData[nextYear][nextMonth][`${item.type}s`].push({
              ...item,
              id: `${item.id}-${nextYear}-${nextMonth}`,
            });

            updateBalance(nextYear, nextMonth, 0, item.amount);
          }
        }
      }
      console.log("Updated finance data:", newData);
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
      const deletedItem = newData[year][month][`${type}s`].find(
        (item) => item.id === id
      );
      newData[year][month][`${type}s`] = newData[year][month][
        `${type}s`
      ].filter((item) => item.id !== id);

      // Update balance for the current month and all future months
      const updateBalance = (y: string, m: string, amount: number) => {
        if (!newData[y]) newData[y] = {};
        if (!newData[y][m])
          newData[y][m] = {
            incomes: [],
            expenses: [],
            balance: 0,
            savings: 0,
            rating: "neutral",
          };
        const prevBalance =
          y === year && m === month
            ? newData[y][m].balance
            : getPreviousMonthBalance(newData, y, m);
        const monthIncomes = newData[y][m].incomes.reduce(
          (sum, income) => sum + income.amount,
          0
        );
        const monthExpenses = newData[y][m].expenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );
        newData[y][m].balance = prevBalance + monthIncomes - monthExpenses;
        newData[y][m].rating = getMonthlyRating(y, m);
      };

      if (deletedItem) {
        updateBalance(year, month, deletedItem.amount);
        console.log(
          `Deleted item for ${year}-${month}:`,
          id,
          type,
          "Updated data:",
          newData[year][month]
        );

        // Handle recurring items
        if (deletedItem.recurrence !== "once") {
          Object.keys(newData).forEach((y) => {
            Object.keys(newData[y]).forEach((m) => {
              if (y > year || (y === year && m > month)) {
                const deletedFutureItem = newData[y][m][`${type}s`].find(
                  (item) => item.id.startsWith(id)
                );
                newData[y][m][`${type}s`] = newData[y][m][`${type}s`].filter(
                  (item) => !item.id.startsWith(id)
                );
                if (deletedFutureItem) {
                  updateBalance(y, m, deletedFutureItem.amount);
                }
              }
            });
          });
        }
      }

      console.log("Updated finance data:", newData);
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

  const setInitialBalance = (balance: number) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");

    setFinanceData((prev) => {
      const newData = { ...prev };
      if (!newData[year]) newData[year] = {};
      if (!newData[year][month])
        newData[year][month] = {
          incomes: [],
          expenses: [],
          balance: 0,
          savings: 0,
          rating: "neutral",
        };
      newData[year][month].balance = balance;
      newData[year][month].rating = getMonthlyRating(year, month);

      // Set the initial balance for all future months
      Object.keys(newData).forEach((y) => {
        if (y >= year) {
          Object.keys(newData[y]).forEach((m) => {
            if (y > year || (y === year && m >= month)) {
              if (!newData[y][m])
                newData[y][m] = {
                  incomes: [],
                  expenses: [],
                  balance: 0,
                  savings: 0,
                  rating: "neutral",
                };
              const prevBalance = getPreviousMonthBalance(newData, y, m);
              const monthIncomes = newData[y][m].incomes.reduce(
                (sum, income) => sum + income.amount,
                0
              );
              const monthExpenses = newData[y][m].expenses.reduce(
                (sum, expense) => sum + expense.amount,
                0
              );
              newData[y][m].balance =
                prevBalance + monthIncomes - monthExpenses;
              newData[y][m].rating = getMonthlyRating(y, m);
              console.log(`Set balance for ${y}-${m}:`, newData[y][m].balance);
            }
          });
        }
      });

      console.log("Set initial balance:", balance, newData);
      return newData;
    });
  };

  const getMonthlyRating = (
    year: string,
    month: string
  ): "good" | "neutral" | "bad" => {
    const monthData = financeData[year]?.[month];
    if (!monthData) return "neutral";

    const totalIncome = monthData.incomes.reduce(
      (sum, income) => sum + income.amount,
      0
    );
    const totalExpense = monthData.expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const netIncome = totalIncome - totalExpense;

    if (netIncome > 0 && monthData.balance > 0) return "good";
    if (netIncome < 0 || monthData.balance < 0) return "bad";
    return "neutral";
  };

  const getPreviousMonthBalance = (
    data: FinanceData,
    year: string,
    month: string
  ): number => {
    const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1);
    date.setMonth(date.getMonth() - 1);
    const prevYear = date.getFullYear().toString();
    const prevMonth = (date.getMonth() + 1).toString().padStart(2, "0");
    const prevBalance = data[prevYear]?.[prevMonth]?.balance || 0;
    console.log(`Previous month balance for ${year}-${month}:`, prevBalance);
    return prevBalance;
  };

  const addToSavings = (year: string, month: string, amount: number) => {
    setFinanceData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      if (!newData[year]) newData[year] = {};
      if (!newData[year][month])
        newData[year][month] = {
          incomes: [],
          expenses: [],
          balance: 0,
          savings: 0,
          rating: "neutral",
        };

      newData[year][month].balance -= amount;
      newData[year][month].savings += amount;
      newData[year][month].rating = getMonthlyRating(year, month);

      return newData;
    });
  };

  const withdrawFromSavings = (year: string, month: string, amount: number) => {
    setFinanceData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      if (!newData[year]) newData[year] = {};
      if (!newData[year][month])
        newData[year][month] = {
          incomes: [],
          expenses: [],
          balance: 0,
          savings: 0,
          rating: "neutral",
        };

      if (newData[year][month].savings >= amount) {
        newData[year][month].balance += amount;
        newData[year][month].savings -= amount;
        newData[year][month].rating = getMonthlyRating(year, month);
      } else {
        console.error("Insufficient savings");
      }

      return newData;
    });
  };

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
        setInitialBalance,
        getMonthlyRating,
        addToSavings,
        withdrawFromSavings,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
