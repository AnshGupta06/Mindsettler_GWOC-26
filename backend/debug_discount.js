
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const email = "i.am.apro.006@gmail.com";
    console.log(`Looking up user: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: { bookings: true }
    });

    if (!user) {
        console.log("User not found!");
        return;
    }

    console.log(`User ID: ${user.id}`);

    // Count using the exact same logic as service
    const confirmedCount = await prisma.booking.count({
        where: {
            userId: user.id,
            status: "CONFIRMED"
        }
    });

    console.log(`CONFIRMED Booking Count (DB): ${confirmedCount}`);

    // Show all bookings status
    console.log("All Bookings:");
    user.bookings.forEach(b => console.log(` - [${b.status}] ${b.id} createdAt:${b.createdAt}`));

    console.log("\n--- Active Discount Rules ---");
    const rules = await prisma.bookingDiscount.findMany({
        where: { isActive: true }
    });
    console.log(JSON.stringify(rules, null, 2));

    console.log("\n--- Logic Trace ---");
    console.log(`Searching for rules where:`);
    console.log(`  bookingCountFrom <= ${confirmedCount}`);
    console.log(`  bookingCountTo   >= ${confirmedCount}`);

    const validRules = rules.filter(r =>
        r.bookingCountFrom <= confirmedCount &&
        r.bookingCountTo >= confirmedCount
    );

    console.log(`Found ${validRules.length} matching rules.`);
    validRules.forEach(r => console.log(`MATCH: ${r.label} (${r.discountPercent}%)`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
