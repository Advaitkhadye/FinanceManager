"use client";
import { authenticatedFetch } from "../lib/api";

import { DollarSign, TrendingUp, TrendingDown, Target, Edit2, Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Transaction {
    amount: number;
    category: string;
}

export default function SummaryCards({ transactions }: { transactions: Transaction[] }) {
    const totalExpenses = transactions.reduce((acc, curr) => acc + curr.amount, 0);

    const [budget, setBudget] = useState(1000);
    const [initialBalance, setInitialBalance] = useState(5000);
    const [isEditingBalance, setIsEditingBalance] = useState(false);
    const [editBalanceValue, setEditBalanceValue] = useState("");
    const [isLoadingBalance, setIsLoadingBalance] = useState(true);

    // Fetch initial balance from backend
    useEffect(() => {
        const fetchProfile = async () => {
            try {

                const response = await authenticatedFetch(`/profile/`);
                if (response.ok) {
                    const data = await response.json();
                    setInitialBalance(data.initial_balance);
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setIsLoadingBalance(false);
            }
        };
        fetchProfile();
    }, []);

    // Load budget from local storage
    useEffect(() => {
        const savedBudget = localStorage.getItem("monthly_budget");
        if (savedBudget) setBudget(parseFloat(savedBudget));
    }, []);

    const balance = initialBalance - totalExpenses;

    const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setBudget(val);
        localStorage.setItem("monthly_budget", val.toString());
    };

    const startEditingBalance = () => {
        setEditBalanceValue(balance.toFixed(2));
        setIsEditingBalance(true);
    };

    const cancelEditingBalance = () => {
        setIsEditingBalance(false);
        setEditBalanceValue("");
    };

    const saveBalance = async () => {
        const newTotalBalance = parseFloat(editBalanceValue);
        if (isNaN(newTotalBalance)) return;

        // Calculate new initial balance: New Total + Current Expenses
        const newInitialBalance = newTotalBalance + totalExpenses;

        try {

            const response = await authenticatedFetch(`/profile/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ initial_balance: newInitialBalance }),
            });

            if (response.ok) {
                const data = await response.json();
                setInitialBalance(data.initial_balance);
                setIsEditingBalance(false);
            }
        } catch (error) {
            console.error("Failed to update balance:", error);
        }
    };

    const progress = Math.min((totalExpenses / budget) * 100, 100);
    const isOverBudget = totalExpenses > budget;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
                    <div className="p-2.5 bg-blue-50 rounded-xl">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                </div>

                {isLoadingBalance ? (
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                ) : isEditingBalance ? (
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={editBalanceValue}
                            onChange={(e) => setEditBalanceValue(e.target.value)}
                            className="text-2xl font-bold text-gray-900 border border-gray-300 rounded-lg px-2 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                        <button onClick={saveBalance} className="p-1 hover:bg-green-50 rounded text-green-600"><Save className="w-5 h-5" /></button>
                        <button onClick={cancelEditingBalance} className="p-1 hover:bg-red-50 rounded text-red-600"><X className="w-5 h-5" /></button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <p className="text-3xl font-bold text-gray-900 tracking-tight">${balance.toFixed(2)}</p>
                        <button onClick={startEditingBalance} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-blue-600 transition-colors">
                            <Edit2 className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <p className="text-xs text-green-600 flex items-center mt-2 font-medium">
                    <TrendingUp className="w-3 h-3 mr-1" /> +2.5% vs last month
                </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Monthly Budget</h3>
                    <div className="p-2.5 bg-violet-50 rounded-xl">
                        <Target className="w-5 h-5 text-violet-600" />
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                        <input
                            type="number"
                            value={budget}
                            onChange={handleBudgetChange}
                            className="text-3xl font-bold text-gray-900 tracking-tight bg-transparent border-none p-0 focus:ring-0 w-32 focus:outline-none"
                        />
                        <span className="text-xs text-gray-400">Target</span>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-2 rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-violet-500'}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 flex justify-between">
                        <span>{Math.round(progress)}% Used</span>
                        <span>${(budget - totalExpenses).toFixed(0)} remaining</span>
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
                    <div className="p-2.5 bg-red-50 rounded-xl">
                        <TrendingDown className="w-5 h-5 text-red-600" />
                    </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">${totalExpenses.toFixed(2)}</p>
                <p className="text-xs text-red-600 flex items-center mt-2 font-medium">
                    <TrendingDown className="w-3 h-3 mr-1" /> -4% vs last month
                </p>
            </div>
        </div>
    );
}
