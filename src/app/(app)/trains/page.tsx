
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Search, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { compareTrains, CompareTrainsInput, CompareTrainsOutput } from '@/ai/flows/compare-trains';
import { Skeleton } from '@/components/ui/skeleton';

type TrainResult = CompareTrainsOutput['results'][0];

export default function TrainsPage() {
    const [origin, setOrigin] = useState('New Delhi');
    const [destination, setDestination] = useState('Mumbai');
    const [journeyDate, setJourneyDate] = useState<Date | undefined>(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState<TrainResult[]>([]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!origin || !destination || !journeyDate) {
            setError('Please fill in all search fields.');
            return;
        }

        setError('');
        setIsLoading(true);
        setResults([]);

        try {
            const input: CompareTrainsInput = {
                origin,
                destination,
                journeyDate: format(journeyDate, 'PPP'),
            };
            const response = await compareTrains(input);
            setResults(response.results);
        } catch (err) {
            console.error(err);
            setError('Failed to get comparison results. Please try again.');
        } finally {
            setIsLoading(false);
        }
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
                            <Input id="origin" placeholder="e.g., NDLS - New Delhi" value={origin} onChange={(e) => setOrigin(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="destination">To</Label>
                            <Input id="destination" placeholder="e.g., BCT - Mumbai Central" value={destination} onChange={(e) => setDestination(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                             <Label>Date of Journey</Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !journeyDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {journeyDate ? format(journeyDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={journeyDate} onSelect={setJourneyDate} initialFocus />
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
                        <CardTitle>Comparison Results</CardTitle>
                        <CardDescription>
                             {isLoading ? `Searching for trains from ${origin} to ${destination}...` : `Showing best prices for trains from ${origin} to ${destination}.`}
                        </CardDescription>
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
                                {isLoading ? (
                                     Array.from({ length: 5 }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Skeleton className="h-4 w-[120px]" />
                                                <Skeleton className="h-3 w-[80px] mt-2" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-[100px]" />
                                                <Skeleton className="h-3 w-[80px] mt-2" />
                                            </TableCell>
                                            <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="h-4 w-[60px] ml-auto" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="h-8 w-[100px] ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    results.map((item, index) => (
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
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
