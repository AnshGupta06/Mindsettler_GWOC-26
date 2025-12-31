import { config } from 'dotenv';
config();

import '@/ai/flows/chatbot-redirects-sensitive-questions.ts';
import '@/ai/flows/chatbot-assists-booking.ts';