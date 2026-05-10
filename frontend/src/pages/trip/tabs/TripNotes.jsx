import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTripNotes, addNote, updateNote, deleteNote } from '@/api/note.api';
import { Plus, StickyNote, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import NoteModal from '@/components/notes/NoteModal';
import NoteCard from '@/components/notes/NoteCard';
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function TripNotes() {
  const { trip } = useOutletContext();
  const tripId = trip.id;
  const stops = trip.TripStops || [];
  
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const { data: notes, isLoading } = useQuery({
    queryKey: ['tripNotes', tripId],
    queryFn: () => getTripNotes(tripId),
  });

  const mutation = useMutation({
    mutationFn: (data) => editingNote 
      ? updateNote(editingNote.id, data)
      : addNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tripNotes', tripId]);
      queryClient.invalidateQueries(['userNotes']); // Also invalidate global list
      setIsModalOpen(false);
      setEditingNote(null);
      toast.success(editingNote ? 'Note updated' : 'Note added');
    },
    onError: () => toast.error('Something went wrong'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries(['tripNotes', tripId]);
      queryClient.invalidateQueries(['userNotes']);
      toast.success('Note deleted');
    },
  });

  if (isLoading) {
    return <div className="p-12 text-center animate-pulse text-muted-foreground">Opening your journal...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black flex items-center gap-3">
            <StickyNote className="w-7 h-7 text-primary" />
            Trip Journal
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Jot down reminders and memories for this trip.</p>
        </div>
        <Button onClick={() => { setEditingNote(null); setIsModalOpen(true); }} className="rounded-full px-6 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" /> New Entry
        </Button>
      </div>

      {notes?.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-[2.5rem] border-2 border-dashed border-border/50">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
             <StickyNote className="w-8 h-8 text-primary opacity-40" />
          </div>
          <h4 className="text-lg font-bold text-muted-foreground">Your journal is empty</h4>
          <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto">Add check-in info, local tips, or day-to-day reminders for your trip.</p>
          <Button variant="outline" onClick={() => setIsModalOpen(true)} className="rounded-full">
            Create First Entry
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes?.map((note) => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onEdit={() => { setEditingNote(note); setIsModalOpen(true); }}
              onDelete={(id) => { if(window.confirm('Delete this note?')) deleteMutation.mutate(id); }}
            />
          ))}
        </div>
      )}

      <NoteModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingNote(null); }} 
        onSubmit={(data) => mutation.mutate(data)}
        initialData={editingNote}
        tripId={tripId}
        stops={stops}
      />
    </div>
  );
}
