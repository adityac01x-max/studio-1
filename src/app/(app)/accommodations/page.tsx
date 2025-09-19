
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Search, Loader2, Hotel, Star, Building } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { compareAccommodations, CompareAccommodationsInput, CompareAccommodationsOutput } from '@/ai/flows/compare-accommodations';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

type AccommodationResult = CompareAccommodationsOutput['results'][0];

export default function AccommodationsPage() {
    const [searchTerm, setSearchTerm] = useState('Mumbai');
    const [checkInDate, setCheckInDate] = useState<Date | undefined>(new Date());
    const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState<AccommodationResult[]>([]);
    const [hotelSearch, setHotelSearch] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm || !checkInDate || !checkOutDate) {
            setError('Please fill in all search fields.');
            return;
        }
        
        setError('');
        setIsLoading(true);
        setResults([]);
        setHotelSearch('');

        try {
            const input: CompareAccommodationsInput = {
                searchTerm,
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
                            <Label htmlFor="searchTerm">Hotel Name or Location</Label>
                            <Input id="searchTerm" placeholder="e.g., Taj Mahal Palace or Mumbai" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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

            {isLoading && (
                 <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                             <CardTitle>Searching for best deals...</CardTitle>
                             <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                        <CardDescription>
                            Please wait while we compare prices for you.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                           <Card key={index} className="p-4">
                                <div className="flex gap-4">
                                     <Skeleton className="h-32 w-48 rounded-md" />
                                     <div className="space-y-2 flex-1">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-1/4" />
                                        <Separator className="my-4"/>
                                        <div className="space-y-3 pt-2">
                                            <div className="flex justify-between"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-1/5" /></div>
                                            <div className="flex justify-between"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-1/5" /></div>
                                        </div>
                                     </div>
                                </div>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            )}

            {!isLoading && results.length > 0 && (
                <div className="space-y-4">
                     <Card>
                        <CardHeader>
                             <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div>
                                    <CardTitle>Comparison Results</CardTitle>
                                    <CardDescription>
                                        {`Showing best prices for hotels based on your search.`}
                                    </CardDescription>
                                </div>
                                <div className="relative">
                                    <Hotel className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        placeholder="Filter hotels..." 
                                        className="pl-9"
                                        value={hotelSearch}
                                        onChange={(e) => setHotelSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                    <div className="grid grid-cols-1 gap-6">
                        {filteredResults.map((item) => (
                            <Card key={item.name} className="overflow-hidden">
                               <div className="flex flex-col md:flex-row">
                                    <div className="md:w-1/3 relative">
                                         <Image src={item.imageUrl} alt={item.name} width={400} height={300} className="object-cover h-full w-full" data-ai-hint={item.imageHint} />
                                    </div>
                                    <div className="md:w-2/3 flex flex-col">
                                        <CardHeader>
                                            <CardTitle>{item.name}</CardTitle>
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} className={cn("w-5 h-5", i < item.rating ? 'fill-current' : 'fill-muted stroke-muted-foreground')} />
                                                ))}
                                                <span className="text-sm text-muted-foreground ml-2">({item.rating} stars)</span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Platform</TableHead>
                                                        <TableHead className="text-right">Price (per night)</TableHead>
                                                        <TableHead className="w-[120px]"></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {item.platforms.map((platformItem) => (
                                                         <TableRow key={platformItem.platform}>
                                                            <TableCell>
                                                                <Badge variant="secondary">{platformItem.platform}</Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right font-semibold">{platformItem.price}</TableCell>
                                                             <TableCell className="text-right">
                                                                <Button asChild size="sm">
                                                                    <a href={platformItem.url} target="_blank" rel="noopener noreferrer">Book Now</a>
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </div>
                               </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
             {!isLoading && results.length === 0 && (
                <Card>
                    <CardContent className="py-10">
                        <div className="text-center text-muted-foreground">
                            <Building className="mx-auto h-12 w-12 mb-4"/>
                            <p>No hotels found matching your search criteria.</p>
                            <p className="text-sm">Try searching for a different hotel or location.</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
