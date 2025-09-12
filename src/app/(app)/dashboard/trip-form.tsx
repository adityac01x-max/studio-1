
'use client';

import { useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusCircle, Trash2, ArrowLeft, ArrowRight, Upload } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const dailyDetailSchema = z.object({
    date: z.date(),
    accommodation: z.string().optional(),
    localTravel: z.string().optional(),
    cost: z.number().optional(),
    placesVisited: z.string().optional(),
    food: z.string().optional(),
    notes: z.string().optional(),
});

const tripSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  startDate: z.date({ required_error: 'A start date is required.' }),
  numberOfDays: z.coerce.number().min(1, 'Trip must be at least 1 day long.'),
  mode: z.enum(['flight', 'train', 'bus', 'car']),
  travelers: z.string().min(1, 'Please list at least one traveler.'),
  modeOfTravelCost: z.coerce.number().min(0, 'Cost must be a positive number.').optional(),
  dailyDetails: z.array(dailyDetailSchema).optional(),
  media: z.any().optional(),
});

type TripFormValues = z.infer<typeof tripSchema>;

export function TripForm() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      origin: '',
      destination: '',
      mode: 'flight',
      travelers: '',
      numberOfDays: 1,
      dailyDetails: [],
    },
  });

   const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'dailyDetails',
  });

  const handleNext = async () => {
    const isValid = await form.trigger(['origin', 'destination', 'startDate', 'numberOfDays', 'mode', 'travelers', 'modeOfTravelCost']);
    if (isValid) {
        const { startDate, numberOfDays } = form.getValues();
        const existingDetails = form.getValues('dailyDetails') || [];
        const newDetails = [];

        for(let i=0; i < numberOfDays; i++) {
            const currentDate = addDays(startDate, i);
            const existingDay = existingDetails.find(d => format(d.date, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd'));
            if (!existingDay) {
                newDetails.push({ 
                    date: currentDate, 
                    accommodation: '', 
                    localTravel: '', 
                    placesVisited: '', 
                    food: '', 
                    notes: '' 
                });
            } else {
                 newDetails.push(existingDay);
            }
        }
        
        form.setValue('dailyDetails', newDetails.slice(0, numberOfDays));
        setCurrentStep(1);
    }
  }

  function onSubmit(values: TripFormValues) {
    console.log(values);
    // In a real app, this would be a server action.
    toast({
        title: "Trip Added!",
        description: `Your trip from ${values.origin} to ${values.destination} has been saved.`,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
        {currentStep === 0 && (
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="origin" render={({ field }) => ( <FormItem> <FormLabel>Origin</FormLabel> <FormControl> <Input placeholder="e.g., Delhi" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="destination" render={({ field }) => ( <FormItem> <FormLabel>Destination</FormLabel> <FormControl> <Input placeholder="e.g., Mumbai" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="startDate" render={({ field }) => ( <FormItem className="flex flex-col"> <FormLabel>Start Date</FormLabel> <Popover> <PopoverTrigger asChild> <FormControl> <Button variant={'outline'} className={cn( 'w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground' )}> {field.value ? ( format(field.value, 'PPP') ) : ( <span>Pick a date</span> )} <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> </Button> </FormControl> </PopoverTrigger> <PopoverContent className="w-auto p-0" align="start"> <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date('1900-01-01')} initialFocus /> </PopoverContent> </Popover> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="numberOfDays" render={({ field }) => ( <FormItem> <FormLabel>Number of Days</FormLabel> <FormControl> <Input type="number" min="1" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <FormField control={form.control} name="mode" render={({ field }) => ( <FormItem> <FormLabel>Mode of Transport</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select a mode of transport" /> </SelectTrigger> </FormControl> <SelectContent> <SelectItem value="flight">Flight</SelectItem> <SelectItem value="train">Train</SelectItem> <SelectItem value="bus">Bus</SelectItem> <SelectItem value="car">Car</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                     <FormField control={form.control} name="modeOfTravelCost" render={({ field }) => ( <FormItem> <FormLabel>Travel Cost (₹)</FormLabel> <FormControl> <Input type="number" placeholder="e.g., 5000" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                </div>
                <FormField control={form.control} name="travelers" render={({ field }) => ( <FormItem> <FormLabel>Accompanying Travelers</FormLabel> <FormControl> <Input placeholder="e.g., Anjali, Rohan (comma-separated)" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>

                <Button type="button" onClick={handleNext} className="w-full">
                    Next <ArrowRight className="ml-2"/>
                </Button>
            </div>
        )}

        {currentStep === 1 && (
            <div className="space-y-6">
                {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4 rounded-lg border p-4">
                        <h3 className="font-semibold text-lg">Day {index + 1}: {format(form.watch(`dailyDetails.${index}.date`), 'PPP')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name={`dailyDetails.${index}.accommodation`} render={({ field }) => ( <FormItem> <FormLabel>Accommodation</FormLabel> <FormControl><Input placeholder="e.g., Hotel Taj" {...field} /></FormControl><FormMessage/></FormItem> )}/>
                            <FormField control={form.control} name={`dailyDetails.${index}.localTravel`} render={({ field }) => ( <FormItem> <FormLabel>Local Travel</FormLabel> <FormControl><Input placeholder="e.g., Taxi, Metro" {...field} /></FormControl><FormMessage/></FormItem> )}/>
                        </div>
                         <FormField control={form.control} name={`dailyDetails.${index}.cost`} render={({ field }) => ( <FormItem> <FormLabel>Day's Estimated Cost (₹)</FormLabel> <FormControl><Input type="number" placeholder="e.g., 3000" {...field} /></FormControl><FormMessage/></FormItem> )}/>
                        <FormField control={form.control} name={`dailyDetails.${index}.placesVisited`} render={({ field }) => ( <FormItem> <FormLabel>Places Visited & Reviews</FormLabel> <FormControl><Textarea placeholder="e.g., Gateway of India (5/5) - amazing view!" {...field} /></FormControl><FormMessage/></FormItem> )}/>
                        <FormField control={form.control} name={`dailyDetails.${index}.food`} render={({ field }) => ( <FormItem> <FormLabel>Food Highlights</FormLabel> <FormControl><Textarea placeholder="e.g., Vada Pav at a local stall" {...field} /></FormControl><FormMessage/></FormItem> )}/>
                        <FormField control={form.control} name={`dailyDetails.${index}.notes`} render={({ field }) => ( <FormItem> <FormLabel>Other Notes</FormLabel> <FormControl><Textarea placeholder="e.g., Local market details, cultural observations" {...field} /></FormControl><FormMessage/></FormItem> )}/>
                    </div>
                ))}
                <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setCurrentStep(0)}>
                        <ArrowLeft className="mr-2"/> Back
                    </Button>
                    <Button type="button" onClick={() => setCurrentStep(2)}>
                        Next <ArrowRight className="ml-2"/>
                    </Button>
                </div>
            </div>
        )}
        
        {currentStep === 2 && (
             <div className="space-y-4">
                 <FormField
                    control={form.control}
                    name="media"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Upload Images/Videos</FormLabel>
                        <FormControl>
                             <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-4 text-muted-foreground"/>
                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG, MP4 (MAX. 800x400px)</p>
                                    </div>
                                    <Input id="dropzone-file" type="file" className="hidden" onChange={(e) => field.onChange(e.target.files)} multiple />
                                </label>
                            </div> 
                        </FormControl>
                         <FormDescription>You can upload multiple files.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                 <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                        <ArrowLeft className="mr-2"/> Back
                    </Button>
                    <Button type="submit" className="w-full">Save Trip</Button>
                </div>
             </div>
        )}
      </form>
    </Form>
  );
}

    