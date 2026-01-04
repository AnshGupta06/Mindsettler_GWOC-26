"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import {
    getDiscountStatus, toggleDiscountStatus, getDiscountRules, createDiscountRule, deleteDiscountRule
} from "@/app/lib/discountApi";
import {
    LayoutDashboard, PlusCircle, Trash2, ToggleLeft, ToggleRight, Percent, Award, ArrowLeft
} from "lucide-react";
import Loader from "../../components/common/Loader";

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
    const [error, setError] = useState("");

    // Form State
    const [newRule, setNewRule] = useState({
        bookingCountFrom: "",
        bookingCountTo: "",
        discountPercent: "",
        label: ""
    });

    const fetchData = async (token: string) => {
        try {
            setLoading(true);
            const statusData = await getDiscountStatus(token);
            const rulesData = await getDiscountRules(token);
            setEnabled(statusData.enableDiscounts);
            setRules(rulesData);
        } catch (err: any) {
            setError(err.message || "Failed to load discount data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) { router.replace("/login"); return; }
            const token = await user.getIdToken();
            await fetchData(token);
        });
        return () => unsub();
    }, [router]);

    const handleToggle = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;
            const token = await user.getIdToken();
            await toggleDiscountStatus(token, !enabled);
            setEnabled(!enabled);
        } catch (err) {
            alert("Failed to toggle status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this rule?")) return;
        try {
            const user = auth.currentUser;
            if (!user) return;
            const token = await user.getIdToken();
            await deleteDiscountRule(token, id);
            setRules(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            alert("Failed to delete rule");
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;
            if (!user) return;
            const token = await user.getIdToken();
            const created = await createDiscountRule(token, {
                bookingCountFrom: parseInt(newRule.bookingCountFrom),
                bookingCountTo: parseInt(newRule.bookingCountTo),
                discountPercent: parseInt(newRule.discountPercent),
                label: newRule.label
            });
            setRules(prev => [...prev, created].sort((a, b) => a.bookingCountFrom - b.bookingCountFrom));
            setNewRule({ bookingCountFrom: "", bookingCountTo: "", discountPercent: "", label: "" });
        } catch (err) {
            alert("Failed to create rule");
        }
    };

    if (loading) return <Loader fullScreen={true} message="Loading Discount Data..."/>

    return (
        <div className="min-h-screen bg-white pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8">
            <div className="max-w-[1440px] mx-auto bg-[#F9F6FF] rounded-[2.5rem] p-6 md:p-12 shadow-sm min-h-[80vh] text-[#3F2965]">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <button onClick={() => router.push("/admin")} className="flex items-center gap-2 text-sm font-bold text-[#3F2965]/60 hover:text-[#3F2965] mb-2">
                            <ArrowLeft size={16} /> Back to Dashboard
                        </button>
                        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                            <Award className="text-[#Dd1764]" />
                            Discount Rules
                        </h1>
                        <p className="text-[#3F2965]/60 mt-1">Manage automatic discounts based on booking counts.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-[#3F2965]/5">
                        <span className="font-bold text-sm">System Status:</span>
                        <button onClick={handleToggle} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-white transition-all ${enabled ? 'bg-green-600' : 'bg-gray-400'}`}>
                            {enabled ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                            {enabled ? "Active" : "Disabled"}
                        </button>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Create Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#3F2965]/5 sticky top-24">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <PlusCircle size={20} className="text-[#Dd1764]" />
                                Add New Rule
                            </h2>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-[#3F2965]/60 uppercase ml-1">From Booking #</label>
                                        <input
                                            type="number"
                                            min="1"
                                            required
                                            value={newRule.bookingCountFrom}
                                            onChange={e => setNewRule({ ...newRule, bookingCountFrom: e.target.value })}
                                            className="w-full mt-1 p-3 bg-[#F9F6FF] rounded-xl border border-[#3F2965]/10 focus:border-[#3F2965] outline-none font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[#3F2965]/60 uppercase ml-1">To Booking #</label>
                                        <input
                                            type="number"
                                            min="1"
                                            required
                                            value={newRule.bookingCountTo}
                                            onChange={e => setNewRule({ ...newRule, bookingCountTo: e.target.value })}
                                            className="w-full mt-1 p-3 bg-[#F9F6FF] rounded-xl border border-[#3F2965]/10 focus:border-[#3F2965] outline-none font-bold"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#3F2965]/60 uppercase ml-1">Discount Percentage</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            required
                                            value={newRule.discountPercent}
                                            onChange={e => setNewRule({ ...newRule, discountPercent: e.target.value })}
                                            className="w-full mt-1 p-3 pl-10 bg-[#F9F6FF] rounded-xl border border-[#3F2965]/10 focus:border-[#3F2965] outline-none font-bold"
                                        />
                                        <Percent size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3F2965]/40" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#3F2965]/60 uppercase ml-1">Label (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Loyalty Reward"
                                        value={newRule.label}
                                        onChange={e => setNewRule({ ...newRule, label: e.target.value })}
                                        className="w-full mt-1 p-3 bg-[#F9F6FF] rounded-xl border border-[#3F2965]/10 focus:border-[#3F2965] outline-none font-bold"
                                    />
                                </div>
                                <button type="submit" className="w-full py-3 bg-[#3F2965] text-white rounded-xl font-bold hover:bg-[#2d1c4a] transition-all">
                                    Create Rule
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Rules List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 px-2">
                            Existing Rules
                        </h2>
                        {rules.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-[#3F2965]/20">
                                <p className="text-[#3F2965]/40 font-bold">No active rules defined.</p>
                            </div>
                        ) : (
                            rules.map((rule) => (
                                <div key={rule.id} className="bg-white p-5 rounded-2xl shadow-sm border border-[#3F2965]/5 flex items-center justify-between group hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#F9F6FF] flex items-center justify-center text-[#Dd1764] font-black text-xl">
                                            {rule.discountPercent}%
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">
                                                {rule.bookingCountFrom} - {rule.bookingCountTo} Bookings
                                            </h3>
                                            {rule.label && <p className="text-sm text-[#3F2965]/60">{rule.label}</p>}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(rule.id)}
                                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                                        title="Delete Rule"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
