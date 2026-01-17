import admin from "../config/firebaseAdmin.js";
import prisma from "../config/prisma.js"; 

// 🔒 STRICT: Requires Verified Email (Use for Booking/Profile)
export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token, true);
    
    // 🛑 Block unverified emails
    if (!decoded.email_verified) {
      return res.status(403).json({ 
        error: "EMAIL_NOT_VERIFIED", 
        message: "Please verify your email address to access this feature." 
      });
    }

    // Check if user is blocked
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
      select: { isBlocked: true }
    });

    if (user?.isBlocked) {
      return res.status(403).json({ 
        error: "ACCOUNT_BLOCKED", 
        message: "Your account has been restricted. Please contact support." 
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    if (err.code === 'auth/id-token-revoked') {
      return res.status(401).json({ error: "Session revoked. Please login again." });
    }
    console.error("Auth error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};

// 🔓 LENIENT: Allows Unverified Email (Use for Syncing Data on Signup)
export const requireLogin = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token, true);
    
    // NOTE: We do NOT check !decoded.email_verified here. 
    // This allows the frontend to save the user's name/phone immediately after signup.

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Login auth error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};