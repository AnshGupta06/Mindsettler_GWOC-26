import prisma from "../config/prisma.js";
import { sendEmail } from "../services/emailService.js";
import "dotenv/config";

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
    const { status, meetingLink } = req.body;

    // Guard: only allowed statuses
    if (!["CONFIRMED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Fetch booking to get slotId
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { user: true, slot: true },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // ------------------ REJECT FLOW ------------------
    if (status === "REJECTED") {
      // 1. Update Booking Status
      // 2. Free up the slot (isBooked = false)
      const [updatedBooking] = await prisma.$transaction([
        prisma.booking.update({
          where: { id },
          data: { status },
        }),
        prisma.sessionSlot.update({
          where: { id: booking.slotId },
          data: { isBooked: false },
        }),
      ]);
      
      return res.json(updatedBooking);
    }

    // ------------------ CONFIRM FLOW ------------------
    if (status === "CONFIRMED") {
      const updateData = { status };
      if (meetingLink) updateData.meetingLink = meetingLink;

      const updatedBooking = await prisma.booking.update({
        where: { id },
        data: updateData,
        include: { user: true, slot: true },
      });

      // Send Confirmation Email
      const userEmail = updatedBooking.user.email;
      if (userEmail) {
        const userName = updatedBooking.user.name || "there";
        const date = new Date(updatedBooking.slot.startTime).toLocaleString("en-IN", {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
          hour: "2-digit", minute: "2-digit",
        });

        let emailContent = `
          <h2>✅ Your Session is Confirmed</h2>
          <p>Hi <strong>${userName}</strong>,</p>
          <p>Your session with MindSettler is confirmed.</p>
          <p><strong>📅 Date:</strong> ${date}</p>
          <p><strong>📍 Mode:</strong> ${updatedBooking.slot.mode}</p>
        `;

        if (meetingLink) {
          emailContent += `<p><strong>🔗 Join Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>`;
        }

        await sendEmail(userEmail, "✅ Booking Confirmed - MindSettler", emailContent);
      }

      return res.json(updatedBooking);
    }

  } catch (err) {
    console.error("❌ Update booking:", err);
    res.status(500).json({ error: "Failed to update booking" });
  }
};

export const deleteBooking = async (req, res) => {
  const { id } = req.params;
  try {
    // When deleting, we should also free the slot if it wasn't already rejected
    const booking = await prisma.booking.findUnique({ where: { id } });
    
    if (booking && booking.status !== "REJECTED") {
       await prisma.sessionSlot.update({
         where: { id: booking.slotId },
         data: { isBooked: false }
       });
    }

    await prisma.booking.delete({ where: { id } });
    res.json({ message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete booking" });
  }
};