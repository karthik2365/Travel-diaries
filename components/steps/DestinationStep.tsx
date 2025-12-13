import { ArrowRight, MapPin } from "lucide-react";
import { useState } from "react";
import PlaceAutocomplete from "@/components/ui/PlaceAutocomplete";

interface DestinationStepProps {
    onNext: (destination: string) => void;
}

export default function DestinationStep({ onNext }: DestinationStepProps) {
    const [value, setValue] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onNext(value);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-2xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-full space-y-8 text-center">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                        Where to next?
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto">
                        Start your journey by choosing a dream destination.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="relative w-full max-w-lg mx-auto">
                    <PlaceAutocomplete
                        value={value}
                        onChange={setValue}
                        onSelect={(val) => {
                            // Optional: Auto-submit on select if desired, or just let user click arrow
                            // For now, we update value and keep focus or let user submit
                        }}
                        autoFocus
                    />

                    <button
                        type="submit"
                        disabled={!value.trim()}
                        className="absolute top-2 right-2 z-10 aspect-square rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all h-12 w-12"
                    >
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
}
