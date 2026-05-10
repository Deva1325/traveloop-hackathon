import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { MapPin, Calendar as CalendarIcon, Wallet, ArrowRight, ArrowLeft, Check, Image as ImageIcon } from 'lucide-react';

import { createTrip } from '@/api/trips.api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';

const tripSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  budget: z.string().min(1, 'Budget is required'),
  coverImage: z.string().optional(),
});

const STEPS = [
  { id: 1, name: 'Basic Info', icon: MapPin },
  { id: 2, name: 'Dates & Budget', icon: CalendarIcon },
  { id: 3, name: 'Review', icon: Check },
];

export default function CreateTrip() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors, isValid }, trigger, watch } = useForm({
    resolver: zodResolver(tripSchema),
    mode: 'onChange',
    defaultValues: {
      coverImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
    }
  });

  const formValues = watch();

  const mutation = useMutation({
    mutationFn: createTrip,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Trip created successfully!');
      navigate(`/trips/${data.id}`);
    },
    onError: () => {
      toast.error('Failed to create trip');
    }
  });

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (step === 1) fieldsToValidate = ['title', 'description', 'coverImage'];
    if (step === 2) fieldsToValidate = ['startDate', 'endDate', 'budget'];
    
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      budget: Number(data.budget),
      destinations: [] // Will be added later in planner
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Plan a New Trip</h1>
        <p className="text-muted-foreground mt-1">Let's start by getting the basics down.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full -z-10"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full -z-10 transition-all duration-500" style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}></div>
        
        {STEPS.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-2 bg-background p-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
              step >= s.id ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-muted text-muted-foreground'
            }`}>
              <s.icon className="w-5 h-5" />
            </div>
            <span className={`text-xs font-medium ${step >= s.id ? 'text-foreground' : 'text-muted-foreground'}`}>{s.name}</span>
          </div>
        ))}
      </div>

      <Card className="shadow-lg border-muted/50 overflow-hidden">
        <div className="h-2 bg-primary/10 w-full">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(step / STEPS.length) * 100}%` }}></div>
        </div>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Step 1: Basics */}
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trip Title</label>
                  <Input {...register("title")} placeholder="e.g. Summer Backpacking in Europe" className="text-lg py-6" />
                  {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description (Optional)</label>
                  <textarea 
                    {...register("description")} 
                    placeholder="What's the vibe of this trip?" 
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Cover Image URL
                  </label>
                  <Input {...register("coverImage")} placeholder="https://..." />
                  {formValues.coverImage && (
                    <div className="mt-2 rounded-xl overflow-hidden h-32 border relative">
                      <img src={formValues.coverImage} alt="Cover Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Dates & Budget */}
            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Input {...register("startDate")} type="date" />
                    {errors.startDate && <p className="text-sm text-destructive">{errors.startDate.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <Input {...register("endDate")} type="date" />
                    {errors.endDate && <p className="text-sm text-destructive">{errors.endDate.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Wallet className="w-4 h-4" /> Estimated Budget ($)
                  </label>
                  <Input {...register("budget")} type="number" placeholder="5000" className="text-lg" />
                  {errors.budget && <p className="text-sm text-destructive">{errors.budget.message}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-8">
                <div className="bg-muted/30 p-6 rounded-2xl border">
                  <div className="aspect-video w-full rounded-xl overflow-hidden mb-6">
                    <img src={formValues.coverImage} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{formValues.title}</h3>
                  <p className="text-muted-foreground mb-4">{formValues.description || 'No description provided.'}</p>
                  
                  <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Dates</p>
                      <p className="font-medium">
                        {formValues.startDate} to {formValues.endDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="font-medium text-primary">${formValues.budget}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6 mt-6 border-t">
              <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1 || mutation.isPending}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              
              {step < STEPS.length ? (
                <Button type="button" onClick={nextStep} className="gap-2">
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={mutation.isPending} className="gap-2 bg-green-600 hover:bg-green-700">
                  {mutation.isPending ? 'Creating...' : 'Create Trip'} <Check className="w-4 h-4" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
