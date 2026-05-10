import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Grid, List, MapPin, Calendar, MoreVertical, Trash2, Edit, Share2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

import { getTrips, deleteTrip } from '@/api/trips.api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function MyTrips() {
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  
  const queryClient = useQueryClient();
  const { data: trips, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: getTrips,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Trip deleted successfully');
    },
  });

  const filteredTrips = trips?.filter(t => t.title.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Trips</h1>
          <p className="text-muted-foreground mt-1">Manage and organize all your travel plans</p>
        </div>
        <Link to="/trips/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Trip
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card p-4 rounded-xl shadow-sm border">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search your trips..." 
            className="pl-9 w-full bg-muted/50 border-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button 
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-muted animate-pulse h-72 rounded-2xl"></div>
          ))}
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No trips found</h3>
          <p className="text-muted-foreground mb-6">You haven't planned any trips matching that search.</p>
          <Link to="/trips/new">
            <Button>Start Planning</Button>
          </Link>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredTrips.map((trip) => (
            <div key={trip.id} className={`bg-card rounded-2xl overflow-hidden border shadow-sm group hover:shadow-lg transition-all ${viewMode === 'list' ? 'flex flex-row items-center h-32' : 'flex flex-col'}`}>
              <div className={`relative ${viewMode === 'list' ? 'w-48 h-full flex-shrink-0' : 'aspect-video w-full'}`}>
                <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <Badge variant={trip.status === 'planned' ? 'default' : 'secondary'} className="capitalize shadow-sm backdrop-blur-md bg-background/90 text-foreground">
                    {trip.status}
                  </Badge>
                </div>
              </div>
              
              <div className={`p-5 flex flex-col flex-1 ${viewMode === 'list' ? 'justify-center py-2' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors">
                    <Link to={`/trips/${trip.id}`}>{trip.title}</Link>
                  </h3>
                  <div className="relative">
                    <button className="text-muted-foreground hover:bg-muted p-1 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {/* Minimal dropdown placeholder */}
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4" />
                  {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <MapPin className="w-4 h-4 text-primary" />
                    {trip.destinations?.length || 0} Destinations
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" title="Share">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive" 
                      title="Delete"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this trip?')) {
                          deleteMutation.mutate(trip.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
