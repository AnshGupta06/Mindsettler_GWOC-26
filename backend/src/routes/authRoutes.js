import express from "express";
import {requireAuth} from "../middlewares/requireAuth.js";
import { syncUser } from "../controllers/authController.js";
import { getMe } from "../controllers/authController.js";
const router = express.Router();
router.get("/me", requireAuth, getMe);
router.post("/sync-user", (req, res, next) => {
  next();
}, requireAuth, syncUser);

export default router;
