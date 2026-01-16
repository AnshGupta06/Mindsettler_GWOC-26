import { z } from "zod";

const SESSION_TYPES = ["FIRST", "FOLLOW_UP"];

export const createBookingSchema = z.object({
  body: z.object({
    slotId: z.string().uuid({ message: "Invalid Slot ID format" }),

    type: z.enum(SESSION_TYPES, { 
      errorMap: () => ({ message: "Type must be 'FIRST' or 'FOLLOW_UP'" }) 
    }),

    therapyType: z.string().optional(),
    reason: z.string().max(500).optional(),

    // --- NEW FIELDS (No Email) ---
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone number is required"),
    attendees: z.number().int().min(1, "At least 1 attendee is required"),
    status: z.string().optional(), // Marital Status
  }),
});