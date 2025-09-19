
'use client';

import { PlusCircle, MoreHorizontal, Car, Plane, Train, Bus, DollarSign, ListChecks, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { Trip } from '@/lib/types';
import { TripForm } from '@/app/(app)/dashboard/trip-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { AppShell } from '@/components/app-shell';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';


const mockTrips: Trip[] = [
  {
    id: '1',
    tripNumber: 'AGT-001',
    origin: 'Delhi (DEL)',
    destination: 'Mumbai (BOM)',
    startTime: new Date('2024-08-15T09:00:00'),
    mode: 'flight',
    travelers: ['Anjali', 'Rohan'],
    status: 'Upcoming',
  },
  {
    id: '2',
    tripNumber: 'AGT-002',
    origin: 'Jaipur',
    destination: 'Agra',
    startTime: new Date('2024-07-20T07:30:00'),
    mode: 'car',
    travelers: ['Priya'],
    status: 'Completed',
  },
  {
    id: '3',
    tripNumber: 'AGT-003',
    origin: 'Kolkata (HWH)',
    destination: 'Varanasi (BSB)',
    startTime: new Date('2024-08-25T21:00:00'),
    mode: 'train',
    travelers: ['Mr. Sharma', 'Mrs. Sharma'],
    status: 'Upcoming',
  },
];

const bookingsData = [
  { month: 'Jan', bookings: 12 },
  { month: 'Feb', bookings: 15 },
  { month: 'Mar', bookings: 22 },
  { month: 'Apr', bookings: 18 },
  { month: 'May', bookings: 25 },
  { month: 'Jun', bookings: 20 },
];

const bookingsChartConfig: ChartConfig = {
  bookings: {
    label: 'Bookings',
    color: 'hsl(var(--primary))',
  },
};

const tripTypeData = [
    { type: "Flight", count: 25 },
    { type: "Train", count: 18 },
    { type: "Bus", count: 12 },
    { type: "Car", count: 23 },
]

const tripTypeChartConfig: ChartConfig = {
    count: {
        label: "Count",
    }
}

const modeIcons = {
  flight: <Plane className="h-4 w-4 text-muted-foreground" />,
  train: <Train className="h-4 w-4 text-muted-foreground" />,
  car: <Car className="h-4 w-4 text-muted-foreground" />,
  bus: <Bus className="h-4 w-4 text-muted-foreground" />,
}


export default function AgencyDashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agency Dashboard</h1>
            <p className="text-muted-foreground">Manage your trips and view analytics.</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Trip
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add a New Trip</DialogTitle>
              </DialogHeader>
              <TripForm setDialogOpen={() => {}} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                    <ListChecks className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">78</div>
                    <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
                    <Plane className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">12</div>
                     <p className="text-xs text-muted-foreground">5 scheduled for next week</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹8,50,000</div>
                     <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
            </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Bookings Per Month</CardTitle>
                    <CardDescription>An overview of your monthly trip bookings.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={bookingsChartConfig} className="h-64 w-full">
                        <BarChart accessibilityLayer data={bookingsData}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="bookings" fill="var(--color-bookings)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Trip Type Distribution</CardTitle>
                    <CardDescription>Breakdown of trips by transport mode.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={tripTypeChartConfig} className="h-64 w-full">
                        <BarChart accessibilityLayer data={tripTypeData} layout="vertical">
                            <CartesianGrid horizontal={false} />
                            <YAxis dataKey="type" type="category" tickLine={false} tickMargin={10} axisLine={false} width={80}/>
                            <XAxis type="number" hide />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Trip Management</CardTitle>
            <CardDescription>A list of all trips managed by your agency.</CardDescription>
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
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Cancel Trip</DropdownMenuItem>
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
    </AppShell>
  );
}
