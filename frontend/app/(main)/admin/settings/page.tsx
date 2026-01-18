"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { API_URL } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  ShieldAlert, 
  DollarSign, 
  Clock, 
  Loader2, 
  Settings as SettingsIcon 
} from "lucide-react";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";

const AdminSettingsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    priceFirst: "",
    priceFollowUp: "",
    cancellationHours: ""
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { 
        router.replace("/login"); 
        return; 
      }
      const token = await user.getIdToken();
      fetchSettings(token);
    });
    return () => unsub();
  }, [router]);

  const fetchSettings = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Failed to fetch settings");
      
      const data = await res.json();
      setSettings({
        priceFirst: data.priceFirst || "",
        priceFollowUp: data.priceFollowUp || "",
        cancellationHours: data.cancellationHours || ""
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading("Updating configuration...");

    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const res = await fetch(`${API_URL}/api/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            priceFirst: Number(settings.priceFirst),
            priceFollowUp: Number(settings.priceFollowUp),
            cancellationHours: Number(settings.cancellationHours)
        })
      });

      if (!res.ok) throw new Error("Update failed");
      toast.success("Settings Updated!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullScreen={true} message="Loading Config..." />;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8">
            <button 
                onClick={() => router.push('/admin')} 
                className="inline-flex items-center gap-2 text-gray-500 hover:text-[#3F2965] font-bold mb-4 transition-colors text-sm px-3 py-2 rounded-lg hover:bg-white/50"
            >
                <ArrowLeft size={18} /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-[#3F2965]">
              <SettingsIcon className="text-[#Dd1764]" size={32} /> Global Configuration
            </h1>
            <p className="text-[#3F2965]/70 mt-1 font-medium">Manage pricing schemes and booking policies.</p>
        </div>

        <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-[#3F2965]/10 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
               <div className="p-2 bg-green-50 rounded-lg text-green-600">
                 <DollarSign size={24} />
               </div>
               <h2 className="text-xl font-bold text-[#3F2965]">Pricing Scheme</h2>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-[#3F2965]/60 uppercase mb-2">First Session (₹)</label>
              <input 
                type="number"
                value={settings.priceFirst}
                onChange={(e) => setSettings({...settings, priceFirst: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 font-bold text-[#3F2965] focus:outline-none focus:border-[#Dd1764] focus:bg-white transition-all text-sm"
                placeholder="1499"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-[#3F2965]/60 uppercase mb-2">Follow-up Session (₹)</label>
              <input 
                type="number"
                value={settings.priceFollowUp}
                onChange={(e) => setSettings({...settings, priceFollowUp: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 font-bold text-[#3F2965] focus:outline-none focus:border-[#Dd1764] focus:bg-white transition-all text-sm"
                placeholder="999"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#3F2965]/10 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
               <div className="p-2 bg-red-50 rounded-lg text-red-600">
                 <ShieldAlert size={24} />
               </div>
               <h2 className="text-xl font-bold text-[#3F2965]">Cancellation Policy</h2>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
               <p className="text-xs text-orange-800 leading-relaxed font-medium flex gap-2">
                 <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                 Users cannot cancel bookings within this window to prevent late slot consumption.
               </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3F2965]/60 uppercase mb-2">Lock Window (Hours)</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F2965]/30" size={18} />
                <input 
                  type="number"
                  value={settings.cancellationHours}
                  onChange={(e) => setSettings({...settings, cancellationHours: e.target.value})}
                  className="w-full pl-11 bg-gray-50 border border-gray-200 rounded-xl p-3.5 font-bold text-[#3F2965] focus:outline-none focus:border-[#Dd1764] focus:bg-white transition-all text-sm"
                  placeholder="24"
                />
              </div>
              <p className="text-[10px] text-[#3F2965]/50 mt-2 font-bold uppercase tracking-wider">
                Example: 24 = No cancellation if less than 24h left
              </p>
            </div>
          </div>

          <div className="md:col-span-2 pt-4">
            <button 
              type="submit" 
              disabled={saving}
              className="w-full py-4 bg-[#Dd1764] hover:bg-[#b01350] text-white rounded-xl font-bold shadow-lg shadow-[#Dd1764]/20 transition-all flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Save Configuration
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminSettingsPage;