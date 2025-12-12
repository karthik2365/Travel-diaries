'use client';

import { Trip } from '@/context/TripContext';
import { Calendar, MapPin, Wallet, ArrowRight, Trash2 } from 'lucide-react';

interface TripCardProps {
    trip: Trip;
    onClick: () => void;
    onDelete: (e: React.MouseEvent) => void;
    delay?: number;
}

export default function TripCard({ trip, onClick, onDelete, delay = 0 }: TripCardProps) {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const getDaysRemaining = () => {
        const start = new Date(trip.startDate);
        const today = new Date();
        const diff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff < 0) return 'Completed';
        if (diff === 0) return 'Today!';
        return `${diff} days`;
    };

    const getSpentAmount = () => {
        return trip.budget.reduce((sum, item) => sum + item.amount, 0);
    };

    const spentAmount = getSpentAmount();
    const budgetPercentage = trip.totalBudget > 0 ? (spentAmount / trip.totalBudget) * 100 : 0;

    return (
        <div
            className="card group cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${delay}ms` }}
            onClick={onClick}
        >
            {/* Cover Image */}
            <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-[var(--radius-xl)]">
                <img
                    src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
                    alt={trip.destination}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[var(--bg-glass)] backdrop-blur-sm text-xs font-medium border border-[var(--border-color)]">
                    {getDaysRemaining()}
                </div>

                {/* Delete Button */}
                <button
                    onClick={onDelete}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/40"
                >
                    <Trash2 className="w-4 h-4 text-red-400" />
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                        {trip.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[var(--text-secondary)] mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{trip.destination}</span>
                    </div>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                </div>

                {/* Budget Progress */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                            <Wallet className="w-4 h-4" />
                            <span>Budget</span>
                        </div>
                        <span className="font-semibold">
                            {trip.currency} {spentAmount.toLocaleString()} / {trip.totalBudget.toLocaleString()}
                        </span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--bg-glass)] overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${budgetPercentage > 90 ? 'bg-red-500' :
                                budgetPercentage > 70 ? 'bg-yellow-500' :
                                    'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)]'
                                }`}
                            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Places Count */}
                <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-[var(--text-muted)]">
                        {trip.places.length} places added
                    </span>
                    <div className="flex items-center gap-1 text-[var(--primary)] text-sm font-medium group-hover:gap-2 transition-all">
                        View Trip
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </div>
    );
}
