
'use server';

/**
 * @fileOverview A flow to convert geographic coordinates into a human-readable address (reverse geocoding).
 *
 * - reverseGeocode - A function that returns a place name for a given latitude and longitude.
 * - ReverseGeocodeInput - The input type for the reverseGeocode function.
 * - ReverseGeocodeOutput - The return type for the reverseGeocode function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ReverseGeocodeInputSchema = z.object({
  latitude: z.number().describe('The latitude of the location.'),
  longitude: z.number().describe('The longitude of the location.'),
});
export type ReverseGeocodeInput = z.infer<typeof ReverseGeocodeInputSchema>;

const ReverseGeocodeOutputSchema = z.object({
  placeName: z.string().describe('The human-readable place name, like a city, neighborhood, or landmark.'),
});
export type ReverseGeocodeOutput = z.infer<typeof ReverseGeocodeOutputSchema>;

export async function reverseGeocode(input: ReverseGeocodeInput): Promise<ReverseGeocodeOutput> {
  return reverseGeocodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reverseGeocodePrompt',
  input: { schema: ReverseGeocodeInputSchema },
  output: { schema: ReverseGeocodeOutputSchema },
  prompt: `You are a reverse geocoding service. Based on the provided latitude and longitude, provide a concise, human-readable place name for the location. This could be a well-known landmark, neighborhood, or city.

  Latitude: {{{latitude}}}
  Longitude: {{{longitude}}}
  
  Return the most likely place name. For example, for latitude 28.6329 and longitude 77.2193, a good answer would be "Connaught Place, New Delhi". For latitude 19.0760 and longitude 72.8777, a good answer would be "Mumbai, Maharashtra".`,
});

const reverseGeocodeFlow = ai.defineFlow(
  {
    name: 'reverseGeocodeFlow',
    inputSchema: ReverseGeocodeInputSchema,
    outputSchema: ReverseGeocodeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
