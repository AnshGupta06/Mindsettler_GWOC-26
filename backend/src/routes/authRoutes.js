import express from "express";
import { requireAuth, requireLogin } from "../middlewares/requireAuth.js";
import { syncUser, getMe, verifyEmail} from "../controllers/authController.js";

const router = express.Router();

router.get("/me", requireAuth, getMe);
router.post("/sync-user", requireLogin, syncUser);
router.get("/verify-email", verifyEmail);
export default router;