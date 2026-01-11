import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = express.Router();

// Public: Get Settings (for Booking Page pricing)
router.get("/", getSettings);

// Admin: Update Settings
router.post("/", requireAuth, requireAdmin, updateSettings);

export default router;