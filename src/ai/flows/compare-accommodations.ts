
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
  searchTerm: z.string().describe('The city, location, or specific hotel name for the accommodation search.'),
  checkInDate: z.string().describe('The check-in date for the stay.'),
  checkOutDate: z.string().describe('The check-out date for the stay.'),
});
export type CompareAccommodationsInput = z.infer<typeof CompareAccommodationsInputSchema>;

const CompareAccommodationsOutputSchema = z.object({
  results: z.array(z.object({
      name: z.string().describe("The name of the accommodation."),
      rating: z.number().min(1).max(5).describe("The user rating out of 5."),
      imageUrl: z.string().url().describe("A realistic image URL for the accommodation from source.unsplash.com, based on the hotel type and location (e.g., https://source.unsplash.com/800x600/?luxury-hotel-mumbai)."),
      imageHint: z.string().describe("A two-word hint for generating an image, e.g., 'luxury hotel'"),
      platforms: z.array(z.object({
        platform: z.string().describe("The booking platform offering the price (e.g., 'MakeMyTrip', 'Booking.com')."),
        price: z.string().describe("The price per night, formatted with '₹' (e.g., '₹8,500')."),
        url: z.string().url().describe("The direct booking URL on the platform."),
      })).describe("A list of prices from different booking platforms.")
  })).describe("A list of 5-10 accommodation options, with prices compared across different platforms for each hotel."),
});
export type CompareAccommodationsOutput = z.infer<typeof CompareAccommodationsOutputSchema>;

export async function compareAccommodations(input: CompareAccommodationsInput): Promise<CompareAccommodationsOutput> {
  return compareAccommodationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareAccommodationsPrompt',
  input: { schema: CompareAccommodationsInputSchema },
  output: { schema: CompareAccommodationsOutputSchema },
  prompt: `You are a travel price comparison expert. A user is searching for accommodations based on the term '{{{searchTerm}}}' from {{{checkInDate}}} to {{{checkOutDate}}}.

  - If '{{{searchTerm}}}' seems to be a specific hotel name, find that hotel and generate price comparisons for it from 3-5 major platforms (e.g., Booking.com, Agoda, MakeMyTrip, Goibibo, Hotels.com).
  - If '{{{searchTerm}}}' seems to be a city or location, generate a list of 5-10 realistic and popular hotel options in that area. For each hotel, provide price comparisons from 2-4 different platforms.
  
  - Ensure prices are realistic for the location and are in Indian Rupees (₹).
  - Provide a valid, but generic, booking URL for each platform.
  - Generate a realistic image URL from source.unsplash.com for each hotel, using search terms relevant to the hotel and its location (e.g., https://source.unsplash.com/800x600/?luxury-hotel-mumbai).
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
