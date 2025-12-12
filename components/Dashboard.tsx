import { generateActivities, generateHotels } from "@/lib/utils";
import { Bed, Map, Activity, DollarSign, Navigation, Star } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface DashboardProps {
    destination: string;
    origin: string;
    distance: number | null;
    budget: number;
    onReset: () => void;
}

export default function Dashboard({ destination, origin, distance, budget, onReset }: DashboardProps) {
    const hotels = useMemo(() => generateHotels(budget), [budget]);
    const activities = useMemo(() => generateActivities(budget), [budget]);

    const accomBudget = budget * 0.4;
    const activityBudget = budget * 0.6;

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header / Summary */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Trip to {destination}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Navigation className="w-4 h-4" />
                        <span>From {origin}</span>
                        {distance && (
                            <>
                                <span className="mx-2">•</span>
                                <span>{distance} km</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-3xl font-bold text-primary">${budget.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Budget</div>
                    <button onClick={onReset} className="text-xs text-primary underline mt-2 hover:text-primary/80">Plan New Trip</button>
                </div>
            </div>

            {/* Budget & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Bed className="w-5 h-5 text-indigo-500" />
                        Accommodation Budget (40%)
                    </h3>
                    <div className="text-2xl font-bold mb-2">${accomBudget.toLocaleString()}</div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full w-[40%]" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Recommended for hotels & stays</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-500" />
                        Activities Budget (60%)
                    </h3>
                    <div className="text-2xl font-bold mb-2">${activityBudget.toLocaleString()}</div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[60%]" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Reserved for tours, food & fun</p>
                </div>
            </div>

            {/* Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Hotels Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Bed className="w-5 h-5" />
                        Recommended Stays
                    </h2>
                    <div className="grid gap-4">
                        {hotels.map((hotel) => (
                            <div key={hotel.id} className="group flex flex-col sm:flex-row bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all">
                                <div className="sm:w-32 h-32 sm:h-auto bg-muted relative">
                                    {/* Using a real img tag, normally we'd use Next Image but kept simple for tool */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-4 flex flex-col justify-between flex-1">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold group-hover:text-primary transition-colors">{hotel.name}</h3>
                                            <div className="flex items-center text-xs font-medium bg-secondary px-2 py-1 rounded">
                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                                                {hotel.rating}
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">{hotel.distance}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {hotel.features.map(f => (
                                                <span key={f} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">{f}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-3 flex justify-between items-end">
                                        <div className="text-lg font-bold">${hotel.price.toLocaleString()}</div>
                                        <button className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity">
                                            View Deal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activities Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Map className="w-5 h-5" />
                        Top Experiences
                    </h2>
                    <div className="grid gap-4">
                        {activities.map((activity) => (
                            <div key={activity.id} className="group flex flex-col sm:flex-row bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all">
                                <div className="sm:w-32 h-32 sm:h-auto bg-muted relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={activity.image} alt={activity.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-4 flex flex-col justify-between flex-1">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold group-hover:text-primary transition-colors">{activity.name}</h3>
                                            <div className="flex items-center text-xs font-medium bg-secondary px-2 py-1 rounded">
                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                                                {activity.rating}
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">{activity.duration}</p>
                                    </div>
                                    <div className="mt-3 flex justify-between items-end">
                                        <div className="text-lg font-bold">${activity.price.toLocaleString()}</div>
                                        <button className="text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1.5 rounded-full transition-colors">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
