import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const settingsPath = path.resolve(__dirname, "../../config/discountSettings.json");

// Helper to read global settings
const getSettings = () => {
    try {
        if (!fs.existsSync(settingsPath)) {
            return { enableDiscounts: false };
        }
        const data = fs.readFileSync(settingsPath, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading discount settings:", err);
        return { enableDiscounts: false };
    }
};

// Helper to write global settings
const updateSettings = (settings) => {
    try {
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    } catch (err) {
        console.error("Error writing discount settings:", err);
    }
};

export const getApplicableDiscount = async (userId) => {
    // 1. Check if global discounts are enabled
    const settings = getSettings();
    if (!settings.enableDiscounts) {
        return null; // Feature Disabled by Admin
    }

    // [FIX] Valid User ID is MANDATORY
    // Prisma ignores undefined fields in where clause, causing GLOBAL COUNTS if userId is missing.
    if (!userId) {
        console.error("[DiscountService] Error: userId is missing/undefined. Cannot calculate discount.");
        return null;
    }

    // 2. Count CONFIRMED bookings for the user
    // CRITICAL: Only count bookings that are officially confirmed to prevent gaming.
    const confirmedCount = await prisma.booking.count({
        where: {
            userId: userId,
            status: "CONFIRMED"
        }
    });

    console.log(`[DiscountService] Checking discounts for user ${userId}. Confirmed Bookings: ${confirmedCount}`);

    // 3. Fetch ONLY valid matching rules directly from DB
    // Logic: Rule is valid IF (rule.from <= count AND rule.to >= count)
    const validRules = await prisma.bookingDiscount.findMany({
        where: {
            isActive: true,
            bookingCountFrom: { lte: confirmedCount }, // Rule requires LESS/EQUAL to current count
            bookingCountTo: { gte: confirmedCount }    // Rule valid until MORE/EQUAL to current count
        }
    });

    if (validRules.length === 0) {
        return null; // No rule applies to this specific count
    }

    // 4. Sort rules to find the MOST SPECIFIC match (Highest Priority)
    // Priority 1: Exact Match (5-5) is better than Range (1-10)
    // Priority 2: Narrowest Range (5-6) is better than Wide Range (1-10)
    // Priority 3: Highest Start (Tiebreaker)
    validRules.sort((a, b) => {
        const rangeA = a.bookingCountTo - a.bookingCountFrom;
        const rangeB = b.bookingCountTo - b.bookingCountFrom;

        // Rule 1 & 2: Smaller range wins (Specific > General)
        if (rangeA !== rangeB) {
            return rangeA - rangeB;
        }

        // Rule 3: If ranges are equal, prefer the one starting higher (arbitrary but consistent)
        return b.bookingCountFrom - a.bookingCountFrom;
    });

    const bestMatch = validRules[0];

    console.log(`[DiscountService] Match found: ${bestMatch.label} (${bestMatch.discountPercent}%)`);

    return {
        discountPercent: bestMatch.discountPercent,
        label: bestMatch.label
    };
};

// Admin Operations

export const getAllRules = async () => {
    return await prisma.bookingDiscount.findMany({
        orderBy: { bookingCountFrom: 'asc' }
    });
};

export const createRule = async (data) => {
    const { bookingCountFrom, bookingCountTo, discountPercent, label } = data;
    return await prisma.bookingDiscount.create({
        data: {
            bookingCountFrom: parseInt(bookingCountFrom),
            bookingCountTo: parseInt(bookingCountTo),
            discountPercent: parseInt(discountPercent),
            label,
            isActive: true
        }
    });
};

export const deleteRule = async (id) => {
    return await prisma.bookingDiscount.delete({
        where: { id }
    });
};

export const getGlobalStatus = () => {
    return getSettings();
};

export const toggleGlobalStatus = (enable) => {
    const settings = getSettings();
    settings.enableDiscounts = !!enable;
    updateSettings(settings);
    return settings;
};
