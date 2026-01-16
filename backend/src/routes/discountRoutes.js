import express from "express";
import * as discountController from "../controllers/discountController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = express.Router();


router.get("/check", requireAuth, discountController.checkDiscount);


router.get("/status", requireAuth, requireAdmin, discountController.getStatus);
router.post("/toggle", requireAuth, requireAdmin, discountController.toggleStatus);
router.get("/rules", requireAuth, requireAdmin, discountController.getRules);
router.post("/rules", requireAuth, requireAdmin, discountController.addRule);
router.delete("/rules/:id", requireAuth, requireAdmin, discountController.removeRule);

export default router;
