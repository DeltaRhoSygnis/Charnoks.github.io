
import React, { useState } from 'react';
import { mockExpenses, mockWorkers } from '../data/mockData';
import type { Expense } from '../types';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

const ExpenseRow: React.FC<{ expense: Expense }> = ({ expense }) => {
    const workerName = mockWorkers.find(w => w.id === expense.workerId)?.name || 'N/A';
    return (
        <tr className="border-b border-border/50 hover:bg-white/5 transition-colors">
            <td className="p-3 whitespace-nowrap">{new Date(expense.date).toLocaleDateString()}</td>
            <td className="p-3">{expense.description}</td>
            <td className="p-3 whitespace-nowrap">{workerName}</td>
            <td className="p-3 text-right font-semibold text-red-400 whitespace-nowrap">{`$${expense.amount.toFixed(2)}`}</td>
        </tr>
    );
};

const ExpensesPage: React.FC = () => {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState<Expense[]>(() => mockExpenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount || parseFloat(amount) <= 0) {
            setError('Please fill out all fields with valid values.');
            return;
        }
        setError(null);
        setIsLoading(true);

        // Simulate API call
        await new Promise(res => setTimeout(res, 1000));

        const newExpense: Expense = {
            id: `exp-${Date.now()}`,
            date: new Date().toISOString(),
            description,
            amount: parseFloat(amount),
            workerId: user?.role === 'worker' ? user.uid : undefined,
        };

        setExpenses(prev => [newExpense, ...prev]);
        setDescription('');
        setAmount('');
        setIsLoading(false);
    };

    return (
        <div className="space-y-8">
            <header className="animate-bounce-in">
                <h1 className="text-4xl font-bold text-text-primary">Expenses</h1>
                <p className="text-text-secondary mt-1">Record and track business expenses.</p>
            </header>
            
            <form onSubmit={handleAddExpense} className="bg-card-bg/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg space-y-4">
                <h2 className="text-2xl font-bold text-text-primary">Record New Expense</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-3">
                        <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                        <input
                            type="text"
                            id="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            className="w-full bg-transparent border-2 border-border/50 rounded-lg p-3 focus:border-primary focus:ring-0 transition"
                            placeholder="e.g., Supplier payment"
                        />
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-text-secondary mb-1">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            required
                            min="0.01"
                            step="0.01"
                            className="w-full bg-transparent border-2 border-border/50 rounded-lg p-3 focus:border-primary focus:ring-0 transition"
                            placeholder="$0.00"
                        />
                    </div>
                    <div className="flex items-end">
                        <button type="submit" disabled={isLoading} className="w-full px-6 py-3 rounded-lg bg-primary text-text-on-primary font-bold transition hover:bg-primary/80 disabled:opacity-50 flex items-center justify-center">
                            {isLoading && <Spinner size="sm" />}
                            <span className={isLoading ? 'ml-2' : ''}>Add Expense</span>
                        </button>
                    </div>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
            </form>

            <div className="bg-card-bg/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Recent Expenses</h2>
                <div className="overflow-auto max-h-[50vh]">
                    <table className="w-full text-left table-auto">
                        <thead className="sticky top-0 bg-card-bg-solid/80 backdrop-blur-sm">
                            <tr>
                                <th className="p-3 font-semibold text-text-secondary">Date</th>
                                <th className="p-3 font-semibold text-text-secondary">Description</th>
                                <th className="p-3 font-semibold text-text-secondary">Added By</th>
                                <th className="p-3 font-semibold text-text-secondary text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map(expense => (
                                <ExpenseRow key={expense.id} expense={expense} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExpensesPage;
