import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, Save, DollarSign, Calendar as CalendarIcon, Tag, AlignLeft } from 'lucide-react';
import { getExpenseCategories } from '@/api/expense.api';
import toast from 'react-hot-toast';

export default function ExpenseModal({ isOpen, onClose, onSubmit, initialData, tripId, tripStartDate, tripEndDate }) {
  const [categories, setCategories] = useState([]);
  
  // Format dates for input min/max
  const minDate = tripStartDate ? new Date(tripStartDate).toISOString().split('T')[0] : '';
  const maxDate = tripEndDate ? new Date(tripEndDate).toISOString().split('T')[0] : '';

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: initialData || {
      title: '',
      amount: '',
      expenseDate: minDate || new Date().toISOString().split('T')[0],
      expenseCategoryId: '',
      notes: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (initialData) {
        reset({
          ...initialData,
          expenseDate: initialData.expenseDate ? new Date(initialData.expenseDate).toISOString().split('T')[0] : ''
        });
      } else {
        reset({
          title: '',
          amount: '',
          expenseDate: minDate || new Date().toISOString().split('T')[0],
          expenseCategoryId: '',
          notes: ''
        });
      }
    }
  }, [isOpen, initialData, reset, minDate]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-4">
      <div className="bg-card w-full max-w-lg rounded-[2rem] shadow-2xl border border-border/50 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-6 py-4 border-b border-border/50 bg-muted/20 flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            {initialData ? 'Edit Expense' : 'Add New Expense'}
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-8 h-8 hover:bg-muted">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit((data) => onSubmit({ ...data, tripId }))} className="p-6 space-y-5">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground ml-1">Expense Title</label>
              <div className="relative">
                <AlignLeft className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input 
                  {...register('title', { required: 'Title is required' })}
                  placeholder="e.g. Dinner at Eiffel Tower"
                  className="pl-10 rounded-xl h-11 bg-muted/30 border-transparent focus:bg-background transition-all text-sm"
                />
              </div>
              {errors.title && <p className="text-[10px] text-destructive font-bold ml-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground ml-1">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input 
                    type="number"
                    step="0.01"
                    {...register('amount', { required: 'Required', min: { value: 0.01, message: 'Min 0.01' } })}
                    placeholder="0.00"
                    className="pl-10 rounded-xl h-11 bg-muted/30 border-transparent focus:bg-background transition-all text-sm"
                  />
                </div>
                {errors.amount && <p className="text-[10px] text-destructive font-bold ml-1">{errors.amount.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground ml-1">Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input 
                    type="date"
                    min={minDate}
                    max={maxDate}
                    {...register('expenseDate', { 
                      required: 'Required',
                      validate: (value) => {
                        if (!minDate || !maxDate) return true;
                        const date = new Date(value);
                        return (date >= new Date(minDate) && date <= new Date(maxDate)) || 'Date out of trip range';
                      }
                    })}
                    className="pl-10 rounded-xl h-11 bg-muted/30 border-transparent focus:bg-background transition-all text-sm"
                  />
                </div>
                {errors.expenseDate && <p className="text-[10px] text-destructive font-bold ml-1">{errors.expenseDate.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground ml-1">Category</label>
              <div className="relative">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <select 
                  {...register('expenseCategoryId', { required: 'Category is required' })}
                  className="flex h-11 w-full rounded-xl border-transparent bg-muted/30 pl-10 pr-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all appearance-none"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.ExpenseCategoryId} value={cat.ExpenseCategoryId}>
                      {cat.CategoryName}
                    </option>
                  ))}
                </select>
              </div>
              {errors.expenseCategoryId && <p className="text-[10px] text-destructive font-bold ml-1">{errors.expenseCategoryId.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground ml-1">Notes (Optional)</label>
              <textarea 
                {...register('notes')}
                rows={2}
                placeholder="Additional details..."
                className="flex w-full rounded-xl border-transparent bg-muted/30 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all resize-none"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl h-10 text-sm">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 rounded-xl h-10 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-sm">
              <Save className="w-4 h-4 mr-2" />
              {initialData ? 'Update' : 'Add'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
