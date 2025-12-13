import { ArrowRight, MapPin, Navigation } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import PlaceAutocomplete from "@/components/ui/PlaceAutocomplete";

interface OriginStepProps {
    onNext: (origin: string, coords?: { lat: number; lon: number }) => void;
}

export default function OriginStep({ onNext }: OriginStepProps) {
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onNext(value);
        }
    };

    const handleGeolocation = () => {
        setLoading(true);
        setError("");

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLoading(false);
                // We submit with a generic name but specific coords
                onNext("Current Location", {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            },
            () => {
                setLoading(false);
                setError("Unable to retrieve your location");
            }
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-2xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-full space-y-8 text-center">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                        Where are you starting?
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto">
                        Enter your origin or let us find you.
                    </p>
                </div>

                <div className="space-y-4 w-full max-w-lg mx-auto">
                    <button
                        onClick={handleGeolocation}
                        disabled={loading}
                        className={cn(
                            "w-full flex items-center justify-center gap-2 p-4 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all font-medium text-lg",
                            loading && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <Navigation className={cn("w-5 h-5", loading && "animate-spin")} />
                        {loading ? "Locating..." : "Use Current Location"}
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
                        </div>
                    </div>

                    <form onSubmit={handleManualSubmit} className="relative w-full group">
                        <PlaceAutocomplete
                            value={value}
                            onChange={setValue}
                            placeholder="e.g. London, Berlin"
                            onSelect={(val) => {
                                // Optional auto-submit
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!value.trim()}
                            className="absolute top-2 right-2 z-10 aspect-square rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all h-12 w-12"
                        >
                            <ArrowRight className="w-6 h-6" />
                        </button>
                    </form>
                    {error && <p className="text-destructive text-sm mt-2">{error}</p>}
                </div>
            </div>
        </div>
    );
}
