import admin from "../config/firebaseAdmin.js";
import prisma from "../config/prisma.js"; 

export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token, true);
    
    
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