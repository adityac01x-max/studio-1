
'use client';

import { useState } from 'react';
import { Wand2, Loader2, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { suggestTravelItinerary, SuggestTravelItineraryInput } from '@/ai/flows/suggest-travel-itinerary';

export default function ItineraryPlannerPage() {
  const [location, setLocation] = useState('');
  const [preferences, setPreferences] = useState('');
  const [itinerary, setItinerary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
        setError('Please enter a location.');
        return;
    }
    setError('');
    setIsLoading(true);
    setItinerary('');

    try {
        const input: SuggestTravelItineraryInput = {
            location,
            preferences: preferences || 'No specific preferences',
        };
        const result = await suggestTravelItinerary(input);
        setItinerary(result.itinerary);
    } catch (err) {
        console.error(err);
        setError('Failed to generate itinerary. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Wand2 />
            Create Your Perfect Itinerary
          </CardTitle>
          <CardDescription>Let our AI craft a personalized travel plan for you.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Goa, India"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferences">Preferences</Label>
              <Textarea
                id="preferences"
                placeholder="e.g., interested in beaches, historical sites, and local cuisine. Budget of ₹20,000."
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
              />
            </div>
             {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Itinerary
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <MapPin />
            Your Suggested Itinerary
          </CardTitle>
          <CardDescription>
            {location ? `A plan for your trip to ${location}` : "Your plan will appear here."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4 pt-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Crafting your adventure...</p>
            </div>
          ) : itinerary ? (
            <div className="prose dark:prose-invert prose-sm sm:prose-base whitespace-pre-wrap">
                {itinerary}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center space-y-4 pt-10 text-center">
                <Sparkles className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">Your personalized itinerary is just a click away.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
