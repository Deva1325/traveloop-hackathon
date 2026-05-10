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
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  MapPin, 
  X, 
  Loader2, 
  Search, 
  Map as MapIcon, 
  Clock, 
  ChevronDown, 
  ChevronRight,
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { addStop, deleteStop, reorderStops, updateStop } from '@/api/itinerary.api';
import toast from 'react-hot-toast';

// Sortable Item Component
function SortableStop({ stop, onRemove, isDeleting, onUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [activityForm, setActivityForm] = useState({ name: '', time: '10:00' });

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

  const activities = stop.activities ? (typeof stop.activities === 'string' ? JSON.parse(stop.activities) : stop.activities) : [];

  const handleAddActivity = (e) => {
    e.preventDefault();
    const newActivities = [...activities, { id: Date.now(), ...activityForm }];
    onUpdate(stop.id, { activities: newActivities });
    setActivityForm({ name: '', time: '' });
    setShowAddActivity(false);
  };

  const removeActivity = (activityId) => {
    const newActivities = activities.filter(a => a.id !== activityId);
    onUpdate(stop.id, { activities: newActivities });
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-card rounded-xl border shadow-sm group overflow-hidden">
      <div 
        className="flex items-center gap-4 p-4 border-b bg-muted/10 cursor-pointer hover:bg-muted/20 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab text-muted-foreground hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-5 h-5" />
        </div>
        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden border">
          {stop.City?.imageUrl ? (
            <img src={stop.City.imageUrl} alt={stop.City.name} className="w-full h-full object-cover" />
          ) : (
            <MapPin className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-lg">{stop.City?.name || 'Unknown City'}</h4>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none">{stop.nights || 1} Nights</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{stop.City?.country || ''}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              onRemove(stop.id);
            }} 
            disabled={isDeleting}
            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-3 bg-card animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Planned Activities</h5>
            {!showAddActivity && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAddActivity(true)}
                className="h-7 text-[10px] gap-1 text-primary hover:text-primary hover:bg-primary/10 font-bold"
              >
                <PlusCircle className="w-3 h-3" /> ADD ACTIVITY
              </Button>
            )}
          </div>
          
          {showAddActivity && (
            <form onSubmit={handleAddActivity} className="flex gap-2 mb-4 animate-in fade-in slide-in-from-right-2">
              <Input 
                placeholder="Activity name..." 
                className="h-8 text-xs flex-1"
                value={activityForm.name}
                onChange={e => setActivityForm({...activityForm, name: e.target.value})}
                required
                autoFocus
              />
              <Input 
                type="time"
                className="h-8 text-xs w-32"
                value={activityForm.time}
                onChange={e => setActivityForm({...activityForm, time: e.target.value})}
                required
              />
              <Button type="submit" size="sm" className="h-8 px-3">Add</Button>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowAddActivity(false)}>
                <X className="w-4 h-4" />
              </Button>
            </form>
          )}

          <div className="space-y-2">
            {activities.length > 0 ? activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20 group/item hover:border-primary/50 transition-colors">
                <div className="w-10 h-8 rounded bg-background border flex items-center justify-center text-[10px] font-bold shrink-0 uppercase">
                  {activity.time}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.name}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover/item:opacity-100"
                  onClick={() => removeActivity(activity.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )) : (
              <p className="text-[10px] text-muted-foreground text-center py-2 italic">No activities planned yet. Click add to start planning your day!</p>
            )}
          </div>
        </div>
      )}
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
      toast.success('City added');
      setShowAddModal(false);
      setNewCity({ name: '', country: '', nights: 1 });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({stopId, data}) => updateStop(trip.id, stopId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', trip.id] });
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

  const handleUpdateStop = (stopId, data) => {
    updateMutation.mutate({ stopId, data });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in h-full relative">
      
      {/* Itinerary Builder */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Itinerary Builder</h2>
            <p className="text-sm text-muted-foreground">Drag to reorder cities and plan activities</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="gap-2 shadow-lg">
            <Plus className="w-4 h-4" /> Add Stop
          </Button>
        </div>

        <div className="space-y-4 pb-20">
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
                  onUpdate={handleUpdateStop}
                />
              ))}
            </SortableContext>
          </DndContext>
          
          {stops.length === 0 && (
            <div className="text-center py-20 bg-card border border-dashed rounded-3xl">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-1">Start your journey</h3>
              <p className="text-muted-foreground mb-6 max-w-[280px] mx-auto">Add your first destination to begin building your custom itinerary.</p>
              <Button onClick={() => setShowAddModal(true)} variant="secondary">Add First Stop</Button>
            </div>
          )}
        </div>
      </div>

      {/* Map / Search Sidebar */}
      <div className="space-y-6">
        <div className="bg-card rounded-2xl border shadow-sm p-5 h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Destination Map</h3>
            <Badge variant="outline" className="text-[10px]">LIVE VIEW</Badge>
          </div>
          <div className="bg-muted flex-1 rounded-xl flex items-center justify-center border-dashed border-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/0,0,1/600x400?access_token=pk.placeholder')] bg-cover opacity-30 grayscale group-hover:grayscale-0 transition-all duration-500"></div>
            <div className="text-center p-6 relative z-10">
              <MapIcon className="w-10 h-10 text-primary mx-auto mb-2" />
              <span className="text-muted-foreground text-sm font-medium">Map View enabled after<br/>adding 2+ stops</span>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
            AI Travel Assistant
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            I noticed you're traveling through Europe. Would you like me to suggest the best train routes between your stops?
          </p>
          <Button variant="link" className="p-0 h-auto text-xs mt-3 text-primary font-bold">Generate Route Suggestions →</Button>
        </div>
      </div>

      {/* Add City Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-muted/30">
              <h2 className="text-xl font-bold">Add New Stop</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <form onSubmit={handleAddCity} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search for a city..."
                    className="pl-9"
                    value={newCity.name} 
                    onChange={e => setNewCity({...newCity, name: e.target.value})}
                    required
                  />
                </div>
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
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration</label>
                  <Input 
                    type="number"
                    min="1"
                    value={newCity.nights} 
                    onChange={e => setNewCity({...newCity, nights: e.target.value})}
                    required
                  />
                </div>
                <div className="flex items-end pb-1">
                  <span className="text-sm text-muted-foreground font-medium">Nights stay</span>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={addMutation.isPending}>
                  {addMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Stop'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
