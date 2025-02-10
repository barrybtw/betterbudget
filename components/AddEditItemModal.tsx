"use client";

import { useState, useEffect } from "react";
import { useFinance } from "../contexts/FinanceContext";
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

  useEffect(() => {
    if (editingItem) {
      setItem(editingItem);
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
      amount: Number.parseFloat(item.amount as string),
      id: editingItem ? item.id : Date.now().toString(),
    };

    if (editingItem) {
      editItem(year, month, newItem);
    } else {
      addItem(year, month, newItem);
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
          <DialogFooter>
            <Button type="submit" className="mt-4">
              {editingItem ? t("Update") : t("Add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
