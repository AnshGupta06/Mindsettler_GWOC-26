import prisma from "../config/prisma.js";
import { sendWelcomeEmail } from "../services/emailService.js";

export const syncUser = async (req, res) => {
  try {
    const decoded = req.user; 
    const { name, phone, sendWelcome } = req.body || {};

    const existingUser = await prisma.user.findUnique({
        where: { firebaseUid: decoded.uid }
    });

    const user = await prisma.user.upsert({
      where: { firebaseUid: decoded.uid },
      update: {
        email: decoded.email,
        name: name ?? undefined,
        phone: phone ?? undefined,
        emailVerified: decoded.email_verified,
      },
      create: {
        firebaseUid: decoded.uid,
        email: decoded.email,
        name: name || decoded.name || "Friend",
        phone: phone ?? null,
        emailVerified: decoded.email_verified || false,
      },
    });

    if (sendWelcome && decoded.email_verified) {
        sendWelcomeEmail(user.email, user.name || "Friend").catch(console.error);
    }

    res.json(user);
  } catch (err) {
    console.error("Sync user error:", err);
    res.status(500).json({ error: "Failed to sync user" });
  }
};

export async function getMe(req, res) {
  try {
    const { uid } = req.user;
    const user = await prisma.user.findUnique({ where: { firebaseUid: uid } });

    if (!user) return res.status(404).json({ error: "User not found" });
    
    if (user.isBlocked) return res.status(403).json({ error: "ACCOUNT_BLOCKED" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
}
export const verifyEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const response = await fetch(
      `https://emailreputation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`
    );
    
    const data = await response.json();
    const isDisposable = data.is_disposable_email || data.email_quality?.is_disposable;
    
    if (isDisposable === true) {
       return res.status(400).json({ 
         error: "INVALID_EMAIL",
         message: "Temporary/Disposable email addresses are not allowed."
       });
    }

    const rawStatus = data.deliverability || data.email_deliverability?.status;
    const status = rawStatus ? rawStatus.toUpperCase() : "UNKNOWN";

    if (status === "UNDELIVERABLE") {
       return res.status(400).json({ 
         error: "INVALID_EMAIL",
         message: "This email address appears to be invalid or does not exist."
       });
    }

     if (data.email_risk?.address_risk_status === "high") {
        return res.status(400).json({ error: "INVALID_EMAIL", message: "This email was flagged as high risk." });
    } 
   

    res.json({ success: true, data });

  } catch (err) {
    console.error("❌ Email verification error:", err);
    res.json({ success: true }); 
  }
};