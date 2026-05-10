import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { X, Save, FileText, Palette, Layers } from 'lucide-react';

const COLORS = [
  { name: 'Yellow', value: 'yellow', class: 'bg-yellow-100 border-yellow-200' },
  { name: 'Blue', value: 'blue', class: 'bg-blue-100 border-blue-200' },
  { name: 'Green', value: 'green', class: 'bg-green-100 border-green-200' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-100 border-purple-200' },
  { name: 'Pink', value: 'pink', class: 'bg-pink-100 border-pink-200' },
  { name: 'Gray', value: 'gray', class: 'bg-gray-100 border-gray-200' },
];

export default function NoteModal({ isOpen, onClose, onSubmit, initialData, tripId, stops = [] }) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData || {
      content: '',
      color: 'yellow',
      tripStopId: '',
      tripId: tripId || ''
    }
  });

  const selectedColor = watch('color');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({
          content: '',
          color: 'yellow',
          tripStopId: '',
          tripId: tripId || ''
        });
      }
    }
  }, [isOpen, initialData, reset, tripId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-4">
      <div className={`bg-card w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-border/50 overflow-hidden animate-in zoom-in-95 duration-300`}>
        <div className="px-8 py-6 border-b border-border/50 bg-muted/20 flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            {initialData ? 'Edit Journal Entry' : 'New Journal Entry'}
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit((data) => onSubmit({ ...data, tripId }))} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground ml-1">Content</label>
              <textarea 
                {...register('content', { required: 'Content is required' })}
                rows={5}
                placeholder="Write your travel reminders, thoughts, or check-in info here..."
                className={`flex w-full rounded-2xl border-2 px-4 py-4 text-base ring-offset-background focus-visible:outline-none transition-all ${COLORS.find(c => c.value === selectedColor)?.class || 'bg-muted/30 border-transparent'}`}
              />
              {errors.content && <p className="text-xs text-destructive font-medium ml-1">{errors.content.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-muted-foreground ml-1 flex items-center gap-2">
                <Palette className="w-4 h-4" /> Note Color
              </label>
              <div className="flex flex-wrap gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setValue('color', color.value)}
                    className={`w-10 h-10 rounded-xl border-2 transition-all ${color.class} ${selectedColor === color.value ? 'ring-2 ring-primary ring-offset-2 scale-110' : 'opacity-70 hover:opacity-100'}`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {stops.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground ml-1 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Link to Trip Stop (Optional)
                </label>
                <select 
                  {...register('tripStopId')}
                  className="flex h-12 w-full rounded-2xl border-transparent bg-muted/30 px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                >
                  <option value="">No specific stop</option>
                  {stops.map(stop => (
                    <option key={stop.id} value={stop.id}>
                      Day {stop.stopOrder}: {stop.City?.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-2xl h-12">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 rounded-2xl h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Save className="w-4 h-4 mr-2" />
              {initialData ? 'Update Note' : 'Save Note'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
