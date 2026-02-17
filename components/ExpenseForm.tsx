import { useState } from 'react';
import { Expense } from '../types/expense';

interface ExpenseFormProps {
    onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

export default function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Other');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount) return;

        onAddExpense({
            description,
            amount: parseFloat(amount),
            category,
            date: new Date().toISOString(),
        });

        setDescription('');
        setAmount('');
        setCategory('Other');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white/5 p-6 rounded-2xl shadow-lg border border-white/10 mb-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4 text-white/90">Add New Expense</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white transition-all"
                        placeholder="e.g., Grocery"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white transition-all"
                        placeholder="0.00"
                        step="0.01"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white transition-all appearance-none"
                    >
                        <option className="bg-gray-900" value="Food">Food</option>
                        <option className="bg-gray-900" value="Transport">Transport</option>
                        <option className="bg-gray-900" value="Housing">Housing</option>
                        <option className="bg-gray-900" value="Entertainment">Entertainment</option>
                        <option className="bg-gray-900" value="Utilities">Utilities</option>
                        <option className="bg-gray-900" value="Other">Other</option>
                    </select>
                </div>
            </div>
            <button
                type="submit"
                className="mt-6 w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-900/20"
            >
                Add Expense
            </button>
        </form>
    );
}
