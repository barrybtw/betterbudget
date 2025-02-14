"use client"

import { useState } from "react"
import { useFinance } from "../contexts/FinanceContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { t } from "../utils/translations"

type InitialBalanceModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function InitialBalanceModal({ isOpen, onClose }: InitialBalanceModalProps) {
  const { setInitialBalance } = useFinance()
  const [balance, setBalance] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const initialBalance = Number.parseFloat(balance)
    if (!isNaN(initialBalance)) {
      setInitialBalance(initialBalance)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Set Initial Balance")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="balance">{t("Initial Balance")} (DKK)</Label>
              <Input id="balance" type="number" value={balance} onChange={(e) => setBalance(e.target.value)} required />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit">{t("Set Balance")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

