import { Edit2, Trash2, Calendar, MapPin, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const COLOR_MAP = {
  yellow: 'bg-yellow-100 border-yellow-200 text-yellow-800',
  blue: 'bg-blue-100 border-blue-200 text-blue-800',
  green: 'bg-green-100 border-green-200 text-green-800',
  purple: 'bg-purple-100 border-purple-200 text-purple-800',
  pink: 'bg-pink-100 border-pink-200 text-pink-800',
  gray: 'bg-gray-100 border-gray-200 text-gray-800',
};

export default function NoteCard({ note, onEdit, onDelete, showTrip = false }) {
  const colorClass = COLOR_MAP[note.color] || COLOR_MAP.yellow;

  return (
    <div className={`group relative p-6 rounded-3xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${colorClass}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 opacity-60 text-[10px] font-black uppercase tracking-widest">
          <Calendar className="w-3 h-3" />
          {new Date(note.UpdatedAt).toLocaleDateString()}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit(note)}
            className="w-8 h-8 rounded-full hover:bg-black/5"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(note.id)}
            className="w-8 h-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap mb-6">
        {note.content}
      </p>

      <div className="mt-auto space-y-2">
        {showTrip && note.Trip && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-70">
            <Tag className="w-3 h-3" />
            {note.Trip.Title}
          </div>
        )}
        {note.TripStop?.City && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-70">
            <MapPin className="w-3 h-3" />
            {note.TripStop.City.Name}
          </div>
        )}
      </div>
    </div>
  );
}
