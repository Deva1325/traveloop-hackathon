import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getTripExpenses, getTripBudgetSummary, 
  addExpense, updateExpense, deleteExpense 
} from '@/api/expense.api';
import { 
  Plus, DollarSign, PieChart as PieChartIcon, 
  TrendingUp, TrendingDown, Clock, Tag, 
  Trash2, Edit2, AlertCircle, Calendar, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import ExpenseModal from '@/components/trips/ExpenseModal';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function TripBudgetTab({ trip }) {
  const tripId = trip.id;
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const { data: expenses, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ['expenses', tripId],
    queryFn: () => getTripExpenses(tripId),
  });

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['budgetSummary', tripId],
    queryFn: () => getTripBudgetSummary(tripId),
  });

  const mutation = useMutation({
    mutationFn: (data) => editingExpense 
      ? updateExpense(editingExpense.id, data)
      : addExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses', tripId]);
      queryClient.invalidateQueries(['budgetSummary', tripId]);
      setIsModalOpen(false);
      setEditingExpense(null);
      toast.success(editingExpense ? 'Expense updated' : 'Expense added');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Something went wrong'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses', tripId]);
      queryClient.invalidateQueries(['budgetSummary', tripId]);
      toast.success('Expense deleted');
    },
  });

  const chartData = summary ? Object.entries(summary.categoryBreakdown).map(([name, value]) => ({ name, value })) : [];

  if (isLoadingExpenses || isLoadingSummary) {
    return <div className="p-12 text-center animate-pulse text-muted-foreground">Calculating budget...</div>;
  }

  const isOverBudget = summary?.remainingBalance < 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-7xl mx-auto">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-5 rounded-3xl border border-border/50 shadow-lg shadow-primary/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Planned</p>
              <h4 className="text-xl font-bold">${summary?.plannedBudget.toLocaleString()}</h4>
            </div>
          </div>
        </div>

        <div className="bg-card p-5 rounded-3xl border border-border/50 shadow-lg shadow-primary/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Spent</p>
              <h4 className="text-xl font-bold">${summary?.totalSpent.toLocaleString()}</h4>
            </div>
          </div>
        </div>

        <div className={`bg-card p-5 rounded-3xl border shadow-lg shadow-primary/5 ${isOverBudget ? 'border-destructive/30' : 'border-border/50'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isOverBudget ? 'bg-destructive/10 text-destructive' : 'bg-blue-500/10 text-blue-500'}`}>
              {isOverBudget ? <AlertCircle className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Balance</p>
              <h4 className={`text-xl font-bold ${isOverBudget ? 'text-destructive' : ''}`}>
                ${summary?.remainingBalance.toLocaleString()}
              </h4>
            </div>
          </div>
        </div>

        <div className="bg-card p-5 rounded-3xl border border-border/50 shadow-lg shadow-primary/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Daily Avg</p>
              <h4 className="text-xl font-bold">${summary?.dailyAverage.toFixed(1)}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-md">
        <div className="flex justify-between items-end mb-3">
          <div className="space-y-1">
            <h3 className="text-base font-bold">Budget Utilization</h3>
            <p className="text-xs text-muted-foreground">You have used {summary?.utilization.toFixed(1)}% of your planned budget.</p>
          </div>
          <p className="text-xl font-black text-primary">{summary?.utilization.toFixed(0)}%</p>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out rounded-full ${summary?.utilization > 90 ? 'bg-destructive' : 'bg-primary'}`}
            style={{ width: `${Math.min(100, summary?.utilization)}%` }}
          />
        </div>
        {isOverBudget && (
          <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2 text-destructive">
            <AlertCircle className="w-4 h-4" />
            <p className="text-xs font-bold">Over Budget! Consider reducing shopping or miscellaneous expenses.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Charts Column */}
        <div className="lg:col-span-4">
          <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-md sticky top-4">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-primary" />
              Category Breakdown
            </h3>
            <div className="h-[250px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-muted-foreground italic">No data to show</div>
              )}
            </div>
          </div>
        </div>

        {/* Expenses List Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black">Expense History</h3>
            <Button onClick={() => { setEditingExpense(null); setIsModalOpen(true); }} className="rounded-full px-5 h-10 shadow-lg shadow-primary/20 text-sm">
              <Plus className="w-4 h-4 mr-2" /> Add Expense
            </Button>
          </div>

          <div className="space-y-3">
            {expenses?.length === 0 ? (
              <div className="text-center py-16 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
                <DollarSign className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-20" />
                <h4 className="text-base font-bold text-muted-foreground">No expenses recorded yet</h4>
                <p className="text-xs text-muted-foreground mb-6">Start tracking your spending for this trip.</p>
                <Button variant="outline" onClick={() => setIsModalOpen(true)} className="rounded-full h-10 px-6">
                  Create First Expense
                </Button>
              </div>
            ) : (
              expenses?.map((expense) => (
                <div key={expense.id} className="group bg-card p-4 rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{expense.title}</h4>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-medium">
                        <span className="flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5" /> {expense.ExpenseCategory?.CategoryName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5" /> {new Date(expense.expenseDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-lg font-black text-foreground">${parseFloat(expense.amount).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => { setEditingExpense(expense); setIsModalOpen(true); }}
                        className="rounded-full w-8 h-8 hover:bg-primary/10 hover:text-primary"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => { if(window.confirm('Delete this expense?')) deleteMutation.mutate(expense.id); }}
                        className="rounded-full w-8 h-8 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingExpense(null); }} 
        onSubmit={(data) => mutation.mutate(data)}
        initialData={editingExpense}
        tripId={tripId}
        tripStartDate={trip.startDate}
        tripEndDate={trip.endDate}
      />
    </div>
  );
}
