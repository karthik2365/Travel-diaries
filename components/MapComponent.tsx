'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Plus, X, Navigation } from 'lucide-react';

// Fix for default marker icon
const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #ff5500 0%, #ff7733 100%);
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 3px solid white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  ">
    <div style="transform: rotate(45deg); color: white; font-size: 14px;">📍</div>
  </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const userIcon = L.divIcon({
    className: 'user-marker',
    html: `<div style="
    width: 24px;
    height: 24px;
    background: #3b82f6;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
  "></div>`,
    iconSize: [24, 24],
});

interface Place {
    id: string;
    name: string;
    lat: number;
    lng: number;
    notes?: string;
}

interface MapComponentProps {
    places: Place[];
    onAddPlace: (place: Omit<Place, 'id'>) => void;
    onRemovePlace: (placeId: string) => void;
    center?: [number, number];
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click: (e) => {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function MapComponent({ places, onAddPlace, onRemovePlace, center = [48.8566, 2.3522] }: MapComponentProps) {
    const [isClient, setIsClient] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPlaceCoords, setNewPlaceCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [newPlaceName, setNewPlaceName] = useState('');
    const [newPlaceNotes, setNewPlaceNotes] = useState('');
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [routePath, setRoutePath] = useState<[number, number][]>([]);

    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
    }, []);

    const fetchRoute = async (start: [number, number], end: [number, number]) => {
        try {
            // OSRM expects lng,lat
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
            );
            const data = await response.json();
            if (data.routes && data.routes[0]) {
                // Convert [lng, lat] to [lat, lng]
                const coordinates = data.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number]);
                setRoutePath(coordinates);
            }
        } catch (error) {
            console.error("Error fetching route:", error);
        }
    };

    const handleMapClick = (lat: number, lng: number) => {
        setNewPlaceCoords({ lat, lng });
        setShowAddModal(true);
        if (userLocation) {
            fetchRoute(userLocation, [lat, lng]);
        }
    };

    const handleAddPlace = () => {
        if (newPlaceCoords && newPlaceName) {
            onAddPlace({
                name: newPlaceName,
                lat: newPlaceCoords.lat,
                lng: newPlaceCoords.lng,
                notes: newPlaceNotes,
            });
            setShowAddModal(false);
            setNewPlaceName('');
            setNewPlaceNotes('');
            setNewPlaceCoords(null);
        }
    };

    if (!isClient) {
        return (
            <div className="w-full h-[500px] rounded-[var(--radius-lg)] bg-[var(--bg-glass)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[var(--text-secondary)]">Loading map...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-color)]">
                <MapContainer
                    center={center}
                    zoom={12}
                    style={{ height: '500px', width: '100%' }}
                    className="z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    <MapClickHandler onMapClick={handleMapClick} />

                    {/* User Location */}
                    {userLocation && (
                        <Marker position={userLocation} icon={userIcon}>
                            <Popup>You are here</Popup>
                        </Marker>
                    )}

                    {/* Route */}
                    {routePath.length > 0 && (
                        <Polyline
                            positions={routePath}
                            pathOptions={{ color: 'var(--primary)', weight: 4, opacity: 0.8, dashArray: '10, 10' }}
                        />
                    )}

                    {places.map((place) => (
                        <Marker key={place.id} position={[place.lat, place.lng]} icon={customIcon}>
                            <Popup>
                                <div className="p-2 min-w-[200px]">
                                    <h4 className="font-semibold text-[var(--text-primary)] mb-1">{place.name}</h4>
                                    {place.notes && (
                                        <p className="text-sm text-[var(--text-secondary)] mb-3">{place.notes}</p>
                                    )}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                if (userLocation) fetchRoute(userLocation, [place.lat, place.lng]);
                                            }}
                                            className="text-xs bg-[var(--primary)] text-white px-2 py-1 rounded hover:bg-[var(--primary-dark)] flex items-center gap-1"
                                        >
                                            <Navigation className="w-3 h-3" />
                                            Route
                                        </button>
                                        <button
                                            onClick={() => onRemovePlace(place.id)}
                                            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 ml-auto"
                                        >
                                            <X className="w-3 h-3" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Instructions */}
            <div className="absolute top-4 left-4 z-[1000] px-4 py-2 rounded-[var(--radius-md)] bg-[var(--bg-card)] backdrop-blur-sm border border-[var(--border-color)]">
                <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-[var(--primary)]" />
                    <span className="text-[var(--text-secondary)]">Click on the map to add places</span>
                </div>
            </div>

            {/* Add Place Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setShowAddModal(false)}
                    />
                    <div className="relative w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-xl)] p-6 animate-scale-in">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center">
                                <Plus className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Add New Place</h3>
                                <p className="text-sm text-[var(--text-muted)]">
                                    Lat: {newPlaceCoords?.lat.toFixed(4)}, Lng: {newPlaceCoords?.lng.toFixed(4)}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                    Place Name *
                                </label>
                                <input
                                    type="text"
                                    value={newPlaceName}
                                    onChange={(e) => setNewPlaceName(e.target.value)}
                                    placeholder="Eiffel Tower"
                                    className="input-field"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={newPlaceNotes}
                                    onChange={(e) => setNewPlaceNotes(e.target.value)}
                                    placeholder="Must visit at sunset!"
                                    rows={3}
                                    className="input-field resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddPlace}
                                disabled={!newPlaceName}
                                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Place
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
