
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Sun, Cloud, CloudRain, Newspaper, Building, Star, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { generateLocationDetails, GenerateLocationDetailsOutput } from '@/ai/flows/generate-location-details';
import { Skeleton } from '@/components/ui/skeleton';

type LocationPageProps = {
  params: { slug: string };
};

const weatherIcons = {
    Sun: <Sun className="text-yellow-500" />,
    Cloud: <Cloud className="text-gray-400" />,
    CloudRain: <CloudRain className="text-blue-500" />,
}

export default function LocationPage({ params }: LocationPageProps) {
  const locationName = decodeURIComponent(params.slug);
  const [locationData, setLocationData] = useState<GenerateLocationDetailsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLocationData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await generateLocationDetails({ location: locationName });
        setLocationData(data);
      } catch (err) {
        console.error(err);
        setError(`Failed to load details for ${locationName}. Please try searching for another location.`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocationData();
  }, [locationName]);

  if (isLoading) {
    return <LocationSkeleton />;
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20">
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="text-muted-foreground">{error}</p>
        </div>
    );
  }

  if (!locationData) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20">
        <h2 className="text-2xl font-bold">No data found</h2>
        <p className="text-muted-foreground">We couldn't find any information for {locationName}.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
        <Image
          src={`https://picsum.photos/seed/${locationName.toLowerCase().replace(/ /g, '-')}/1200/400`}
          alt={`View of ${locationName}`}
          fill
          className="object-cover"
          data-ai-hint={locationData.heroImageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                {locationData.name}
            </h1>
            <p className="mt-2 max-w-2xl text-lg text-foreground/80">{locationData.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Building/> Accommodations</CardTitle>
                    <CardDescription>Price comparisons from various platforms.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Hotel</TableHead>
                                <TableHead>Best Price</TableHead>
                                <TableHead>Platform</TableHead>
                                <TableHead>Rating</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {locationData.accommodations.map(hotel => (
                                <TableRow key={hotel.name}>
                                    <TableCell className="font-medium">{hotel.name}</TableCell>
                                    <TableCell>{hotel.price}</TableCell>
                                    <TableCell><Badge variant="secondary">{hotel.platform}</Badge></TableCell>
                                    <TableCell className='flex items-center gap-1'><Star className='text-yellow-500 fill-yellow-500 w-4 h-4'/> {hotel.rating}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tourist Places & Nearby Landmarks</CardTitle>
                    <CardDescription>Must-visit spots in and around {locationName}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Carousel opts={{ align: "start", loop: true }}>
                        <CarouselContent>
                            {locationData.touristPlaces.map((place, index) => (
                                <CarouselItem key={place.name} className="md:basis-1/2 lg:basis-1/3">
                                    <div className="p-1">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Card className="overflow-hidden cursor-pointer">
                                                    <CardContent className="flex aspect-video items-center justify-center p-0 relative overflow-hidden rounded-lg">
                                                        <Image src={`https://picsum.photos/seed/${place.name.toLowerCase().replace(/ /g, '-')}/${index}/400/300`} alt={place.name} fill className='object-cover' data-ai-hint={place.imageHint}/>
                                                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                                                          <span className="text-lg font-semibold text-white">{place.name}</span>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-xl">
                                                <DialogHeader>
                                                    <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
                                                        <Image src={`https://picsum.photos/seed/${place.name.toLowerCase().replace(/ /g, '-')}/${index}/400/300`} alt={place.name} fill className='object-cover' data-ai-hint={place.imageHint}/>
                                                    </div>
                                                    <DialogTitle className="text-2xl">{place.name}</DialogTitle>
                                                    <DialogDescription className="text-base pt-2">
                                                        {place.description}
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="ml-12" />
                        <CarouselNext className="mr-12" />
                    </Carousel>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Weather Forecast</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {locationData.weather.map((day, index) => (
                        <div key={day.day}>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{day.day}</span>
                                <span className="text-muted-foreground">{day.condition}</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{day.temp}</span>
                                    {weatherIcons[day.icon]}
                                </div>
                            </div>
                            {index < locationData.weather.length -1 && <Separator className="mt-4"/>}
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Newspaper/> Local News</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     {locationData.news.map((item, index) => (
                        <div key={item.title}>
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                <p className="font-medium leading-snug">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.source}</p>
                            </a>
                            {index < locationData.news.length - 1 && <Separator className="mt-4" />}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}


function LocationSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                <Skeleton className="h-full w-full" />
                 <div className="absolute bottom-0 left-0 p-6">
                    <Skeleton className="h-12 w-1/2 mb-4" />
                    <Skeleton className="h-6 w-3/4" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                     <Card>
                        <CardHeader>
                             <Skeleton className="h-8 w-1/2" />
                             <Skeleton className="h-4 w-1/3" />
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-2">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                           </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                           <Skeleton className="h-8 w-1/2" />
                           <Skeleton className="h-4 w-1/3" />
                        </CardHeader>
                        <CardContent>
                             <div className="flex gap-4">
                                <Skeleton className="h-40 w-1/3" />
                                <Skeleton className="h-40 w-1/3" />
                                <Skeleton className="h-40 w-1/3" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-8">
                     <Card>
                        <CardHeader>
                           <Skeleton className="h-8 w-1/2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                             <Skeleton className="h-8 w-1/2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}


    
