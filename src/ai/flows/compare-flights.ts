
'use server';

/**
 * @fileOverview Generates flight ticket price comparisons.
 *
 * - compareFlights - A function that returns flight options based on user search.
 * - CompareFlightsInput - The input type for the compareFlights function.
 * - CompareFlightsOutput - The return type for the compareFlights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CompareFlightsInputSchema = z.object({
  origin: z.string().describe('The origin city or airport code for the flight search.'),
  destination: z.string().describe('The destination city or airport code for the flight search.'),
  departureDate: z.string().describe('The departure date for the flight.'),
});
export type CompareFlightsInput = z.infer<typeof CompareFlightsInputSchema>;

const CompareFlightsOutputSchema = z.object({
  results: z.array(z.object({
      airline: z.string().describe("The name of the airline."),
      flightNumber: z.string().describe("The flight number (e.g., '6E 204')."),
      departure: z.string().describe("The departure time (e.g., '08:30')."),
      arrival: z.string().describe("The arrival time (e.g., '10:45')."),
      duration: z.string().describe("The total flight duration (e.g., '2h 15m')."),
      platform: z.string().describe("The booking platform offering the price (e.g., 'MakeMyTrip', 'Goibibo')."),
      price: z.string().describe("The ticket price, formatted with '₹' (e.g., '₹5,500')."),
      url: z.string().url().describe("The direct booking URL on the platform."),
  })).describe("A list of 5-10 flight options, with prices compared across different platforms for the same flight."),
});
export type CompareFlightsOutput = z.infer<typeof CompareFlightsOutputSchema>;

export async function compareFlights(input: CompareFlightsInput): Promise<CompareFlightsOutput> {
  return compareFlightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareFlightsPrompt',
  input: { schema: CompareFlightsInputSchema },
  output: { schema: CompareFlightsOutputSchema },
  prompt: `You are a travel price comparison expert. A user is searching for flights from {{{origin}}} to {{{destination}}} on {{{departureDate}}}.

  Generate a list of 5-10 realistic flight options. For some of the most popular flights, provide price comparisons from 2-3 different platforms (e.g., MakeMyTrip, Goibibo, EaseMyTrip, Skyscanner, or the airline's official site).
  
  - Ensure prices are realistic for the route and are in Indian Rupees (₹).
  - Provide a valid, but generic, booking URL for each platform.
  - Use a mix of major Indian airlines like IndiGo, Vistara, Air India, etc.`,
});

const compareFlightsFlow = ai.defineFlow(
  {
    name: 'compareFlightsFlow',
    inputSchema: CompareFlightsInputSchema,
    outputSchema: CompareFlightsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
