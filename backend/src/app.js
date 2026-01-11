import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminSlotRoutes from "./routes/adminSlotRoutes.js";
import adminBookingRoutes from "./routes/adminBookingRoutes.js";
import discountRoutes from "./routes/discountRoutes.js";
import adminClientRoutes from "./routes/adminClientRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import healthRoutes from "./routes/healthRoutes.js"; // Import health routes
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import xss from 'xss-clean';

const app = express();

app.use(helmet());

const allowedOrigins = [
  "http://localhost:3000",
  "https://mindsettler-bypb.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true
  });
  next();
});

app.use(hpp());
app.use(xss());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { 
    error: 'Too many requests from this IP, please try again in 15 minutes' 
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});
app.use('/api', limiter);

app.use(express.json());

// Routes
app.use("/api/admin/", adminBookingRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/admin/slots", adminSlotRoutes);
app.use("/api/admin/clients", adminClientRoutes);
app.use("/api/health", healthRoutes); 

app.get("/", (req, res) => {
  res.json({ message: "MindSettler backend running" });
});

export default app;