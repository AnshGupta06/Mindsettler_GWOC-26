import prisma from "../config/prisma.js";
import { sendWelcomeEmail } from "../services/emailService.js";

export const syncUser = async (req, res) => {
  try {
    const decoded = req.user; 
    const { name, phone, sendWelcome } = req.body || {}; // ✅ Added sendWelcome flag

    // Check for existing user before upsert
    const existingUser = await prisma.user.findUnique({
        where: { firebaseUid: decoded.uid }
    });

    const user = await prisma.user.upsert({
      where: { firebaseUid: decoded.uid },
      update: {
        email: decoded.email,
        name: name ?? undefined,
        phone: phone ?? undefined,
      },
      create: {
        firebaseUid: decoded.uid,
        email: decoded.email,
        name: name || decoded.name || "Friend",
        phone: phone ?? null,
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