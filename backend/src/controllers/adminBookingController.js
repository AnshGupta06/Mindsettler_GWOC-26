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
    const { status } = req.body;

    // Guard: only allowed statuses
    if (!["CONFIRMED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Fetch booking with relations
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        slot: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // ------------------ REJECT FLOW ------------------
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
    }

    // ------------------ CONFIRM FLOW ------------------
    if (status === "CONFIRMED") {
      await prisma.booking.update({
        where: { id },
        data: { status },
      });

      const userEmail = booking.user.email;

      // 🚨 CRITICAL FIX: email existence check
      if (!userEmail) {
        console.error("❌ Cannot send confirmation email — user email missing", {
          bookingId: booking.id,
          userId: booking.user.id,
        });
      } else {
        const userName = booking.user.name || "there";

        const date = new Date(booking.slot.startTime).toLocaleString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        const emailContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Booking Confirmed</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f7; font-family: Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 30px 15px;">
          <table width="100%" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden;">
            <tr>
              <td style="background:#3F2965; padding:24px 32px;">
                <h1 style="margin:0; font-size:22px; color:#ffffff;">MindSettler</h1>
              </td>
            </tr>

            <tr>
              <td style="padding:32px; color:#333;">
                <h2 style="margin-top:0; color:#3F2965;">✅ Your Session is Confirmed</h2>

                <p>Hi <strong>${userName}</strong>,</p>

                <p>
                  We’re happy to let you know that your session with
                  <strong>MindSettler</strong> has been successfully confirmed.
                </p>

                <table width="100%" style="background:#f9f6ff; border:1px solid #e5dcff; border-radius:10px; margin:24px 0;">
                  <tr>
                    <td style="padding:20px;">
                      <p><strong>📅 Date & Time:</strong> ${date}</p>
                      <p><strong>📍 Mode:</strong> ${booking.slot.mode}</p>
                      <p>
                        <strong>📝 Session Type:</strong>
                        ${booking.type === "FIRST" ? "First Session" : "Follow-up Session"}
                      </p>
                    </td>
                  </tr>
                </table>

                <p>
                  Please make sure to join on time.
                  If this is an online session, the meeting link will be shared with you shortly.
                </p>

                <p style="margin-top:32px; font-size:14px; color:#555;">
                  Warm regards,<br />
                  <strong>Team MindSettler</strong>
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#fafafa; padding:18px 32px; text-align:center;">
                <p style="margin:0; font-size:12px; color:#888;">
                  © ${new Date().getFullYear()} MindSettler. All rights reserved.
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

        console.log("📧 Sending confirmation email to:", userEmail);

        sendEmail(
          userEmail,
          "✅ Your MindSettler Session is Confirmed",
          emailContent
        );
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Update booking:", err);
    res.status(500).json({ error: "Failed to update booking" });
  }
};
