import prisma from "../config/prisma.js";

export async function syncUser(req, res) {
  console.log("SYNC HIT", req.firebaseUser);
  const { uid, email, name } = req.firebaseUser;

  try {
    let user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseUid: uid,
          email,
          name: name || "",
        },
      });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: "User sync failed" });
  }
}
