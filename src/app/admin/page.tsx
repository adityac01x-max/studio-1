

'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { SOSAlert } from '@/lib/types';
import { format } from 'date-fns';
import { AppShell } from '@/components/app-shell';
import { BellRing, TrendingUp, MapPin } from 'lucide-react';
import Link from 'next/link';

const mockAlerts: SOSAlert[] = [
  { id: '1', userName: 'Anjali Sharma', location: 'Goa', time: new Date('2024-08-10T14:30:00'), status: 'Pending' },
  { id: '2', userName: 'Rohan Mehra', location: 'Shimla', time: new Date('2024-08-10T12:15:00'), status: 'Resolved' },
  { id: '3', userName: 'Priya Singh', location: 'Jaipur', time: new Date('2024-08-09T22:00:00'), status: 'Resolved' },
  { id: '4', userName: 'Vikram Rathod', location: 'Mumbai', time: new Date('2024-08-10T15:00:00'), status: 'In Progress' },
];

const tripsData = [
  { month: 'January', trips: 186 },
  { month: 'February', trips: 305 },
  { month: 'March', trips: 237 },
  { month: 'April', trips: 273 },
  { month: 'May', trips: 209 },
  { month: 'June', trips: 214 },
];

const chartConfig: ChartConfig = {
  trips: {
    label: 'Trips',
    color: 'hsl(var(--primary))',
  },
};

const sosStatusData = [
    { status: 'Pending', count: 1 },
    { status: 'In Progress', count: 1 },
    { status: 'Resolved', count: 12 },
]

const sosChartConfig: ChartConfig = {
    count: {
        label: "Count",
        color: "hsl(var(--destructive))"
    }
}

const mockDestinationData = [
    { location: 'Mumbai', trips: 45, itineraries: 120, sos: 1 },
    { location: 'Delhi', trips: 62, itineraries: 150, sos: 0 },
    { location: 'Goa', trips: 88, itineraries: 210, sos: 1 },
    { location: 'Jaipur', trips: 35, itineraries: 95, sos: 1 },
    { location: 'Shimla', trips: 25, itineraries: 70, sos: 1 },
    { location: 'Kolkata', trips: 40, itineraries: 80, sos: 0 },
];

export default function AdminPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader>
                    <CardTitle>Total Trips (6 months)</CardTitle>
                    <CardDescription>1,424</CardDescription>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Active SOS Alerts</CardTitle>
                    <CardDescription>2</CardDescription>
                </CardHeader>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>New Agencies</CardTitle>
                    <CardDescription>5 this month</CardDescription>
                </CardHeader>
            </Card>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin/> Popular Destinations</CardTitle>
                <CardDescription>Analytics based on tourist activity. Select a location to view details.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Location</TableHead>
                            <TableHead className="text-right">Trips</TableHead>
                            <TableHead className="text-right">Itinerary Requests</TableHead>
                            <TableHead className="text-right">SOS Alerts</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockDestinationData.sort((a,b) => b.trips - a.trips).map(dest => (
                            <TableRow key={dest.location}>
                                <TableCell className="font-medium">
                                    <Link href={`/admin/location/${encodeURIComponent(dest.location)}`} className="hover:underline text-primary">
                                        {dest.location}
                                    </Link>
                                </TableCell>
                                <TableCell className="text-right">{dest.trips}</TableCell>
                                <TableCell className="text-right">{dest.itineraries}</TableCell>
                                <TableCell className="text-right">{dest.sos}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>


        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BellRing />SOS Alert Receiver</CardTitle>
                    <CardDescription>Live feed of emergency requests.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {mockAlerts.map(alert => (
                            <TableRow key={alert.id} className={alert.status === 'Pending' ? 'bg-destructive/10' : ''}>
                                <TableCell className="font-medium">{alert.userName}</TableCell>
                                <TableCell>{alert.location}</TableCell>
                                <TableCell>{format(alert.time, 'MMM d, h:mm a')}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        alert.status === 'Resolved' ? 'secondary' : alert.status === 'Pending' ? 'destructive' : 'default'
                                    }>
                                    {alert.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp/>Data Analytics</CardTitle>
                    <CardDescription>Overview of platform activity.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div>
                        <h3 className="font-semibold mb-2">Trips per Month</h3>
                        <ChartContainer config={chartConfig} className="h-48 w-full">
                            <BarChart accessibilityLayer data={tripsData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="trips" fill="var(--color-trips)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-2">SOS Request Status</h3>
                        <ChartContainer config={sosChartConfig} className="h-48 w-full">
                           <BarChart accessibilityLayer data={sosStatusData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="status" tickLine={false} tickMargin={10} axisLine={false} />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </AppShell>
  );
}
