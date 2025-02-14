import { useState } from "react"
import useFinanceStore from "../hooks/useFinanceStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { t } from "../utils/translations"

type SavingsTransactionModalProps = {
  isOpen: boolean
  onClose: () => void
  type: "deposit" | "withdraw"
  selectedDate: Date
}

export default function SavingsTransactionModal({ isOpen, onClose, type, selectedDate }: SavingsTransactionModalProps) {
  const { depositToSavings, withdrawFromSavings, getSavings } = useFinanceStore()
  const [amount, setAmount] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const transactionAmount = Number(amount)
    if (transactionAmount > 0) {
      if (type === "deposit") {
        depositToSavings(transactionAmount, selectedDate)
      } else {
        const currentSavings = getSavings(selectedDate)
        if (transactionAmount <= currentSavings) {
          withdrawFromSavings(transactionAmount, selectedDate)
        } else {
          alert(t("Insufficient savings balance"))
          return
        }
      }
      onClose()
      setAmount("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type === "deposit" ? t("Deposit to Savings") : t("Withdraw from Savings")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">{t("Amount")} (DKK)</Label>
              <Input
                id="amount"
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
            <Button type="submit">{type === "deposit" ? t("Deposit") : t("Withdraw")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

