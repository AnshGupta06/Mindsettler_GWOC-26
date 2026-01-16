import prisma from "../config/prisma.js";
import { 
  sendBookingRejectedEmail, 
  sendBookingConfirmedEmail 
} from "../services/emailService.js";
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
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};


export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, meetingLink } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { user: true, slot: true },
    });

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    
    if (status === "REJECTED") {
      await prisma.$transaction([
        
        prisma.booking.update({ where: { id }, data: { status } }),
        
        prisma.sessionSlot.update({ where: { id: booking.slotId }, data: { isBooked: false } }),
      ]);

      
      const dateStr = new Date(booking.slot.startTime).toLocaleDateString();
      
      sendBookingRejectedEmail(booking.user.email, booking.user.name, dateStr, "Slot unavailable or admin cancelled.")
        .catch(err => console.error("Email failed:", err));

      return res.json({ status: "REJECTED" });
    }

    
    if (status === "CONFIRMED") {
      const updated = await prisma.booking.update({
        where: { id },
        data: { status, meetingLink },
        include: { user: true, slot: true },
      });

      
      const dateObj = new Date(updated.slot.startTime);
      const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      
      
      sendBookingConfirmedEmail(
          updated.user.email, 
          updated.user.name, 
          dateStr, 
          timeStr, 
          meetingLink, 
          updated.slot.mode 
        )
        .catch(err => console.error("Email failed:", err));

      return res.json(updated);
    }

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Update failed" });
  }
};


export const deleteBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await prisma.booking.findUnique({ where: { id } });
    
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    
    
    if (booking.status !== "REJECTED") {
       await prisma.sessionSlot.update({
         where: { id: booking.slotId },
         data: { isBooked: false }
       });
    }

    await prisma.booking.delete({ where: { id } });
    
    res.json({ message: "Booking record permanently deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete booking" });
  }
};