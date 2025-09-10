import Image from 'next/image';
import Link from 'next/link';
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
import { Sun, Cloud, CloudRain, Newspaper, Building, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';


type LocationPageProps = {
  params: { slug: string };
};

const mockLocationData = {
    name: "Mumbai",
    description: "The vibrant financial capital of India, known for its bustling streets, colonial architecture, and the Bollywood film industry.",
    accommodations: [
        { name: 'The Taj Mahal Palace', price: '₹25,000', platform: 'Booking.com', rating: 4.8 },
        { name: 'Trident Nariman Point', price: '₹18,000', platform: 'Agoda', rating: 4.6 },
        { name: 'The Oberoi', price: '₹22,000', platform: 'MakeMyTrip', rating: 4.9 },
    ],
    weather: [
        { day: 'Today', temp: '31°C', condition: 'Sunny', icon: <Sun/> },
        { day: 'Tomorrow', temp: '30°C', condition: 'Partly Cloudy', icon: <Cloud/> },
        { day: 'Day After', temp: '29°C', condition: 'Light Rain', icon: <CloudRain/> },
    ],
    news: [
        { title: "City metro's new line to open next month", source: "The Times of India", url: "https://timesofindia.indiatimes.com/" },
        { title: "Annual food festival to kick off this weekend", source: "Hindustan Times", url: "https://www.hindustantimes.com/" },
        { title: "Authorities issue advisory for monsoon preparedness", source: "NDTV", url: "https://www.ndtv.com/" },
    ],
    touristPlaces: [
        { name: "Gateway of India", image: "https://picsum.photos/seed/gateway/400/300", hint: "historic monument", description: "An arch-monument built in the early 20th century, located on the waterfront in South Mumbai." },
        { name: "Marine Drive", image: "https://picsum.photos/seed/marinedrive/400/300", hint: "city skyline", description: "A 3.6-kilometre-long boulevard in South Mumbai. It is a 'C'-shaped six-lane concrete road along the coast." },
        { name: "Elephanta Caves", image: "https://picsum.photos/seed/elephanta/400/300", hint: "ancient caves", description: "A network of sculpted caves located on Elephanta Island, or Gharapuri in Mumbai Harbour." },
        { name: "Chhatrapati Shivaji Terminus", image: "https://picsum.photos/seed/cst/400/300", hint: "train station", description: "A historic railway station and a UNESCO World Heritage Site in Mumbai, Maharashtra, India." },
        { name: "Siddhivinayak Temple", image: "https://picsum.photos/seed/siddhi/400/300", hint: "temple architecture", description: "A Hindu temple dedicated to Lord Shri Ganesh. It is one of the richest temples in Mumbai." },
    ]
}

export default function LocationPage({ params }: LocationPageProps) {
  const locationName = decodeURIComponent(params.slug);

  return (
    <div className="space-y-8">
      <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
        <Image
          src="https://picsum.photos/seed/mumbaivibe/1200/400"
          alt={`View of ${locationName}`}
          fill
          className="object-cover"
          data-ai-hint="cityscape mumbai"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground">
                {mockLocationData.name}
            </h1>
            <p className="mt-2 max-w-2xl text-lg text-foreground/80">{mockLocationData.description}</p>
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
                            {mockLocationData.accommodations.map(hotel => (
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
                            {mockLocationData.touristPlaces.map(place => (
                                <CarouselItem key={place.name} className="md:basis-1/2 lg:basis-1/3">
                                    <div className="p-1">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Card className="overflow-hidden cursor-pointer">
                                                    <CardContent className="flex aspect-video items-center justify-center p-0 relative overflow-hidden rounded-lg">
                                                        <Image src={place.image} alt={place.name} fill className='object-cover' data-ai-hint={place.hint}/>
                                                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                                                          <span className="text-lg font-semibold text-white">{place.name}</span>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-xl">
                                                <DialogHeader>
                                                    <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
                                                        <Image src={place.image} alt={place.name} fill className='object-cover' data-ai-hint={place.hint}/>
                                                    </div>
                                                    <DialogTitle className="text-2xl font-headline">{place.name}</DialogTitle>
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
                    {mockLocationData.weather.map((day, index) => (
                        <div key={day.day}>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{day.day}</span>
                                <span className="text-muted-foreground">{day.condition}</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{day.temp}</span>
                                    <div className="text-muted-foreground">{day.icon}</div>
                                </div>
                            </div>
                            {index < mockLocationData.weather.length -1 && <Separator className="mt-4"/>}
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Newspaper/> Local News</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     {mockLocationData.news.map((item, index) => (
                        <div key={item.title}>
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                <p className="font-medium leading-snug">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.source}</p>
                            </a>
                            {index < mockLocationData.news.length - 1 && <Separator className="mt-4" />}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
