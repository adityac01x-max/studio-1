// src/ai/flows/suggest-travel-itinerary.ts
'use server';
/**
 * @fileOverview A travel itinerary suggestion AI agent.
 *
 * - suggestTravelItinerary - A function that handles the travel itinerary suggestion process.
 * - SuggestTravelItineraryInput - The input type for the suggestTravelItinerary function.
 * - SuggestTravelItineraryOutput - The return type for the suggestTravelItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTravelItineraryInputSchema = z.object({
  location: z.string().describe('The location for which to suggest a travel itinerary.'),
  preferences: z.string().describe('The user\u2019s preferences for the travel itinerary, such as interests, budget, and travel style.'),
});
export type SuggestTravelItineraryInput = z.infer<typeof SuggestTravelItineraryInputSchema>;

const SuggestTravelItineraryOutputSchema = z.object({
  itinerary: z.string().describe('A detailed travel itinerary suggestion based on the location and preferences.'),
});
export type SuggestTravelItineraryOutput = z.infer<typeof SuggestTravelItineraryOutputSchema>;

export async function suggestTravelItinerary(input: SuggestTravelItineraryInput): Promise<SuggestTravelItineraryOutput> {
  return suggestTravelItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTravelItineraryPrompt',
  input: {schema: SuggestTravelItineraryInputSchema},
  output: {schema: SuggestTravelItineraryOutputSchema},
  prompt: `You are an expert travel agent specializing in creating personalized travel itineraries.

You will use the location and preferences provided to create a detailed travel itinerary suggestion.

Location: {{{location}}}
Preferences: {{{preferences}}}

Travel Itinerary:`,
});

const suggestTravelItineraryFlow = ai.defineFlow(
  {
    name: 'suggestTravelItineraryFlow',
    inputSchema: SuggestTravelItineraryInputSchema,
    outputSchema: SuggestTravelItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
