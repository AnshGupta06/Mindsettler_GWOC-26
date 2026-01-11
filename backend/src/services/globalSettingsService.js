import prisma from "../config/prisma.js";

const DEFAULTS = {
    priceFirst: 1499,
    priceFollowUp: 999,
    cancellationHours: 24
};

// Fetch the single row of settings
export const getSettings = async () => {
    try {
        // Try to find the first (and only) settings row
        const settings = await prisma.globalSettings.findFirst();

        // If no settings exist yet, return defaults (or create them)
        if (!settings) {
            return DEFAULTS;
        }

        return settings;
    } catch (err) {
        console.error("Error fetching global settings:", err);
        return DEFAULTS; // Fallback if DB fails
    }
};

// Update (or Create if missing) the settings
export const updateSettings = async (newSettings) => {
    try {
        // Check if a row exists
        const existing = await prisma.globalSettings.findFirst();

        if (existing) {
            // Update the existing row
            return await prisma.globalSettings.update({
                where: { id: existing.id },
                data: {
                    priceFirst: Number(newSettings.priceFirst),
                    priceFollowUp: Number(newSettings.priceFollowUp),
                    cancellationHours: Number(newSettings.cancellationHours),
                },
            });
        } else {
            // Create the first row
            return await prisma.globalSettings.create({
                data: {
                    priceFirst: Number(newSettings.priceFirst),
                    priceFollowUp: Number(newSettings.priceFollowUp),
                    cancellationHours: Number(newSettings.cancellationHours),
                }
            });
        }
    } catch (err) {
        console.error("Error updating settings:", err);
        throw new Error("Failed to save settings to database");
    }
};