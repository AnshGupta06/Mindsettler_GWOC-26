import prisma from "../config/prisma.js";

export const syncUser = async (req, res) => {
  try {
    const decoded = req.user; // from requireAuth middleware

    const { name, phone } = req.body || {};

    console.log("🔥 Syncing user:", decoded.uid, decoded.email);

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
        name: name ?? null,
        phone: phone ?? null,
      },
    });

    res.json(user);
  } catch (err) {
    console.error("Sync user error:", err);
    res.status(500).json({ error: "Failed to sync user" });
  }
};
export async function getMe(req, res) {
  try {
    const { uid } = req.user;

    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
}

