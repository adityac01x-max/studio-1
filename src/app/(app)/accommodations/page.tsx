
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Search, Loader2, Hotel } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { compareAccommodations, CompareAccommodationsInput, CompareAccommodationsOutput } from '@/ai/flows/compare-accommodations';
import { Skeleton } from '@/components/ui/skeleton';

type AccommodationResult = CompareAccommodationsOutput['results'][0];

export default function AccommodationsPage() {
    const [location, setLocation] = useState('Mumbai');
    const [checkInDate, setCheckInDate] = useState<Date | undefined>(new Date());
    const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState<AccommodationResult[]>([]);
    const [hotelSearch, setHotelSearch] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!location || !checkInDate || !checkOutDate) {
            setError('Please fill in all search fields.');
            return;
        }
        
        setError('');
        setIsLoading(true);
        setResults([]);
        setHotelSearch('');

        try {
            const input: CompareAccommodationsInput = {
                location,
                checkInDate: format(checkInDate, 'PPP'),
                checkOutDate: format(checkOutDate, 'PPP'),
            };
            const response = await compareAccommodations(input);
            setResults(response.results);
        } catch (err) {
            console.error(err);
            setError('Failed to get comparison results. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const filteredResults = results.filter(item => 
        item.name.toLowerCase().includes(hotelSearch.toLowerCase())
    );

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
                            <Input id="location" placeholder="e.g., Mumbai" value={location} onChange={(e) => setLocation(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                             <Label>Check-in Date</Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !checkInDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {checkInDate ? format(checkInDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={checkInDate} onSelect={setCheckInDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                         <div className="space-y-2">
                             <Label>Check-out Date</Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !checkOutDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {checkOutDate ? format(checkOutDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={checkOutDate} onSelect={setCheckOutDate} disabled={{ before: checkInDate || new Date() }} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />} 
                            {isLoading ? 'Searching...' : 'Search'}
                        </Button>
                    </form>
                    {error && <p className="text-sm font-medium text-destructive mt-4">{error}</p>}
                </CardContent>
            </Card>

            {(isLoading || results.length > 0) && (
                 <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <div>
                                <CardTitle>Comparison Results</CardTitle>
                                <CardDescription>
                                    {isLoading ? `Searching for hotels in ${location}...` : `Showing best prices for hotels in ${location}.`}
                                </CardDescription>
                            </div>
                            <div className="relative">
                                <Hotel className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search hotels..." 
                                    className="pl-9"
                                    value={hotelSearch}
                                    onChange={(e) => setHotelSearch(e.target.value)}
                                    disabled={isLoading || results.length === 0}
                                />
                            </div>
                        </div>
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
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="flex items-center gap-4">
                                                    <Skeleton className="h-[75px] w-[100px] rounded-md" />
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-4 w-[150px]" />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="h-4 w-[60px] ml-auto" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="h-8 w-[100px] ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    filteredResults.map((item, index) => (
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
                                    ))
                                )}
                            </TableBody>
                        </Table>
                         {!isLoading && filteredResults.length === 0 && (
                            <div className="text-center py-10 text-muted-foreground">
                                No hotels found matching your search.
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
