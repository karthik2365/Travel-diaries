import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Haversine formula to calculate distance between two points
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return Number(d.toFixed(1));
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export const CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
    "new york": { lat: 40.7128, lon: -74.0060 },
    "london": { lat: 51.5074, lon: -0.1278 },
    "paris": { lat: 48.8566, lon: 2.3522 },
    "tokyo": { lat: 35.6762, lon: 139.6503 },
    "sydney": { lat: -33.8688, lon: 151.2093 },
    "dubai": { lat: 25.2048, lon: 55.2708 },
    "singapore": { lat: 1.3521, lon: 103.8198 },
    "los angeles": { lat: 34.0522, lon: -118.2437 },
    "san francisco": { lat: 37.7749, lon: -122.4194 },
    "berlin": { lat: 52.5200, lon: 13.4050 },
    "rome": { lat: 41.9028, lon: 12.4964 },
    "mumbai": { lat: 19.0760, lon: 72.8777 },
    "delhi": { lat: 28.6139, lon: 77.2090 },
    "bangalore": { lat: 12.9716, lon: 77.5946 },
    "hyderabad": { lat: 17.3850, lon: 78.4867 },
    "chennai": { lat: 13.0827, lon: 80.2707 },
    "toronto": { lat: 43.6532, lon: -79.3832 },
    "vancouver": { lat: 49.2827, lon: -123.1207 },
    "barcelona": { lat: 41.3851, lon: 2.1734 },
    "madrid": { lat: 40.4168, lon: -3.7038 },
    "amsterdam": { lat: 52.3676, lon: 4.9041 },
    "bangkok": { lat: 13.7563, lon: 100.5018 },
    "seoul": { lat: 37.5665, lon: 126.9780 },
    "hong kong": { lat: 22.3193, lon: 114.1694 },
    "istanbul": { lat: 41.0082, lon: 28.9784 },
    "rio de janeiro": { lat: -22.9068, lon: -43.1729 },
    "cairo": { lat: 30.0444, lon: 31.2357 },
    "beijing": { lat: 39.9042, lon: 116.4074 },
    "shanghai": { lat: 31.2304, lon: 121.4737 },
    "moscow": { lat: 55.7558, lon: 37.6173 },
    "mexico city": { lat: 19.4326, lon: -99.1332 },
};

export const CITIES_LIST = Object.keys(CITY_COORDINATES).map(city =>
    city.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
).sort();

export const getCoordinates = (city: string) => {
    const normalized = city.toLowerCase().trim();
    return CITY_COORDINATES[normalized] || { lat: 0, lon: 0 };
};

// Mock Data Generators
export const generateHotels = (budget: number) => {
    // Assume 40% of budget for accommodation
    const accommodationBudget = budget * 0.4;

    return [
        {
            id: 1,
            name: "Grand Horizon Hotel",
            rating: 4.8,
            price: Math.floor(accommodationBudget * 0.8),
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
            distance: "2.5 km from center",
            features: ["Spa", "Pool", "Wifi"]
        },
        {
            id: 2,
            name: "Urban Retreat",
            rating: 4.5,
            price: Math.floor(accommodationBudget * 0.6),
            image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
            distance: "0.5 km from center",
            features: ["Bar", "Gym", "View"]
        },
        {
            id: 3,
            name: "Cozy Corner BnB",
            rating: 4.2,
            price: Math.floor(accommodationBudget * 0.4),
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
            distance: "1.2 km from center",
            features: ["Breakfast", "Wifi"]
        }
    ];
};

export const generateActivities = (budget: number) => {
    // Assume 60% of budget for activities
    // We'll show a few activities that fit in this range
    const activityBudget = budget * 0.6;

    return [
        {
            id: 1,
            name: "Iconic City Tour",
            rating: 4.9,
            price: Math.floor(activityBudget * 0.15),
            image: "https://images.unsplash.com/photo-1499856871940-a09e3f92f49e?q=80&w=2070&auto=format&fit=crop",
            duration: "3 hours"
        },
        {
            id: 2,
            name: "Mountain Adventure",
            rating: 4.7,
            price: Math.floor(activityBudget * 0.25),
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
            duration: "5 hours"
        },
        {
            id: 3,
            name: "Local Food Tasting",
            rating: 4.8,
            price: Math.floor(activityBudget * 0.1),
            image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
            duration: "2 hours"
        },
        {
            id: 4,
            name: "Historical Museum",
            rating: 4.6,
            price: Math.floor(activityBudget * 0.05),
            image: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=2070&auto=format&fit=crop",
            duration: "4 hours"
        }
    ];
};
