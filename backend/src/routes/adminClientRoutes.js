import express from "express";
import { getAllClients, updateClient } from "../controllers/adminClientController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = express.Router();

// All routes require Admin Auth
router.use(requireAuth, requireAdmin);

router.get("/", getAllClients);
router.patch("/:id", updateClient);

export default router;