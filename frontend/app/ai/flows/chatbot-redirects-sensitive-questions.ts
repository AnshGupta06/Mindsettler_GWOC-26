'use server';

/**
 * @fileOverview An AI chatbot flow that redirects sensitive mental health questions to booking or contact pages.
 *
 * - chatbotRedirectsSensitiveQuestions - A function that processes user queries and redirects sensitive questions.
 * - ChatbotRedirectsSensitiveQuestionsInput - The input type for the chatbotRedirectsSensitiveQuestions function.
 * - ChatbotRedirectsSensitiveQuestionsOutput - The return type for the chatbotRedirectsSensitiveQuestions function.
 */

import {ai} from '../../ai/genkit';
import {z} from 'genkit';

const ChatbotRedirectsSensitiveQuestionsInputSchema = z.object({
  query: z.string().describe('The user query to be processed by the chatbot.'),
});
export type ChatbotRedirectsSensitiveQuestionsInput = z.infer<typeof ChatbotRedirectsSensitiveQuestionsInputSchema>;

const ChatbotRedirectsSensitiveQuestionsOutputSchema = z.object({
  response: z.string().describe('The chatbot response, redirecting to booking or contact pages if the query is sensitive.'),
});
export type ChatbotRedirectsSensitiveQuestionsOutput = z.infer<typeof ChatbotRedirectsSensitiveQuestionsOutputSchema>;

export async function chatbotRedirectsSensitiveQuestions(input: ChatbotRedirectsSensitiveQuestionsInput): Promise<ChatbotRedirectsSensitiveQuestionsOutput> {
  return chatbotRedirectsSensitiveQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotRedirectsSensitiveQuestionsPrompt',
  input: {schema: ChatbotRedirectsSensitiveQuestionsInputSchema},
  output: {schema: ChatbotRedirectsSensitiveQuestionsOutputSchema},
  prompt: `You are a helpful chatbot for MindSettler, a mental health platform. If the user asks a question about mental health or psycho-diagnosis, gently redirect them to the booking or contact pages. Otherwise, respond normally.\n\nUser Query: {{{query}}}`,
});

const chatbotRedirectsSensitiveQuestionsFlow = ai.defineFlow(
  {
    name: 'chatbotRedirectsSensitiveQuestionsFlow',
    inputSchema: ChatbotRedirectsSensitiveQuestionsInputSchema,
    outputSchema: ChatbotRedirectsSensitiveQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
