import { z } from "zod";

const SESSION_TYPES = ["FIRST", "FOLLOW_UP"];

export const createBookingSchema = z.object({
  body: z.object({
    slotId: z.string().uuid({ message: "Invalid Slot ID format" }),

    type: z.enum(SESSION_TYPES, { 
      errorMap: () => ({ message: "Type must be 'FIRST' or 'FOLLOW_UP'" }) 
    }),

    // Add this to allow therapyType to reach the controller
    therapyType: z.string().optional(),

    reason: z.string().max(500).optional(),
  }),
});