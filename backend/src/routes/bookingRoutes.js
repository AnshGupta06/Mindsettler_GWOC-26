import express from "express";
import {requireAuth} from "../middlewares/requireAuth.js";
import {requireAdmin} from "../middlewares/requireAdmin.js";
import { getMyBookings } from "../controllers/bookingController.js";
import {
  getSlots,
  createBooking,
  cancelBooking,
  startMeeting,
  endMeeting,
  updateMeetingNotes,
  getMeetingNotes,
} from "../controllers/bookingController.js";
import { validate } from "../middlewares/validate.js";
import { createBookingSchema } from "../schemas/bookingSchema.js";
const router = express.Router();
    
router.post("/", requireAuth, validate(createBookingSchema), createBooking);
router.get("/my", requireAuth, getMyBookings);
router.get("/slots", getSlots);
router.delete("/:id", requireAuth, cancelBooking);


router.post("/:bookingId/start-meeting", requireAuth, requireAdmin, startMeeting);
router.post("/:bookingId/end-meeting", requireAuth, requireAdmin, endMeeting);
router.get("/:bookingId/meeting-notes", requireAuth, requireAdmin, getMeetingNotes);
router.put("/:bookingId/meeting-notes", requireAuth, requireAdmin, updateMeetingNotes);

export default router;
