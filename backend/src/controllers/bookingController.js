import prisma from "../config/prisma.js";
import { sendEmail } from "../services/emailService.js";
import "dotenv/config";


const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

/* -------------------------------------------------------------------------- */
/*                                EMAIL TEMPLATES                              */
/* -------------------------------------------------------------------------- */

const newBookingAdminTemplate = ({ userName, userEmail, type, reason }) => `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f7;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:30px 15px;">
          <table width="100%" style="max-width:600px;background:#ffffff;border-radius:12px;">
            <tr>
              <td style="background:#3F2965;padding:24px 32px;color:#ffffff;">
                <h2 style="margin:0;">New Booking Request</h2>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:#333;">
                <p>A new booking request has been submitted.</p>
                <table width="100%" style="background:#f9f6ff;border-radius:10px;padding:16px;">
                  <tr><td><strong>User:</strong> ${userName || "N/A"}</td></tr>
                  <tr><td><strong>Email:</strong> ${userEmail}</td></tr>
                  <tr><td><strong>Session Type:</strong> ${type}</td></tr>
                  <tr><td><strong>Reason:</strong> ${reason || "—"}</td></tr>
                </table>
                <p style="margin-top:24px;">
                  Please review this booking in the admin dashboard.
                </p>
                <p style="font-size:14px;color:#555;">
                  — MindSettler System
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

const refundAlertTemplate = ({ userName, userEmail, sessionDate, status }) => `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f7;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:30px 15px;">
          <table width="100%" style="max-width:600px;background:#ffffff;border-radius:12px;">
            <tr>
              <td style="background:#92400e;padding:24px 32px;color:#ffffff;">
                <h2 style="margin:0;">Refund Action Required</h2>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:#333;">
                <p>A confirmed booking has been cancelled.</p>
                <table width="100%" style="background:#fff7ed;border-radius:10px;padding:16px;">
                  <tr><td><strong>User:</strong> ${userName}</td></tr>
                  <tr><td><strong>Email:</strong> ${userEmail}</td></tr>
                  <tr><td><strong>Session Date:</strong> ${sessionDate}</td></tr>
                  <tr><td><strong>Previous Status:</strong> ${status}</td></tr>
                </table>
                <p style="margin-top:20px;color:#b91c1c;font-weight:bold;">
                  Action required: Please verify payment and process refund manually.
                </p>
                <p style="font-size:14px;color:#555;">
                  — MindSettler System
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

/* -------------------------------------------------------------------------- */
/*                                   CONTROLLERS                               */
/* -------------------------------------------------------------------------- */

export const getSlots = async (req, res) => {
  try {
    const now = new Date();
    const slots = await prisma.sessionSlot.findMany({
      where: {
        isBooked: false,
        startTime: { gt: now },
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

    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const booking = await prisma.$transaction(async (tx) => {
      const slot = await tx.sessionSlot.findUnique({ where: { id: slotId } });
      if (!slot || slot.isBooked) throw new Error("Slot unavailable");

      const created = await tx.booking.create({
        data: { userId: user.id, slotId, type, reason },
      });

      await tx.sessionSlot.update({
        where: { id: slotId },
        data: { isBooked: true },
      });

      return created;
    });

    // respond fast
    res.json(booking);

    // notify admin (fire-and-forget)
    sendEmail(
      ADMIN_EMAIL,
      "🔔 New MindSettler Booking Request",
      newBookingAdminTemplate({
        userName: user.name,
        userEmail: user.email,
        type,
        reason,
      })
    );
  } catch (err) {
    console.error("❌ Create booking error:", err);
    res.status(500).json({ error: err.message || "Failed to create booking" });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: { slot: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(bookings);
  } catch (err) {
    console.error("❌ Get my bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
    });

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { slot: true },
    });

    if (!booking || booking.userId !== user.id) {
      return res.status(404).json({ error: "Unauthorized" });
    }

    await prisma.$transaction([
      prisma.sessionSlot.update({
        where: { id: booking.slotId },
        data: { isBooked: false },
      }),
      prisma.booking.delete({ where: { id } }),
    ]);

    if (["CONFIRMED", "ACCEPTED"].includes(booking.status)) {
      sendEmail(
        ADMIN_EMAIL,
        "💰 Refund Required: Booking Cancelled",
        refundAlertTemplate({
          userName: user.name || "User",
          userEmail: user.email,
          sessionDate: new Date(booking.slot.startTime).toLocaleString("en-IN"),
          status: booking.status,
        })
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Cancel booking error:", err);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};
