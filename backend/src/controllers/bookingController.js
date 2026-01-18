import prisma from "../config/prisma.js";
import { 
  sendNewBookingAdminEmail, 
  sendBookingCancelledEmail, 
  sendRefundRequestedEmail,
  sendAdminRefundAlert,
  sendSessionNotesToUser,
  sendTherapistNotesToAdmin
} from "../services/emailService.js";
import { getSettings } from "../services/globalSettingsService.js";
import "dotenv/config";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const BOOKING_COOLDOWN_MS = 2 * 60 * 1000; 
const MAX_ACTIVE_BOOKINGS = 3;            

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let therapyAvailability = {};

try {
  const jsonPath = path.join(__dirname, '../../../frontend/data/therapyApproaches.json'); 

  if (fs.existsSync(jsonPath)) {
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const approaches = JSON.parse(rawData);

    therapyAvailability = approaches.reduce((acc, item) => {
      acc[item.title] = { 
        online: item.availableOnline, 
        offline: item.availableOffline 
      };
      return acc;
    }, {});
    
    console.log(`✅ Therapy availability loaded from: ${jsonPath}`);
  } else {
    console.warn(`⚠️ Warning: therapyApproaches.json not found at ${jsonPath}. Availability filtering disabled.`);
  }
} catch (err) {
  console.error("❌ Failed to load therapyAvailability from JSON:", err);
}

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
    } else {
      whereCondition.therapyType = null;
    }

    let slots = await prisma.sessionSlot.findMany({
      where: whereCondition,
      orderBy: { startTime: "asc" },
    });

    if (therapyType && therapyAvailability[therapyType]) {
      const availability = therapyAvailability[therapyType];
      slots = slots.filter(slot => {
        if (!slot.therapyType) return true;
        
        if (slot.therapyType === therapyType) {
          if (slot.mode === "ONLINE") return availability.online;
          if (slot.mode === "OFFLINE") return availability.offline;
        }
        return true;
      });
    }

    res.json(slots);
  } catch (err) {
    console.error("❌ Fetch slots error:", err);
    res.status(500).json({ error: "Failed to fetch slots" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { 
      slotId, 
      type, 
      reason, 
      therapyType,
      transactionId,
      paymentType, 
      name,
      phone,
      attendees,
      status 
    } = req.body;

    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.isBlocked) {
      return res.status(403).json({ error: "You are restricted from making new bookings." });
    }

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
   
    const booking = await prisma.$transaction(async (tx) => {
      const slot = await tx.sessionSlot.findUnique({ where: { id: slotId } });
      if (!slot) throw new Error("Slot not found");
      if (slot.isBooked) throw new Error("Slot unavailable");

      const existingBooking = await tx.booking.findUnique({ where: { slotId } });
      
      if (existingBooking) {
        if (existingBooking.status === "REJECTED") {
          await tx.booking.delete({ where: { id: existingBooking.id } });
        } else {
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
          transactionId, 
          status: "PENDING",
          clientName: name,        
          phone: phone,            
          attendees: Number(attendees),
          maritalStatus: status    
        },
      });

      await tx.sessionSlot.update({
        where: { id: slotId },
        data: { isBooked: true },
      });

      return created;
    });

    res.json(booking);

    sendNewBookingAdminEmail(ADMIN_EMAIL, {
        userName: name || user.name, 
        userEmail: user.email,       
        phone,                       
        attendees,                   
        status,                      
        type,
        therapyType,
        reason,
        paymentType,
        transactionId
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

    const dateObj = new Date(booking.slot.startTime);
    const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const isConfirmed = booking.status === "CONFIRMED";

    await prisma.$transaction([
      prisma.sessionSlot.update({ where: { id: booking.slotId }, data: { isBooked: false } }),
      prisma.booking.delete({ where: { id } }),
    ]);

    if (isConfirmed) {
      sendRefundRequestedEmail(user.email, user.name, dateStr, timeStr)
        .catch(err => console.error("Refund email failed:", err));
      
      sendAdminRefundAlert(ADMIN_EMAIL, {
        userName: user.name,
        userEmail: user.email,
        date: dateStr,
        time: timeStr
      }).catch(err => console.error("Admin refund alert failed:", err));

    } else {
      sendBookingCancelledEmail(user.email, user.name, dateStr, timeStr)
        .catch(err => console.error("Cancel email failed:", err));
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Cancel booking error:", err);
    res.status(500).json({ error: err.message || "Failed to cancel booking" });
  }
};

export const startMeeting = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { slot: true, user: true }
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.slot.mode !== "ONLINE") {
      return res.status(400).json({ error: "Only online meetings can be started" });
    }

    const now = new Date();
    
    const meetingNotes = await prisma.meetingNotes.upsert({
      where: { bookingId },
      update: { 
        meetingStartedAt: now,
        updatedAt: now
      },
      create: {
        bookingId,
        meetingStartedAt: now,
        createdBy: req.user.uid
      }
    });

    res.json({ 
      success: true, 
      meetingNotes,
      message: "Meeting started successfully" 
    });
  } catch (err) {
    console.error("❌ Start meeting error:", err);
    res.status(500).json({ error: "Failed to start meeting" });
  }
};

