
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const mockFlights = [
    {
        airline: 'IndiGo',
        flightNumber: '6E 204',
        departure: '08:30',
        arrival: '10:45',
        duration: '2h 15m',
        platform: 'MakeMyTrip',
        price: '₹5,500',
        url: 'https://www.makemytrip.com/flights/',
    },
    {
        airline: 'IndiGo',
        flightNumber: '6E 204',
        departure: '08:30',
        arrival: '10:45',
        duration: '2h 15m',
        platform: 'EaseMyTrip',
        price: '₹5,450',
        url: 'https://www.easemytrip.com/',
    },
    {
        airline: 'Vistara',
        flightNumber: 'UK 987',
        departure: '09:15',
        arrival: '11:20',
        duration: '2h 05m',
        platform: 'Goibibo',
        price: '₹6,200',
        url: 'https://www.goibibo.com/flights/',
    },
     {
        airline: 'Vistara',
        flightNumber: 'UK 987',
        departure: '09:15',
        arrival: '11:20',
        duration: '2h 05m',
        platform: 'Vistara Official',
        price: '₹6,150',
        url: 'https://www.airvistara.com/',
    },
];


export default function FlightsPage() {
    const [showResults, setShowResults] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setShowResults(true);
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Compare Flights</CardTitle>
                    <CardDescription>Find the cheapest flight tickets across different websites.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="origin">Origin</Label>
                            <Input id="origin" placeholder="e.g., Delhi" defaultValue="Delhi" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="destination">Destination</Label>
                            <Input id="destination" placeholder="e.g., Mumbai" defaultValue="Mumbai" />
                        </div>
                        <div className="space-y-2">
                             <Label>Departure Date</Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {format(new Date(), "PPP")}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Button type="submit" className="w-full">
                            <Search className="mr-2 h-4 w-4" /> Search
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {showResults && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Comparison Results</CardTitle>
                        <CardDescription>Showing best prices for flights from Delhi to Mumbai.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Flight</TableHead>
                                    <TableHead>Timings</TableHead>
                                    <TableHead>Platform</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockFlights.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="font-medium">{item.airline}</div>
                                            <div className="text-sm text-muted-foreground">{item.flightNumber}</div>
                                        </TableCell>
                                        <TableCell>
                                             <div className="font-medium">{item.departure} - {item.arrival}</div>
                                             <div className="text-sm text-muted-foreground">{item.duration}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{item.platform}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">{item.price}</TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild size="sm">
                                                <a href={item.url} target="_blank" rel="noopener noreferrer">Book Now</a>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
