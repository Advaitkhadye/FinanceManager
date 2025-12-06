"use client";
import { useEffect, useState } from "react";
import { Calendar, Tag, FileText, Trash2, Edit2, X, Check } from "lucide-react";

interface Transaction {
  id: number;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export default function TransactionList({ transactions, onTransactionChange }: { transactions: Transaction[], onTransactionChange: () => void }) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      const response = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (response.ok) {
        onTransactionChange();
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const startEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm(transaction);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const response = await fetch(`/api/transactions/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        setEditingId(null);
        onTransactionChange();
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
        <button
          onClick={() => {
            const csv = ["ID,Date,Category,Description,Amount", ...transactions.map(t => `${t.id},${t.date},${t.category},${t.description},${t.amount}`)].join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "transactions.csv";
            a.click();
          }}
          className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"
        >
          Download CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="py-3 px-6 text-left font-medium">Date</th>
              <th className="py-3 px-6 text-left font-medium">Category</th>
              <th className="py-3 px-6 text-left font-medium">Description</th>
              <th className="py-3 px-6 text-right font-medium">Amount</th>
              <th className="py-3 px-6 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {editingId === transaction.id ? (
                    <input
                      className="border rounded p-1 text-xs w-full"
                      value={editForm.category || ""}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    />
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      <Tag className="w-3 h-3" />
                      {transaction.category}
                    </span>
                  )}
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {editingId === transaction.id ? (
                    <input
                      className="border border-gray-300 rounded-md p-1.5 text-xs w-full focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      value={editForm.description || ""}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      {transaction.description}
                    </div>
                  )}
                </td>
                <td className="py-4 px-6 text-sm text-right font-semibold text-gray-900">
                  {editingId === transaction.id ? (
                    <input
                      type="number"
                      className="border rounded p-1 text-xs w-20 text-right"
                      value={editForm.amount || 0}
                      onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
                    />
                  ) : (
                    `-$${transaction.amount.toFixed(2)}`
                  )}
                </td>
                <td className="py-4 px-6 text-sm text-right align-middle">
                  <div className="flex items-center justify-end gap-3">
                    {editingId === transaction.id ? (
                      <>
                        <button onClick={saveEdit} className="p-1 text-green-600 hover:bg-green-50 rounded">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={cancelEdit} className="p-1 text-gray-400 hover:bg-gray-50 rounded">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(transaction)} className="p-1.5 text-black hover:bg-gray-100 rounded transition-colors group" title="Edit">
                          <Edit2 className="w-4 h-4 text-black group-hover:text-gray-700" />
                        </button>
                        <button onClick={() => handleDelete(transaction.id)} className="p-1.5 text-black hover:bg-gray-100 rounded transition-colors group" title="Delete">
                          <Trash2 className="w-4 h-4 text-black group-hover:text-red-600" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">
                  No transactions found. Start adding some!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
