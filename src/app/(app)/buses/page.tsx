
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

const mockBuses = [
    {
        operator: 'VRL Travels',
        busType: 'A/C Sleeper (2+1)',
        departure: '20:00',
        arrival: '06:00',
        duration: '10h 00m',
        platform: 'RedBus',
        price: 'Rs. 1,200',
        url: 'https://www.redbus.in/',
    },
    {
        operator: 'VRL Travels',
        busType: 'A/C Sleeper (2+1)',
        departure: '20:00',
        arrival: '06:00',
        duration: '10h 00m',
        platform: 'AbhiBus',
        price: 'Rs. 1,250',
        url: 'https://www.abhibus.com/',
    },
    {
        operator: 'Zingbus',
        busType: 'Volvo A/C Seater (2+2)',
        departure: '21:30',
        arrival: '07:30',
        duration: '10h 00m',
        platform: 'Paytm',
        price: 'Rs. 950',
        url: 'https://paytm.com/bus-tickets',
    },
     {
        operator: 'Zingbus',
        busType: 'Volvo A/C Seater (2+2)',
        departure: '21:30',
        arrival: '07:30',
        duration: '10h 00m',
        platform: 'RedBus',
        price: 'Rs. 980',
        url: 'https://www.redbus.in/',
    },
];


export default function BusesPage() {
    const [showResults, setShowResults] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setShowResults(true);
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Compare Bus Tickets</CardTitle>
                    <CardDescription>Find the best deals for bus travel across India.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="origin">From</Label>
                            <Input id="origin" placeholder="e.g., Bangalore" defaultValue="Bangalore" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="destination">To</Label>
                            <Input id="destination" placeholder="e.g., Hyderabad" defaultValue="Hyderabad" />
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
                        <CardDescription>Showing best prices for buses from Bangalore to Hyderabad.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Operator</TableHead>
                                    <TableHead>Timings</TableHead>
                                    <TableHead>Platform</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockBuses.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="font-medium">{item.operator}</div>
                                            <div className="text-sm text-muted-foreground">{item.busType}</div>
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
