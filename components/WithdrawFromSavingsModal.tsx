"use client"

import { useState } from "react"
import { useFinance } from "../contexts/FinanceContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { t } from "../utils/translations"

type WithdrawFromSavingsModalProps = {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date
}

export default function WithdrawFromSavingsModal({ isOpen, onClose, selectedDate }: WithdrawFromSavingsModalProps) {
  const { withdrawFromSavings } = useFinance()
  const [amount, setAmount] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const withdrawAmount = Number.parseFloat(amount)
    if (!isNaN(withdrawAmount) && withdrawAmount > 0) {
      const year = selectedDate.getFullYear().toString()
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0")
      withdrawFromSavings(year, month, withdrawAmount)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Withdraw from Savings")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="withdraw-amount">{t("Amount")} (DKK)</Label>
              <Input
                id="withdraw-amount"
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
            <Button type="submit">{t("Withdraw from Savings")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

