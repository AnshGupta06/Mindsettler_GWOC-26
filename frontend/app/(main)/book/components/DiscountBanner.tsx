"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { checkDiscountEligibility } from "@/app/lib/discountApi";
import { Sparkles, X, PartyPopper, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Discount = {
    discountPercent: number;
    label?: string;
};

export default function DiscountBanner() {
    const [discount, setDiscount] = useState<Discount | null>(null);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setDiscount(null); 
                setLoading(false);
                return;
            }

            try {
                
                const token = await user.getIdToken(); 
                const res = await checkDiscountEligibility(token);
                
                if (res?.discount) {
                    setDiscount(res.discount);
                    setIsVisible(true); 
                } else {
                    setDiscount(null);
                }
            } catch (err) {
                console.error("Failed to check discount", err);
            } finally {
                setLoading(false);
            }
        });

        return () => unsub();
    }, []);

    
    if (loading) {
        return (
            <div className="mb-8 p-5 bg-white/50 border border-[#3F2965]/5 rounded-2xl flex items-center justify-center gap-3 animate-pulse">
                 <Loader2 className="w-5 h-5 text-[#Dd1764] animate-spin" />
                 <p className="text-sm font-bold text-[#3F2965]/60">Checking available discounts...</p>
            </div>
        );
    }

    if (!discount || !isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                    className="relative mb-8 overflow-hidden"
                >
                    {}
                    <div className="relative bg-white border border-[#Dd1764] backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-[#Dd1764]/5">
                        
                        {}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                            <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-[shimmer_2s_infinite]" />
                        </div>

                        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 text-center sm:text-left pr-8">
                            
                            {}
                            <div className="shrink-0 p-3 bg-white rounded-full shadow-md text-[#Dd1764] ring-4 ring-[#Dd1764]/5">
                                <PartyPopper size={24} className="animate-bounce" strokeWidth={2.5} />
                            </div>

                            {}
                            <div>
                                <h3 className="text-[#3F2965] font-bold text-lg leading-tight">
                                    You’re eligible for a <span className="text-[#Dd1764] text-xl font-extrabold">{discount.discountPercent}% OFF</span> benefit!
                                </h3>
                                {discount.label && (
                                    <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                                        <Sparkles size={12} className="text-[#Dd1764]" />
                                        <p className="text-[#3F2965]/70 text-xs font-bold uppercase tracking-widest">
                                            {discount.label}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {}
                            <button 
                                onClick={() => setIsVisible(false)}
                                className="absolute top-0 right-0 p-2 text-[#3F2965]/40 hover:text-[#Dd1764] hover:bg-[#Dd1764]/10 rounded-full transition-colors"
                                aria-label="Dismiss discount"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}