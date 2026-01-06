import prisma from "../config/prisma.js";

// Create a new slot
export async function createSlot(req, res) {
  try {
    const { date, startTime, endTime, mode, therapyType } = req.body;

    if (!date || !startTime || !endTime || !mode) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const slot = await prisma.sessionSlot.create({
      data: {
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        mode,
        therapyType: therapyType || null,
      },
    });

    res.json(slot);
  } catch (err) {
    console.error("Create slot error:", err);
    res.status(500).json({ error: "Failed to create slot" });
  }
}

export async function getAllSlots(req, res) {
  try {
    const slots = await prisma.sessionSlot.findMany({
      orderBy: { startTime: "desc" },
      include: { 
        // We include the booking status so the frontend knows if it's REJECTED/CONFIRMED
        booking: {
          select: { status: true } 
        } 
      }, 
    });
    
    res.json(slots);
  } catch (err) {
    console.error("❌ Get slots error:", err); 
    res.status(500).json({ error: "Failed to fetch slots" });
  }
}

// 👇 FIXED DELETE FUNCTION
export async function deleteSlot(req, res) {
  try {
    const { id } = req.params;

    // 1. Find the slot AND its attached booking (if any)
    const slot = await prisma.sessionSlot.findUnique({
      where: { id },
      include: { booking: true }, 
    });

    if (!slot) {
      return res.status(404).json({ error: "Slot not found" });
    }

    // 2. Logic to handle the Foreign Key Constraint
    if (slot.booking) {
      // ✅ Case A: The booking is REJECTED. 
      // It's safe to delete this "history" record so we can free up the slot.
      if (slot.booking.status === "REJECTED") {
        await prisma.booking.delete({
          where: { id: slot.booking.id }
        });
      } 
      // ❌ Case B: The booking is CONFIRMED or PENDING.
      // We block deletion to prevent accidental data loss.
      else {
        return res.status(400).json({ 
          error: `Cannot delete slot because it has a ${slot.booking.status} booking. Please cancel/reject the booking first.` 
        });
      }
    }

    // 3. Now that the booking is gone (or never existed), delete the slot
    await prisma.sessionSlot.delete({ where: { id } });
    
    res.json({ success: true });

  } catch (err) {
    console.error("Delete slot error:", err);
    res.status(500).json({ error: "Failed to delete slot" });
  }
}