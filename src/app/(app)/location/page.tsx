
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const locations = [
    { name: 'Mumbai', description: 'The vibrant financial capital of India.', imageId: 'location-6' },
    { name: 'Delhi', description: 'The historic capital city of India.', imageId: 'location-1' },
    { name: 'Kerala', description: 'Famous for its serene backwaters.', imageId: 'location-2' },
    { name: 'Varanasi', description: 'The spiritual heart of India.', imageId: 'location-3' },
    { name: 'Rajasthan', description: 'The land of kings, forts, and palaces.', imageId: 'location-4' },
    { name: 'Munnar', description: 'Known for its sprawling tea plantations.', imageId: 'location-5' },
];

export default function LocationExplorerPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Explore Destinations</h1>
                <p className="text-muted-foreground">Discover popular tourist spots across India.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map(location => {
                    const placeholder = PlaceHolderImages.find(p => p.id === location.imageId);
                    return (
                        <Link key={location.name} href={`/location/${encodeURIComponent(location.name)}`}>
                            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                                <div className="relative h-64 w-full">
                                    <Image 
                                        src={placeholder?.imageUrl || "https://picsum.photos/seed/placeholder/600/400"} 
                                        alt={location.name} 
                                        fill 
                                        className="object-cover transition-transform duration-300 group-hover:scale-105" 
                                        data-ai-hint={placeholder?.imageHint}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-4">
                                        <h3 className="text-2xl font-bold text-white">{location.name}</h3>
                                        <p className="text-sm text-white/80">{location.description}</p>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full p-2 transform transition-transform duration-300 group-hover:scale-110 opacity-0 group-hover:opacity-100">
                                        <ArrowRight className="h-5 w-5"/>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
