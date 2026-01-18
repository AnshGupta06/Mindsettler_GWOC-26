import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminSlotRoutes from "./routes/adminSlotRoutes.js";
import adminBookingRoutes from "./routes/adminBookingRoutes.js";
import discountRoutes from "./routes/discountRoutes.js";
import adminClientRoutes from "./routes/adminClientRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import healthRoutes from "./routes/healthRoutes.js"; 
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
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true, 
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "TOO_MANY_REQUESTS",
      message: "Too many requests from this IP. Please wait 15 minutes before trying again."
    });
  }
});
app.use('/api', limiter);

app.use(express.json());

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

app.use((req, res, next) => {
  res.status(404).json({
    error: "NOT_FOUND",
    message: `API Endpoint '${req.originalUrl}' not found.`
  });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      error: "CORS_ERROR",
      message: "Access denied by CORS policy."
    });
  }

  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      error: "BAD_REQUEST",
      message: "Invalid JSON payload."
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: statusCode === 500 ? "SERVER_ERROR" : "REQUEST_FAILED",
    message: message
  });
});

export default app;