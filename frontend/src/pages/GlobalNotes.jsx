import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserNotes, updateNote, deleteNote } from '@/api/note.api';
import { StickyNote, Search, Plus, Filter, Calendar, LayoutGrid } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import NoteCard from '@/components/notes/NoteCard';
import NoteModal from '@/components/notes/NoteModal';
import toast from 'react-hot-toast';

export default function GlobalNotes() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const { data: notes, isLoading } = useQuery({
    queryKey: ['userNotes', searchTerm],
    queryFn: () => getUserNotes(searchTerm),
  });

  const mutation = useMutation({
    mutationFn: (data) => updateNote(editingNote.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['userNotes']);
      setIsModalOpen(false);
      setEditingNote(null);
      toast.success('Note updated');
    },
    onError: () => toast.error('Failed to update note'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries(['userNotes']);
      toast.success('Note deleted');
    },
  });

  if (isLoading) {
    return <div className="p-12 text-center animate-pulse text-muted-foreground">Fetching your travel thoughts...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-6 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Travel Journal
          </h1>
          <p className="text-muted-foreground text-lg font-medium">All your memories and reminders in one place.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search notes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 rounded-2xl h-12 bg-muted/30 border-transparent focus:bg-background shadow-sm"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-2xl w-12 h-12 border-border/50 bg-card">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {notes?.length === 0 ? (
        <div className="text-center py-32 bg-card rounded-[3rem] border border-border/50 shadow-2xl shadow-primary/5">
          <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/10">
             <StickyNote className="w-12 h-12 text-primary opacity-30" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">No notes found</h2>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            {searchTerm ? `No results for "${searchTerm}". Try a different search.` : "You haven't added any travel notes yet. Go to a trip and start writing!"}
          </p>
          {!searchTerm && (
            <Button variant="outline" className="mt-10 rounded-full px-8" onClick={() => window.location.href = '/trips'}>
              Go to My Trips
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {notes?.map((note) => (
            <NoteCard 
              key={note.id} 
              note={note} 
              showTrip={true}
              onEdit={(n) => { setEditingNote(n); setIsModalOpen(true); }}
              onDelete={(id) => { if(window.confirm('Delete this note?')) deleteMutation.mutate(id); }}
            />
          ))}
        </div>
      )}

      {editingNote && (
        <NoteModal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); setEditingNote(null); }} 
          onSubmit={(data) => mutation.mutate(data)}
          initialData={editingNote}
        />
      )}
    </div>
  );
}
