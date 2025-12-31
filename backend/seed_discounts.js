import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    console.log("Deleting all existing discount rules...");
    await prisma.bookingDiscount.deleteMany({});

    console.log("Seeding clean rules...");
    await prisma.bookingDiscount.createMany({
        data: [
            {
                bookingCountFrom: 2,
                bookingCountTo: 2,
                discountPercent: 10,
                label: "2nd Booking Special",
                isActive: true
            },
            {
                bookingCountFrom: 7,
                bookingCountTo: 7,
                discountPercent: 50,
                label: "Lucky Number 7",
                isActive: true
            },
            {
                bookingCountFrom: 1,
                bookingCountTo: 10,
                discountPercent: 5,
                label: "Loyalty 1-10",
                isActive: true
            }
        ]
    });

    console.log("Rules reset complete.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
