"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { checkDiscountEligibility } from "@/app/lib/discountApi";
import { Sparkles } from "lucide-react";

type Discount = {
    discountPercent: number;
    label?: string;
};

export default function DiscountBanner() {
    const [discount, setDiscount] = useState<Discount | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const token = await user.getIdToken();
                    const res = await checkDiscountEligibility(token);
                    if (res.discount) {
                        setDiscount(res.discount);
                    }
                } catch (err) {
                    console.error("Failed to check discount", err);
                }
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    if (loading || !discount) return null;

    return (
        <div className="mb-6 bg-gradient-to-r from-[#Dd1764]/10 to-[#3F2965]/10 border border-[#Dd1764]/20 rounded-2xl p-4 flex items-center justify-center text-center animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <div className="p-2 bg-white rounded-full shadow-sm text-[#Dd1764]">
                    <Sparkles size={20} fill="currentColor" className="animate-pulse" />
                </div>
                <div>
                    <p className="text-[#3F2965] font-bold text-lg">
                        🎉 You’re eligible for a <span className="text-[#Dd1764] text-xl">{discount.discountPercent}%</span> session benefit!
                    </p>
                    {discount.label && (
                        <p className="text-[#3F2965]/60 text-xs font-bold uppercase tracking-wider mt-1">
                            {discount.label}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
