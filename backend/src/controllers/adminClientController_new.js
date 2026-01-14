import prisma from "../config/prisma.js";
import { sendUserBlockedEmail, sendAdminReportEmail } from "../services/emailService.js";

// 1. Get All Clients (with full Booking History)
export const getAllClients = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        bookings: {
          orderBy: { slot: { startTime: "desc" } }, // Latest first
          include: { slot: true },
        },
        adminNotes: {
          orderBy: { createdAt: "desc" }, // Latest first
          include: { user: false }, // Don't include user relation
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
        adminNotes: user.adminNotes || [],
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

// 2. Update Client (Add Admin Note or Block Status)
export const updateClient = async (req, res) => {
  const { id } = req.params;
  const { adminNotes, isBlocked } = req.body;

  try {
    // First, get the current user
    const currentUser = await prisma.user.findUnique({
      where: { id },
      select: { name: true, email: true }
    });

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateData = {};
    if (isBlocked !== undefined) updateData.isBlocked = isBlocked;

    // Update user (only isBlocked for now)
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        adminNotes: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // If adminNotes provided, create a new AdminNote
    if (adminNotes && adminNotes.trim()) {
      await prisma.adminNote.create({
        data: {
          userId: id,
          note: adminNotes.trim(),
          createdBy: req.user.uid,
        },
      });

      // Refresh the updatedUser to include the new note
      const userWithNotes = await prisma.user.findUnique({
        where: { id },
        include: {
          adminNotes: {
            orderBy: { createdAt: "desc" },
          },
        },
      });

      // ✨ Send report email with the new note
      console.log(`📧 Sending new admin note as report to ${currentUser.email}...`);
      sendAdminReportEmail(currentUser.email, currentUser.name || "User", adminNotes.trim(), "Admin")
        .catch(err => console.error("❌ Failed to send notes update email:", err));

      return res.json({ success: true, user: userWithNotes });
    }

    // ✨ FIX: Trigger email if user is being blocked
    if (isBlocked === true) {
      console.log(`🔒 Blocking user ${currentUser.email}, sending email...`);
      sendUserBlockedEmail(currentUser.email, currentUser.name || "User")
        .catch(err => console.error("❌ Failed to send block email:", err));
    }

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("❌ Update Client Error:", err);
    res.status(500).json({ error: "Failed to update client" });
  }
};

// 3. Send Report to Client
export const sendClientReport = async (req, res) => {
  const { id } = req.params;
  const { reportContent, adminName } = req.body;

  if (!reportContent || reportContent.trim().length === 0) {
    return res.status(400).json({ error: "Report content is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the report email
    await sendAdminReportEmail(user.email, user.name || "User", reportContent, adminName);

    // Create a new AdminNote for the sent message
    await prisma.adminNote.create({
      data: {
        userId: id,
        note: `Message sent to client: ${reportContent.trim()}`,
        createdBy: req.user.uid,
      },
    });

    res.json({ message: "Message sent successfully to client" });
  } catch (err) {
    console.error("❌ Send Message Error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};