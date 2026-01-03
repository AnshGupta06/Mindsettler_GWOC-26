import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminSlotRoutes from "./routes/adminSlotRoutes.js"; 
import adminBookingRoutes from "./routes/adminBookingRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/admin/", adminBookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin/slots", adminSlotRoutes); 

app.get("/", (req, res) => {
  res.json({ message: "MindSettler backend running" });
});

export default app;