export const translations = {
  "Financial Dashboard": "Økonomisk Dashboard",
  "Incomes and Expenses": "Indtægter og Udgifter",
  "Add Item": "Tilføj",
  Incomes: "Indtægter",
  Expenses: "Udgifter",
  "Total Income": "Samlet Indtægter",
  "Total Expenses": "Samlede Udgifter",
  "Net Income": "Nettoindkomst",
  "Savings Rate": "Opsparingsrate",
  "Goal Tracker": "Målsporing",
  "Goal name": "Målnavn",
  Amount: "Beløb",
  "Add Goal": "Tilføj Mål",
  "Update Goal": "Opdater Mål",
  "Monthly Overview": "Månedlig Oversigt",
  "Income Distribution": "Indkomstfordeling",
  "Expense Distribution": "Udgiftsfordeling",
  "Add Income/Expense": "Tilføj Indtægt/Udgift",
  "Edit Income/Expense": "Rediger Indtægt/Udgift",
  Type: "Type",
  Name: "Navn",
  Variable: "Variabel",
  Update: "Opdater",
  by: "inden",
  Income: "Indtægt",
  Expense: "Udgift",
  Recurrence: "Gentagelse",
  "Select type": "Vælg type",
  "Select recurrence": "Vælg gentagelse",
  Once: "Én gang",
  Monthly: "Månedlig",
  Quarterly: "Kvartalsvis",
  Yearly: "Årlig",
  "End Date": "Slutdato",
  Optional: "Valgfri",
};

type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey): string {
  return translations[key] || key;
}
