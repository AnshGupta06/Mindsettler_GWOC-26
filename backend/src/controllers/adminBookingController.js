import prisma from "../config/prisma.js";
import { sendEmail } from "../services/emailService.js";

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

    // 1. Fetch booking with User and Slot details (needed for email)
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

    // 2. Handle Rejection (Free up the slot)
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
    // 3. Handle Confirmation
    else {
      await prisma.booking.update({
        where: { id },
        data: { status },
      });

      // 📧 SEND EMAIL NOTIFICATION (Only if Confirmed)
      if (status === "CONFIRMED") {
         const userEmail = booking.user.email;
         const userName = booking.user.name || "there";
         
         // Format date nicely (e.g., "Monday, January 12, 2025 at 10:00 AM")
         const date = new Date(booking.slot.startTime).toLocaleString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
         });
         
         const emailContent = `
           <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
             <h2 style="color: #3F2965;">✅ Booking Confirmed!</h2>
             <p>Hi ${userName},</p>
             <p>Your session with <strong>MindSettler</strong> has been successfully confirmed.</p>
             
             <div style="background: #f9f6ff; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #e0d4fc;">
               <p style="margin: 5px 0;"><strong>📅 Date & Time:</strong> ${date}</p>
               <p style="margin: 5px 0;"><strong>📍 Mode:</strong> ${booking.slot.mode}</p>
               <p style="margin: 5px 0;"><strong>📝 Session Type:</strong> ${booking.type === 'FIRST' ? 'First Session' : 'Follow-up'}</p>
             </div>

             <p>Please ensure you are on time. If this is an online session, a meeting link will be shared with you shortly.</p>
             <br/>
             <p style="color: #666; font-size: 14px;">Warm regards,<br/><strong>Team MindSettler</strong></p>
           </div>
         `;
       
         // Send email asynchronously (no await, so it doesn't block the response)
         sendEmail(userEmail, "✅ Your MindSettler Session is Confirmed", emailContent);
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Update booking:", err);
    res.status(500).json({ error: "Failed to update booking" });
  }
};