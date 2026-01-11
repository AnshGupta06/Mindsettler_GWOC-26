import * as settingsService from "../services/globalSettingsService.js";

export const getSettings = async (req, res) => {
    try {
        const settings = await settingsService.getSettings(); // ✨ Added await
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch settings" });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const updated = await settingsService.updateSettings(req.body); // ✨ Added await
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Failed to update settings" });
    }
};