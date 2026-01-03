import express from "express";
import {requireAuth} from "../middlewares/requireAuth.js";
import { getMyBookings } from "../controllers/bookingController.js";
import {
  getSlots,
  createBooking,
  cancelBooking,
} from "../controllers/bookingController.js";

const router = express.Router();
    
router.get("/my", requireAuth, getMyBookings);
router.get("/slots", getSlots);
router.post("/", requireAuth, createBooking);
router.delete("/:id", requireAuth, cancelBooking);

export default router;
