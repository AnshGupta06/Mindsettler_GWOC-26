import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const today = new Date();

  function slotTime(baseDate: Date, hour: number) {
    const d = new Date(baseDate);
    d.setHours(hour, 0, 0, 0);
    return d;
  }

  // ✅ Explicit type
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
        isBooked: false,
      },
      {
        date,
        startTime: slotTime(date, 12),
        endTime: slotTime(date, 13),
        mode: "ONLINE",
        isBooked: false,
      },
      {
        date,
        startTime: slotTime(date, 16),
        endTime: slotTime(date, 17),
        mode: "OFFLINE",
        isBooked: false,
      }
    );
  }

  await prisma.sessionSlot.createMany({
    data: slots,
    skipDuplicates: true,
  });

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
