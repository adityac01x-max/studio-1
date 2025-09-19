

'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Upload } from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import type { Trip } from '@/lib/types';


const dailyDetailSchema = z.object({
  date: z.date(),
  accommodation: z.string().optional(),
  placesVisited: z.string().optional(),
  notes: z.string().optional(),
  food: z.string().optional(),
  foodCost: z.number().optional(),
  localTravelCost: z.number().optional(),
  cost: z.number().optional(),
  media: z.any().optional(),
});

const tripSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  startDate: z.date({ required_error: 'A start date is required.' }),
  endDate: z.date({ required_error: 'An end date is required.' }),
  mode: z.enum(['flight', 'train', 'bus', 'car']),
  travelCost: z.number().optional(),
  totalCost: z.number().optional(),
  dailyDetails: z.array(dailyDetailSchema).optional(),
  media: z.any().optional(),
  travelers: z.string().min(1, 'At least one traveler is required.'),
});

type TripFormValues = z.infer<typeof tripSchema>;

type TripFormProps = {
  tripToEdit?: Trip | null;
  setDialogOpen: (open: boolean) => void;
};


export function TripForm({ tripToEdit, setDialogOpen }: TripFormProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: tripToEdit ? {
        ...tripToEdit,
        startDate: tripToEdit.startTime,
        endDate: tripToEdit.dailyDetails?.[tripToEdit.dailyDetails.length - 1]?.date || tripToEdit.startTime,
        travelers: tripToEdit.travelers.join(', '),
    } : {
      origin: '',
      destination: '',
      dailyDetails: [],
      travelers: '',
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "dailyDetails",
  });

  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');

  useEffect(() => {
    if (startDate && endDate && endDate >= startDate) {
      const days = differenceInDays(endDate, startDate) + 1;
      const currentDays = fields.length;

      if (days > currentDays) {
        for (let i = currentDays; i < days; i++) {
          append({ date: addDays(startDate, i) });
        }
      } else if (days < currentDays) {
        for (let i = currentDays - 1; i >= days; i--) {
          remove(i);
        }
      }
    } else if (fields.length > 0) {
        for (let i = fields.length - 1; i >= 0; i--) {
          remove(i);
        }
    }
  }, [startDate, endDate, append, remove, fields.length]);


  async function processNext() {
      const isValid = await form.trigger(
          currentStep === 0 ? ['origin', 'destination', 'startDate', 'endDate', 'mode', 'travelers'] : []
      );
      if (isValid) {
          setCurrentStep(prev => prev + 1);
      }
  }

  function onSubmit(values: TripFormValues) {
    console.log(values);
    // In a real app, this would be a server action.
    toast({
      title: tripToEdit ? 'Trip Updated!' : 'Trip Added!',
      description: `Your trip from ${values.origin} to ${values.destination} has been saved.`,
    });
    setDialogOpen(false);
  }

  return (
    <div className="max-h-[70vh] overflow-y-auto pr-4">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {currentStep === 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Trip Details</h3>
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origin</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Delhi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mumbai" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < (startDate || new Date("1900-01-01"))}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode of Transport</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode of travel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="flight">Flight</SelectItem>
                        <SelectItem value="train">Train</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name="travelCost"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Travel Cost (₹)</FormLabel>
                      <FormControl>
                          <Input type="number" placeholder="e.g., 8000" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
              />
            </div>
            <FormField
              control={form.control}
              name="travelers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Travelers</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Anjali, Rohan" {...field} />
                  </FormControl>
                   <FormDescription>Comma-separated list of traveler names.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {currentStep === 1 && (
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Daily Itinerary</h3>
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4">
                {fields.map((item, index) => (
                    <Card key={item.id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Day {index + 1}: {format(item.date, 'PPP')}</span>
                            </CardTitle>
                        </CardHeader>
                         <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name={`dailyDetails.${index}.accommodation`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Accommodation</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., The Taj Palace" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`dailyDetails.${index}.placesVisited`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Local Places Visited</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="e.g., Gateway of India, Marine Drive (comma-separated)" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`dailyDetails.${index}.food`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Food Eaten</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="e.g., Vada Pav at Ashok Vada Pav, Kanda Bhaji at a local stall" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name={`dailyDetails.${index}.foodCost`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Food Cost (₹)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="e.g., 1500" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`dailyDetails.${index}.localTravelCost`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Local Travel Cost (₹)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="e.g., 500" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                             </div>
                             <FormField
                                control={form.control}
                                name={`dailyDetails.${index}.notes`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Notes & Experience</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Any notes on food, culture, etc." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`dailyDetails.${index}.media`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Upload Photos/Videos for Day {index + 1}</FormLabel>
                                    <FormControl>
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor={`dropzone-file-${index}`} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
                                            </div>
                                            <Input id={`dropzone-file-${index}`} type="file" className="hidden" {...field} multiple />
                                        </label>
                                    </div> 
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`dailyDetails.${index}.cost`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Day's Total Cost (₹)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="e.g., 5000" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                ))}
                </div>
            </div>
        )}

        {currentStep === 2 && (
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Trip Summary</h3>
                 <FormField
                    control={form.control}
                    name="totalCost"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Total Trip Cost (₹)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 50000" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                        </FormControl>
                        <FormDescription>Optional: Overall budget for the trip.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        )}
        
        <div className="flex justify-between sticky bottom-0 bg-background py-4">
            {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={() => setCurrentStep(prev => prev - 1)}>
                    Back
                </Button>
            )}
            {currentStep < 2 ? (
                 <Button type="button" onClick={processNext} className="ml-auto">
                    Next
                </Button>
            ) : (
                <Button type="submit" className="ml-auto">
                    {tripToEdit ? 'Save Changes' : 'Save Trip'}
                </Button>
            )}
        </div>
      </form>
    </Form>
    </div>
  );
}
