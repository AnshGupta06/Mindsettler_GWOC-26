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
    // First, get the current user to check for changes
    const currentUser = await prisma.user.findUnique({
      where: { id },
      select: { adminNotes: true, name: true, email: true }
    });

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateData = {};
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (isBlocked !== undefined) updateData.isBlocked = isBlocked;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // ✨ Send report email if adminNotes were updated
    if (adminNotes !== undefined && adminNotes !== currentUser.adminNotes) {
      console.log(`📧 Sending updated notes as report to ${updatedUser.email}...`);
      sendAdminReportEmail(updatedUser.email, updatedUser.name || "User", adminNotes, "Admin")
        .catch(err => console.error("❌ Failed to send notes update email:", err));
    }

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

    // Optionally, save the report to adminNotes or create a separate reports table
    // For now, we'll append to adminNotes
    const existingNotes = user.adminNotes || "";
    const reportEntry = `\n\n--- Report Sent on ${new Date().toLocaleString()} ---\n${reportContent}`;
    const updatedNotes = existingNotes + reportEntry;

    await prisma.user.update({
      where: { id },
      data: { adminNotes: updatedNotes }
    });

    res.json({ message: "Report sent successfully to client" });
  } catch (err) {
    console.error("❌ Send Report Error:", err);
    res.status(500).json({ error: "Failed to send report" });
  }
};