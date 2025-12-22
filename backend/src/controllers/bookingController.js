import prisma from "../config/prisma.js";

/**
 * Get all available (not booked) slots
 */
export const getSlots = async (req, res) => {
  try {
    const slots = await prisma.sessionSlot.findMany({
      where: {
        isBooked: false,
      },
      orderBy: { startTime: "asc" },
    });

    res.json(slots);
  } catch (err) {
    console.error("❌ Fetch slots error:", err);
    res.status(500).json({ error: "Failed to fetch slots" });
  }
};

/**
 * Create booking request (PENDING)
 */
export const createBooking = async (req, res) => {
  try {
    const { slotId, type, reason } = req.body;

    if (!req.user?.uid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // lock slot by checking + updating
      const slot = await tx.sessionSlot.findUnique({
        where: { id: slotId },
      });

      if (!slot) throw new Error("Slot not found");
      if (slot.isBooked) throw new Error("Slot already booked");

      const booking = await tx.booking.create({
        data: {
          userId: user.id,
          slotId,
          type,
          reason,
        },
      });

      await tx.sessionSlot.update({
        where: { id: slotId },
        data: { isBooked: true },
      });

      return booking;
    });

    res.json(result);
  } catch (err) {
    console.error("❌ Create booking error:", err);

    if (err.code === "P2002") {
      return res.status(400).json({ error: "Slot already booked" });
    }

    res.status(500).json({ error: err.message || "Failed to create booking" });
  }
};
export async function getMyBookings(req, res) {
  try {
    console.log("🔥 req.user:", req.user); 

    const firebaseUid = req.user.uid;

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        slot: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(bookings);
  } catch (err) {
    console.error("Get my bookings error:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
}