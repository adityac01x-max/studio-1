
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

const mockTrains = [
    {
        trainName: 'Mumbai Rajdhani',
        trainNumber: '12951',
        departure: '17:00',
        arrival: '08:32',
        duration: '15h 32m',
        platform: 'IRCTC Official',
        price: 'Rs. 3,500',
        url: 'https://www.irctc.co.in/',
    },
    {
        trainName: 'Mumbai Rajdhani',
        trainNumber: '12951',
        departure: '17:00',
        arrival: '08:32',
        duration: '15h 32m',
        platform: 'RailYatri',
        price: 'Rs. 3,550',
        url: 'https://www.railyatri.in/',
    },
    {
        trainName: 'Golden Temple Mail',
        trainNumber: '12904',
        departure: '07:40',
        arrival: '05:05',
        duration: '21h 25m',
        platform: 'IRCTC Official',
        price: 'Rs. 950',
        url: 'https://www.irctc.co.in/',
    },
     {
        trainName: 'Golden Temple Mail',
        trainNumber: '12904',
        departure: '07:40',
        arrival: '05:05',
        duration: '21h 25m',
        platform: 'MakeMyTrip',
        price: 'Rs. 1,000',
        url: 'https://www.makemytrip.com/railways/',
    },
];


export default function TrainsPage() {
    const [showResults, setShowResults] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setShowResults(true);
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Compare Train Tickets</CardTitle>
                    <CardDescription>Find the best prices for train journeys across India.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="origin">From</Label>
                            <Input id="origin" placeholder="e.g., NDLS - New Delhi" defaultValue="New Delhi" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="destination">To</Label>
                            <Input id="destination" placeholder="e.g., BCT - Mumbai Central" defaultValue="Mumbai" />
                        </div>
                        <div className="space-y-2">
                             <Label>Date of Journey</Label>
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
                        <CardDescription>Showing best prices for trains from New Delhi to Mumbai.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Train</TableHead>
                                    <TableHead>Timings</TableHead>
                                    <TableHead>Platform</TableHead>
                                    <TableHead className="text-right">Price (AC 3 Tier)</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockTrains.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="font-medium">{item.trainName}</div>
                                            <div className="text-sm text-muted-foreground">{item.trainNumber}</div>
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
