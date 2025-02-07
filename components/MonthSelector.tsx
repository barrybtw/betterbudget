import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type MonthSelectorProps = {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export default function MonthSelector({ selectedDate, onDateChange }: MonthSelectorProps) {
  const monthNames = [
    "Januar",
    "Februar",
    "Marts",
    "April",
    "Maj",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "December",
  ]

  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() - 1)
    onDateChange(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() + 1)
    onDateChange(newDate)
  }

  return (
    <div className="flex items-center justify-between">
      <Button onClick={handlePrevMonth} variant="outline" size="icon">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h2 className="text-xl font-semibold">
        {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
      </h2>
      <Button onClick={handleNextMonth} variant="outline" size="icon">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

