import express from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { syncUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/sync-user", (req, res, next) => {
  console.log("🔥 /sync-user route hit");
  next();
}, requireAuth, syncUser);

export default router;
