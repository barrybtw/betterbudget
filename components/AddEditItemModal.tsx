"use client";

import { useState, useEffect } from "react";
import useFinanceStore, { FinanceItem } from "../hooks/useFinanceStore";
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
  const { addItem, editItem } = useFinanceStore();
  const [item, setItem] = useState({
    type: "income",
    name: "",
    amount: "",
    recurrence: "once",
    endDate: "",
  });

  useEffect(() => {
    if (editingItem) {
      setItem({
        ...editingItem,
        amount: editingItem.amount.toString(),
        endDate: editingItem.endDate || "",
      });
    } else {
      setItem({
        type: "income" as "income" | "expense",
        name: "",
        amount: "",
        recurrence: "once",
        endDate: "",
      });
    }
  }, [editingItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      ...item,
      amount: Number(item.amount),
      startDate: new Date().toISOString().split("T")[0], // Use current date as start date
      endDate: item.endDate || undefined,
    } as unknown as Omit<FinanceItem, "id">;

    if (editingItem) {
      editItem(editingItem.id, newItem);
    } else {
      addItem(newItem);
    }
    onClose();
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
                type="number"
                value={item.amount}
                onChange={(e) => setItem({ ...item, amount: e.target.value })}
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
                    recurrence: value as "once" | "monthly" | "yearly",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("Select recurrence")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">{t("Once")}</SelectItem>
                  <SelectItem value="monthly">{t("Monthly")}</SelectItem>
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
