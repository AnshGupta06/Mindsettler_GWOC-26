import prisma from "../config/prisma.js";

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        slot: true,
      },
    });

    res.json(bookings);
  } catch (err) {
    console.error("❌ Admin fetch bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // CONFIRMED | REJECTED

    if (!["CONFIRMED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // 🔥 If rejecting → free slot
    if (status === "REJECTED") {
      await prisma.$transaction([
        prisma.booking.update({
          where: { id },
          data: { status },
        }),
        prisma.sessionSlot.update({
          where: { id: booking.slotId },
          data: { isBooked: false },
        }),
      ]);
    } else {
      await prisma.booking.update({
        where: { id },
        data: { status },
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Update booking:", err);
    res.status(500).json({ error: "Failed to update booking" });
  }
};
