import { useFinance } from "../contexts/FinanceContext"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2, RepeatIcon } from "lucide-react"
import { t } from "../utils/translations"

type IncomeExpenseListProps = {
  selectedDate: Date
  onAddItem: () => void
  onEditItem: (item: any) => void
}

export default function IncomeExpenseList({ selectedDate, onAddItem, onEditItem }: IncomeExpenseListProps) {
  const { financeData, deleteItem } = useFinance()

  const year = selectedDate.getFullYear().toString()
  const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0")
  const monthData = financeData[year]?.[month] || { incomes: [], expenses: [] }

  const handleDelete = (id: string, type: "income" | "expense") => {
    deleteItem(year, month, id, type)
  }

  const renderList = (items, type) => (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className={`flex justify-between items-center ${type === "income" ? "bg-green-100" : "bg-red-100"} p-2 rounded`}
        >
          <span className="flex items-center">
            {item.name}
            {item.recurrence !== "once" && <RepeatIcon className="ml-2 h-4 w-4" title={t(item.recurrence)} />}
          </span>
          <div>
            <span className="mr-4">{item.amount.toLocaleString("da-DK", { style: "currency", currency: "DKK" })}</span>
            <Button variant="ghost" size="icon" onClick={() => onEditItem(item)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id, type)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{t("Incomes and Expenses")}</h2>
        <Button onClick={onAddItem}>
          <PlusCircle className="mr-2 h-4 w-4" /> {t("Add Item")}
        </Button>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">{t("Incomes")}</h3>
          {renderList(monthData.incomes, "income")}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">{t("Expenses")}</h3>
          {renderList(monthData.expenses, "expense")}
        </div>
      </div>
    </div>
  )
}

