import { ArrowRight, DollarSign } from "lucide-react";
import { useState } from "react";

interface BudgetStepProps {
    onNext: (budget: number) => void;
}

export default function BudgetStep({ onNext }: BudgetStepProps) {
    const [value, setValue] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const budget = parseFloat(value);
        if (!isNaN(budget) && budget > 0) {
            onNext(budget);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-2xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-full space-y-8 text-center">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                        What is your budget?
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto">
                        Set a total budget for your trip. We'll help you allocate it.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="relative w-full max-w-lg mx-auto group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="e.g. 5000"
                        min="0"
                        className="w-full h-16 pl-14 pr-16 bg-card border-2 border-border rounded-full text-xl shadow-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!value || parseFloat(value) <= 0}
                        className="absolute inset-y-2 right-2 aspect-square rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
}
