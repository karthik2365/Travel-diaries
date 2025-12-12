'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Wallet,
    Map,
    ListTodo,
    Share2,
    Trash2
} from 'lucide-react';
import { useTrips, Trip } from '@/context/TripContext';
import BudgetTracker from '@/components/BudgetTracker';

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] rounded-[var(--radius-lg)] bg-[var(--bg-glass)] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                <p className="text-[var(--text-secondary)]">Loading map...</p>
            </div>
        </div>
    ),
});

type TabType = 'overview' | 'places' | 'budget';

export default function TripDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { trips, addPlace, removePlace, addBudgetItem, removeBudgetItem, deleteTrip } = useTrips();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [trip, setTrip] = useState<Trip | null>(null);

    useEffect(() => {
        const foundTrip = trips.find(t => t.id === params.id);
        if (foundTrip) {
            setTrip(foundTrip);
        }
    }, [trips, params.id]);

    const handleDeleteTrip = () => {
        if (trip && confirm('Are you sure you want to delete this trip?')) {
            deleteTrip(trip.id);
            router.push('/');
        }
    };

    if (!trip) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[var(--text-secondary)]">Loading trip...</p>
                </div>
            </div>
        );
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getDuration = () => {
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return `${diff} days`;
    };

    const totalSpent = trip.budget.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[40vh] min-h-[300px]">
                <img
                    src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'}
                    alt={trip.destination}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/50 to-transparent" />

                {/* Back Button */}
                <button
                    onClick={() => router.push('/')}
                    className="absolute top-6 left-6 w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-[var(--primary)]/20 transition-colors z-10"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                {/* Actions */}
                <div className="absolute top-6 right-6 flex gap-3 z-10">
                    <button className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-[var(--primary)]/20 transition-colors">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleDeleteTrip}
                        className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-red-500/20 transition-colors"
                    >
                        <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                </div>

                {/* Trip Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">{trip.name}</h1>
                        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-[var(--text-secondary)]">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[var(--primary)]" />
                                <span>{trip.destination}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[var(--secondary)]" />
                                <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-[var(--accent)]" />
                                <span>{trip.currency} {totalSpent.toLocaleString()} / {trip.totalBudget.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {[
                        { id: 'overview', label: 'Overview', icon: ListTodo },
                        { id: 'places', label: 'Places', icon: Map },
                        { id: 'budget', label: 'Budget', icon: Wallet },
                    ].map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-[var(--primary)] text-white'
                                        : 'bg-[var(--bg-glass)] text-[var(--text-secondary)] hover:bg-[var(--primary)]/20'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="animate-fade-in">
                    {activeTab === 'overview' && (
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Quick Stats */}
                            <div className="card">
                                <h3 className="text-xl font-semibold mb-4">Trip Overview</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-[var(--border-color)]">
                                        <span className="text-[var(--text-secondary)]">Duration</span>
                                        <span className="font-medium">{getDuration()}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-[var(--border-color)]">
                                        <span className="text-[var(--text-secondary)]">Places to Visit</span>
                                        <span className="font-medium">{trip.places.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-[var(--border-color)]">
                                        <span className="text-[var(--text-secondary)]">Budget Used</span>
                                        <span className="font-medium">
                                            {trip.totalBudget > 0 ? `${((totalSpent / trip.totalBudget) * 100).toFixed(0)}%` : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-[var(--text-secondary)]">Remaining Budget</span>
                                        <span className={`font-medium ${trip.totalBudget - totalSpent < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                            {trip.currency} {(trip.totalBudget - totalSpent).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="card">
                                <h3 className="text-xl font-semibold mb-4">Description</h3>
                                <p className="text-[var(--text-secondary)] leading-relaxed">
                                    {trip.description || 'No description added yet. Edit your trip to add details about your adventure!'}
                                </p>
                            </div>

                            {/* Places Preview */}
                            <div className="card md:col-span-2">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold">Places to Visit</h3>
                                    <button
                                        onClick={() => setActiveTab('places')}
                                        className="text-[var(--primary)] text-sm font-medium hover:underline"
                                    >
                                        View all
                                    </button>
                                </div>
                                {trip.places.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Map className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-3" />
                                        <p className="text-[var(--text-secondary)]">No places added yet</p>
                                        <button
                                            onClick={() => setActiveTab('places')}
                                            className="text-[var(--primary)] text-sm font-medium hover:underline mt-2"
                                        >
                                            Add your first place
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                        {trip.places.slice(0, 5).map((place, index) => (
                                            <div
                                                key={place.id}
                                                className="flex-shrink-0 px-4 py-3 rounded-[var(--radius-lg)] bg-[var(--bg-glass)] border border-[var(--border-color)]"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-[var(--primary)]">{index + 1}</span>
                                                    </div>
                                                    <span className="font-medium">{place.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'places' && (
                        <div className="space-y-6">
                            <MapComponent
                                places={trip.places}
                                onAddPlace={(place) => addPlace(trip.id, place)}
                                onRemovePlace={(placeId) => removePlace(trip.id, placeId)}
                            />

                            {/* Places List */}
                            {trip.places.length > 0 && (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {trip.places.map((place, index) => (
                                        <div key={place.id} className="card">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center shrink-0">
                                                    <span className="font-semibold text-[var(--primary)]">{index + 1}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold truncate">{place.name}</h4>
                                                    {place.notes && (
                                                        <p className="text-sm text-[var(--text-muted)] mt-1">{place.notes}</p>
                                                    )}
                                                    <p className="text-xs text-[var(--text-muted)] mt-2">
                                                        {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => removePlace(trip.id, place.id)}
                                                    className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center hover:bg-red-500/20 transition-colors shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'budget' && (
                        <BudgetTracker
                            budget={trip.budget}
                            totalBudget={trip.totalBudget}
                            currency={trip.currency}
                            onAddItem={(item) => addBudgetItem(trip.id, item)}
                            onRemoveItem={(itemId) => removeBudgetItem(trip.id, itemId)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
