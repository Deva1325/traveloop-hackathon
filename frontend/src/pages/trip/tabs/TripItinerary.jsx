import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
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
import { GripVertical, Plus, Trash2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Sortable Item Component
function SortableStop({ stop, onRemove }) {
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
        {stop.image ? (
          <img src={stop.image} alt={stop.name} className="w-full h-full object-cover" />
        ) : (
          <MapPin className="w-6 h-6 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-lg">{stop.name}</h4>
        <p className="text-sm text-muted-foreground">{stop.country} • {stop.nights || 2} Nights</p>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onRemove(stop.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default function TripItinerary() {
  const { trip } = useOutletContext();
  
  // Mock stops for now
  const [stops, setStops] = useState([
    { id: '1', name: 'Rome', country: 'Italy', nights: 3, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=150&q=80' },
    { id: '2', name: 'Florence', country: 'Italy', nights: 2, image: 'https://images.unsplash.com/photo-1543429776-2782632bf814?auto=format&fit=crop&w=150&q=80' },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setStops((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRemove = (id) => {
    setStops(stops.filter(s => s.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in h-full">
      
      {/* Itinerary Builder */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
          <h2 className="text-xl font-bold">Itinerary</h2>
          <Button variant="outline" size="sm" className="gap-2">
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
                <SortableStop key={stop.id} stop={stop} onRemove={handleRemove} />
              ))}
            </SortableContext>
          </DndContext>
          
          {stops.length === 0 && (
            <div className="text-center py-12 bg-muted/30 border border-dashed rounded-xl">
              <p className="text-muted-foreground">No stops added yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Map / Search Sidebar */}
      <div className="bg-card rounded-xl border shadow-sm p-4 h-[500px] flex flex-col">
        <h3 className="font-bold text-lg mb-4">Search Destinations</h3>
        {/* Placeholder for city search module */}
        <div className="bg-muted flex-1 rounded-lg flex items-center justify-center border-dashed border-2">
          <span className="text-muted-foreground text-sm font-medium">Map & Search Area</span>
        </div>
      </div>
    </div>
  );
}
