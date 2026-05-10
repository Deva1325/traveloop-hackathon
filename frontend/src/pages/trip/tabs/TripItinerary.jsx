import { useState, useMemo } from 'react';
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
  PlusCircle,
  Calendar,
  LayoutList,
  History,
  DollarSign,
  Globe,
  Milestone
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { addStop, deleteStop, reorderStops, updateStop } from '@/api/itinerary.api';
import toast from 'react-hot-toast';

// Sortable Item Component for List View
function SortableStop({ stop, onRemove, isDeleting, onUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [activityForm, setActivityForm] = useState({ name: '', time: '10:00', cost: '0' });

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
    setActivityForm({ name: '', time: '10:00', cost: '0' });
    setShowAddActivity(false);
  };

  const removeActivity = (activityId) => {
    const newActivities = activities.filter(a => a.id !== activityId);
    onUpdate(stop.id, { activities: newActivities });
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-card rounded-xl border shadow-sm group overflow-hidden mb-4">
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
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] uppercase font-bold">
              {new Date(stop.arrivalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(stop.departureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <Globe className="w-3 h-3" /> {stop.City?.country || ''} • {stop.nights || 1} Nights
          </p>
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
        <div className="p-4 space-y-4 bg-card animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Timeline & Activities</h5>
            </div>
            {!showAddActivity && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddActivity(true);
                }}
                className="h-7 text-[10px] gap-1 text-primary hover:text-primary hover:bg-primary/10 font-bold border border-primary/20"
              >
                <PlusCircle className="w-3 h-3" /> ADD ACTIVITY
              </Button>
            )}
          </div>
          
          {showAddActivity && (
            <form onSubmit={handleAddActivity} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4 p-4 rounded-xl bg-muted/30 border border-dashed animate-in fade-in slide-in-from-top-2" onClick={(e) => e.stopPropagation()}>
              <div className="md:col-span-2">
                <Input 
                  placeholder="Activity (e.g. Vatican Museum)" 
                  className="h-9 text-sm"
                  value={activityForm.name}
                  onChange={e => setActivityForm({...activityForm, name: e.target.value})}
                  required
                />
              </div>
              <Input 
                type="time"
                className="h-9 text-sm"
                value={activityForm.time}
                onChange={e => setActivityForm({...activityForm, time: e.target.value})}
                required
              />
              <div className="flex gap-2">
                <Input 
                  type="number"
                  placeholder="Cost"
                  className="h-9 text-sm w-full"
                  value={activityForm.cost}
                  onChange={e => setActivityForm({...activityForm, cost: e.target.value})}
                />
                <Button type="submit" size="sm" className="h-9 px-4">Save</Button>
                <Button type="button" variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => setShowAddActivity(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {activities.length > 0 ? (
              <div className="relative pl-4 border-l-2 border-primary/20 ml-3 space-y-4">
                {activities.map((activity, idx) => (
                  <div key={activity.id} className="relative group/item">
                    <div className="absolute -left-[25px] top-2 w-4 h-4 rounded-full bg-primary border-4 border-background ring-4 ring-primary/5"></div>
                    <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/20 hover:border-primary/40 hover:bg-muted/40 transition-all duration-300">
                      <div className="w-16 text-[11px] font-bold text-primary flex items-center gap-1 shrink-0 uppercase tracking-tighter">
                        <Clock className="w-3 h-3" /> {activity.time}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold">{activity.name}</p>
                        {activity.cost > 0 && (
                          <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                            <DollarSign className="w-2 h-2" /> Est. Cost: ${activity.cost}
                          </p>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover/item:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeActivity(activity.id);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-muted/20 rounded-xl border border-dashed">
                <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-widest italic opacity-60">Nothing planned for this city stop yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Timeline View Component
function ItineraryTimeline({ stops }) {
  // Flatten and sort all activities by date and time
  const timelineData = useMemo(() => {
    const data = [];
    stops.forEach(stop => {
      const activities = stop.activities ? (typeof stop.activities === 'string' ? JSON.parse(stop.activities) : stop.activities) : [];
      activities.forEach(activity => {
        data.push({
          ...activity,
          cityName: stop.City?.name,
          cityImage: stop.City?.imageUrl,
          arrivalDate: stop.arrivalDate
        });
      });
    });
    // Sort by arrival date and then by time
    return data.sort((a, b) => {
      if (a.arrivalDate !== b.arrivalDate) return new Date(a.arrivalDate) - new Date(b.arrivalDate);
      return a.time.localeCompare(b.time);
    });
  }, [stops]);

  if (timelineData.length === 0) {
    return (
      <div className="text-center py-32 bg-card rounded-[40px] border border-dashed border-primary/20">
        <Milestone className="w-12 h-12 text-primary/40 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-1">Timeline is empty</h3>
        <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">Add activities to your cities to see them in a chronological view.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative pl-8 md:pl-32 border-l-4 border-primary/10 ml-4 md:ml-0 space-y-12">
        {timelineData.map((item, idx) => (
          <div key={item.id} className="relative">
            {/* Date Label on Left (Desktop) */}
            <div className="hidden md:block absolute -left-32 top-1 w-24 text-right">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter leading-none">
                {new Date(item.arrivalDate).toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              <p className="text-lg font-black text-primary leading-none mt-1">
                {new Date(item.arrivalDate).getDate()} {new Date(item.arrivalDate).toLocaleDateString('en-US', { month: 'short' })}
              </p>
            </div>

            {/* Timeline Dot */}
            <div className="absolute -left-[42px] top-1 w-6 h-6 rounded-full bg-primary border-4 border-background ring-8 ring-primary/5"></div>
            
            <div className="bg-card rounded-2xl border shadow-md p-6 flex flex-col md:flex-row gap-6 items-start hover:shadow-xl transition-all hover:border-primary/30 duration-300">
              <div className="w-full md:w-32 h-24 rounded-xl overflow-hidden shrink-0 border relative group">
                <img src={item.cityImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-background/90 backdrop-blur-sm rounded text-[9px] font-bold uppercase">{item.cityName}</div>
              </div>
              
              <div className="flex-1 space-y-2 w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black tracking-widest h-5 mb-1 flex w-fit items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.time}
                    </Badge>
                    <h4 className="text-xl font-black tracking-tight">{item.name}</h4>
                  </div>
                  {item.cost > 0 && (
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Estimated Cost</p>
                      <p className="text-lg font-black text-primary">${item.cost}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-dashed">
                   <div className="flex -space-x-2">
                     <div className="w-6 h-6 rounded-full border-2 border-background bg-muted"></div>
                     <div className="w-6 h-6 rounded-full border-2 border-background bg-muted"></div>
                   </div>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase">Shared with 2 travelers</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TripItinerary() {
  const { trip } = useOutletContext();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'timeline'
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCity, setNewCity] = useState({ name: '', country: '', arrivalDate: '', departureDate: '', nights: 1 });

  const stops = useMemo(() => trip?.TripStops || [], [trip]);

  // Mock list of popular cities
  const popularCities = [
    { name: 'Rome', country: 'Italy', region: 'Europe', popularity: 'High', costIndex: '$$$' },
    { name: 'Paris', country: 'France', region: 'Europe', popularity: 'Extreme', costIndex: '$$$$' },
    { name: 'Tokyo', country: 'Japan', region: 'Asia', popularity: 'High', costIndex: '$$$' },
    { name: 'London', country: 'UK', region: 'Europe', popularity: 'High', costIndex: '$$$$' },
  ].filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.country.toLowerCase().includes(searchTerm.toLowerCase()));

  const addMutation = useMutation({
    mutationFn: (data) => addStop(trip.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', trip.id] });
      toast.success('Added to Trip!');
      setShowAddModal(false);
      setNewCity({ name: '', country: '', arrivalDate: '', departureDate: '', nights: 1 });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({stopId, data}) => updateStop(trip.id, stopId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trip', trip.id] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (stopId) => deleteStop(trip.id, stopId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', trip.id] });
      toast.success('Removed stop');
    }
  });

  const reorderMutation = useMutation({
    mutationFn: (newStops) => reorderStops(trip.id, newStops)
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = stops.findIndex(i => i.id === active.id);
      const newIndex = stops.findIndex(i => i.id === over.id);
      const reordered = arrayMove(stops, oldIndex, newIndex);
      const payload = reordered.map((s, idx) => ({ id: s.id, orderIndex: idx }));
      reorderMutation.mutate(payload);
      queryClient.setQueryData(['trip', trip.id], (old) => ({ ...old, TripStops: reordered }));
    }
  };

  const handleAddStop = (e) => {
    e.preventDefault();
    const arrival = new Date(newCity.arrivalDate);
    const departure = new Date(newCity.departureDate);
    const isOverlap = stops.some(s => {
      const sArr = new Date(s.arrivalDate);
      const sDep = new Date(s.departureDate);
      return (arrival < sDep && departure > sArr);
    });
    if (isOverlap) return toast.error('Overlap detected!');

    addMutation.mutate({
      cityName: newCity.name,
      country: newCity.country,
      arrivalDate: newCity.arrivalDate,
      departureDate: newCity.departureDate,
      nights: Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24)),
      orderIndex: stops.length
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in h-full pb-10">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-card rounded-2xl border shadow-sm p-6 space-y-6 sticky top-6">
          <div className="space-y-2">
            <h3 className="font-bold text-lg flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /> City Explorer</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Discover & add destinations</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search cities..." 
              className="pl-9 h-11 bg-muted/50 border-none" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
            {popularCities.map((city, idx) => (
              <div key={idx} className="p-4 rounded-xl border bg-muted/5 hover:border-primary/30 hover:bg-primary/5 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-sm group-hover:text-primary">{city.name}</h4>
                    <p className="text-[10px] text-muted-foreground">{city.country}</p>
                  </div>
                  <Badge variant="outline" className="text-[8px] h-4">{city.costIndex}</Badge>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-[9px] font-bold text-muted-foreground flex items-center gap-1">
                    <History className="w-3 h-3" /> {city.popularity}
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold" onClick={() => { setNewCity({ ...newCity, name: city.name, country: city.country }); setShowAddModal(true); }}>
                    <Plus className="w-3 h-3" /> ADD
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-3xl border shadow-sm">
          <div>
            <h2 className="text-2xl font-bold">Itinerary Builder</h2>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-sm text-muted-foreground">Manage your stops and daily plans</p>
              <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold">{stops.length} Stops</Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-muted p-1 rounded-lg">
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}><LayoutList className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('timeline')} className={`p-1.5 rounded-md transition-all ${viewMode === 'timeline' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}><Calendar className="w-4 h-4" /></button>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="gap-2 shadow-xl shadow-primary/20"><Plus className="w-4 h-4" /> Add Stop</Button>
          </div>
        </div>

        <div className="space-y-6">
          {viewMode === 'list' ? (
            stops.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={stops} strategy={verticalListSortingStrategy}>
                  {stops.map(stop => (
                    <SortableStop key={stop.id} stop={stop} onRemove={(id) => deleteMutation.mutate(id)} isDeleting={deleteMutation.isPending} onUpdate={(stopId, data) => updateMutation.mutate({ stopId, data })} />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-card rounded-[40px] border border-dashed border-primary/20"><MapPin className="w-12 h-12 text-primary/20 mb-4" /><h3 className="text-xl font-bold">Your journey starts here</h3><Button onClick={() => setShowAddModal(true)} className="mt-6 rounded-full px-8">Get Started</Button></div>
            )
          ) : (
            <ItineraryTimeline stops={stops} />
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-xl border rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b flex justify-between items-center bg-muted/20">
              <div><h2 className="text-2xl font-bold">Add Destination</h2><p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mt-1">Plan your next city stop</p></div>
              <Button variant="ghost" size="icon" className="rounded-full bg-muted/50" onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></Button>
            </div>
            <form onSubmit={handleAddStop} className="p-8 space-y-6">
              {stops.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest flex items-center gap-1"><Calendar className="w-3 h-3" /> Already Occupied Dates</p>
                  <div className="flex flex-wrap gap-2">{stops.map(s => (<Badge key={s.id} variant="outline" className="bg-white border-amber-200 text-amber-700 text-[9px]">{s.City?.name}: {new Date(s.arrivalDate).toLocaleDateString()} - {new Date(s.departureDate).toLocaleDateString()}</Badge>))}</div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-sm font-bold flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> City Name</label><Input placeholder="e.g. Rome" className="h-12 text-base" value={newCity.name} onChange={e => setNewCity({...newCity, name: e.target.value})} required /></div>
                <div className="space-y-2"><label className="text-sm font-bold flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Country</label><Input placeholder="e.g. Italy" className="h-12 text-base" value={newCity.country} onChange={e => setNewCity({...newCity, country: e.target.value})} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-sm font-bold flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Arrival Date</label><Input type="date" className="h-12 text-base" min={trip.startDate.split('T')[0]} max={trip.endDate.split('T')[0]} value={newCity.arrivalDate} onChange={e => setNewCity({...newCity, arrivalDate: e.target.value})} required /></div>
                <div className="space-y-2"><label className="text-sm font-bold flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Departure Date</label><Input type="date" className="h-12 text-base" min={newCity.arrivalDate || trip.startDate.split('T')[0]} max={trip.endDate.split('T')[0]} value={newCity.departureDate} onChange={e => setNewCity({...newCity, departureDate: e.target.value})} required /></div>
              </div>
              <div className="pt-6 flex gap-4"><Button type="button" variant="outline" className="flex-1 h-14 font-bold rounded-2xl" onClick={() => setShowAddModal(false)}>Cancel</Button><Button type="submit" className="flex-1 h-14 font-bold rounded-2xl shadow-xl shadow-primary/20" disabled={addMutation.isPending}>{addMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Stop'}</Button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
