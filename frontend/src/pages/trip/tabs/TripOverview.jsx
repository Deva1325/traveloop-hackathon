import { useOutletContext, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  PlaneTakeoff,
  Luggage,
  Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getPackingItems } from '@/api/packing.api';

export default function TripOverview() {
  const { trip } = useOutletContext();
  
  const { data: packingItems = [] } = useQuery({
    queryKey: ['packing', trip.id],
    queryFn: () => getPackingItems(trip.id),
  });

  const stops = trip?.TripStops || [];
  const packedCount = packingItems.filter(i => i.isPacked).length;
  const packingProgress = packingItems.length > 0 ? Math.round((packedCount / packingItems.length) * 100) : 0;

  // Calculate total activity costs
  const totalActivityCost = stops.reduce((sum, stop) => {
    const activities = stop.activities ? (typeof stop.activities === 'string' ? JSON.parse(stop.activities) : stop.activities) : [];
    return sum + activities.reduce((aSum, act) => aSum + (Number(act.cost) || 0), 0);
  }, 0);

  const budgetUsed = totalActivityCost; // For now, only activities. Later add expenses.
  const budgetProgress = trip.budget > 0 ? Math.round((budgetUsed / trip.budget) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Budget Card */}
        <div className="bg-card rounded-3xl border shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Budget</p>
              <h4 className="text-xl font-black text-emerald-600">${trip.budget}</h4>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-muted-foreground">Estimated Spending</span>
              <span>${budgetUsed}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${budgetProgress > 90 ? 'bg-destructive' : 'bg-emerald-500'}`} 
                style={{ width: `${Math.min(budgetProgress, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Itinerary Card */}
        <div className="bg-card rounded-3xl border shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Itinerary</p>
              <h4 className="text-xl font-black text-blue-600">{stops.length} Stops</h4>
            </div>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {stops.map(s => s.City?.name).join(' → ')}
          </p>
          <div className="flex items-center gap-1 mt-3 text-[10px] font-bold text-blue-600 uppercase">
             <TrendingUp className="w-3 h-3" /> Fully Planned
          </div>
        </div>

        {/* Packing Card */}
        <div className="bg-card rounded-3xl border shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600">
              <Luggage className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Packing Status</p>
              <h4 className="text-xl font-black text-amber-600">{packingProgress}%</h4>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-muted-foreground">Items Packed</span>
              <span>{packedCount}/{packingItems.length}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${packingProgress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Countdown Card */}
        <div className="bg-card rounded-3xl border shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</p>
              <h4 className="text-xl font-black text-purple-600 uppercase">{trip.status}</h4>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Ends in {Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))} Days
          </p>
          <Badge className="mt-3 bg-purple-500/10 text-purple-600 border-none text-[9px] font-bold uppercase">Ready for departure</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Itinerary Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <PlaneTakeoff className="w-5 h-5 text-primary" />
              Your Journey
            </h3>
            <Link to={`/trips/${trip.id}/itinerary`} className="text-xs text-primary font-bold uppercase tracking-widest hover:underline">
              View Full Itinerary
            </Link>
          </div>
          
          <div className="space-y-4">
            {stops.length > 0 ? stops.map((stop, idx) => (
              <div key={stop.id} className="bg-card rounded-2xl border p-5 flex items-center gap-6 group hover:border-primary/50 transition-all">
                <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0">
                  <img src={stop.City?.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">{stop.City?.name}</h4>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter mt-0.5">
                    {new Date(stop.arrivalDate).toLocaleDateString()} — {new Date(stop.departureDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-[10px] uppercase">{stop.nights} Nights</Badge>
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Planned
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 bg-muted/20 rounded-[40px] border border-dashed">
                <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">No destinations added yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Packing List Preview */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Luggage className="w-5 h-5 text-primary" />
            Checklist Summary
          </h3>
          <div className="bg-card rounded-3xl border shadow-sm p-6 space-y-4">
             {packingItems.slice(0, 5).map(item => (
               <div key={item.id} className="flex items-center gap-3 py-1">
                  {item.isPacked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-muted"></div>
                  )}
                  <span className={`text-sm ${item.isPacked ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                    {item.name}
                  </span>
               </div>
             ))}
             {packingItems.length > 5 && (
               <p className="text-[10px] text-muted-foreground font-bold uppercase text-center pt-2">
                 + {packingItems.length - 5} more items
               </p>
             )}
             <Link 
               to={`/trips/${trip.id}/checklist`}
               className="flex items-center justify-center w-full mt-4 h-10 rounded-xl bg-secondary text-secondary-foreground font-bold text-xs gap-2 hover:bg-secondary/80 transition-colors"
             >
                Open Checklist <ArrowRight className="w-3 h-3" />
             </Link>
          </div>

          <div className="bg-primary p-6 rounded-[32px] text-primary-foreground shadow-xl shadow-primary/20 overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
               <Navigation className="w-20 h-20" />
             </div>
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-80">Next Step</p>
             <h4 className="text-xl font-black mb-4 leading-tight">Finalize your budget and set off!</h4>
             <Link 
               to={`/trips/${trip.id}/budget`}
               className="inline-flex items-center justify-center bg-white text-primary hover:bg-white/90 rounded-xl font-bold text-[10px] px-6 h-8"
             >
               GO TO BUDGET
             </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
