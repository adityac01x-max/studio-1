
'use client';

import Link from 'next/link';
import { ArrowLeft, Car, Plane, Train, Bus, User, BarChart2, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/components/app-shell';
import type { Trip } from '@/lib/types';
import { format } from 'date-fns';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TripDetails } from './trip-details';

type LocationAdminPageProps = {
  params: { slug: string };
};

const mockLocationTrips: Trip[] = [
  {
    id: '1',
    tripNumber: 'BT-M-001',
    origin: 'Delhi (DEL)',
    destination: 'Mumbai (BOM)',
    startTime: new Date('2024-08-15T09:00:00'),
    mode: 'flight',
    travelers: ['Anjali', 'Rohan'],
    status: 'Completed',
    accommodation: { name: 'The Taj Mahal Palace', type: 'Hotel' },
    visitedPlaces: [
        { name: 'Gateway of India', rating: 5, review: 'Absolutely breathtaking, a must-see.' },
        { name: 'Marine Drive', rating: 4, review: 'Beautiful promenade, great for evening walks.' }
    ],
    tripExperience: 'Had a wonderful time exploring Mumbai. The food was incredible and the sights were amazing. The accommodation at the Taj was superb.'
  },
  {
    id: '2',
    tripNumber: 'BT-M-002',
    origin: 'Pune',
    destination: 'Mumbai',
    startTime: new Date('2024-07-22T08:00:00'),
    mode: 'car',
    travelers: ['Amit'],
    status: 'Completed',
    accommodation: { name: 'Trident Nariman Point', type: 'Hotel' },
    visitedPlaces: [
        { name: 'Siddhivinayak Temple', rating: 5, review: 'Very spiritual and peaceful experience.' },
    ],
    tripExperience: 'A quick but fulfilling trip. The drive was smooth and the temple visit was the highlight.'
  },
   {
    id: '3',
    tripNumber: 'BT-M-003',
    origin: 'Ahmedabad (ADI)',
    destination: 'Mumbai (BCT)',
    startTime: new Date('2024-09-05T22:00:00'),
    mode: 'train',
    travelers: ['Priya', 'Sunil'],
    status: 'Upcoming',
  },
   {
    id: '4',
    tripNumber: 'BT-M-004',
    origin: 'Bengaluru',
    destination: 'Mumbai',
    startTime: new Date('2024-09-10T20:00:00'),
    mode: 'bus',
    travelers: ['Kavita'],
    status: 'Upcoming',
  },
];

const chartData = [
  { month: 'January', trips: 5 },
  { month: 'February', trips: 8 },
  { month: 'March', trips: 12 },
  { month: 'April', trips: 7 },
  { month: 'May', trips: 10 },
  { month: 'June', trips: 15 },
];

const chartConfig: ChartConfig = {
  trips: {
    label: 'Trips',
    color: 'hsl(var(--primary))',
  },
};

const modeIcons = {
  flight: <Plane className="h-4 w-4 text-muted-foreground" />,
  train: <Train className="h-4 w-4 text-muted-foreground" />,
  car: <Car className="h-4 w-4 text-muted-foreground" />,
  bus: <Bus className="h-4 w-4 text-muted-foreground" />,
};

export default function LocationAdminPage({ params }: LocationAdminPageProps) {
  const locationName = decodeURIComponent(params.slug);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/admin">
                    <ArrowLeft className="h-4 w-4"/>
                    <span className="sr-only">Back to Admin</span>
                </Link>
            </Button>
            <div>
                <h1 className="text-3xl font-bold">
                Location Analytics: {locationName}
                </h1>
                <p className="text-muted-foreground">Detailed report of tourist activities and trips.</p>
            </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
                    <Car className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">45</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Itinerary Requests</CardTitle>
                    <List className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">120</div>
                     <p className="text-xs text-muted-foreground">+25% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Tourists</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">85</div>
                     <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">SOS Alerts</CardTitle>
                    <BarChart2 className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">1</div>
                     <p className="text-xs text-muted-foreground">Last alert on Aug 10</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Trip History</CardTitle>
                    <CardDescription>Recent trips to and from {locationName}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Trip</TableHead>
                                <TableHead>Travelers</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {mockLocationTrips.map((trip) => (
                           <Dialog key={trip.id}>
                            <DialogTrigger asChild>
                                <TableRow className="cursor-pointer">
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {modeIcons[trip.mode]}
                                            <div>
                                                <div className="font-medium">{trip.origin}</div>
                                                <div className="text-sm text-muted-foreground">to {trip.destination}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{trip.travelers.join(', ')}</TableCell>
                                    <TableCell>{format(trip.startTime, 'MMM d, yyyy')}</TableCell>
                                    <TableCell>
                                        <Badge variant={trip.status === 'Completed' ? 'secondary' : 'default'}>
                                        {trip.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                    <DialogHeader>
                                        <DialogTitle>Trip Details: {trip.tripNumber}</DialogTitle>
                                    </DialogHeader>
                                    <TripDetails trip={trip} />
                                </DialogContent>
                            </Dialog>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Trip Trends</CardTitle>
                    <CardDescription>Monthly trip volume for {locationName}.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={chartConfig} className="h-64 w-full">
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="trips" fill="var(--color-trips)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
      </div>
    </AppShell>
  );
}
