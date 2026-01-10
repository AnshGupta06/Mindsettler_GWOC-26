"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import {
    getDiscountStatus, toggleDiscountStatus, getDiscountRules, createDiscountRule, deleteDiscountRule
} from "@/app/lib/discountApi";
import {
    LayoutDashboard, Plus, Trash2, Power, Percent, ArrowLeft, Save, AlertCircle, Loader2, Sparkles, Tag
} from "lucide-react";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

type DiscountRule = {
    id: string;
    bookingCountFrom: number;
    bookingCountTo: number;
    discountPercent: number;
    label?: string;
    isActive: boolean;
};

export default function DiscountAdminPage() {
    const router = useRouter();
    const [rules, setRules] = useState<DiscountRule[]>([]);
    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Processing States
    const [isToggling, setIsToggling] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Form State
    const [newRule, setNewRule] = useState({
        bookingCountFrom: "",
        bookingCountTo: "",
        discountPercent: "",
        label: ""
    });

    // 1. Fetch Data
    const fetchData = async (token: string) => {
        try {
            const [statusData, rulesData] = await Promise.all([
                getDiscountStatus(token),
                getDiscountRules(token)
            ]);
            setEnabled(statusData.enableDiscounts);
            setRules(rulesData);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load discount data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken();
                fetchData(token);
            } else {
                router.push("/login");
            }
        });
        return () => unsub();
    }, [router]);

    // 2. Handlers
    const handleToggleStatus = async () => {
        setIsToggling(true);
        const toastId = toast.loading("Updating system status...");
        try {
            const user = auth.currentUser;
            if (!user) return;
            const token = await user.getIdToken();
            const res = await toggleDiscountStatus(token, !enabled);
            setEnabled(res.enableDiscounts);
            toast.success(res.enableDiscounts ? "Discounts Active" : "Discounts Paused", { id: toastId });
        } catch (err) {
            toast.error("Failed to update status", { id: toastId });
        } finally {
            setIsToggling(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRule.bookingCountFrom || !newRule.bookingCountTo || !newRule.discountPercent) {
            toast.error("Please fill all required fields");
            return;
        }

        setIsCreating(true);
        const toastId = toast.loading("Creating rule...");
        try {
            const user = auth.currentUser;
            if (!user) return;
            const token = await user.getIdToken();
            
            // Validate Logic: From <= To
            if (parseInt(newRule.bookingCountFrom) > parseInt(newRule.bookingCountTo)) {
                throw new Error("'From' count cannot be greater than 'To' count");
            }

            const payload = {
                ...newRule,
                bookingCountFrom: parseInt(newRule.bookingCountFrom),
                bookingCountTo: parseInt(newRule.bookingCountTo),
                discountPercent: parseInt(newRule.discountPercent),
            };

            const created = await createDiscountRule(token, payload);
            setRules([...rules, created]);
            setNewRule({ bookingCountFrom: "", bookingCountTo: "", discountPercent: "", label: "" });
            toast.success("Rule created successfully!", { id: toastId });
        } catch (err: any) {
            toast.error(err.message || "Failed to create rule", { id: toastId });
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this rule?")) return;

        setDeletingId(id);
        const toastId = toast.loading("Deleting rule...");
        try {
            const user = auth.currentUser;
            if (!user) return;
            const token = await user.getIdToken();
            
            await deleteDiscountRule(token, id);
            setRules(rules.filter(r => r.id !== id));
            toast.success("Rule deleted", { id: toastId });
        } catch (err) {
            toast.error("Failed to delete rule", { id: toastId });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        // 1. Outer Container: White background with top padding (Same as Slots Page)
        <div className="min-h-screen bg-white pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8">
            
            {/* 2. Inner Container: Purple Box (Same as Slots Page) */}
                
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Sparkles className="text-[#Dd1764]" />
                            Discount Manager
                        </h1>
                        <p className="text-[#3F2965]/60 mt-1">Automate loyalty rewards and session benefits</p>
                    </div>

                    <div className="flex items-center gap-4">
                       {/* Status Toggle Switch */}
{!loading && (
    <button
        onClick={handleToggleStatus}
        disabled={isToggling}
        className={`group flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full border transition-all duration-300 ${
            enabled 
                ? "bg-green-50/50 border-green-200 hover:bg-green-50 hover:shadow-md hover:shadow-green-100/50" 
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
        }`}
    >
        {/* The Switch Track */}
        <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${
            enabled ? "bg-green-500" : "bg-gray-300"
        }`}>
            {/* The Switch Thumb */}
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center ${
                enabled ? "translate-x-5" : "translate-x-0"
            }`}>
                {/* Icon inside Thumb */}
                {isToggling ? (
                    <Loader2 size={10} className="animate-spin text-gray-400" />
                ) : (
                    enabled ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    ) : (
                        <Power size={10} className="text-gray-400" />
                    )
                )}
            </div>
        </div>

        {/* Text Labels */}
        <div className="text-left leading-none">
            <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-0.5">
                System Status
            </p>
            <p className={`text-xs font-bold transition-colors ${
                enabled ? "text-green-700" : "text-gray-500"
            }`}>
                {isToggling ? "Updating..." : (enabled ? "Live & Active" : "Paused")}
            </p>
        </div>
    </button>
)}

                        <button 
                            onClick={() => router.push("/admin")}
                            className="px-5 py-2.5 bg-white border border-[#3F2965]/10 text-[#3F2965] rounded-full font-bold hover:bg-[#F9F6FF] transition flex items-center gap-2"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                    </div>
                </div>

                {loading ? (
                    <Loader fullScreen={false} message="Loading Rules..." />
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        
                        {/* === LEFT: CREATE FORM === */}
                        <div className="bg-white p-6 rounded-3xl shadow-lg border border-[#3F2965]/5 lg:sticky lg:top-8">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Plus className="bg-[#3F2965] text-white rounded-full p-1" size={24} />
                                Add New Rule
                            </h2>

                            <form onSubmit={handleCreate} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-[#3F2965]/60 uppercase ml-1">From (Booking #)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={newRule.bookingCountFrom}
                                            onChange={(e) => setNewRule({ ...newRule, bookingCountFrom: e.target.value })}
                                            className="w-full mt-1 px-4 py-3 rounded-xl bg-[#F9F6FF] border border-[#3F2965]/10 focus:outline-none focus:ring-2 focus:ring-[#Dd1764]"
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[#3F2965]/60 uppercase ml-1">To (Booking #)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={newRule.bookingCountTo}
                                            onChange={(e) => setNewRule({ ...newRule, bookingCountTo: e.target.value })}
                                            className="w-full mt-1 px-4 py-3 rounded-xl bg-[#F9F6FF] border border-[#3F2965]/10 focus:outline-none focus:ring-2 focus:ring-[#Dd1764]"
                                            placeholder="5"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-[#3F2965]/60 uppercase ml-1">Discount Percentage</label>
                                    <div className="relative">
                                        <Percent size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F2965]/40" />
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={newRule.discountPercent}
                                            onChange={(e) => setNewRule({ ...newRule, discountPercent: e.target.value })}
                                            className="w-full mt-1 pl-10 pr-4 py-3 rounded-xl bg-[#F9F6FF] border border-[#3F2965]/10 focus:outline-none focus:ring-2 focus:ring-[#Dd1764]"
                                            placeholder="20"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-[#3F2965]/60 uppercase ml-1">Label (Optional)</label>
                                    <div className="relative">
                                        <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F2965]/40" />
                                        <input
                                            type="text"
                                            value={newRule.label}
                                            onChange={(e) => setNewRule({ ...newRule, label: e.target.value })}
                                            className="w-full mt-1 pl-10 pr-4 py-3 rounded-xl bg-[#F9F6FF] border border-[#3F2965]/10 focus:outline-none focus:ring-2 focus:ring-[#Dd1764]"
                                            placeholder="e.g. Loyalty Bonus"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="w-full py-4 rounded-xl bg-[#Dd1764] text-white font-bold shadow-lg hover:shadow-[#Dd1764]/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isCreating ? <Loader2 size={20} className="animate-spin" /> : "Save Rule"}
                                </button>
                            </form>
                        </div>

                        {/* === RIGHT: RULES LIST === */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Simple Header for List */}
                            <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-[#3F2965]/5">
                                <h3 className="font-bold text-lg text-[#3F2965]">Active Rules</h3>
                                <span className="bg-[#F9F6FF] text-[#Dd1764] px-3 py-1 rounded-lg text-xs font-bold">
                                    {rules.length} Rules Defined
                                </span>
                            </div>

                            {rules.length === 0 ? (
                                <div className="bg-white p-12 rounded-3xl border border-dashed border-[#3F2965]/20 text-center">
                                    <AlertCircle className="mx-auto text-[#3F2965]/20 mb-4" size={48} />
                                    <p className="text-[#3F2965]/60 font-medium text-lg">No discount rules found.</p>
                                    <p className="text-[#3F2965]/40 text-sm mt-1">Add your first rule using the form on the left.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {rules.map((rule) => (
                                            <motion.div
                                                key={rule.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                                                className="group bg-white p-5 rounded-2xl shadow-sm border border-[#3F2965]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#Dd1764]/20 hover:shadow-md transition-all"
                                            >
                                                <div className="flex items-center gap-5">
                                                    {/* Percentage Badge */}
                                                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#F9F6FF] text-[#Dd1764] flex flex-col items-center justify-center shadow-inner ring-1 ring-[#Dd1764]/10">
                                                        <span className="text-2xl font-black">{rule.discountPercent}%</span>
                                                        <span className="text-[10px] uppercase font-bold opacity-60">OFF</span>
                                                    </div>
                                                    
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <h3 className="font-bold text-[#3F2965] text-lg">
                                                                Booking {rule.bookingCountFrom} 
                                                                {rule.bookingCountFrom !== rule.bookingCountTo && ` — ${rule.bookingCountTo}`}
                                                            </h3>
                                                            {rule.label && (
                                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md">
                                                                    {rule.label}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-[#3F2965]/60 font-medium">
                                                            Applied when user has between <b>{rule.bookingCountFrom}</b> and <b>{rule.bookingCountTo}</b> confirmed bookings.
                                                        </p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleDelete(rule.id)}
                                                    disabled={deletingId === rule.id}
                                                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all self-end sm:self-center"
                                                    title="Delete Rule"
                                                >
                                                    {deletingId === rule.id ? (
                                                        <Loader2 size={20} className="animate-spin text-red-500" />
                                                    ) : (
                                                        <Trash2 size={20} />
                                                    )}
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
    );
}