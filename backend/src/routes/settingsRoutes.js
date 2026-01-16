import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = express.Router();


router.get("/", getSettings);


router.post("/", requireAuth, requireAdmin, updateSettings);

export default router;