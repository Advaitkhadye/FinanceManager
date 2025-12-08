"use client";

import { useState } from "react";
import { PlusCircle, DollarSign, Tag, FileText } from "lucide-react";

export default function TransactionForm({ onTransactionAdded }: { onTransactionAdded: () => void }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("API URL:", API_URL);
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await fetch(`${API_URL}/transactions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          category,
          description,
        }),
      });

      if (response.ok) {
        setAmount("");
        setCategory("");
        setDescription("");
        onTransactionAdded();
      } else {
        const errorText = await response.text();
        console.error("Failed to add transaction:", response.status, response.statusText, errorText);
        alert(`Failed to add transaction: ${response.status} ${response.statusText}\n${errorText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Error adding transaction: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-blue-600" />
        Add New Transaction
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-10 w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800"
            required
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Tag className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Category (Optional)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="pl-10 w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FileText className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="pl-10 w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? "Adding..." : "Add Transaction"}
        </button>
      </form>
    </div>
  );
}
