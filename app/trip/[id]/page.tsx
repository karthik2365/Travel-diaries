'use client';

import { TripProvider } from '@/context/TripContext';
import TripDetailPage from './TripDetailPage';

export default function TripPage() {
    return (
        <TripProvider>
            <TripDetailPage />
        </TripProvider>
    );
}
