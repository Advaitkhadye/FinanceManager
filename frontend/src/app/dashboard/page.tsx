"use client";

import { useState, useEffect } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import ChatInterface from "@/components/ChatInterface";
import SummaryCards from "@/components/SummaryCards";
import ExpensePieChart from "@/components/ExpensePieChart";
import { LayoutDashboard } from "lucide-react";

import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleTransactionAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${API_URL}/transactions/`);
        if (response.ok) {
          const data = await response.json();
          setTransactions(data.reverse());
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [refreshTrigger]);

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row items-center gap-3 md:gap-4 text-center md:text-left">
          <Link href="/" className="flex flex-col md:flex-row items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="p-2 md:p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
              <LayoutDashboard className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                FinanceManager
              </h1>
              <p className="text-gray-500">Track, Analyze, and Optimize your wealth</p>
            </div>
          </Link>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 animate-pulse">Loading your financial data...</p>
          </div>
        ) : (
          <>
            <SummaryCards transactions={transactions} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <TransactionForm onTransactionAdded={handleTransactionAdded} />
                  </div>
                </div>
                <TransactionList transactions={transactions} onTransactionChange={handleTransactionAdded} />
              </div>

              <div className="space-y-8 h-full">
                <ExpensePieChart transactions={transactions} />
              </div>
            </div>
          </>
        )}
        <ChatInterface />
      </div>
    </main>
  );
}
