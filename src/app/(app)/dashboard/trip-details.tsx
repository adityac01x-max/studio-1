

import type { Trip } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Star, Building, Plane, Train, Car, Bus, User, Calendar, IndianRupee, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

type TripDetailsProps = {
  trip: Trip;
};

const modeIcons = {
  flight: <Plane className="h-4 w-4" />,
  train: <Train className="h-4 w-4" />,
  car: <Car className="h-4 w-4" />,
  bus: <Bus className="h-4 w-4" />,
};

export function TripDetails({ trip }: TripDetailsProps) {
    if (trip.status !== 'Completed') {
        return <p className="text-muted-foreground p-4">Detailed information is only available for completed trips. You can edit this trip to add more details once it's complete.</p>;
    }

  return (
    <div className="space-y-6 p-2 max-h-[70vh] overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle>Trip Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
                <User className="text-muted-foreground"/>
                <div>
                    <p className="font-semibold">Travelers</p>
                    <p>{trip.travelers.join(', ')}</p>
                </div>
            </div>
             <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground"/>
                <div>
                    <p className="font-semibold">Date</p>
                    <p>{format(trip.startTime, 'MMM d, yyyy')}</p>
                </div>
            </div>
             <div className="flex items-center gap-2">
                {modeIcons[trip.mode]}
                <div>
                    <p className="font-semibold">Mode</p>
                    <p className='capitalize'>{trip.mode}</p>
                </div>
            </div>
             {trip.accommodation && (
                <div className="flex items-center gap-2">
                    <Building className="text-muted-foreground"/>
                    <div>
                        <p className="font-semibold">Accommodation</p>
                        <p>{trip.accommodation?.name} ({trip.accommodation?.type})</p>
                    </div>
                </div>
             )}
        </CardContent>
      </Card>

    {trip.dailyDetails && trip.dailyDetails.length > 0 && (
        <Card>
            <CardHeader>
                <CardTitle>Daily Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {trip.dailyDetails.map((day, index) =>(
                     <div key={index}>
                        <h4 className="font-semibold mb-2">{format(day.date, 'eeee, MMM d')}</h4>
                        <div className="grid gap-2 text-sm ml-4">
                            {day.accommodation && <p><span className='font-medium'>Stayed at:</span> {day.accommodation}</p>}
                            {day.placesVisited && <p><span className='font-medium'>Visited:</span> {day.placesVisited}</p>}
                            {day.food && <p><span className='font-medium'>Food Eaten:</span> {day.food}</p>}
                             <div className='flex gap-4'>
                                {day.foodCost && <p className="flex items-center gap-1"><span className='font-medium'>Food Cost:</span> ₹{day.foodCost}</p>}
                                {day.localTravelCost && <p className="flex items-center gap-1"><span className='font-medium'>Local Travel Cost:</span> ₹{day.localTravelCost}</p>}
                            </div>
                            {day.notes && <p><span className='font-medium'>Notes:</span> <span className="italic text-muted-foreground">"{day.notes}"</span></p>}
                            {day.cost && <p className="flex items-center gap-1"><span className='font-medium'>Total Day Cost:</span> ₹{day.cost}</p>}
                            {day.media && day.media.length > 0 && (
                                <div>
                                    <p className='font-medium flex items-center gap-2'><ImageIcon className="w-4 h-4" /> Photos & Videos</p>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
                                        {/* Mock display for uploaded media */}
                                        {Array.from({length: day.media.length}).map((_, mediaIndex) => (
                                             <div key={mediaIndex} className="relative aspect-square rounded-md overflow-hidden bg-muted">
                                                <Image 
                                                    src={`https://picsum.photos/seed/${trip.id}-${index}-${mediaIndex}/200`} 
                                                    alt={`Media ${mediaIndex + 1}`} 
                                                    fill 
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        {index < trip.dailyDetails!.length - 1 && <Separator className="my-4" />}
                     </div>
                ))}
            </CardContent>
        </Card>
    )}


      {trip.visitedPlaces && trip.visitedPlaces.length > 0 && (
        <Card>
            <CardHeader>
            <CardTitle>Places Visited & Reviews</CardTitle>
            <CardDescription>Feedback provided by the travelers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            {trip.visitedPlaces?.map((place, index) => (
                <div key={index}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold">{place.name}</p>
                        <p className="text-sm text-muted-foreground italic">"{place.review}"</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="font-bold">{place.rating}</span>
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </div>
                </div>
                {index < trip.visitedPlaces!.length - 1 && <Separator className="my-4" />}
                </div>
            ))}
            </CardContent>
        </Card>
      )}


      {trip.tripExperience && (
        <Card>
            <CardHeader>
                <CardTitle>Overall Trip Experience</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground italic">
                    "{trip.tripExperience}"
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
