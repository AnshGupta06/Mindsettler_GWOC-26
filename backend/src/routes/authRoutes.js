import express from "express";
import { requireAuth, requireLogin } from "../middlewares/requireAuth.js";
import { syncUser, getMe } from "../controllers/authController.js";

const router = express.Router();

router.get("/me", requireAuth, getMe);

// ✅ Use requireLogin here so unverified users can save their name/phone
router.post("/sync-user", requireLogin, syncUser);

export default router;