import prisma from "../config/prisma.js";
import { sendUserBlockedEmail } from "../services/emailService.js";

// 1. Get All Clients (with full Booking History)
export const getAllClients = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        bookings: {
          orderBy: { slot: { startTime: "desc" } }, // Latest first
          include: { slot: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format data for the frontend
    const clients = users.map((user) => {
      const bookings = user.bookings || [];
      const totalBookings = bookings.length;
      const lastBooking = bookings.length > 0 ? bookings[0] : null;
      
      return {
        id: user.id,
        name: user.name || "N/A",
        email: user.email,
        phone: user.phone || "N/A",
        adminNotes: user.adminNotes || "",
        isBlocked: user.isBlocked || false,
        totalBookings,
        lastSession: lastBooking ? lastBooking.slot.startTime : null,
        bookings: bookings,
      };
    });

    res.json(clients);
  } catch (err) {
    console.error("❌ Get Clients Error:", err);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
};

// 2. Update Client (Notes or Block Status)
export const updateClient = async (req, res) => {
  const { id } = req.params;
  const { adminNotes, isBlocked } = req.body;

  try {
    const updateData = {};
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (isBlocked !== undefined) updateData.isBlocked = isBlocked;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // ✨ FIX: Trigger email if user is being blocked
    if (isBlocked === true) {
      console.log(`🔒 Blocking user ${updatedUser.email}, sending email...`);
      sendUserBlockedEmail(updatedUser.email, updatedUser.name || "User")
        .catch(err => console.error("❌ Failed to send block email:", err));
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("❌ Update Client Error:", err);
    res.status(500).json({ error: "Failed to update client" });
  }
};