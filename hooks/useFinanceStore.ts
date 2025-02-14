import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FinanceItem = {
  id: string;
  type: "income" | "expense";
  name: string;
  amount: number;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string, optional
  recurrence: "once" | "monthly" | "yearly";
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: string; // ISO date string
};

type MonthlyData = {
  balance: number;
  income: number;
  expenses: number;
  savings: number;
};

type FinanceStore = {
  items: FinanceItem[];
  goals: Goal[];
  monthlyData: Record<string, MonthlyData>; // Key format: "YYYY-MM"
  addItem: (item: Omit<FinanceItem, "id">) => void;
  editItem: (id: string, item: Omit<FinanceItem, "id">) => void;
  deleteItem: (id: string) => void;
  addGoal: (goal: Omit<Goal, "id">) => void;
  editGoal: (id: string, goal: Omit<Goal, "id">) => void;
  deleteGoal: (id: string) => void;
  getBalance: (date: Date) => number;
  getMonthlyData: (year: number, month: number) => MonthlyData;
  recalculateAllBalances: () => void;
};

const useFinanceStore = create<FinanceStore>()(
  persist(
    (set, get) => ({
      items: [],
      goals: [],
      monthlyData: {},

      addItem: (item) => {
        set((state) => ({
          items: [...state.items, { ...item, id: Date.now().toString() }],
        }));
        get().recalculateAllBalances();
      },

      editItem: (id, updatedItem) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updatedItem, id } : item
          ),
        }));
        get().recalculateAllBalances();
      },

      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
        get().recalculateAllBalances();
      },

      addGoal: (goal) =>
        set((state) => ({
          goals: [...state.goals, { ...goal, id: Date.now().toString() }],
        })),

      editGoal: (id, updatedGoal) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, ...updatedGoal, id } : goal
          ),
        })),

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        })),

      getBalance: (date) => {
        const { monthlyData } = get();
        const key = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        return monthlyData[key]?.balance || 0;
      },

      getMonthlyData: (year, month) => {
        const { monthlyData } = get();
        const key = `${year}-${String(month + 1).padStart(2, "0")}`;
        return (
          monthlyData[key] || { balance: 0, income: 0, expenses: 0, savings: 0 }
        );
      },

      recalculateAllBalances: () => {
        const { items } = get();
        const newMonthlyData: Record<string, MonthlyData> = {};

        // Sort items by start date
        const sortedItems = [...items].sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );

        let currentBalance = 0;
        let currentSavings = 0;
        const startDate = new Date(sortedItems[0]?.startDate || new Date());
        startDate.setMonth(startDate.getMonth() - 1); // Start from the month before the first transaction
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 100); // Calculate for one year in the future

        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth();
          const key = `${year}-${String(month + 1).padStart(2, "0")}`;

          let monthlyIncome = 0;
          let monthlyExpenses = 0;
          let monthlySavingsChange = 0;

          sortedItems.forEach((item) => {
            const itemStart = new Date(item.startDate);
            const itemEnd = item.endDate ? new Date(item.endDate) : null;

            if (
              itemStart <= currentDate &&
              (!itemEnd || itemEnd >= currentDate)
            ) {
              if (
                item.recurrence === "once" &&
                itemStart.getFullYear() === year &&
                itemStart.getMonth() === month
              ) {
                if (item.type === "income") {
                  monthlyIncome += item.amount;
                } else if (item.type === "expense") {
                  monthlyExpenses += item.amount;
                } else if (item.type === "savings-deposit") {
                  monthlySavingsChange += item.amount;
                } else if (item.type === "savings-withdrawal") {
                  monthlySavingsChange -= item.amount;
                }
              } else if (
                item.recurrence === "monthly" ||
                (item.recurrence === "yearly" && itemStart.getMonth() === month)
              ) {
                if (item.type === "income") {
                  monthlyIncome += item.amount;
                } else if (item.type === "expense") {
                  monthlyExpenses += item.amount;
                } else if (item.type === "savings-deposit") {
                  monthlySavingsChange += item.amount;
                } else if (item.type === "savings-withdrawal") {
                  monthlySavingsChange -= item.amount;
                }
              }
            }
          });

          currentBalance +=
            monthlyIncome - monthlyExpenses - monthlySavingsChange;
          currentSavings += monthlySavingsChange;

          newMonthlyData[key] = {
            balance: currentBalance,
            income: monthlyIncome,
            expenses: monthlyExpenses,
            savings: currentSavings,
          };

          currentDate.setMonth(currentDate.getMonth() + 1);
        }

        set({ monthlyData: newMonthlyData });
      },
    }),
    {
      name: "finance-store",
    }
  )
);

export default useFinanceStore;