export const endMeeting = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const meetingNotes = await prisma.meetingNotes.findUnique({
      where: { bookingId }
    });

    if (!meetingNotes || !meetingNotes.meetingStartedAt) {
      return res.status(400).json({ error: "Meeting not started" });
    }

    const now = new Date();
    const duration = Math.round((now - meetingNotes.meetingStartedAt) / (1000 * 60)); 

    await prisma.meetingNotes.update({
      where: { bookingId },
      data: {
        meetingEndedAt: now,
        meetingDuration: duration,
        updatedAt: now
      }
    });

    res.json({ 
      success: true, 
      duration,
      message: "Meeting ended successfully" 
    });
  } catch (err) {
    console.error("❌ End meeting error:", err);
    res.status(500).json({ error: "Failed to end meeting" });
  }
};

export const updateMeetingNotes = async (req, res) => {
  const { bookingId } = req.params;
  const { 
    sessionSummary,
    clientProgress,
    keyInsights,
    followUpPlan,
    additionalNotes,
    therapistNotes
  } = req.body;

  try {
    const meetingNotes = await prisma.meetingNotes.upsert({
      where: { bookingId },
      update: {
        sessionSummary,
        clientProgress,
        keyInsights,
        followUpPlan,
        additionalNotes,
        therapistNotes,
        updatedAt: new Date()
      },
      create: {
        bookingId,
        sessionSummary,
        clientProgress,
        keyInsights,
        followUpPlan,
        additionalNotes,
        therapistNotes,
        createdBy: req.user.uid
      }
    });

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: true, slot: true }
    });

    if (booking) {
      const publicNotes = [
        sessionSummary && `Session Summary:\n${sessionSummary}`,
        clientProgress && `Client Progress:\n${clientProgress}`,
        keyInsights && `Key Insights:\n${keyInsights}`,
        followUpPlan && `Follow-up Plan:\n${followUpPlan}`,
        additionalNotes && `Additional Notes:\n${additionalNotes}`
      ].filter(Boolean).join('\n\n');

      if (publicNotes.trim()) {
        sendSessionNotesToUser(booking.user.email, booking.user.name || "Valued Client", publicNotes)
          .catch(err => console.error("Failed to send session notes to user:", err));
      }

      if (therapistNotes && therapistNotes.trim()) {
        sendTherapistNotesToAdmin(ADMIN_EMAIL, booking.user.name || "Client", booking.user.email, therapistNotes)
          .catch(err => console.error("Failed to send therapist notes to admin:", err));
      }
    }

    res.json({ 
      success: true, 
      meetingNotes,
      message: "Meeting notes updated successfully" 
    });
  } catch (err) {
    console.error("❌ Update meeting notes error:", err);
    res.status(500).json({ error: "Failed to update meeting notes" });
  }
};

export const getMeetingNotes = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const meetingNotes = await prisma.meetingNotes.findUnique({
      where: { bookingId },
      include: {
        booking: {
          include: {
            user: true,
            slot: true
          }
        }
      }
    });

    if (!meetingNotes) {
      return res.status(404).json({ error: "Meeting notes not found" });
    }

    res.json(meetingNotes);
  } catch (err) {
    console.error("❌ Get meeting notes error:", err);
    res.status(500).json({ error: "Failed to fetch meeting notes" });
  }
};