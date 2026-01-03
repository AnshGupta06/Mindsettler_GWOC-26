import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminSlotRoutes from "./routes/adminSlotRoutes.js"; 
import adminBookingRoutes from "./routes/adminBookingRoutes.js";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import xss from 'xss-clean';

const app = express();
// 1. Helmet: Sets various HTTP headers for security
app.use(helmet());

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Required for cookies/authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: { ...req.query }, // Create a writable copy
    writable: true,
    configurable: true,
    enumerable: true
  });
  next();
});
// 2. HPP: Prevents HTTP Parameter Pollution attacks
app.use(hpp());

// 3. XSS-Clean: Sanitizes user input to prevent Cross-Site Scripting
app.use(xss());

// 4. Rate Limiting: Prevents brute-force and DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again in 15 minutes',
  standardHeaders: true, 
  legacyHeaders: false, 
});
app.use('/api', limiter);
const allowedOrigins = [
  "http://localhost:3000", // Next.js Localhost
  // "https://mindsettler.vercel.app" <--- UNCOMMENT & ADD YOUR LIVE URL HERE LATER
];


app.use(express.json());
app.use("/api/admin/", adminBookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin/slots", adminSlotRoutes); 

app.get("/", (req, res) => {
  res.json({ message: "MindSettler backend running" });
});

export default app;