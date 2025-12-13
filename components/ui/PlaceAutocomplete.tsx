import { useState, useRef, useEffect } from "react";
import { Check, MapPin } from "lucide-react";
import { cn, CITIES_LIST } from "@/lib/utils";

interface PlaceAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    autoFocus?: boolean;
    onSelect?: (value: string) => void;
}

export default function PlaceAutocomplete({
    value,
    onChange,
    placeholder = "Search for a city...",
    className,
    autoFocus = false,
    onSelect
}: PlaceAutocompleteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);

        if (newValue.trim().length > 0) {
            const filtered = CITIES_LIST.filter(city =>
                city.toLowerCase().includes(newValue.toLowerCase())
            );
            setSuggestions(filtered);
            setIsOpen(true);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    };

    const handleSelect = (city: string) => {
        onChange(city);
        setIsOpen(false);
        if (onSelect) {
            onSelect(city);
        }
    };

    const handleFocus = () => {
        if (value.trim().length > 0) {
            const filtered = CITIES_LIST.filter(city =>
                city.toLowerCase().includes(value.toLowerCase())
            );
            if (filtered.length > 0) {
                setSuggestions(filtered);
                setIsOpen(true);
            }
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className={cn("relative group", className)}>
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <MapPin className="w-6 h-6" />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={handleInput}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    className="w-full h-16 pl-14 pr-16 bg-card border-2 border-border rounded-full text-xl shadow-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                    autoFocus={autoFocus}
                />
            </div>

            {/* Dropdown Results */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-card border border-border rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    <ul className="space-y-1">
                        {suggestions.map((city) => (
                            <li key={city}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(city)}
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-secondary/50 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-secondary p-2 rounded-full">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <span className="font-medium text-lg">{city}</span>
                                    </div>
                                    {value.toLowerCase() === city.toLowerCase() && (
                                        <Check className="w-5 h-5 text-primary" />
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
