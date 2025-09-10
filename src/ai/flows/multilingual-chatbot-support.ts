// src/ai/flows/multilingual-chatbot-support.ts
'use server';

/**
 * @fileOverview A multilingual chatbot flow that translates user input and provides support in their native language.
 *
 * - multilingualChatbot - A function that handles the chatbot interaction.
 * - MultilingualChatbotInput - The input type for the multilingualChatbot function.
 * - MultilingualChatbotOutput - The return type for the multilingualChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MultilingualChatbotInputSchema = z.object({
  userMessage: z.string().describe('The user message in their native language.'),
  userLanguage: z.string().describe('The language of the user message (e.g., en, fr, es).'),
});
export type MultilingualChatbotInput = z.infer<typeof MultilingualChatbotInputSchema>;

const MultilingualChatbotOutputSchema = z.object({
  translatedResponse: z.string().describe('The chatbot response translated to the user language.'),
});
export type MultilingualChatbotOutput = z.infer<typeof MultilingualChatbotOutputSchema>;

export async function multilingualChatbot(input: MultilingualChatbotInput): Promise<MultilingualChatbotOutput> {
  return multilingualChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'multilingualChatbotPrompt',
  input: {
    schema: MultilingualChatbotInputSchema,
  },
  output: {
    schema: MultilingualChatbotOutputSchema,
  },
  prompt: `You are a multilingual travel support chatbot. A user will send you a message in their native language along with the language code.

  Respond to the user in their native language, providing helpful and informative support related to travel.

  User Message: {{{userMessage}}}
  User Language: {{{userLanguage}}}

  Translated Response:`, // The model will translate and respond in the user's language.
});

const multilingualChatbotFlow = ai.defineFlow(
  {
    name: 'multilingualChatbotFlow',
    inputSchema: MultilingualChatbotInputSchema,
    outputSchema: MultilingualChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
