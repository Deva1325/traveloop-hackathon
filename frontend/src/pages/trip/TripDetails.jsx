import { useParams, Link, useLocation, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, MapPin, Share2, Download, Settings, Map, Wallet, CheckSquare, FileText } from 'lucide-react';
import { getTripById } from '@/api/trips.api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function TripDetails() {
  const { tripId } = useParams();
  const location = useLocation();
  
  const { data: trip, isLoading } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => getTripById(tripId),
  });

  if (isLoading) {
    return <div className="p-8 animate-pulse bg-muted h-64 rounded-2xl"></div>;
  }

  if (!trip) {
    return <div className="p-8 text-center text-muted-foreground">Trip not found</div>;
  }

  const TABS = [
    { name: 'Overview', path: `/trips/${tripId}`, icon: Map, exact: true },
    { name: 'Itinerary', path: `/trips/${tripId}/itinerary`, icon: MapPin },
    { name: 'Budget', path: `/trips/${tripId}/budget`, icon: Wallet },
    { name: 'Checklist', path: `/trips/${tripId}/checklist`, icon: CheckSquare },
    { name: 'Notes', path: `/trips/${tripId}/notes`, icon: FileText },
  ];

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in">
      {/* Trip Header */}
      <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shrink-0">
        <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="secondary" className="backdrop-blur-md bg-white/20 text-white hover:bg-white/30 border-none">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <Button variant="secondary" size="icon" className="backdrop-blur-md bg-white/20 text-white hover:bg-white/30 border-none">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
          <Badge variant="secondary" className="mb-3 bg-white/20 text-white backdrop-blur-md hover:bg-white/30 border-none">
            {trip.status.toUpperCase()}
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">{trip.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {trip.destinations?.length || 0} Destinations
            </div>
            <div className="flex items-center gap-1.5">
              <Wallet className="w-4 h-4" />
              ${trip.budget} Budget
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide border-b shrink-0">
        {TABS.map((tab) => (
          <Link
            key={tab.name}
            to={tab.path}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-medium transition-colors whitespace-nowrap border-b-2 ${
              isActive(tab.path, tab.exact)
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </Link>
        ))}
      </div>

      {/* Dynamic Content Area */}
      <div className="mt-6 flex-1 min-h-0 overflow-y-auto">
        <Outlet context={{ trip }} />
      </div>
    </div>
  );
}
