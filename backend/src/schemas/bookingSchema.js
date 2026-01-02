import { z } from "zod";

// These match your Prisma Enums exactly
const SESSION_TYPES = ["FIRST", "FOLLOW_UP"];

export const createBookingSchema = z.object({
  body: z.object({
    // Ensures slotId is a real UUID (preventing SQL injection attempts in ID fields)
    slotId: z.string().uuid({ message: "Invalid Slot ID format" }),

    // "The Bouncer": Only allows "FIRST" or "FOLLOW_UP"
    // If they send anything else, Zod blocks it instantly with a 400 error.
    type: z.enum(SESSION_TYPES, { 
      errorMap: () => ({ message: "Type must be 'FIRST' or 'FOLLOW_UP'" }) 
    }),

    // Sanitize the reason field (max 500 chars)
    reason: z.string().max(500).optional(),
  }),
});