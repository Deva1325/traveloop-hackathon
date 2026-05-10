import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, Save, DollarSign, Calendar as CalendarIcon, Tag, AlignLeft } from 'lucide-react';
import { getExpenseCategories } from '@/api/expense.api';
import toast from 'react-hot-toast';

export default function ExpenseModal({ isOpen, onClose, onSubmit, initialData, tripId }) {
  const [categories, setCategories] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: initialData || {
      title: '',
      amount: '',
      expenseDate: new Date().toISOString().split('T')[0],
      expenseCategoryId: '',
      notes: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (initialData) {
        reset(initialData);
      } else {
        reset({
          title: '',
          amount: '',
          expenseDate: new Date().toISOString().split('T')[0],
          expenseCategoryId: '',
          notes: ''
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const fetchCategories = async () => {
    try {
      const data = await getExpenseCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-card w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-border/50 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-border/50 bg-muted/20 flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            {initialData ? 'Edit Expense' : 'Add New Expense'}
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit((data) => onSubmit({ ...data, tripId }))} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground ml-1">Expense Title</label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  {...register('title', { required: 'Title is required' })}
                  placeholder="e.g. Dinner at Eiffel Tower"
                  className="pl-11 rounded-2xl h-12 bg-muted/30 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              {errors.title && <p className="text-xs text-destructive font-medium ml-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground ml-1">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="number"
                    step="0.01"
                    {...register('amount', { required: 'Amount is required', min: 0.01 })}
                    placeholder="0.00"
                    className="pl-11 rounded-2xl h-12 bg-muted/30 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground ml-1">Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="date"
                    {...register('expenseDate', { required: 'Date is required' })}
                    className="pl-11 rounded-2xl h-12 bg-muted/30 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground ml-1">Category</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select 
                  {...register('expenseCategoryId', { required: 'Category is required' })}
                  className="flex h-12 w-full rounded-2xl border-transparent bg-muted/30 pl-11 pr-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.ExpenseCategoryId} value={cat.ExpenseCategoryId}>
                      {cat.CategoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground ml-1">Notes (Optional)</label>
              <textarea 
                {...register('notes')}
                rows={3}
                placeholder="Additional details..."
                className="flex w-full rounded-2xl border-transparent bg-muted/30 px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-2xl h-12">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 rounded-2xl h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Save className="w-4 h-4 mr-2" />
              {initialData ? 'Update Expense' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
