import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import {
  createSlot,
  getAllSlots,
  deleteSlot,
} from "../controllers/adminSlotController.js";

const router = express.Router();

router.post("/", requireAuth, requireAdmin, createSlot);
router.get("/",requireAuth, requireAdmin, getAllSlots); 
router.delete("/:id", requireAuth, requireAdmin, deleteSlot);

export default router;
