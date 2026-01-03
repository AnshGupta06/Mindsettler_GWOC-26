import express from "express";
import {requireAuth} from "../middlewares/requireAuth.js";
import { getMyBookings } from "../controllers/bookingController.js";
import {
  getSlots,
  createBooking,
  cancelBooking,
} from "../controllers/bookingController.js";
import { validate } from "../middlewares/validate.js";
import { createBookingSchema } from "../schemas/bookingSchema.js";
const router = express.Router();
    
router.post("/", requireAuth, validate(createBookingSchema), createBooking);
router.get("/my", requireAuth, getMyBookings);
router.get("/slots", getSlots);
router.delete("/:id", requireAuth, cancelBooking);

export default router;
