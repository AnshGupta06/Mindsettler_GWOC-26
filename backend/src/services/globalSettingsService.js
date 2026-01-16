import prisma from "../config/prisma.js";

const DEFAULTS = {
    priceFirst: 1499,
    priceFollowUp: 999,
    cancellationHours: 24
};


export const getSettings = async () => {
    try {
        
        const settings = await prisma.globalSettings.findFirst();

        
        if (!settings) {
            return DEFAULTS;
        }

        return settings;
    } catch (err) {
        console.error("Error fetching global settings:", err);
        return DEFAULTS; 
    }
};


export const updateSettings = async (newSettings) => {
    try {
        
        const existing = await prisma.globalSettings.findFirst();

        if (existing) {
            
            return await prisma.globalSettings.update({
                where: { id: existing.id },
                data: {
                    priceFirst: Number(newSettings.priceFirst),
                    priceFollowUp: Number(newSettings.priceFollowUp),
                    cancellationHours: Number(newSettings.cancellationHours),
                },
            });
        } else {
            
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