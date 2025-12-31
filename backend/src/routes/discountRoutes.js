// routes/discountRoutes.js
import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getAvailableDiscounts, validateDiscount } from "../controllers/discountController.js";

const router = express.Router();

// Public route - get available discounts
router.get("/available", getAvailableDiscounts);

// Protected route - validate discount for authenticated user
router.post("/validate", requireAuth, validateDiscount);

export default router;