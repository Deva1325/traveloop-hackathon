import { useState } from 'react';
import { useParams, Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Calendar, 
  MapPin, 
  Share2, 
  Settings, 
  Map, 
  Wallet, 
  CheckSquare, 
  FileText, 
  Edit, 
  Trash2, 
  X,
  Loader2
} from 'lucide-react';
import { getTripById, updateTrip, deleteTrip } from '@/api/trips.api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function TripDetails() {
  const { tripId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [showSettings, setShowSettings] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const { data: trip, isLoading } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => getTripById(tripId),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateTrip(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
      toast.success('Trip updated successfully');
      setShowEditModal(false);
    },
    onError: (error) => toast.error(error.message || 'Failed to update trip')
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTrip(tripId),
    onSuccess: () => {
      toast.success('Trip deleted');
      navigate('/trips');
    }
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

  const handleEditClick = () => {
    setEditForm({
      title: trip.title,
      description: trip.description || '',
      startDate: trip.startDate.split('T')[0],
      endDate: trip.endDate.split('T')[0],
      budget: trip.budget,
      coverImage: trip.coverImage,
      isPublic: trip.isPublic || false
    });
    setShowEditModal(true);
    setShowSettings(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateMutation.mutate(editForm);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in relative">
      {/* Trip Header */}
      <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shrink-0">
        <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="absolute top-4 right-4 flex gap-2">
          <Button 
            variant="secondary" 
            className="backdrop-blur-md bg-white/20 text-white hover:bg-white/30 border-none"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Trip link copied!');
            }}
          >
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          
          <div className="relative">
            <Button 
              variant="secondary" 
              size="icon" 
              className="backdrop-blur-md bg-white/20 text-white hover:bg-white/30 border-none"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>

            {showSettings && (
              <div className="absolute right-0 mt-2 w-48 bg-card border rounded-xl shadow-xl z-50 overflow-hidden animate-in zoom-in-95 duration-100">
                <button 
                  onClick={handleEditClick}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-muted transition-colors"
                >
                  <Edit className="w-4 h-4" /> Edit Trip
                </button>
                <button 
                  onClick={() => {
                    if(confirm('Are you sure you want to delete this trip?')) deleteMutation.mutate();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors border-t"
                >
                  <Trash2 className="w-4 h-4" /> Delete Trip
                </button>
              </div>
            )}
          </div>
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-muted/30">
              <h2 className="text-xl font-bold">Edit Trip Details</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowEditModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Trip Title</label>
                <Input 
                  value={editForm.title} 
                  onChange={e => setEditForm({...editForm, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input 
                    type="date"
                    value={editForm.startDate} 
                    onChange={e => setEditForm({...editForm, startDate: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input 
                    type="date"
                    value={editForm.endDate} 
                    onChange={e => setEditForm({...editForm, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Budget ($)</label>
                <Input 
                  type="number"
                  value={editForm.budget} 
                  onChange={e => setEditForm({...editForm, budget: e.target.value})}
                  required
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input 
                  type="checkbox" 
                  id="isPublic"
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={editForm.isPublic}
                  onChange={e => setEditForm({ ...editForm, isPublic: e.target.checked })}
                />
                <label htmlFor="isPublic" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Public Trip (anyone with the link can view)
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                  ) : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
