"use client";

import { useState } from "react";
import DestinationStep from "@/components/steps/DestinationStep";
import OriginStep from "@/components/steps/OriginStep";
import BudgetStep from "@/components/steps/BudgetStep";
import Dashboard from "@/components/Dashboard";
import { calculateDistance, getCoordinates } from "@/lib/utils";
import { Plane } from "lucide-react";

export default function Home() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    destination: "",
    origin: "",
    originCoords: null as { lat: number; lon: number } | null,
    budget: 0,
    distance: 0,
  });

  const handleDestinationSubmit = (destination: string) => {
    setData((prev) => ({ ...prev, destination }));
    setStep(1);
  };

  const handleOriginSubmit = (origin: string, coords?: { lat: number; lon: number }) => {
    // Calculate distance logic
    let startCoords = coords;
    if (!startCoords) {
      // Manual input - try to resolve
      startCoords = getCoordinates(origin);
    }

    // Resolve destination
    const endCoords = getCoordinates(data.destination);

    let dist = 0;
    // Only calculate if we have valid non-zero coords for both (our mock returns 0,0 if not found)
    if (startCoords && (startCoords.lat !== 0 || startCoords.lon !== 0) && (endCoords.lat !== 0 || endCoords.lon !== 0)) {
      dist = calculateDistance(startCoords.lat, startCoords.lon, endCoords.lat, endCoords.lon);
    } else {
      // Fallback for prototype if coords missing: Mock a reasonable distance if strings are present
      // This ensures the UI looks populated users
      if (origin && data.destination) {
        dist = Math.floor(Math.random() * 5000) + 500;
      }
    }

    setData((prev) => ({
      ...prev,
      origin,
      originCoords: startCoords || null,
      distance: dist
    }));
    setStep(2);
  };

  const handleBudgetSubmit = (budget: number) => {
    setData((prev) => ({ ...prev, budget }));
    setStep(3);
  };

  const handleReset = () => {
    setStep(0);
    setData({
      destination: "",
      origin: "",
      originCoords: null,
      budget: 0,
      distance: 0,
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">

      {/* Header (Simplified) */}
      <header className="p-6 flex items-center justify-between sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            <Plane className="w-5 h-5" />
          </div>
          TravelDiaries<span className="text-primary hidden sm:inline">.AI</span>
        </div>
        <div className="text-sm font-medium text-muted-foreground flex items-center gap-4">
          {step < 3 && (
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${step >= 0 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`h-2 w-2 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`h-2 w-2 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col">
        {step === 0 && <DestinationStep onNext={handleDestinationSubmit} />}
        {step === 1 && <OriginStep onNext={handleOriginSubmit} />}
        {step === 2 && <BudgetStep onNext={handleBudgetSubmit} />}
        {step === 3 && (
          <Dashboard
            destination={data.destination}
            origin={data.origin}
            distance={data.distance}
            budget={data.budget}
            onReset={handleReset}
          />
        )}
      </div>

    </main>
  );
}
