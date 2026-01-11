import prisma from "../config/prisma.js";
import { 
  sendNewBookingAdminEmail, 
  sendBookingCancelledEmail, 
  sendRefundRequestedEmail,
  sendAdminRefundAlert
} from "../services/emailService.js";
import { getSettings } from "../services/globalSettingsService.js";
import "dotenv/config";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// CONFIGURATION
const BOOKING_COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes
const MAX_ACTIVE_BOOKINGS = 3;

/* -------------------------------------------------------------------------- */
/* CONTROLLERS                                                                */
/* -------------------------------------------------------------------------- */

export const getSlots = async (req, res) => {
  try {
    const { therapyType } = req.query;
    const now = new Date();
    
    const whereCondition = {
      isBooked: false,
      startTime: { gt: now },
    };

    if (therapyType) {
      whereCondition.OR = [
        { therapyType: null }, 
        { therapyType }, 
      ];
    }

    const slots = await prisma.sessionSlot.findMany({
      where: whereCondition,
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
    const { slotId, type, reason, therapyType } = req.body;

    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.isBlocked) {
      return res.status(403).json({ error: "You are restricted from making new bookings." });
    }

  // 1. SPAM PREVENTION
    const activeFutureBookings = await prisma.booking.count({
      where: {
        userId: user.id,
        slot: { startTime: { gt: new Date() } },
        status: { not: "REJECTED" } 
      }
    });

    if (activeFutureBookings >= MAX_ACTIVE_BOOKINGS) {
      return res.status(400).json({ error: `You cannot have more than ${MAX_ACTIVE_BOOKINGS} active bookings.` });
    }

    const lastBooking = await prisma.booking.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (lastBooking) {
      const timeSinceLast = new Date().getTime() - new Date(lastBooking.createdAt).getTime();
      if (timeSinceLast < BOOKING_COOLDOWN_MS) {
        return res.status(429).json({ error: "Please wait a moment before booking another session." });
      }
    }
    // 2. SESSION TYPE VALIDATION
    const historyCheckQuery = {
      userId: user.id,
      status: { not: "REJECTED" },
    };
    if (therapyType) {
      historyCheckQuery.therapyType = therapyType;
    }

    const previousBookingsCount = await prisma.booking.count({ where: historyCheckQuery });

    if (previousBookingsCount === 0 && type === "FOLLOW_UP") {
      const msg = therapyType 
        ? `This is your first session for ${therapyType}. Please select 'First Session'.`
        : "Welcome! Since this is your first booking, please select 'First Session'.";
      return res.status(400).json({ error: msg });
    }

    if (previousBookingsCount > 0 && type === "FIRST") {
      const msg = therapyType
        ? `You have already started ${therapyType}. Please select 'Follow-up Session'.`
        : "It looks like you've booked with us before. Please select 'Follow-up Session'.";
      return res.status(400).json({ error: msg });
    }
   
    // 3. EXECUTE BOOKING (With Unique Constraint Fix)
    const booking = await prisma.$transaction(async (tx) => {
      const slot = await tx.sessionSlot.findUnique({ where: { id: slotId } });
      if (!slot) throw new Error("Slot not found");
      if (slot.isBooked) throw new Error("Slot unavailable");

      // ✨ CRITICAL FIX: Handle Unique Constraint on slotId
      const existingBooking = await tx.booking.findUnique({ where: { slotId } });
      
      if (existingBooking) {
        if (existingBooking.status === "REJECTED") {
          // It's safe to overwrite a rejected booking
          await tx.booking.delete({ where: { id: existingBooking.id } });
        } else {
          // This slot is occupied by a valid booking
          throw new Error("Slot is already tied to an active booking.");
        }
      }

      const created = await tx.booking.create({
        data: { 
          userId: user.id, 
          slotId, 
          type, 
          reason, 
          therapyType,
          status: "PENDING"
        },
      });

      await tx.sessionSlot.update({
        where: { id: slotId },
        data: { isBooked: true },
      });

      return created;
    });

    res.json(booking);

    // Send Admin Notification via Service
    sendNewBookingAdminEmail(ADMIN_EMAIL, {
        userName: user.name,
        userEmail: user.email,
        type,
        therapyType,
        reason,
    }).catch(err => console.error("❌ Admin email failed:", err));

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
    const user = await prisma.user.findUnique({ where: { firebaseUid: req.user.uid } });
    const booking = await prisma.booking.findUnique({ where: { id }, include: { slot: true } });

    if (!booking || booking.userId !== user.id) {
      return res.status(404).json({ error: "Booking not found or unauthorized" });
    }

    // 🔒 CANCELLATION POLICY CHECK
    const settings = await getSettings(); 
    
    const sessionTime = new Date(booking.slot.startTime);
    const now = new Date();
    const msUntilSession = sessionTime - now;
    const hoursUntilSession = msUntilSession / (1000 * 60 * 60);

    if (hoursUntilSession < settings.cancellationHours) {
        return res.status(400).json({ 
            error: `Policy Violation: Cancellations are not allowed within ${settings.cancellationHours} hours of the session. Please contact support.` 
        });
    }

    // Capture details before deletion for emails
    const dateObj = new Date(booking.slot.startTime);
    const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const isConfirmed = booking.status === "CONFIRMED";

    // Proceed with cancellation
    await prisma.$transaction([
      prisma.sessionSlot.update({ where: { id: booking.slotId }, data: { isBooked: false } }),
      prisma.booking.delete({ where: { id } }),
    ]);

    // ✨ SEND RELEVANT EMAILS
    if (isConfirmed) {
      // 1. Notify User of Refund Request
      sendRefundRequestedEmail(user.email, user.name, dateStr, timeStr)
        .catch(err => console.error("Refund email failed:", err));
      
      // 2. Alert Admin to Process Refund
      sendAdminRefundAlert(ADMIN_EMAIL, {
        userName: user.name,
        userEmail: user.email,
        date: dateStr,
        time: timeStr
      }).catch(err => console.error("Admin refund alert failed:", err));

    } else {
      // 1. Notify User of Cancellation (Pending/Rejected)
      sendBookingCancelledEmail(user.email, user.name, dateStr, timeStr)
        .catch(err => console.error("Cancel email failed:", err));
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Cancel booking error:", err);
    res.status(500).json({ error: err.message || "Failed to cancel booking" });
  }
};