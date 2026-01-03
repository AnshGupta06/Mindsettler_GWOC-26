import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const today = new Date();

  function slotTime(baseDate: Date, hour: number) {
    const d = new Date(baseDate);
    d.setHours(hour, 0, 0, 0);
    return d;
  }

  // Create test users
  console.log("📝 Creating test users...");
  const testUsers = [
    {
      firebaseUid: "test-user-1",
      email: "john@example.com",
      name: "John Doe",
      phone: "+1234567890",
    },
    {
      firebaseUid: "test-user-2",
      email: "jane@example.com",
      name: "Jane Smith",
      phone: "+9876543210",
    },
    {
      firebaseUid: "test-user-3",
      email: "alice@example.com",
      name: "Alice Johnson",
      phone: "+5555555555",
    },
  ];

  const users = await Promise.all(
    testUsers.map((userData) =>
      prisma.user.upsert({
        where: { firebaseUid: userData.firebaseUid },
        update: {},
        create: userData,
      })
    )
  );
  console.log(`✅ Created ${users.length} test users`);

  // Create therapy slots
  console.log("📅 Creating therapy slots...");
  const slots: Prisma.SessionSlotCreateManyInput[] = [];

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    slots.push(
      {
        date,
        startTime: slotTime(date, 10),
        endTime: slotTime(date, 11),
        mode: "ONLINE",
        therapyType: "Cognitive Behavioural Therapy (CBT)",
        isBooked: false,
      },
      {
        date,
        startTime: slotTime(date, 12),
        endTime: slotTime(date, 13),
        mode: "ONLINE",
        therapyType: "Dialectical Behavioural Therapy (DBT)",
        isBooked: false,
      },
      {
        date,
        startTime: slotTime(date, 16),
        endTime: slotTime(date, 17),
        mode: "OFFLINE",
        therapyType: "Acceptance & Commitment Therapy (ACT)",
        isBooked: false,
      }
    );
  }

  await prisma.sessionSlot.createMany({
    data: slots,
    skipDuplicates: true,
  });
  console.log(`✅ Created ${slots.length} therapy slots`);

  // Update existing slots with wrong names
  await prisma.sessionSlot.updateMany({
    where: { therapyType: "Cognitive Behavioral Therapy" },
    data: { therapyType: "Cognitive Behavioural Therapy (CBT)" },
  });
  await prisma.sessionSlot.updateMany({
    where: { therapyType: "Mindfulness Meditation" },
    data: { therapyType: "Mindfulness-Based Cognitive Therapy (MBCT)" },
  });
  await prisma.sessionSlot.updateMany({
    where: { therapyType: "Counseling Session" },
    data: { therapyType: "Client-Centred Therapy" },
  });

  // Create test bookings
  console.log("📌 Creating test bookings...");
  const allSlots = await prisma.sessionSlot.findMany({
    take: 3,
  });

  const testBookings = [
    {
      userId: users[0].id,
      slotId: allSlots[0].id,
      status: "CONFIRMED" as const,
      type: "FIRST" as const,
      reason: "Anxiety management",
      therapyType: "Cognitive Behavioral Therapy",
    },
    {
      userId: users[1].id,
      slotId: allSlots[1].id,
      status: "PENDING" as const,
      type: "FOLLOW_UP" as const,
      reason: "Progress check-in",
      therapyType: "Mindfulness Meditation",
    },
    {
      userId: users[2].id,
      slotId: allSlots[2].id,
      status: "CONFIRMED" as const,
      type: "FIRST" as const,
      reason: "Initial consultation",
      therapyType: "Counseling Session",
    },
  ];

  const bookings = await Promise.all(
    testBookings.map((bookingData) =>
      prisma.booking.create({
        data: bookingData,
      })
    )
  );
  console.log(`✅ Created ${bookings.length} test bookings`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
