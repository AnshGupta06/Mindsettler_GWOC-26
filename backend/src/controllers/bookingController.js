import prisma from "../config/prisma.js";
import { sendEmail } from "../services/emailService.js";

export const getSlots = async (req, res) => {
  try {
    const now = new Date();
    const slots = await prisma.sessionSlot.findMany({
      where: {
        isBooked: false,
        startTime:{
          gt:now,
        },
      },
      orderBy: { startTime: "asc" },
    });

    res.json(slots);
  } catch (err) {
    console.error("❌ Fetch slots error:", err);
    res.status(500).json({ error: "Failed to fetch slots" });
  }
};

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
    const adminEmail = "shsheth2006@gmail.com";
const emailContent = `
  <h3>New Booking Request!</h3>
  <p><strong>User:</strong> ${user.name || user.email}</p>
  <p><strong>Type:</strong> ${type}</p>
  <p><strong>Reason:</strong> ${reason}</p>
  <p>Login to your Admin Dashboard to accept or reject.</p>
`;

sendEmail(adminEmail, "🔔 New MindSettler Booking Request", emailContent);

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
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params; 
    const firebaseUid = req.user.uid;

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    // 1. Check booking details before deleting
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { slot: true },
    });

    if (!booking || booking.userId !== user.id) {
      return res.status(404).json({ error: "Booking not found or unauthorized" });
    }

    // 2. Transaction: Delete booking AND Free up the slot
    await prisma.$transaction([
      prisma.sessionSlot.update({
        where: { id: booking.slotId },
        data: { isBooked: false }, // 🔓 Make slot available again
      }),
      prisma.booking.delete({
        where: { id },
      }),
    ]);

    // 🔔 3. IF PAID: Notify Admin to Refund
    if (booking.status === "CONFIRMED" || booking.status === "ACCEPTED") {
      const adminEmail = "shsheth2006@gmail.com"; // Your email
      const emailSubject = "💰 REFUND REQUIRED: Booking Cancelled";
      const emailBody = `
        <h3>Booking Cancelled by User</h3>
        <p><strong>User:</strong> ${user.name} (${user.email})</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Session Date:</strong> ${new Date(booking.slot.date).toDateString()}</p>
        <p><strong>Status was:</strong> ${booking.status}</p>
        <br/>
        <p style="color: red; font-weight: bold;">ACTION: Please check if they paid via UPI and process the refund manually.</p>
      `;
      
      // Send email without waiting (fire and forget)
      sendEmail(adminEmail, emailSubject, emailBody);
    }

    res.json({ success: true, message: "Booking cancelled successfully" });
  } catch (err) {
    console.error("❌ Cancel booking error:", err);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};