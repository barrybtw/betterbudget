"use client";

import { useState, useEffect } from "react";
import { IncomeExpense, useFinance } from "../contexts/FinanceContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { t } from "../utils/translations";

type AddEditItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingItem: any;
  selectedDate: Date;
};

export default function AddEditItemModal({
  isOpen,
  onClose,
  editingItem,
  selectedDate,
}: AddEditItemModalProps) {
  const { addItem, editItem } = useFinance();
  const [item, setItem] = useState({
    id: "",
    type: "income",
    name: "",
    amount: "",
    recurrence: "once",
    endDate: "",
  });
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setItem({
        ...editingItem,
        amount: editingItem.amount.toString(),
      });
    } else {
      setItem({
        id: "",
        type: "income",
        name: "",
        amount: "",
        recurrence: "once",
        endDate: "",
      });
    }
  }, [editingItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const year = selectedDate.getFullYear().toString();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");

    const newItem = {
      ...item,
      amount: Number.parseFloat(item.amount) || 0,
      id: editingItem ? item.id : Date.now().toString(),
    };

    if (newItem.type !== "income" && newItem.type !== "expense") {
      return;
    }

    if (editingItem) {
      editItem(year, month, newItem as IncomeExpense);
    } else {
      addItem(year, month, newItem as IncomeExpense);
    }
    onClose();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setItem({ ...item, amount: value });
    }
  };

  const handleAmountFocus = () => {
    setIsFocused(true);
  };

  const handleAmountBlur = () => {
    setIsFocused(false);
    if (item.amount === "") {
      setItem({ ...item, amount: "0" });
    } else {
      // Ensure the amount is a valid number with at most 2 decimal places
      const formattedAmount = Number.parseFloat(item.amount).toFixed(2);
      setItem({ ...item, amount: formattedAmount });
    }
  };

  const formatAmount = (amount: string) => {
    const num = Number.parseFloat(amount);
    if (isNaN(num)) return "";
    return num.toLocaleString("da-DK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingItem ? t("Edit Income/Expense") : t("Add Income/Expense")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="type">{t("Type")}</Label>
              <Select
                value={item.type}
                onValueChange={(value) =>
                  setItem({ ...item, type: value as "income" | "expense" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("Select type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">{t("Income")}</SelectItem>
                  <SelectItem value="expense">{t("Expense")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="name">{t("Name")}</Label>
              <Input
                id="name"
                value={item.name}
                onChange={(e) => setItem({ ...item, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="amount">{t("Amount")} (DKK)</Label>
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                value={isFocused ? item.amount : formatAmount(item.amount)}
                onChange={handleAmountChange}
                onFocus={handleAmountFocus}
                onBlur={handleAmountBlur}
                required
              />
            </div>
            <div>
              <Label htmlFor="recurrence">{t("Recurrence")}</Label>
              <Select
                value={item.recurrence}
                onValueChange={(value) =>
                  setItem({
                    ...item,
                    recurrence: value as
                      | "once"
                      | "monthly"
                      | "quarterly"
                      | "yearly",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("Select recurrence")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">{t("Once")}</SelectItem>
                  <SelectItem value="monthly">{t("Monthly")}</SelectItem>
                  <SelectItem value="quarterly">{t("Quarterly")}</SelectItem>
                  <SelectItem value="yearly">{t("Yearly")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {item.recurrence !== "once" && (
              <div>
                <Label htmlFor="endDate">
                  {t("End Date")} ({t("Optional")})
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={item.endDate}
                  onChange={(e) =>
                    setItem({ ...item, endDate: e.target.value })
                  }
                />
              </div>
            )}
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit">
              {editingItem ? t("Update") : t("Add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
