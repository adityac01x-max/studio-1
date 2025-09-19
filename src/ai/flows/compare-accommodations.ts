'use server';

/**
 * @fileOverview Generates accommodation price comparisons.
 *
 * - compareAccommodations - A function that returns accommodation options based on user search.
 * - CompareAccommodationsInput - The input type for the compareAccommodations function.
 * - CompareAccommodationsOutput - The return type for the compareAccommodations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CompareAccommodationsInputSchema = z.object({
  location: z.string().describe('The city or location for the accommodation search.'),
  checkInDate: z.string().describe('The check-in date for the stay.'),
  checkOutDate: z.string().describe('The check-out date for the stay.'),
});
export type CompareAccommodationsInput = z.infer<typeof CompareAccommodationsInputSchema>;

const CompareAccommodationsOutputSchema = z.object({
  results: z.array(z.object({
      name: z.string().describe("The name of the accommodation."),
      platform: z.string().describe("The booking platform offering the price (e.g., 'MakeMyTrip', 'Booking.com')."),
      price: z.string().describe("The price per night, formatted with '₹' (e.g., '₹8,500')."),
      rating: z.number().min(1).max(5).describe("The user rating out of 5."),
      imageUrl: z.string().url().describe("A placeholder image URL for the accommodation from picsum.photos."),
      imageHint: z.string().describe("A two-word hint for generating an image, e.g., 'luxury hotel'"),
      url: z.string().url().describe("The direct booking URL on the platform."),
  })).describe("A list of 5-10 accommodation options, with prices compared across different platforms for the same hotel."),
});
export type CompareAccommodationsOutput = z.infer<typeof CompareAccommodationsOutputSchema>;

export async function compareAccommodations(input: CompareAccommodationsInput): Promise<CompareAccommodationsOutput> {
  return compareAccommodationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareAccommodationsPrompt',
  input: { schema: CompareAccommodationsInputSchema },
  output: { schema: CompareAccommodationsOutputSchema },
  prompt: `You are a travel price comparison expert. A user is searching for accommodations in {{{location}}} from {{{checkInDate}}} to {{{checkOutDate}}}.

  Generate a list of 5-10 realistic hotel options. For some of the most popular hotels, provide price comparisons from 2-3 different platforms (e.g., MakeMyTrip, Goibibo, Booking.com, Agoda).
  
  - Ensure prices are realistic for the location and are in Indian Rupees (₹).
  - Provide a valid, but generic, booking URL for each platform.
  - Generate a placeholder image URL from picsum.photos for each unique hotel, using a consistent seed for the same hotel (e.g., https://picsum.photos/seed/hotel-name/200/150).
  - Provide a short, two-word AI hint for the image.`,
});

const compareAccommodationsFlow = ai.defineFlow(
  {
    name: 'compareAccommodationsFlow',
    inputSchema: CompareAccommodationsInputSchema,
    outputSchema: CompareAccommodationsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
