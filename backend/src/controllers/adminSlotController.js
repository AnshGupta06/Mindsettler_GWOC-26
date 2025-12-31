import prisma from "../config/prisma.js";

// Create a new slot
export async function createSlot(req, res) {
  try {
    const { date, startTime, endTime, mode } = req.body;

    if (!date || !startTime || !endTime || !mode) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const slot = await prisma.sessionSlot.create({
      data: {
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        mode,
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
    });
    
    res.json(slots);
  } catch (err) {
    console.error("❌ Get slots error:", err); 
    res.status(500).json({ error: "Failed to fetch slots" });
  }
}

export async function deleteSlot(req, res) {
  try {
    const { id } = req.params;
    await prisma.sessionSlot.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete slot error:", err);
    res.status(500).json({ error: "Failed to delete slot" });
  }
}