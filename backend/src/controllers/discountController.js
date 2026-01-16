import prisma from "../config/prisma.js";
import * as discountService from "../services/discountService.js";


export const checkDiscount = async (req, res) => {
    try {
        if (!req.user || !req.user.uid) {
            console.error("[DiscountController] Error: User not authenticated or UID missing.");
            return res.status(401).json({ error: "Unauthorized" });
        }

        
        const user = await prisma.user.findUnique({
            where: { firebaseUid: req.user.uid }
        });

        if (!user) {
            console.error(`[DiscountController] Error: User not found in DB for UID ${req.user.uid}`);
            return res.status(404).json({ error: "User profile not found. Please complete registration." });
        }

        const userId = user.id; 
        const discount = await discountService.getApplicableDiscount(userId);
        res.json({ discount });
    } catch (error) {
        console.error("Error checking discount:", error);
        res.status(500).json({ error: "Failed to check discount eligibility" });
    }
};


export const getRules = async (req, res) => {
    try {
        const rules = await discountService.getAllRules();
        res.json(rules);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch rules" });
    }
};


export const addRule = async (req, res) => {
    try {
        const rule = await discountService.createRule(req.body);
        res.status(201).json(rule);
    } catch (error) {
        console.error("Error creating rule:", error);
        res.status(500).json({ error: "Failed to create rule" });
    }
};


export const removeRule = async (req, res) => {
    try {
        const { id } = req.params;
        await discountService.deleteRule(id);
        res.json({ message: "Rule deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete rule" });
    }
};


export const getStatus = (req, res) => {
    try {
        const status = discountService.getGlobalStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch status" });
    }
};


export const toggleStatus = (req, res) => {
    try {
        const { enable } = req.body;
        const status = discountService.toggleGlobalStatus(enable);
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: "Failed to toggle status" });
    }
};
