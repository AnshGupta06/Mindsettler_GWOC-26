import * as discountService from "../services/discountService.js";

// User: Check Discount
export const checkDiscount = async (req, res) => {
    try {
        const userId = req.user.id; // user id from auth middleware
        const discount = await discountService.getApplicableDiscount(userId);
        res.json({ discount });
    } catch (error) {
        console.error("Error checking discount:", error);
        res.status(500).json({ error: "Failed to check discount eligibility" });
    }
};

// Admin: Get All Rules
export const getRules = async (req, res) => {
    try {
        const rules = await discountService.getAllRules();
        res.json(rules);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch rules" });
    }
};

// Admin: Create Rule
export const addRule = async (req, res) => {
    try {
        const rule = await discountService.createRule(req.body);
        res.status(201).json(rule);
    } catch (error) {
        console.error("Error creating rule:", error);
        res.status(500).json({ error: "Failed to create rule" });
    }
};

// Admin: Delete Rule
export const removeRule = async (req, res) => {
    try {
        const { id } = req.params;
        await discountService.deleteRule(id);
        res.json({ message: "Rule deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete rule" });
    }
};

// Admin: Get Global Status
export const getStatus = (req, res) => {
    try {
        const status = discountService.getGlobalStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch status" });
    }
};

// Admin: Toggle Global Status
export const toggleStatus = (req, res) => {
    try {
        const { enable } = req.body;
        const status = discountService.toggleGlobalStatus(enable);
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: "Failed to toggle status" });
    }
};
