import prisma from "../config/prisma.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const settingsPath = path.resolve(__dirname, "../../config/discountSettings.json");


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


const updateSettings = (settings) => {
    try {
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    } catch (err) {
        console.error("Error writing discount settings:", err);
    }
};

export const getApplicableDiscount = async (userId) => {
    
    const settings = getSettings();
    if (!settings.enableDiscounts) {
        return null; 
    }

    
    
    if (!userId) {
        console.error("[DiscountService] Error: userId is missing/undefined. Cannot calculate discount.");
        return null;
    }

    
    
    const confirmedCount = await prisma.booking.count({
        where: {
            userId: userId,
            status: "CONFIRMED"
        }
    });

    console.log(`[DiscountService] Checking discounts for user ${userId}. Confirmed Bookings: ${confirmedCount}`);

    
    
    const validRules = await prisma.bookingDiscount.findMany({
        where: {
            isActive: true,
            bookingCountFrom: { lte: confirmedCount }, 
            bookingCountTo: { gte: confirmedCount }    
        }
    });

    if (validRules.length === 0) {
        return null; 
    }

    
    
    
    
    validRules.sort((a, b) => {
        const rangeA = a.bookingCountTo - a.bookingCountFrom;
        const rangeB = b.bookingCountTo - b.bookingCountFrom;

        
        if (rangeA !== rangeB) {
            return rangeA - rangeB;
        }

        
        return b.bookingCountFrom - a.bookingCountFrom;
    });

    const bestMatch = validRules[0];

    console.log(`[DiscountService] Match found: ${bestMatch.label} (${bestMatch.discountPercent}%)`);

    return {
        discountPercent: bestMatch.discountPercent,
        label: bestMatch.label
    };
};



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
