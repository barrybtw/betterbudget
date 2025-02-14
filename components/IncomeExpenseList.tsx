import useFinanceStore from "../hooks/useFinanceStore";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2, RepeatIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { t } from "../utils/translations";

type IncomeExpenseListProps = {
  selectedDate: Date;
  onAddItem: () => void;
  onEditItem: (item: any) => void;
};

export default function IncomeExpenseList({
  selectedDate,
  onAddItem,
  onEditItem,
}: IncomeExpenseListProps) {
  const { items, deleteItem } = useFinanceStore();

  const handleDelete = (id: string) => {
    deleteItem(id);
  };

  const filteredItems = items.filter(
    (item) =>
      new Date(item.startDate) <= selectedDate &&
      (!item.endDate || new Date(item.endDate) >= selectedDate)
  );

  const incomes = filteredItems.filter((item) => item.type === "income");
  const expenses = filteredItems.filter((item) => item.type === "expense");

  const renderList = (items, type) => (
    <ScrollArea className="h-[300px] w-full pr-4">
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={`flex justify-between items-center ${
              type === "income"
                ? "bg-green-100 dark:bg-green-800"
                : "bg-red-100 dark:bg-red-800"
            } p-2 rounded`}
          >
            <span className="flex items-center dark:text-white">
              {item.name}
              {!item.endDate && <RepeatIcon className="ml-2 h-4 w-4" />}
            </span>
            <div className="flex items-center">
              <span className="mr-4 dark:text-white">
                {item.amount.toLocaleString("da-DK", {
                  style: "currency",
                  currency: "DKK",
                })}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEditItem(item)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{t("Incomes and Expenses")}</h2>
        <Button onClick={onAddItem}>
          <PlusCircle className="mr-2 h-4 w-4" /> {t("Add Item")}
        </Button>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">{t("Incomes")}</h3>
          {renderList(incomes, "income")}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">{t("Expenses")}</h3>
          {renderList(expenses, "expense")}
        </div>
      </div>
    </div>
  );
}
