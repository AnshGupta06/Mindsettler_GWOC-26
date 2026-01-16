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
    <div className="min-h-screen bg-[#F9F6FF] pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        
        {}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#3F2965] flex items-center gap-3">
              <SettingsIcon className="text-[#Dd1764]" /> Global Configuration
            </h1>
            <p className="text-[#3F2965]/60 mt-1">Manage pricing schemes and booking policies</p>
          </div>
          <button 
            onClick={() => router.push("/admin")}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#3F2965] font-bold rounded-full hover:bg-gray-50 transition-colors border border-[#3F2965]/10 shadow-sm"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-6">
          
          {}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#3F2965]/5 space-y-6">
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
                className="w-full bg-[#F9F6FF] border border-[#3F2965]/10 rounded-xl p-4 font-bold text-[#3F2965] focus:outline-none focus:ring-2 focus:ring-[#Dd1764]"
                placeholder="1499"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-[#3F2965]/60 uppercase mb-2">Follow-up Session (₹)</label>
              <input 
                type="number"
                value={settings.priceFollowUp}
                onChange={(e) => setSettings({...settings, priceFollowUp: e.target.value})}
                className="w-full bg-[#F9F6FF] border border-[#3F2965]/10 rounded-xl p-4 font-bold text-[#3F2965] focus:outline-none focus:ring-2 focus:ring-[#Dd1764]"
                placeholder="999"
              />
            </div>
          </div>

          {}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#3F2965]/5 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
               <div className="p-2 bg-red-50 rounded-lg text-red-600">
                 <ShieldAlert size={24} />
               </div>
               <h2 className="text-xl font-bold text-[#3F2965]">Cancellation Policy</h2>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
               <p className="text-xs text-orange-800 leading-relaxed font-medium">
                 <ShieldAlert size={14} className="inline mr-1" />
                 Users will be prevented from cancelling if the session is within this window. This prevents "slot consumption" without payment.
               </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3F2965]/60 uppercase mb-2">Lock Window (Hours)</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F2965]/30" size={20} />
                <input 
                  type="number"
                  value={settings.cancellationHours}
                  onChange={(e) => setSettings({...settings, cancellationHours: e.target.value})}
                  className="w-full pl-12 bg-[#F9F6FF] border border-[#3F2965]/10 rounded-xl p-4 font-bold text-[#3F2965] focus:outline-none focus:ring-2 focus:ring-[#Dd1764]"
                  placeholder="24"
                />
              </div>
              <p className="text-[10px] text-[#3F2965]/50 mt-2 font-bold uppercase tracking-wider">
                Example: 24 = Cannot cancel if less than 24h left
              </p>
            </div>
          </div>

          {}
          <div className="md:col-span-2">
            <button 
              type="submit" 
              disabled={saving}
              className="w-full py-4 bg-[#Dd1764] hover:bg-[#b01350] text-white rounded-2xl font-bold shadow-lg shadow-[#Dd1764]/20 transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save />}
              Save Configuration
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminSettingsPage;