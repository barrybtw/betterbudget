import { useFinance } from "../contexts/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "../utils/translations";

type FinancialSummaryProps = {
  selectedDate: Date;
};

export default function FinancialSummary({
  selectedDate,
}: FinancialSummaryProps) {
  const { financeData } = useFinance();

  const year = selectedDate.getFullYear().toString();
  const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
  const monthData = financeData[year]?.[month] || { incomes: [], expenses: [] };

  const totalIncome = monthData.incomes.reduce(
    (sum, income) => sum + income.amount,
    0
  );
  const totalExpense = monthData.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const netIncome = totalIncome - totalExpense;
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="dark:bg-black">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-white">
            {t("Total Income")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">
            {totalIncome.toLocaleString("da-DK", {
              style: "currency",
              currency: "DKK",
            })}
          </div>
        </CardContent>
      </Card>
      <Card className="dark:bg-black">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-white">
            {t("Total Expenses")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">
            {totalExpense.toLocaleString("da-DK", {
              style: "currency",
              currency: "DKK",
            })}
          </div>
        </CardContent>
      </Card>
      <Card className="dark:bg-black">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-white">
            {t("Net Income")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">
            {netIncome.toLocaleString("da-DK", {
              style: "currency",
              currency: "DKK",
            })}
          </div>
        </CardContent>
      </Card>
      <Card className="dark:bg-black">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-white">
            {t("Savings Rate")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">
            {savingsRate.toFixed(2)}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
