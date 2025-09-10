import { PlusCircle, MoreHorizontal, Car, Plane, Train, Bus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { Trip } from '@/lib/types';
import { TripForm } from './trip-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';

const mockTrips: Trip[] = [
  {
    id: '1',
    tripNumber: 'BT-001',
    origin: 'Delhi (DEL)',
    destination: 'Mumbai (BOM)',
    startTime: new Date('2024-08-15T09:00:00'),
    mode: 'flight',
    travelers: ['Anjali', 'Rohan'],
    status: 'Upcoming',
  },
  {
    id: '2',
    tripNumber: 'BT-002',
    origin: 'Jaipur',
    destination: 'Agra',
    startTime: new Date('2024-07-20T07:30:00'),
    mode: 'car',
    travelers: ['Priya'],
    status: 'Completed',
  },
  {
    id: '3',
    tripNumber: 'BT-003',
    origin: 'Kolkata (HWH)',
    destination: 'Varanasi (BSB)',
    startTime: new Date('2024-08-25T21:00:00'),
    mode: 'train',
    travelers: ['Mr. Sharma', 'Mrs. Sharma'],
    status: 'Upcoming',
  },
    {
    id: '4',
    tripNumber: 'BT-004',
    origin: 'Bengaluru',
    destination: 'Goa',
    startTime: new Date('2024-09-01T22:00:00'),
    mode: 'bus',
    travelers: ['Vikram', 'Sunita', 'Raj'],
    status: 'Upcoming',
  },
    {
    id: '5',
    tripNumber: 'BT-005',
    origin: 'Chennai (MAS)',
    destination: 'Hyderabad (HYB)',
    startTime: new Date('2024-06-10T14:00:00'),
    mode: 'train',
    travelers: ['Karthik'],
    status: 'Completed',
  },
];

const modeIcons = {
  flight: <Plane className="h-4 w-4" />,
  train: <Train className="h-4 w-4" />,
  car: <Car className="h-4 w-4" />,
  bus: <Bus className="h-4 w-4" />,
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">My Trips</h1>
          <p className="text-muted-foreground">Manage and view your travel plans.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Trip
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add a New Trip</DialogTitle>
            </DialogHeader>
            <TripForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming & Past Trips</CardTitle>
          <CardDescription>A list of all your recorded journeys.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mode</TableHead>
                <TableHead>Trip</TableHead>
                <TableHead>Travelers</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTrips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        {modeIcons[trip.mode]}
                        <span className="capitalize hidden sm:inline">{trip.mode}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{trip.origin}</div>
                    <div className="text-sm text-muted-foreground">to {trip.destination}</div>
                  </TableCell>
                   <TableCell>
                     {trip.travelers.join(', ')}
                  </TableCell>
                  <TableCell>{format(trip.startTime, 'MMM d, yyyy, h:mm a')}</TableCell>
                  <TableCell>
                    <Badge variant={trip.status === 'Completed' ? 'secondary' : 'default'}
                      className={trip.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' : ''}
                    >
                      {trip.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
