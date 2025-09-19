'use server';

/**
 * @fileOverview Generates train ticket price comparisons.
 *
 * - compareTrains - A function that returns train options based on user search.
 * - CompareTrainsInput - The input type for the compareTrains function.
 * - CompareTrainsOutput - The return type for the compareTrains function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CompareTrainsInputSchema = z.object({
  origin: z.string().describe('The origin station for the train journey.'),
  destination: z.string().describe('The destination station for the train journey.'),
  journeyDate: z.string().describe('The date of the journey.'),
});
export type CompareTrainsInput = z.infer<typeof CompareTrainsInputSchema>;

const CompareTrainsOutputSchema = z.object({
  results: z.array(z.object({
      trainName: z.string().describe("The name of the train."),
      trainNumber: z.string().describe("The train number (e.g., '12951')."),
      departure: z.string().describe("The departure time (e.g., '17:00')."),
      arrival: z.string().describe("The arrival time (e.g., '08:32')."),
      duration: z.string().describe("The total journey duration (e.g., '15h 32m')."),
      platform: z.string().describe("The booking platform offering the price (e.g., 'IRCTC Official', 'RailYatri')."),
      price: z.string().describe("The ticket price for a standard class (e.g., AC 3 Tier), formatted with '₹' (e.g., '₹3,500')."),
      url: z.string().url().describe("The direct booking URL on the platform."),
  })).describe("A list of 5-10 train options, with prices compared across different platforms for the same train."),
});
export type CompareTrainsOutput = z.infer<typeof CompareTrainsOutputSchema>;

export async function compareTrains(input: CompareTrainsInput): Promise<CompareTrainsOutput> {
  return compareTrainsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareTrainsPrompt',
  input: { schema: CompareTrainsInputSchema },
  output: { schema: CompareTrainsOutputSchema },
  prompt: `You are a travel price comparison expert. A user is searching for train tickets from {{{origin}}} to {{{destination}}} on {{{journeyDate}}}.

  Generate a list of 5-10 realistic train options. For some of the most popular trains, provide price comparisons from 2-3 different platforms (e.g., IRCTC Official, MakeMyTrip, RailYatri, Confirmtkt).
  
  - Ensure prices are realistic for the route and class (AC 3 Tier or similar) and are in Indian Rupees (₹).
  - Provide a valid, but generic, booking URL for each platform.
  - Use a mix of popular Indian train names like Rajdhani, Shatabdi, Duronto, etc., where appropriate for the route.`,
});

const compareTrainsFlow = ai.defineFlow(
  {
    name: 'compareTrainsFlow',
    inputSchema: CompareTrainsInputSchema,
    outputSchema: CompareTrainsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
