
'use client';

import { useState } from 'react';
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
import { TripDetails } from './trip-details';

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
    dailyDetails: [
        {
            date: new Date('2024-08-15'),
            accommodation: "The Taj Palace",
            placesVisited: "Gateway of India",
            notes: "Great first day!",
            cost: 5000,
        }
    ]
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
    accommodation: { name: 'The Oberoi Amarvilas', type: 'Hotel' },
    visitedPlaces: [{ name: 'Taj Mahal', rating: 5, review: 'Breathtaking!' }],
    tripExperience: 'A truly memorable visit to the Taj Mahal.'
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
    accommodation: { name: 'Park Hyatt', type: 'Hotel' },
    visitedPlaces: [{ name: 'Charminar', rating: 4, review: 'Historic and bustling.' }],
    tripExperience: 'Enjoyed the Hyderabadi biryani.'
  },
];

const modeIcons = {
  flight: <Plane className="h-4 w-4" />,
  train: <Train className="h-4 w-4" />,
  car: <Car className="h-4 w-4" />,
  bus: <Bus className="h-4 w-4" />,
}

export default function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isViewing, setIsViewing] = useState(false);

  const handleAddClick = () => {
    setSelectedTrip(null);
    setIsViewing(false);
    setDialogOpen(true);
  }

  const handleEditClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsViewing(false);
    setDialogOpen(true);
  }

  const handleViewClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsViewing(true);
    setDialogOpen(true);
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">My Trips</h1>
          <p className="text-muted-foreground">Manage and view your travel plans.</p>
        </div>
         <Button onClick={handleAddClick}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Trip
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
                {isViewing ? `Trip to ${selectedTrip?.destination}`: selectedTrip ? 'Edit Trip' : 'Add a New Trip'}
            </DialogTitle>
          </DialogHeader>
          {isViewing && selectedTrip ? (
             <TripDetails trip={selectedTrip} />
          ) : (
             <TripForm tripToEdit={selectedTrip} setDialogOpen={setDialogOpen} />
          )}
        </DialogContent>
      </Dialog>


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
                        <DropdownMenuItem onSelect={() => handleEditClick(trip)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleViewClick(trip)}>View Details</DropdownMenuItem>
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

