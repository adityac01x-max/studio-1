
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

const accommodationSchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  location: z.string().min(1, 'Location is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  description: z.string().optional(),
  amenities: z.string().optional(),
  status: z.enum(['Listed', 'Unlisted']),
  images: z.any().optional(),
});

type AccommodationFormValues = z.infer<typeof accommodationSchema>;

type AccommodationFormProps = {
  accommodationToEdit?: { id: string, name: string, location: string, price: number, status: 'Listed' | 'Unlisted' } | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
};

export function AccommodationForm({ accommodationToEdit, setDialogOpen }: AccommodationFormProps) {
  const { toast } = useToast();

  const form = useForm<AccommodationFormValues>({
    resolver: zodResolver(accommodationSchema),
    defaultValues: accommodationToEdit ? {
        name: accommodationToEdit.name,
        location: accommodationToEdit.location,
        price: accommodationToEdit.price,
        status: accommodationToEdit.status,
        description: 'A beautiful property with stunning views.', // Mock data
        amenities: 'Wi-Fi, Pool, Free Parking', // Mock data
    } : {
      name: '',
      location: '',
      price: 0,
      description: '',
      amenities: '',
      status: 'Listed',
    },
  });

  function onSubmit(values: AccommodationFormValues) {
    console.log(values);
    toast({
      title: accommodationToEdit ? 'Accommodation Updated!' : 'Accommodation Added!',
      description: `Your property "${values.name}" has been successfully saved.`,
    });
    setDialogOpen(false);
  }

  return (
    <div className="max-h-[70vh] overflow-y-auto pr-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Sunrise Resort" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Goa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per night (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 8000" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select listing status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Listed">Listed</SelectItem>
                        <SelectItem value="Unlisted">Unlisted</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your property..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amenities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amenities</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Wi-Fi, Pool, Free Parking" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Photos</FormLabel>
                <FormControl>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
                      </div>
                      <Input id="dropzone-file" type="file" className="hidden" {...field} multiple />
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end pt-4">
            <Button type="submit">
              {accommodationToEdit ? 'Save Changes' : 'Add Property'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
