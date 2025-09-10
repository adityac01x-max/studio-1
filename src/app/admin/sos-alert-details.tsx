
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { SOSAlert } from '@/lib/types';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, MapPin, Clock } from 'lucide-react';


const alertSchema = z.object({
  status: z.enum(['Pending', 'In Progress', 'Resolved']),
  resolution: z.string().optional(),
  caseId: z.string().optional(),
});

type SosAlertDetailsProps = {
  alert: SOSAlert;
};

export function SosAlertDetails({ alert }: SosAlertDetailsProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof alertSchema>>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      status: alert.status,
      resolution: alert.resolution || '',
      caseId: alert.caseId || '',
    },
  });

  function onSubmit(values: z.infer<typeof alertSchema>) {
    console.log(values);
    // In a real app, this would be a server action to update the alert.
    toast({
      title: "Alert Updated",
      description: `The status for ${alert.userName}'s alert has been updated to ${values.status}.`,
    });
  }

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
        <Card className="bg-muted/50">
            <CardHeader>
                <CardTitle>Alert Information</CardTitle>
                <CardDescription>Details of the emergency request.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <User className="text-muted-foreground"/>
                    <div>
                        <p className="font-semibold">User</p>
                        <p>{alert.userName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="text-muted-foreground"/>
                    <div>
                        <p className="font-semibold">Location</p>
                        <p>{alert.location}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="text-muted-foreground"/>
                    <div>
                        <p className="font-semibold">Time</p>
                        <p>{format(alert.time, 'MMM d, yyyy, h:mm a')}</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Update Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Resolution Details</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Describe how the situation was handled..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="caseId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Case ID (Optional)</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., DEPT-2024-12345" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <Button type="submit" className="w-full">Update Alert</Button>
            </form>
        </Form>
    </div>
  );
}
