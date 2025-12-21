import prisma from "../config/prisma.js";

export async function syncUser(req, res) {
  const { uid, email, name: tokenName } = req.firebaseUser;
  const { name, phone } = req.body;

  try {
    let user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseUid: uid,
          email,
          name: name || tokenName || "",
          phone: phone || null,
        },
      });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "User sync failed" });
  }
}
