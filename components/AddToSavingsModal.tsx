"use client"

import { useState } from "react"
import { useFinance } from "../contexts/FinanceContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { t } from "../utils/translations"

type AddToSavingsModalProps = {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date
}

export default function AddToSavingsModal({ isOpen, onClose, selectedDate }: AddToSavingsModalProps) {
  const { addToSavings } = useFinance()
  const [amount, setAmount] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const savingsAmount = Number.parseFloat(amount)
    if (!isNaN(savingsAmount) && savingsAmount > 0) {
      const year = selectedDate.getFullYear().toString()
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0")
      addToSavings(year, month, savingsAmount)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Add to Savings")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="savings-amount">{t("Amount")} (DKK)</Label>
              <Input
                id="savings-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit">{t("Add to Savings")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

