
'use server';

/**
 * @fileOverview Generates bus ticket price comparisons.
 *
 * - compareBuses - A function that returns bus options based on user search.
 * - CompareBusesInput - The input type for the compareBuses function.
 * - CompareBusesOutput - The return type for the compareBuses function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CompareBusesInputSchema = z.object({
  origin: z.string().describe('The origin city for the bus journey.'),
  destination: z.string().describe('The destination city for the bus journey.'),
  journeyDate: z.string().describe('The date of the journey.'),
});
export type CompareBusesInput = z.infer<typeof CompareBusesInputSchema>;

const CompareBusesOutputSchema = z.object({
  results: z.array(z.object({
      operator: z.string().describe("The name of the bus operator."),
      busType: z.string().describe("The type of bus (e.g., 'A/C Sleeper (2+1)', 'Volvo A/C Seater')."),
      departure: z.string().describe("The departure time (e.g., '20:00')."),
      arrival: z.string().describe("The arrival time (e.g., '06:00')."),
      duration: z.string().describe("The total journey duration (e.g., '10h 00m')."),
      platform: z.string().describe("The booking platform offering the price (e.g., 'RedBus', 'AbhiBus')."),
      price: z.string().describe("The ticket price, formatted with '₹' (e.g., '₹1,200')."),
      url: z.string().url().describe("The direct booking URL on the platform."),
  })).describe("A list of 5-10 bus options, with prices compared across different platforms for the same operator and route."),
});
export type CompareBusesOutput = z.infer<typeof CompareBusesOutputSchema>;

export async function compareBuses(input: CompareBusesInput): Promise<CompareBusesOutput> {
  return compareBusesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareBusesPrompt',
  input: { schema: CompareBusesInputSchema },
  output: { schema: CompareBusesOutputSchema },
  prompt: `You are a travel price comparison expert. A user is searching for bus tickets from {{{origin}}} to {{{destination}}} on {{{journeyDate}}}.

  Generate a list of 5-10 realistic bus options. For some of the most popular operators, provide price comparisons from 2-3 different platforms (e.g., RedBus, AbhiBus, Paytm, MakeMyTrip).
  
  - Ensure prices are realistic for the route and are in Indian Rupees (₹).
  - Provide a valid, but generic, booking URL for each platform.
  - Create a variety of bus types and operators.`,
});

const compareBusesFlow = ai.defineFlow(
  {
    name: 'compareBusesFlow',
    inputSchema: CompareBusesInputSchema,
    outputSchema: CompareBusesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
