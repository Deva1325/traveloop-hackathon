import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, MapPin, X, Loader2, Search, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { addStop, deleteStop, reorderStops } from '@/api/itinerary.api';
import toast from 'react-hot-toast';

// Sortable Item Component
function SortableStop({ stop, onRemove, isDeleting }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm group">
      <div {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
        {stop.City?.imageUrl ? (
          <img src={stop.City.imageUrl} alt={stop.City.name} className="w-full h-full object-cover" />
        ) : (
          <MapPin className="w-6 h-6 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-lg">{stop.City?.name || 'Unknown City'}</h4>
        <p className="text-sm text-muted-foreground">{stop.City?.country || ''} • {stop.nights || 1} Nights</p>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onRemove(stop.id)} 
        disabled={isDeleting}
        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </Button>
    </div>
  );
}

export default function TripItinerary() {
  const { trip } = useOutletContext();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCity, setNewCity] = useState({ name: '', country: '', nights: 1 });

  const stops = trip?.TripStops || [];

  const addMutation = useMutation({
    mutationFn: (data) => addStop(trip.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', trip.id] });
      toast.success('City added to itinerary');
      setShowAddModal(false);
      setNewCity({ name: '', country: '', nights: 1 });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (stopId) => deleteStop(trip.id, stopId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', trip.id] });
      toast.success('Stop removed');
    }
  });

  const reorderMutation = useMutation({
    mutationFn: (newStops) => reorderStops(trip.id, newStops)
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = stops.findIndex(i => i.id === active.id);
      const newIndex = stops.findIndex(i => i.id === over.id);
      const reordered = arrayMove(stops, oldIndex, newIndex);
      
      const payload = reordered.map((s, idx) => ({ id: s.id, orderIndex: idx }));
      reorderMutation.mutate(payload);
      
      // Optimistic update
      queryClient.setQueryData(['trip', trip.id], (old) => ({
        ...old,
        TripStops: reordered
      }));
    }
  };

  const handleAddCity = (e) => {
    e.preventDefault();
    addMutation.mutate({
      cityName: newCity.name,
      country: newCity.country,
      nights: Number(newCity.nights),
      orderIndex: stops.length
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in h-full relative">
      
      {/* Itinerary Builder */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
          <h2 className="text-xl font-bold">Itinerary</h2>
          <Button onClick={() => setShowAddModal(true)} variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" /> Add City
          </Button>
        </div>

        <div className="space-y-4">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={stops}
              strategy={verticalListSortingStrategy}
            >
              {stops.map(stop => (
                <SortableStop 
                  key={stop.id} 
                  stop={stop} 
                  onRemove={(id) => deleteMutation.mutate(id)} 
                  isDeleting={deleteMutation.isPending}
                />
              ))}
            </SortableContext>
          </DndContext>
          
          {stops.length === 0 && (
            <div className="text-center py-20 bg-muted/30 border border-dashed rounded-2xl">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">No stops added yet.</p>
              <Button variant="link" onClick={() => setShowAddModal(true)}>Add your first destination</Button>
            </div>
          )}
        </div>
      </div>

      {/* Map / Search Sidebar */}
      <div className="bg-card rounded-xl border shadow-sm p-4 h-[500px] flex flex-col">
        <h3 className="font-bold text-lg mb-4">Search Destinations</h3>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search for cities..." className="pl-9 bg-muted/50 border-none" />
        </div>
        <div className="bg-muted flex-1 rounded-lg flex items-center justify-center border-dashed border-2">
          <div className="text-center p-6">
            <MapIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <span className="text-muted-foreground text-sm font-medium">Interactive Map coming soon</span>
          </div>
        </div>
      </div>

      {/* Add City Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-muted/30">
              <h2 className="text-xl font-bold">Add Destination</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <form onSubmit={handleAddCity} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City Name</label>
                <Input 
                  placeholder="e.g. Paris"
                  value={newCity.name} 
                  onChange={e => setNewCity({...newCity, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <Input 
                  placeholder="e.g. France"
                  value={newCity.country} 
                  onChange={e => setNewCity({...newCity, country: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Nights</label>
                <Input 
                  type="number"
                  min="1"
                  value={newCity.nights} 
                  onChange={e => setNewCity({...newCity, nights: e.target.value})}
                  required
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={addMutation.isPending}>
                  {addMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add City'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
