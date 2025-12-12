'use client';

import { useState } from 'react';
import {
    Plus,
    Trash2,
    Plane,
    Home,
    Utensils,
    Camera,
    MoreHorizontal,
    Wallet,
    TrendingUp,
    PieChart
} from 'lucide-react';
import { BudgetItem } from '@/context/TripContext';

interface BudgetTrackerProps {
    budget: BudgetItem[];
    totalBudget: number;
    currency: string;
    onAddItem: (item: Omit<BudgetItem, 'id'>) => void;
    onRemoveItem: (itemId: string) => void;
}

const categoryConfig = {
    accommodation: { icon: Home, color: '#8b5cf6', label: 'Accommodation' },
    transport: { icon: Plane, color: '#06b6d4', label: 'Transport' },
    food: { icon: Utensils, color: '#f59e0b', label: 'Food & Drinks' },
    activities: { icon: Camera, color: '#10b981', label: 'Activities' },
    other: { icon: MoreHorizontal, color: '#6b7280', label: 'Other' },
};

export default function BudgetTracker({
    budget,
    totalBudget,
    currency,
    onAddItem,
    onRemoveItem
}: BudgetTrackerProps) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItem, setNewItem] = useState({
        category: 'food' as BudgetItem['category'],
        description: '',
        amount: 0,
    });

    const totalSpent = budget.reduce((sum, item) => sum + item.amount, 0);
    const remaining = totalBudget - totalSpent;
    const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    const categoryTotals = budget.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount;
        return acc;
    }, {} as Record<string, number>);

    const handleAddItem = () => {
        if (newItem.description && newItem.amount > 0) {
            onAddItem({
                ...newItem,
                currency,
            });
            setNewItem({ category: 'food', description: '', amount: 0 });
            setShowAddForm(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Budget Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Budget */}
                <div className="card bg-gradient-to-br from-[var(--primary)]/20 to-transparent">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-[var(--primary)]" />
                        </div>
                        <span className="text-[var(--text-secondary)]">Total Budget</span>
                    </div>
                    <p className="text-2xl font-bold">{currency} {totalBudget.toLocaleString()}</p>
                </div>

                {/* Spent */}
                <div className="card bg-gradient-to-br from-[var(--secondary)]/20 to-transparent">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[var(--secondary)]/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-[var(--secondary)]" />
                        </div>
                        <span className="text-[var(--text-secondary)]">Spent</span>
                    </div>
                    <p className="text-2xl font-bold">{currency} {totalSpent.toLocaleString()}</p>
                </div>

                {/* Remaining */}
                <div className={`card bg-gradient-to-br ${remaining >= 0 ? 'from-green-500/20' : 'from-red-500/20'} to-transparent`}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-full ${remaining >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'} flex items-center justify-center`}>
                            <PieChart className={`w-5 h-5 ${remaining >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                        </div>
                        <span className="text-[var(--text-secondary)]">Remaining</span>
                    </div>
                    <p className={`text-2xl font-bold ${remaining < 0 ? 'text-red-400' : ''}`}>
                        {currency} {remaining.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="card">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-[var(--text-secondary)]">Budget Used</span>
                    <span className="text-sm font-medium">{spentPercentage.toFixed(1)}%</span>
                </div>
                <div className="h-4 rounded-full bg-[var(--bg-glass)] overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-700 ${spentPercentage > 100 ? 'bg-red-500' :
                                spentPercentage > 80 ? 'bg-yellow-500' :
                                    'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)]'
                            }`}
                        style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                    />
                </div>

                {/* Category Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
                    {Object.entries(categoryConfig).map(([key, config]) => {
                        const Icon = config.icon;
                        const amount = categoryTotals[key] || 0;
                        return (
                            <div key={key} className="flex items-center gap-2">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${config.color}20` }}
                                >
                                    <Icon className="w-4 h-4" style={{ color: config.color }} />
                                </div>
                                <div>
                                    <p className="text-xs text-[var(--text-muted)]">{config.label}</p>
                                    <p className="text-sm font-medium">{currency} {amount.toLocaleString()}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Add Expense Button */}
            <button
                onClick={() => setShowAddForm(true)}
                className="w-full btn-primary flex items-center justify-center gap-2"
            >
                <Plus className="w-5 h-5" />
                Add Expense
            </button>

            {/* Add Expense Form */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setShowAddForm(false)}
                    />
                    <div className="relative w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-xl)] p-6 animate-scale-in">
                        <h3 className="text-xl font-bold mb-6">Add Expense</h3>

                        <div className="space-y-4">
                            {/* Category Selection */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                    Category
                                </label>
                                <div className="grid grid-cols-5 gap-2">
                                    {Object.entries(categoryConfig).map(([key, config]) => {
                                        const Icon = config.icon;
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => setNewItem(prev => ({ ...prev, category: key as BudgetItem['category'] }))}
                                                className={`p-3 rounded-[var(--radius-md)] flex flex-col items-center gap-1 transition-all ${newItem.category === key
                                                        ? 'bg-[var(--primary)]/20 border-2 border-[var(--primary)]'
                                                        : 'bg-[var(--bg-glass)] border-2 border-transparent hover:border-[var(--border-hover)]'
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5" style={{ color: config.color }} />
                                                <span className="text-[10px] text-[var(--text-muted)]">{config.label.split(' ')[0]}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={newItem.description}
                                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Hotel booking, Flight ticket..."
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                    Amount ({currency})
                                </label>
                                <input
                                    type="number"
                                    value={newItem.amount || ''}
                                    onChange={(e) => setNewItem(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                                    placeholder="0.00"
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddItem}
                                disabled={!newItem.description || newItem.amount <= 0}
                                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Expense
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Expense List */}
            <div className="space-y-3">
                <h4 className="text-lg font-semibold">Recent Expenses</h4>
                {budget.length === 0 ? (
                    <div className="card text-center py-8">
                        <Wallet className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-3" />
                        <p className="text-[var(--text-secondary)]">No expenses yet</p>
                        <p className="text-sm text-[var(--text-muted)]">Add your first expense to start tracking</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {budget.map((item, index) => {
                            const config = categoryConfig[item.category];
                            const Icon = config.icon;
                            return (
                                <div
                                    key={item.id}
                                    className="card flex items-center gap-4 py-3 animate-fade-in-up"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: `${config.color}20` }}
                                    >
                                        <Icon className="w-5 h-5" style={{ color: config.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{item.description}</p>
                                        <p className="text-sm text-[var(--text-muted)]">{config.label}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{currency} {item.amount.toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={() => onRemoveItem(item.id)}
                                        className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center hover:bg-red-500/20 transition-colors shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
