'use client';

import { useState } from 'react';
import {
    MapPin,
    Wallet,
    Calendar,
    Plane,
    Plus,
    X,
    ChevronRight,
    Globe,
    Sparkles
} from 'lucide-react';
import { useTrips } from '@/context/TripContext';

interface CreateTripModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTripCreated: (tripId: string) => void;
}

const destinationImages: Record<string, string> = {
    'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
    'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
    'default': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
};

export default function CreateTripModal({ isOpen, onClose, onTripCreated }: CreateTripModalProps) {
    const { addTrip } = useTrips();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        destination: '',
        startDate: '',
        endDate: '',
        totalBudget: 0,
        currency: 'USD',
        description: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'totalBudget' ? parseFloat(value) || 0 : value,
        }));
    };

    const getCoverImage = (destination: string) => {
        const lowerDest = destination.toLowerCase();
        for (const key of Object.keys(destinationImages)) {
            if (lowerDest.includes(key)) {
                return destinationImages[key];
            }
        }
        return destinationImages.default;
    };

    const handleSubmit = () => {
        const newTrip = addTrip({
            ...formData,
            coverImage: getCoverImage(formData.destination),
        }) as { id: string };
        onTripCreated(newTrip.id);
        setFormData({
            name: '',
            destination: '',
            startDate: '',
            endDate: '',
            totalBudget: 0,
            currency: 'USD',
            description: '',
        });
        setStep(1);
        onClose();
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-xl)] overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="relative p-6 border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center">
                            <Plane className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Plan a New Trip</h2>
                            <p className="text-[var(--text-secondary)]">Step {step} of 3</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[var(--bg-glass)] flex items-center justify-center hover:bg-[var(--primary)]/20 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Progress Bar */}
                    <div className="mt-6 flex gap-2">
                        {[1, 2, 3].map(i => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-[var(--primary)]' : 'bg-[var(--bg-glass)]'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="text-center mb-8">
                                <Globe className="w-16 h-16 mx-auto text-[var(--primary)] mb-4 animate-float" />
                                <h3 className="text-xl font-semibold">Where are you going?</h3>
                                <p className="text-[var(--text-secondary)]">Tell us about your dream destination</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        Trip Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="My Amazing Adventure"
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        Destination
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                                        <input
                                            type="text"
                                            name="destination"
                                            value={formData.destination}
                                            onChange={handleInputChange}
                                            placeholder="Paris, France"
                                            className="input-field pl-12"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="text-center mb-8">
                                <Calendar className="w-16 h-16 mx-auto text-[var(--secondary)] mb-4" />
                                <h3 className="text-xl font-semibold">When are you traveling?</h3>
                                <p className="text-[var(--text-secondary)]">Select your travel dates</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="What's special about this trip?"
                                    rows={3}
                                    className="input-field resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="text-center mb-8">
                                <Wallet className="w-16 h-16 mx-auto text-[var(--accent)] mb-4" />
                                <h3 className="text-xl font-semibold">Set Your Budget</h3>
                                <p className="text-[var(--text-secondary)]">Plan your expenses wisely</p>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        Total Budget
                                    </label>
                                    <input
                                        type="number"
                                        name="totalBudget"
                                        value={formData.totalBudget || ''}
                                        onChange={handleInputChange}
                                        placeholder="5000"
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        Currency
                                    </label>
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    >
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="GBP">GBP</option>
                                        <option value="JPY">JPY</option>
                                        <option value="INR">INR</option>
                                        <option value="AUD">AUD</option>
                                    </select>
                                </div>
                            </div>

                            {/* Preview Card */}
                            <div className="mt-8 p-4 rounded-[var(--radius-lg)] bg-[var(--bg-glass)] border border-[var(--border-color)]">
                                <div className="flex items-center gap-3 mb-3">
                                    <Sparkles className="w-5 h-5 text-[var(--secondary)]" />
                                    <span className="text-sm font-medium">Trip Preview</span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-[var(--text-muted)]">Trip:</span> {formData.name || 'Untitled Trip'}</p>
                                    <p><span className="text-[var(--text-muted)]">Destination:</span> {formData.destination || 'Not set'}</p>
                                    <p><span className="text-[var(--text-muted)]">Dates:</span> {formData.startDate && formData.endDate ? `${formData.startDate} - ${formData.endDate}` : 'Not set'}</p>
                                    <p><span className="text-[var(--text-muted)]">Budget:</span> {formData.totalBudget > 0 ? `${formData.currency} ${formData.totalBudget.toLocaleString()}` : 'Not set'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--border-color)] flex justify-between">
                    {step > 1 ? (
                        <button onClick={prevStep} className="btn-secondary">
                            Back
                        </button>
                    ) : (
                        <div />
                    )}

                    {step < 3 ? (
                        <button
                            onClick={nextStep}
                            disabled={step === 1 && (!formData.name || !formData.destination)}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={formData.totalBudget <= 0}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-4 h-4" />
                            Create Trip
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
