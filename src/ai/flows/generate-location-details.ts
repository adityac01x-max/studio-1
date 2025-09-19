
'use server';

/**
 * @fileOverview Generates detailed information for a travel location.
 *
 * - generateLocationDetails - A function that generates details for a given location.
 * - GenerateLocationDetailsInput - The input type for the generateLocationDetails function.
 * - GenerateLocationDetailsOutput - The return type for the generateLocationDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLocationDetailsInputSchema = z.object({
  location: z.string().describe('The name of the location to get details for (e.g., "Goa, India").'),
});
export type GenerateLocationDetailsInput = z.infer<typeof GenerateLocationDetailsInputSchema>;

const GenerateLocationDetailsOutputSchema = z.object({
    name: z.string().describe("The full name of the location."),
    description: z.string().describe("A brief, engaging description of the location."),
    heroImageHint: z.string().describe("A two-word hint for generating a hero image, e.g., 'cityscape mumbai'"),
    accommodations: z.array(z.object({
        name: z.string().describe("Name of the accommodation."),
        price: z.string().describe("Starting price per night, formatted with '₹' (e.g., '₹25,000')."),
        platform: z.string().describe("The platform where it can be booked (e.g., 'Booking.com')."),
        rating: z.number().min(1).max(5).describe("The user rating out of 5."),
    })).describe("A list of 3 diverse accommodation options."),
    weather: z.array(z.object({
        day: z.string().describe("The day of the forecast (e.g., 'Today', 'Tomorrow')."),
        temp: z.string().describe("The temperature, including units (e.g., '31°C')."),
        condition: z.string().describe("A brief weather condition (e.g., 'Sunny', 'Light Rain')."),
        icon: z.enum(['Sun', 'Cloud', 'CloudRain']).describe("An icon representing the weather condition."),
    })).describe("A 3-day weather forecast."),
    news: z.array(z.object({
        title: z.string().describe("A recent, relevant news headline for the location."),
        source: z.string().describe("The source of the news article (e.g., 'The Times of India')."),
        url: z.string().url().describe("The URL to the full news article."),
    })).describe("A list of 3 recent news articles."),
    touristPlaces: z.array(z.object({
        name: z.string().describe("The name of the tourist place or landmark."),
        imageHint: z.string().describe("A two-word hint for generating an image for this place, e.g., 'historic monument'"),
        description: z.string().describe("A short, compelling description of the place."),
    })).describe("A list of 5 popular tourist places or landmarks in the location."),
});
export type GenerateLocationDetailsOutput = z.infer<typeof GenerateLocationDetailsOutputSchema>;

export async function generateLocationDetails(input: GenerateLocationDetailsInput): Promise<GenerateLocationDetailsOutput> {
  return generateLocationDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLocationDetailsPrompt',
  input: {schema: GenerateLocationDetailsInputSchema},
  output: {schema: GenerateLocationDetailsOutputSchema},
  prompt: `You are a travel expert specializing in destinations within India. Generate detailed travel information for the following location: {{{location}}}.

  Provide a diverse and realistic set of data. All prices must be in Indian Rupees (₹).
  For news URLs, provide realistic but fake URLs from major Indian news sources.
  For accommodation platforms, use a variety of popular booking sites.
  For weather icons, choose from 'Sun', 'Cloud', 'CloudRain'.`,
});

const generateLocationDetailsFlow = ai.defineFlow(
  {
    name: 'generateLocationDetailsFlow',
    inputSchema: GenerateLocationDetailsInputSchema,
    outputSchema: GenerateLocationDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
