import { ArrowRight, MapPin } from "lucide-react";
import { useState } from "react";

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

                <form onSubmit={handleSubmit} className="relative w-full max-w-lg mx-auto group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="e.g. Paris, Tokyo, New York"
                        className="w-full h-16 pl-14 pr-16 bg-card border-2 border-border rounded-full text-xl shadow-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!value.trim()}
                        className="absolute inset-y-2 right-2 aspect-square rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
}
