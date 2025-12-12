'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Plus, X } from 'lucide-react';

// Fix for default marker icon
const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 3px solid white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
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

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleMapClick = (lat: number, lng: number) => {
        setNewPlaceCoords({ lat, lng });
        setShowAddModal(true);
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

                    {places.map((place) => (
                        <Marker key={place.id} position={[place.lat, place.lng]} icon={customIcon}>
                            <Popup>
                                <div className="p-2 min-w-[200px]">
                                    <h4 className="font-semibold text-[var(--text-primary)] mb-1">{place.name}</h4>
                                    {place.notes && (
                                        <p className="text-sm text-[var(--text-secondary)] mb-3">{place.notes}</p>
                                    )}
                                    <button
                                        onClick={() => onRemovePlace(place.id)}
                                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                                    >
                                        <X className="w-3 h-3" />
                                        Remove
                                    </button>
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
