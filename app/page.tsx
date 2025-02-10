"use client";
import { FinanceProvider } from "../contexts/FinanceContext";
import { ThemeProvider } from "../components/ThemeProvider";
import Dashboard from "../components/Dashboard";

export default function Home() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <Dashboard />
      </FinanceProvider>
    </ThemeProvider>
  );
}
