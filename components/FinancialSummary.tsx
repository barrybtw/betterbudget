"use client";

import { useEffect, useState } from "react";
import useFinanceStore from "../hooks/useFinanceStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "../utils/translations";

type FinancialSummaryProps = {
  selectedDate: Date;
};

export default function FinancialSummary({
  selectedDate,
}: FinancialSummaryProps) {
  const { getMonthlyData, getBalance } = useFinanceStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const monthlyData = getMonthlyData(year, month);
  const totalBalance = getBalance(selectedDate);

  const savingsRate =
    monthlyData.income > 0
      ? ((monthlyData.income - monthlyData.expenses) / monthlyData.income) * 100
      : 0;

  const getRating = () => {
    if (!isClient) return "neutral";
    if (monthlyData.income > monthlyData.expenses && monthlyData.balance > 0)
      return "good";
    if (monthlyData.income < monthlyData.expenses || monthlyData.balance < 0)
      return "bad";
    return "neutral";
  };

  const rating = getRating();

  const getRatingColor = (rating: "good" | "neutral" | "bad") => {
    if (!isClient) return "text-yellow-500";
    switch (rating) {
      case "good":
        return "text-green-500";
      case "neutral":
        return "text-yellow-500";
      case "bad":
        return "text-red-500";
    }
  };

  const formatCurrency = (amount: number) => {
    return isClient
      ? amount.toLocaleString("da-DK", {
          style: "currency",
          currency: "DKK",
        })
      : "0,00 kr.";
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="dark:bg-black">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-white">
            {t("Monthly Income")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">
            {formatCurrency(monthlyData.income)}
          </div>
        </CardContent>
      </Card>
      <Card className="dark:bg-black">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-white">
            {t("Monthly Expenses")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">
            {formatCurrency(monthlyData.expenses)}
          </div>
        </CardContent>
      </Card>
      <Card className="dark:bg-black">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-white">
            {t("Monthly Balance")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">
            {formatCurrency(monthlyData.income - monthlyData.expenses)}
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
            {isClient ? savingsRate.toFixed(2) : "0.00"}%
          </div>
        </CardContent>
      </Card>
      <Card className="dark:bg-black">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-white">
            {t("Total Balance")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">
            {formatCurrency(totalBalance)}
          </div>
        </CardContent>
      </Card>
      <Card className="dark:bg-black">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-white">
            {t("Monthly Rating")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getRatingColor(rating)}`}>
            {t(rating.charAt(0).toUpperCase() + rating.slice(1))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
