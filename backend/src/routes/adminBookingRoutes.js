import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import {
  getAllBookings,
  updateBookingStatus,
} from "../controllers/adminBookingController.js";

const router = express.Router();

router.get("/bookings", requireAuth, requireAdmin, getAllBookings);
router.patch("/bookings/:id", requireAuth, requireAdmin, updateBookingStatus);

export default router;
