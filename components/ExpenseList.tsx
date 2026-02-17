import { Expense } from '../types/expense';

interface ExpenseListProps {
    expenses: Expense[];
    onDelete: (id: string) => void;
}

export default function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                <h2 className="text-xl font-medium text-white/80 mb-2">Total Expenses</h2>
                <p className="text-4xl font-bold text-white tracking-tight">${total.toFixed(2)}</p>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden">
                {expenses.length === 0 ? (
                    <div className="p-8 text-center text-white/40">
                        No expenses recorded yet.
                    </div>
                ) : (
                    <ul className="divide-y divide-white/5">
                        {expenses.map((expense) => (
                            <li key={expense.id} className="p-4 hover:bg-white/5 transition-colors flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-lg">
                                        {expense.category === 'Food' && '🍔'}
                                        {expense.category === 'Transport' && '🚗'}
                                        {expense.category === 'Housing' && '🏠'}
                                        {expense.category === 'Entertainment' && '🎬'}
                                        {expense.category === 'Utilities' && '💡'}
                                        {expense.category === 'Other' && '📝'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{expense.description}</p>
                                        <p className="text-xs text-white/50">{new Date(expense.date).toLocaleDateString()} • {expense.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-white/90">${expense.amount.toFixed(2)}</span>
                                    <button
                                        onClick={() => onDelete(expense.id)}
                                        className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        title="Delete"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
