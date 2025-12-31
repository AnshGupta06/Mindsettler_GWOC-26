import { API_URL } from "./api";

// Fetch global status (Admin)
export const getDiscountStatus = async (token: string) => {
    const res = await fetch(`${API_URL}/api/discounts/status`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch status");
    return res.json();
};

// Toggle global status (Admin)
export const toggleDiscountStatus = async (token: string, enable: boolean) => {
    const res = await fetch(`${API_URL}/api/discounts/toggle`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ enable })
    });
    if (!res.ok) throw new Error("Failed to toggle status");
    return res.json();
};

// Get all rules (Admin)
export const getDiscountRules = async (token: string) => {
    const res = await fetch(`${API_URL}/api/discounts/rules`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch rules");
    return res.json();
};

// Create rule (Admin)
export const createDiscountRule = async (token: string, data: { bookingCountFrom: number; bookingCountTo: number; discountPercent: number; label?: string }) => {
    const res = await fetch(`${API_URL}/api/discounts/rules`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create rule");
    return res.json();
};

// Delete rule (Admin)
export const deleteDiscountRule = async (token: string, id: string) => {
    const res = await fetch(`${API_URL}/api/discounts/rules/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to delete rule");
    return res.json();
};

// Check eligibility (User)
export const checkDiscountEligibility = async (token: string) => {
    const res = await fetch(`${API_URL}/api/discounts/check`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to check eligibility");
    return res.json();
};
