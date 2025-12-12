'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Place {
    id: string;
    name: string;
    lat: number;
    lng: number;
    notes?: string;
}

export interface BudgetItem {
    id: string;
    category: 'accommodation' | 'transport' | 'food' | 'activities' | 'other';
    description: string;
    amount: number;
    currency: string;
}

export interface Trip {
    id: string;
    name: string;
    destination: string;
    startDate: string;
    endDate: string;
    coverImage?: string;
    description?: string;
    places: Place[];
    budget: BudgetItem[];
    totalBudget: number;
    currency: string;
    createdAt: string;
}

interface TripContextType {
    trips: Trip[];
    currentTrip: Trip | null;
    addTrip: (trip: Omit<Trip, 'id' | 'createdAt' | 'places' | 'budget'>) => void;
    updateTrip: (id: string, trip: Partial<Trip>) => void;
    deleteTrip: (id: string) => void;
    setCurrentTrip: (trip: Trip | null) => void;
    addPlace: (tripId: string, place: Omit<Place, 'id'>) => void;
    removePlace: (tripId: string, placeId: string) => void;
    addBudgetItem: (tripId: string, item: Omit<BudgetItem, 'id'>) => void;
    removeBudgetItem: (tripId: string, itemId: string) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);

    // Load trips from localStorage on mount
    useEffect(() => {
        const savedTrips = localStorage.getItem('travel-diaries-trips');
        if (savedTrips) {
            setTrips(JSON.parse(savedTrips));
        }
    }, []);

    // Save trips to localStorage whenever they change
    useEffect(() => {
        if (trips.length > 0) {
            localStorage.setItem('travel-diaries-trips', JSON.stringify(trips));
        }
    }, [trips]);

    const addTrip = (tripData: Omit<Trip, 'id' | 'createdAt' | 'places' | 'budget'>) => {
        const newTrip: Trip = {
            ...tripData,
            id: uuidv4(),
            places: [],
            budget: [],
            createdAt: new Date().toISOString(),
        };
        setTrips(prev => [...prev, newTrip]);
        return newTrip;
    };

    const updateTrip = (id: string, tripData: Partial<Trip>) => {
        setTrips(prev => prev.map(trip =>
            trip.id === id ? { ...trip, ...tripData } : trip
        ));
        if (currentTrip?.id === id) {
            setCurrentTrip(prev => prev ? { ...prev, ...tripData } : null);
        }
    };

    const deleteTrip = (id: string) => {
        setTrips(prev => prev.filter(trip => trip.id !== id));
        if (currentTrip?.id === id) {
            setCurrentTrip(null);
        }
    };

    const addPlace = (tripId: string, placeData: Omit<Place, 'id'>) => {
        const newPlace: Place = {
            ...placeData,
            id: uuidv4(),
        };
        setTrips(prev => prev.map(trip =>
            trip.id === tripId
                ? { ...trip, places: [...trip.places, newPlace] }
                : trip
        ));
    };

    const removePlace = (tripId: string, placeId: string) => {
        setTrips(prev => prev.map(trip =>
            trip.id === tripId
                ? { ...trip, places: trip.places.filter(p => p.id !== placeId) }
                : trip
        ));
    };

    const addBudgetItem = (tripId: string, itemData: Omit<BudgetItem, 'id'>) => {
        const newItem: BudgetItem = {
            ...itemData,
            id: uuidv4(),
        };
        setTrips(prev => prev.map(trip =>
            trip.id === tripId
                ? { ...trip, budget: [...trip.budget, newItem] }
                : trip
        ));
    };

    const removeBudgetItem = (tripId: string, itemId: string) => {
        setTrips(prev => prev.map(trip =>
            trip.id === tripId
                ? { ...trip, budget: trip.budget.filter(b => b.id !== itemId) }
                : trip
        ));
    };

    return (
        <TripContext.Provider value={{
            trips,
            currentTrip,
            addTrip,
            updateTrip,
            deleteTrip,
            setCurrentTrip,
            addPlace,
            removePlace,
            addBudgetItem,
            removeBudgetItem,
        }}>
            {children}
        </TripContext.Provider>
    );
}

export function useTrips() {
    const context = useContext(TripContext);
    if (context === undefined) {
        throw new Error('useTrips must be used within a TripProvider');
    }
    return context;
}
