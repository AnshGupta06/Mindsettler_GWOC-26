"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import {
    getDiscountStatus, toggleDiscountStatus, getDiscountRules, createDiscountRule, deleteDiscountRule
} from "@/app/lib/discountApi";
import {
    Plus, Trash2, Power, Percent, ArrowLeft, Loader2, Tag, AlertCircle, Check, X
} from "lucide-react";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

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
    
    const [isToggling, setIsToggling] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [newRule, setNewRule] = useState({
        bookingCountFrom: "",
        bookingCountTo: "",
        discountPercent: "",
        label: ""
    });

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

    const handleToggleStatus = async () => {
        setIsToggling(true);
        const toastId = toast.loading("Updating status...");
        try {
            const user = auth.currentUser;
            if (!user) return;
            const token = await user.getIdToken();
            const res = await toggleDiscountStatus(token, !enabled);
            setEnabled(res.enableDiscounts);
            toast.success(res.enableDiscounts ? "Discounts Activated" : "Discounts Paused", { id: toastId });
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

    if (loading) return <Loader fullScreen={true} message="Loading Discount Config..." />;

    return (
        <div className="min-h-screen bg-[#F9F6FF] pt-20 pb-12 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col gap-6 mb-8">
                    <div>
                        <button 
                            onClick={() => router.push('/admin')} 
                            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#3F2965] font-bold mb-4 transition-colors text-sm px-3 py-2 rounded-lg hover:bg-white/50"
                        >
                            <ArrowLeft size={18} /> Back to Dashboard
                        </button>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
                                    <Tag className="text-[#Dd1764]" size={32} /> Discount Manager
                                </h1>
                                <p className="text-gray-500 mt-1 font-medium">Configure loyalty rewards and automated discounts.</p>
                            </div>

                            {/* --- SYSTEM STATUS TOGGLE --- */}
                            <div className={`flex items-center gap-4 px-5 py-3 rounded-xl border transition-colors ${enabled ? "bg-green-50 border-green-200" : "bg-white border-gray-200"}`}>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">System Status</p>
                                    <p className={`text-sm font-bold ${enabled ? "text-green-700" : "text-gray-600"}`}>
                                        {enabled ? "Active & Applying" : "Disabled Globally"}
                                    </p>
                                </div>
                                <button
                                    onClick={handleToggleStatus}
                                    disabled={isToggling}
                                    className={`w-12 h-7 rounded-full p-1 transition-colors relative ${enabled ? "bg-green-500" : "bg-gray-300"}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${enabled ? "translate-x-5" : "translate-x-0"} flex items-center justify-center`}>
                                        {isToggling ? <Loader2 size={10} className="animate-spin text-gray-400"/> : (enabled ? <Check size={12} className="text-green-500"/> : <Power size={10} className="text-gray-400"/>)}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    
                    {/* --- LEFT COL: CREATE FORM --- */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 lg:sticky lg:top-24">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800 border-b border-gray-100 pb-4">
                            <Plus className="bg-[#3F2965] text-white rounded-md p-1" size={20} />
                            Add New Rule
                        </h2>

                        <form onSubmit={handleCreate} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1.5 block">From (Bookings)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newRule.bookingCountFrom}
                                        onChange={(e) => setNewRule({ ...newRule, bookingCountFrom: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#Dd1764] text-sm font-medium text-gray-800 transition-all"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1.5 block">To (Bookings)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newRule.bookingCountTo}
                                        onChange={(e) => setNewRule({ ...newRule, bookingCountTo: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#Dd1764] text-sm font-medium text-gray-800 transition-all"
                                        placeholder="5"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1.5 block">Discount (%)</label>
                                <div className="relative">
                                    <Percent size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={newRule.discountPercent}
                                        onChange={(e) => setNewRule({ ...newRule, discountPercent: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#Dd1764] text-sm font-medium text-gray-800 transition-all"
                                        placeholder="20"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1.5 block">Label (Optional)</label>
                                <div className="relative">
                                    <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={newRule.label}
                                        onChange={(e) => setNewRule({ ...newRule, label: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#Dd1764] text-sm font-medium text-gray-800 transition-all"
                                        placeholder="e.g. Loyalty Bonus"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isCreating}
                                className="w-full py-3.5 rounded-xl bg-[#Dd1764] text-white font-bold shadow-lg shadow-[#Dd1764]/20 hover:bg-[#b01350] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                            >
                                {isCreating ? <Loader2 size={18} className="animate-spin" /> : "Save Rule"}
                            </button>
                        </form>
                    </div>

                    {/* --- RIGHT COL: RULES LIST --- */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-base text-gray-800">Existing Rules</h3>
                            <span className="bg-[#F9F6FF] text-[#3F2965] px-3 py-1 rounded-lg text-xs font-bold border border-[#3F2965]/10">
                                {rules.length} Active
                            </span>
                        </div>

                        {rules.length === 0 ? (
                            <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                                <AlertCircle className="mx-auto text-gray-300 mb-3" size={40} />
                                <p className="text-gray-500 font-medium">No discount rules found.</p>
                                <p className="text-gray-400 text-sm mt-1">Use the form to create your first pricing tier.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {rules.map((rule) => (
                                    <div
                                        key={rule.id}
                                        className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gray-300 transition-all"
                                    >
                                        <div className="flex items-center gap-5">
                                            {/* Percentage Badge */}
                                            <div className="w-16 h-16 shrink-0 rounded-xl bg-[#F9F6FF] text-[#Dd1764] flex flex-col items-center justify-center border border-[#Dd1764]/10">
                                                <span className="text-2xl font-black">{rule.discountPercent}%</span>
                                                <span className="text-[10px] uppercase font-bold opacity-60">OFF</span>
                                            </div>
                                            
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-gray-900 text-base">
                                                        Booking {rule.bookingCountFrom} 
                                                        {rule.bookingCountFrom !== rule.bookingCountTo && ` — ${rule.bookingCountTo}`}
                                                    </h3>
                                                    {rule.label && (
                                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md border border-purple-200">
                                                            {rule.label}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 font-medium">
                                                    Applies to users with <b>{rule.bookingCountFrom}</b> to <b>{rule.bookingCountTo}</b> previous bookings.
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(rule.id)}
                                            disabled={deletingId === rule.id}
                                            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all self-end sm:self-center border border-transparent hover:border-red-100"
                                            title="Delete Rule"
                                        >
                                            {deletingId === rule.id ? (
                                                <Loader2 size={20} className="animate-spin text-red-500" />
                                            ) : (
                                                <Trash2 size={20} />
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}