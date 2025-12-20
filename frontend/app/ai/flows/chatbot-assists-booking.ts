'use server';

/**
 * @fileOverview An AI chatbot that assists users in understanding MindBloom's services and booking a session.
 *
 * - chatbotAssistsBooking - A function that handles the chatbot assistance for booking sessions.
 * - ChatbotAssistsBookingInput - The input type for the chatbotAssistsBooking function.
 * - ChatbotAssistsBookingOutput - The return type for the chatbotAssistsBooking function.
 */

import {ai} from '../../ai/genkit';
import {z} from 'genkit';

const ChatbotAssistsBookingInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
});
export type ChatbotAssistsBookingInput = z.infer<typeof ChatbotAssistsBookingInputSchema>;

const ChatbotAssistsBookingOutputSchema = z.object({
  response: z
    .string()
    .describe('A helpful and friendly response to the user message.'),
  redirectUrl: z
    .string()
    .optional()
    .describe('The URL to redirect the user to if their query matches a page function.'),
});
export type ChatbotAssistsBookingOutput = z.infer<typeof ChatbotAssistsBookingOutputSchema>;

export async function chatbotAssistsBooking(input: ChatbotAssistsBookingInput): Promise<ChatbotAssistsBookingOutput> {
  return chatbotAssistsBookingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotAssistsBookingPrompt',
  input: {schema: ChatbotAssistsBookingInputSchema},
  output: {schema: ChatbotAssistsBookingOutputSchema},
  prompt: `You are a friendly and helpful chatbot for MindBloom, a mental wellness platform. Your goal is to assist users by answering their questions and helping them navigate the site.

Based on the user's message, provide a helpful text response. If the user's intent strongly matches one of the pages below, you MUST also provide the corresponding redirectUrl.

Page Functions and Keywords:
- /booking: "book", "schedule", "appointment", "make an appointment"
- /services: "services", "sessions", "counseling", "types of therapy"
- /corporate: "corporate", "company", "workplace", "for my team"
- /contact: "contact", "email", "phone", "address"
- /about: "about you", "mission", "philosophy", "what is mindbloom"
- /faq: "faq", "questions", "how it works"

- Only provide a redirectUrl if the user's intent is very clear and matches the keywords. 
- For general conversation or greetings, do not provide a redirectUrl.
- If the user asks a question about mental health advice, gently state you are not qualified to give medical advice and suggest they book a session, providing the /booking redirectUrl.

User message: {{{message}}}
  `,
});

const chatbotAssistsBookingFlow = ai.defineFlow(
  {
    name: 'chatbotAssistsBookingFlow',
    inputSchema: ChatbotAssistsBookingInputSchema,
    outputSchema: ChatbotAssistsBookingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
