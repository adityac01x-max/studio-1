
'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, MoreHorizontal, Car, Plane, Train, Bus, MapPin, PlayCircle, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { Trip } from '@/lib/types';
import { TripForm } from './trip-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { TripDetails } from './trip-details';
import { useToast } from '@/hooks/use-toast';

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
  flight: <Plane className="h-4 w-4 text-muted-foreground" />,
  train: <Train className="h-4 w-4 text-muted-foreground" />,
  car: <Car className="h-4 w-4 text-muted-foreground" />,
  bus: <Bus className="h-4 w-4 text-muted-foreground" />,
}

export default function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isViewing, setIsViewing] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, check persistent storage (e.g., localStorage)
    const consent = localStorage.getItem('natpac_consent');
    if (consent === 'true') {
        setHasConsented(true);
    } else {
        // Show consent dialog to new users after a small delay
        const timer = setTimeout(() => setShowConsentDialog(true), 1000);
        return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = () => {
    // In a real app, store consent
    localStorage.setItem('natpac_consent', 'true');
    setHasConsented(true);
    setShowConsentDialog(false);
    toast({
        title: "Thank you!",
        description: "You have consented to data collection for NATPAC research.",
    });
  }

  const handleToggleTracking = () => {
    if (!hasConsented) {
        setShowConsentDialog(true);
        return;
    }

    if (!isTracking) {
        // Simulate starting tracking
        setIsTracking(true);
        toast({
            title: "Trip Tracking Started",
            description: "We are now automatically detecting your trip details.",
        });
    } else {
        // Simulate stopping tracking and logging a trip
        setIsTracking(false);
        // In a real app, you would use a flow to upload this data.
        const newTrip: Trip = {
            id: (mockTrips.length + 1).toString(),
            tripNumber: `BT-D-${String(mockTrips.length + 1).padStart(3, '0')}`,
            origin: "Detected: Home",
            destination: "Detected: Office",
            startTime: new Date(),
            mode: 'car',
            travelers: ['You'],
            status: 'Completed',
        };
        mockTrips.push(newTrip);
        toast({
            title: "Trip Logged!",
            description: "Your trip from Home to Office has been logged and uploaded.",
        });
    }
  };


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
       <AlertDialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>User Consent for Data Collection</AlertDialogTitle>
                    <AlertDialogDescription>
                        To improve transportation research, we would like to collect anonymous data about your travel patterns (origin, destination, mode of transport, and time). This data will be securely shared with NATPAC scientists.
                        <br/><br/>
                        Your privacy is important to us. All data is anonymized and handled in compliance with privacy regulations. Do you consent to this data collection?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setShowConsentDialog(false)}>Decline</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConsent}>Consent</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Trips</h1>
          <p className="text-muted-foreground">Manage and view your travel plans.</p>
        </div>
         <Button onClick={handleAddClick}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Trip
        </Button>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>Automated Trip Tracking</CardTitle>
                <CardDescription>Automatically log your trips using your device's sensors for NATPAC research.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-5 w-5" />
                        <span>Status: {isTracking ? 'Tracking in progress...' : 'Not Tracking'}</span>
                        {isTracking && <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>}
                    </div>
                    <Button 
                        onClick={handleToggleTracking} 
                        className={isTracking ? 'bg-destructive hover:bg-destructive/90' : 'bg-green-600 hover:bg-green-600/90'}
                    >
                        {isTracking ? <StopCircle className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                        {isTracking ? 'Stop Tracking' : 'Start Tracking'}
                    </Button>
                </div>
                {!hasConsented && <p className="text-xs text-muted-foreground mt-4">Note: You must consent to data collection to use this feature.</p>}
            </CardContent>
        </Card>

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
                <TableHead className="hidden sm:table-cell">Mode</TableHead>
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
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                        {modeIcons[trip.mode]}
                        <span className="capitalize">{trip.mode}</span>
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
                    <Badge variant={trip.status === 'Completed' ? 'secondary' : 'default'}>
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
