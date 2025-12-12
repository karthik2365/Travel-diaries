'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plane,
  Plus,
  Compass,
  Globe,
  Sparkles,
  Search,
  MapPin
} from 'lucide-react';
import { TripProvider, useTrips } from '@/context/TripContext';
import TripCard from '@/components/TripCard';
import CreateTripModal from '@/components/CreateTripModal';

function HomeContent() {
  const router = useRouter();
  const { trips, deleteTrip } = useTrips();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrips = trips.filter(trip =>
    trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTripCreated = (tripId: string) => {
    router.push(`/trip/${tripId}`);
  };

  const handleDeleteTrip = (e: React.MouseEvent, tripId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this trip?')) {
      deleteTrip(tripId);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle dark glow instead of bright blobs */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary)]/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[var(--primary)]/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-12">
          {/* Logo & Nav */}
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center animate-pulse-glow">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Travel Diaries</h1>
                <p className="text-xs text-[var(--text-muted)]">Your journey starts here</p>
              </div>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Plan a Trip</span>
            </button>
          </nav>

          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-glass)] border border-[var(--border-color)] mb-6">
              <Sparkles className="w-4 h-4 text-[var(--secondary)]" />
              <span className="text-sm">Plan • Explore • Remember</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Your Adventures,{' '}
              <span className="gradient-text">Beautifully Organized</span>
            </h2>

            <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
              Track your travel budget, discover amazing places, and create unforgettable memories.
              Start planning your next adventure today.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 md:gap-16">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">{trips.length}</div>
                <div className="text-sm text-[var(--text-muted)]">Trips Planned</div>
              </div>
              <div className="w-px h-12 bg-[var(--border-color)]" />
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">
                  {trips.reduce((sum, t) => sum + t.places.length, 0)}
                </div>
                <div className="text-sm text-[var(--text-muted)]">Places Saved</div>
              </div>
              <div className="w-px h-12 bg-[var(--border-color)]" />
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">∞</div>
                <div className="text-sm text-[var(--text-muted)]">Memories</div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: Compass,
                title: 'Plan Your Trip',
                description: 'Create detailed itineraries with destinations, dates, and everything you need.',
                color: 'var(--primary)',
              },
              {
                icon: MapPin,
                title: 'Locate Places',
                description: 'Add and discover places on an interactive map. Never miss a spot!',
                color: 'var(--primary)', // Match theme
              },
              {
                icon: Globe,
                title: 'Track Budget',
                description: 'Set budgets, track expenses by category, and stay on top of your spending.',
                color: 'var(--primary)', // Match theme
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="card text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-[var(--text-secondary)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Trips Section */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-bold">Your Trips</h3>
            <p className="text-[var(--text-secondary)]">
              {trips.length === 0 ? 'Start your first adventure' : `${trips.length} trip${trips.length !== 1 ? 's' : ''} planned`}
            </p>
          </div>

          {trips.length > 0 && (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trips..."
                className="input-field pl-12 w-full md:w-64"
              />
            </div>
          )}
        </div>

        {trips.length === 0 ? (
          <div className="card text-center py-16">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 bg-[var(--primary)]/20 rounded-full animate-pulse" />
              <div className="absolute inset-4 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center">
                <Plane className="w-12 h-12 text-[var(--primary)]" />
              </div>
            </div>
            <h4 className="text-xl font-semibold mb-2">No trips yet</h4>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
              Your adventure awaits! Create your first trip and start planning your dream vacation.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Plan Your First Trip
            </button>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="card text-center py-12">
            <Search className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-4" />
            <h4 className="text-xl font-semibold mb-2">No trips found</h4>
            <p className="text-[var(--text-secondary)]">
              Try a different search term
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip, index) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onClick={() => router.push(`/trip/${trip.id}`)}
                onDelete={(e) => handleDeleteTrip(e, trip.id)}
                delay={index * 100}
              />
            ))}
          </div>
        )}
      </section>

      {/* Create Trip Modal */}
      <CreateTripModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTripCreated={handleTripCreated}
      />
    </div>
  );
}

export default function Home() {
  return (
    <TripProvider>
      <HomeContent />
    </TripProvider>
  );
}
