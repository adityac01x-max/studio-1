
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
import Image from 'next/image';

const mockAccommodations = [
    {
        name: 'The Taj Mahal Palace',
        platform: 'MakeMyTrip',
        price: '₹25,000',
        rating: 4.8,
        imageUrl: `https://picsum.photos/seed/taj-palace/200/150`,
        imageHint: 'luxury hotel',
        url: 'https://www.makemytrip.com/hotels/',
    },
    {
        name: 'The Taj Mahal Palace',
        platform: 'Goibibo',
        price: '₹24,500',
        rating: 4.8,
        imageUrl: `https://picsum.photos/seed/taj-palace/200/150`,
        imageHint: 'luxury hotel',
        url: 'https://www.goibibo.com/hotels/',
    },
    {
        name: 'The Taj Mahal Palace',
        platform: 'Booking.com',
        price: '₹26,000',
        rating: 4.8,
        imageUrl: `https://picsum.photos/seed/taj-palace/200/150`,
        imageHint: 'luxury hotel',
        url: 'https://www.booking.com/',
    },
     {
        name: 'Vivanta Goa',
        platform: 'MakeMyTrip',
        price: '₹18,000',
        rating: 4.5,
        imageUrl: `https://picsum.photos/seed/vivanta-goa/200/150`,
        imageHint: 'beach resort',
        url: 'https://www.makemytrip.com/hotels/',
    },
    {
        name: 'Vivanta Goa',
        platform: 'Goibibo',
        price: '₹18,500',
        rating: 4.5,
        imageUrl: `https://picsum.photos/seed/vivanta-goa/200/150`,
        imageHint: 'beach resort',
        url: 'https://www.goibibo.com/hotels/',
    },
];


export default function AccommodationsPage() {
    const [showResults, setShowResults] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setShowResults(true);
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Compare Accommodations</CardTitle>
                    <CardDescription>Find the best hotel deals across different platforms.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" placeholder="e.g., Mumbai" defaultValue="Mumbai" />
                        </div>
                        <div className="space-y-2">
                             <Label>Check-in Date</Label>
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
                         <div className="space-y-2">
                             <Label>Check-out Date</Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {format(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), "PPP")}
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
                        <CardDescription>Showing best prices for hotels in Mumbai.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Accommodation</TableHead>
                                    <TableHead>Platform</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead className="text-right">Price (per night)</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockAccommodations.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <Image src={item.imageUrl} alt={item.name} width={100} height={75} className="rounded-md object-cover" data-ai-hint={item.imageHint} />
                                                <span className="font-medium">{item.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{item.platform}</Badge>
                                        </TableCell>
                                        <TableCell>{item.rating}</TableCell>
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
