import prisma from "../config/prisma.js";
import { sendEmail } from "../services/emailService.js";

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        slot: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

export const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status, meetingLink } = req.body; // 👈 Accept meetingLink

  try {
    const updateData = { status };

    // Only update meetingLink if provided
    if (meetingLink) {
      updateData.meetingLink = meetingLink;
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: { user: true, slot: true },
    });

    // Send Email Notification
    if (status === "CONFIRMED") {
      let emailText = `Your session on ${new Date(booking.slot.date).toDateString()} at ${new Date(booking.slot.startTime).toLocaleTimeString()} has been confirmed.`;
      
      if (meetingLink) {
        emailText += `\n\n🔴 Join Video Session: ${meetingLink}`;
      } else if (booking.slot.mode === "OFFLINE") {
        emailText += `\n\n📍 Location: MindSettler Studio`;
      }

      try {
        await sendEmail(booking.user.email, "Session Confirmed - MindSettler", emailText);
      } catch (emailErr) {
        console.warn("Email failed to send:", emailErr);
      }
    }

    res.json(booking);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
};

export const deleteBooking = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.booking.delete({ where: { id } });
    res.json({ message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete booking" });
  }
};