import { useQuery } from '@tanstack/react-query';
import { getGlobalBudgetSummary } from '@/api/expense.api';
import { 
  Wallet, TrendingUp, TrendingDown, LayoutDashboard, 
  PieChart as PieChartIcon, BarChart as BarChartIcon, 
  History, Calendar, ArrowRight, Plane, Landmark, ShoppingBag,
  Tag
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function GlobalBudget() {
  const navigate = useNavigate();
  const { data: summary, isLoading } = useQuery({
    queryKey: ['globalBudget'],
    queryFn: getGlobalBudgetSummary,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 space-y-10 animate-pulse">
        <div className="h-20 bg-muted rounded-2xl w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted rounded-[2.5rem]"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="lg:col-span-8 h-[400px] bg-muted rounded-[2.5rem]"></div>
           <div className="lg:col-span-4 h-[400px] bg-muted rounded-[2.5rem]"></div>
        </div>
      </div>
    );
  }

  const categoryData = summary ? Object.entries(summary.categoryBreakdown).map(([name, value]) => ({ name, value })) : [];
  const tripComparisonData = summary?.tripComparison || [];

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-6 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Global Budget
          </h1>
          <p className="text-muted-foreground text-lg font-medium">Cross-trip financial analytics and insights.</p>
        </div>
        <div className="p-1 bg-muted/30 rounded-2xl border border-border/50 flex gap-1">
          <div className="px-4 py-2 bg-background rounded-xl shadow-sm font-bold text-sm text-primary flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" /> Analytics
          </div>
          <button className="px-4 py-2 text-muted-foreground font-bold text-sm hover:text-foreground transition-colors">Reports</button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="bg-card p-8 rounded-[2.5rem] border border-border/50 shadow-2xl shadow-primary/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <Wallet className="w-20 h-20" />
          </div>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">Planned</p>
          <h4 className="text-3xl font-black">${summary?.totalPlanned.toLocaleString()}</h4>
          <div className="mt-4 flex items-center gap-2 text-emerald-500 font-bold text-sm">
             <TrendingUp className="w-4 h-4" /> {summary?.tripCount} Trips Total
          </div>
        </div>

        <div className="bg-card p-8 rounded-[2.5rem] border border-border/50 shadow-2xl shadow-primary/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform text-primary">
            <TrendingUp className="w-20 h-20" />
          </div>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">Actual Spent</p>
          <h4 className="text-3xl font-black text-primary">${summary?.totalSpent.toLocaleString()}</h4>
          <div className="mt-4 flex items-center gap-2 text-muted-foreground font-bold text-sm">
             {summary?.utilization.toFixed(1)}% Utilization
          </div>
        </div>

        <div className="bg-card p-8 rounded-[2.5rem] border border-border/50 shadow-2xl shadow-primary/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform text-emerald-500">
            <TrendingDown className="w-20 h-20" />
          </div>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">Remaining</p>
          <h4 className="text-3xl font-black text-emerald-500">${summary?.remainingBalance.toLocaleString()}</h4>
          <div className="mt-4 flex items-center gap-2 text-emerald-500/70 font-bold text-sm">
             Net Savings potential
          </div>
        </div>

        <div className="bg-card p-8 rounded-[2.5rem] border border-border/50 shadow-2xl shadow-primary/5 text-center flex flex-col justify-center items-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
             <Landmark className="w-8 h-8" />
          </div>
          <p className="text-sm font-bold">Financial Health</p>
          <span className="mt-2 text-[10px] font-black px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full uppercase tracking-tighter">Healthy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-card p-10 rounded-[2.5rem] border border-border/50 shadow-2xl shadow-primary/5">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black flex items-center gap-3">
                <BarChartIcon className="w-7 h-7 text-primary" />
                Trip-wise Comparison
              </h3>
            </div>
            <div className="h-[400px] w-full">
              {tripComparisonData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tripComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                    <XAxis dataKey="title" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                    <Tooltip 
                      cursor={{ fill: '#88888810', radius: 12 }}
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="planned" name="Budget" fill="#94a3b8" radius={[10, 10, 0, 0]} barSize={40} />
                    <Bar dataKey="spent" name="Spent" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground italic gap-4">
                  <Plane className="w-12 h-12 opacity-10" />
                  <p>Create trips to see comparison analytics</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card p-10 rounded-[2.5rem] border border-border/50 shadow-2xl shadow-primary/5">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-black flex items-center gap-3">
                <History className="w-7 h-7 text-primary" />
                Recent Expenses
              </h3>
            </div>
            <div className="space-y-4">
              {summary?.recentExpenses.length === 0 ? (
                <p className="text-center py-10 text-muted-foreground font-medium italic">No expenses found</p>
              ) : (
                summary?.recentExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-5 bg-muted/20 rounded-3xl border border-transparent hover:border-primary/20 hover:bg-background transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-background rounded-2xl shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                         <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{expense.title}</h4>
                        <p className="text-xs text-muted-foreground font-bold flex items-center gap-2">
                           <Tag className="w-3 h-3" /> {expense.ExpenseCategory?.CategoryName}
                           <span className="w-1 h-1 bg-muted-foreground/30 rounded-full"></span>
                           <Calendar className="w-3 h-3" /> {new Date(expense.expenseDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xl font-black text-primary">${parseFloat(expense.amount).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-card p-10 rounded-[2.5rem] border border-border/50 shadow-2xl shadow-primary/5">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
              <PieChartIcon className="w-6 h-6 text-primary" />
              Category Share
            </h3>
            <div className="h-[300px] w-full">
               {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground italic">No data to show</div>
              )}
            </div>
          </div>

          <div className="bg-card p-10 rounded-[2.5rem] border border-border/50 shadow-2xl shadow-primary/5 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <h3 className="text-xl font-bold mb-4">Budget Tip</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed mb-6">
              Users who categorize 90% of their expenses stay within budget more often. You're currently at {summary?.utilization > 0 ? '85%' : '0%'}.
            </p>
            <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-2xl font-black h-12 shadow-xl shadow-black/10">
              View Suggestions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
