import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  Smartphone, 
  FileText, 
  MoreVertical,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { getPackingItems, addPackingItem, togglePackingItem, deletePackingItem, resetChecklist } from '@/api/packing.api';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'clothing', name: 'Clothing', icon: ShoppingBag, color: 'text-blue-500' },
  { id: 'electronics', name: 'Electronics', icon: Smartphone, color: 'text-purple-500' },
  { id: 'documents', name: 'Documents', icon: FileText, color: 'text-amber-500' },
  { id: 'toiletries', name: 'Toiletries', icon: CheckCircle2, color: 'text-emerald-500' },
];

export default function TripChecklist() {
  const { trip } = useOutletContext();
  const queryClient = useQueryClient();
  const [newItem, setNewItem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('clothing');

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['packing', trip.id],
    queryFn: () => getPackingItems(trip.id),
  });

  const addMutation = useMutation({
    mutationFn: (data) => addPackingItem(trip.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packing', trip.id] });
      setNewItem('');
      toast.success('Item added');
    }
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isPacked }) => togglePackingItem(trip.id, id, isPacked),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['packing', trip.id] }),
  });

  const resetMutation = useMutation({
    mutationFn: () => resetChecklist(trip.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packing', trip.id] });
      toast.success('Checklist reset');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deletePackingItem(trip.id, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packing', trip.id] });
      toast.success('Item removed');
    }
  });

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    addMutation.mutate({ name: newItem, category: selectedCategory });
  };

  const packedCount = items.filter(i => i.isPacked).length;
  const progress = items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Stats */}
      <div className="bg-card rounded-3xl border shadow-sm p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Packing Checklist</h2>
          <p className="text-sm text-muted-foreground mt-1">Get ready for your trip to {trip.title}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Progress</p>
            <div className="flex items-center gap-3">
               <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                 <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }}></div>
               </div>
               <span className="text-sm font-bold text-primary">{progress}%</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl h-10 border-dashed gap-2"
            onClick={() => resetMutation.mutate()}
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
            Reset
          </Button>
        </div>
      </div>

      {/* Add Item Form */}
      <div className="bg-card rounded-2xl border shadow-sm p-4 mb-8">
        <form onSubmit={handleAddItem} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Input 
              placeholder="What do you need to pack?" 
              className="h-12 text-base pl-4 rounded-xl border-none bg-muted/30 focus-visible:ring-primary/20"
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="h-12 px-4 rounded-xl bg-muted/30 border-none text-sm font-medium focus:ring-2 ring-primary/20 outline-none"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <Button type="submit" className="h-12 px-6 rounded-xl shadow-lg shadow-primary/20" disabled={addMutation.isPending}>
              {addMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            </Button>
          </div>
        </form>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        {CATEGORIES.map(category => {
          const catItems = items.filter(i => i.category === category.id);
          const catPacked = catItems.filter(i => i.isPacked).length;
          
          return (
            <div key={category.id} className="bg-card rounded-3xl border shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b bg-muted/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-muted/50 ${category.color}`}>
                    <category.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{category.name}</h3>
                    <p className="text-[10px] text-muted-foreground font-bold">{catPacked}/{catItems.length} PACKED</p>
                  </div>
                </div>
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </div>
              
              <div className="p-4 flex-1 space-y-2">
                {catItems.length > 0 ? catItems.map(item => (
                  <div 
                    key={item.id} 
                    className={`flex items-center justify-between p-3 rounded-xl transition-all group ${
                      item.isPacked ? 'bg-primary/5 opacity-60' : 'bg-muted/10 hover:bg-muted/20'
                    }`}
                  >
                    <div 
                      className="flex items-center gap-3 cursor-pointer flex-1"
                      onClick={() => toggleMutation.mutate({ id: item.id, isPacked: !item.isPacked })}
                    >
                      {item.isPacked ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                      <span className={`text-sm font-medium ${item.isPacked ? 'line-through text-muted-foreground' : ''}`}>
                        {item.name}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                      onClick={() => deleteMutation.mutate(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )) : (
                  <div className="h-24 flex flex-col items-center justify-center border border-dashed rounded-2xl opacity-40">
                    <category.icon className="w-6 h-6 mb-2" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">No Items</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
