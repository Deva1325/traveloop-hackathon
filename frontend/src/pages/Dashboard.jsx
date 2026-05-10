import { Link } from 'react-router-dom';
import {
  Plane,
  MapPin,
  Calendar,
  Wallet,
  ArrowRight,
  TrendingUp,
  Plus
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getTrips } from '@/api/trips.api';
import { useAuthStore } from '@/store/authStore';

const STATS = [
  { label: 'Total Trips', value: '12', icon: Plane, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Countries Visited', value: '8', icon: MapPin, color: 'text-green-500', bg: 'bg-green-500/10' },
  { label: 'Upcoming', value: '2', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { label: 'Avg. Budget', value: '$2.5k', icon: Wallet, color: 'text-orange-500', bg: 'bg-orange-500/10' },
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const { data: trips, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: getTrips,
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'Traveler'}! 👋</h1>
          <p className="text-muted-foreground mt-1">Ready for your next adventure?</p>
        </div>
        <Link
          to="/trips/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25"
        >
          <Plus className="w-5 h-5" />
          Plan New Trip
        </Link>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <div key={i} className="bg-card p-6 rounded-2xl shadow-sm border flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Recent Trips */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Your Recent Trips
          </h2>
          <Link to="/trips" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-muted animate-pulse rounded-2xl h-64"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips?.map((trip) => (
              <Link key={trip.id} to={`/trips/${trip.id}`} className="group relative bg-card rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold capitalize shadow-sm">
                    {trip.status}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-xl truncate">{trip.title}</h3>
                    <p className="text-sm text-white/80 mt-1 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -
                      {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{trip.destinations?.length || 0} Stops</span>
                  </div>
                  <div className="font-semibold text-primary">
                    ${trip.budget}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
