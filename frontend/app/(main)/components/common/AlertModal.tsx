"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Lock, AlertTriangle, CheckCircle, AlertCircle, Ban } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  
  page?: string; 
  
  
  type?: "AUTH" | "CONFIRM" | "SUCCESS" | "ERROR" | "BLOCKED";
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  isLoading?: boolean;
}

export default function AlertModal({ 
  isOpen, 
  onClose, 
  page,
  type = "AUTH", 
  title,
  message,
  actionLabel,
  onAction,
  isLoading = false
}: AuthModalProps) {

  const config = {
    AUTH: {
      icon: <Lock className="w-8 h-8 text-[#3F2965]" />,
      bg: "bg-[#F9F6FF]",
      title: "Login Required",
      btnColor: "bg-[#Dd1764]",
      btnText: "Log In / Sign Up",
      showCancel: true
    },
    CONFIRM: {
      icon: <AlertTriangle className="w-8 h-8 text-amber-600" />,
      bg: "bg-amber-50",
      title: title || "Are you sure?",
      btnColor: "bg-red-600 hover:bg-red-700",
      btnText: actionLabel || "Yes, Cancel",
      showCancel: true
    },
    SUCCESS: {
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      bg: "bg-green-50",
      title: title || "Success!",
      btnColor: "bg-green-600 hover:bg-green-700",
      btnText: "Okay, Got it",
      showCancel: false
    },
    ERROR: {
      icon: <AlertCircle className="w-8 h-8 text-red-600" />,
      bg: "bg-red-50",
      title: title || "Error",
      btnColor: "bg-[#3F2965]",
      btnText: "Close",
      showCancel: false
    },
    BLOCKED: {
      icon: <Ban className="w-8 h-8 text-red-600" />,
      bg: "bg-red-50",
      title: "Account Restricted",
      btnColor: "bg-[#3F2965]",
      btnText: "Contact Support",
      showCancel: true
    }
  };

  const currentConfig = config[type];

  
  const renderAuthMessage = () => {
    if (page === "book") {
      return "To book a personalized session and track your healing journey, please log in to your MindSettler account.";
    }
    return "Please log in to continue accessing your dashboard.";
  };

  const renderMessage = () => {
    if (message) return message;
    if (type === "AUTH") return renderAuthMessage();
    if (type === "BLOCKED") return "Your account has been temporarily restricted due to policy violations. Please contact support for assistance.";
    return "";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8 text-center"
          >
            {}
            {!isLoading && type !== 'SUCCESS' && (
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}

            {}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${currentConfig.bg}`}>
              {currentConfig.icon}
            </div>

            {}
            <h2 className="text-2xl font-bold text-[#3F2965] mb-3">
              {type === "AUTH" ? currentConfig.title : title || currentConfig.title}
            </h2>
            
            <p className="text-[#3F2965]/70 mb-8 leading-relaxed whitespace-pre-line">
              {renderMessage()}
            </p>

            {}
            <div className="flex flex-col gap-3">
              {type === "AUTH" ? (
                
                <Link href="/login" onClick={onClose}>
                  <button className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform ${currentConfig.btnColor}`}>
                    {currentConfig.btnText}
                  </button>
                </Link>
              ) : type === "BLOCKED" ? (
                
                <Link href="/contact" onClick={onClose}>
                   <button className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform ${currentConfig.btnColor}`}>
                    {currentConfig.btnText}
                  </button>
                </Link>
              ) : (
                
                <button 
                  onClick={onAction || onClose}
                  disabled={isLoading}
                  className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 ${currentConfig.btnColor} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    currentConfig.btnText
                  )}
                </button>
              )}
              
              {}
              {currentConfig.showCancel && !isLoading && (
                <button 
                  onClick={onClose}
                  className="w-full py-3.5 rounded-xl border-2 border-gray-100 text-gray-500 font-semibold hover:border-gray-200 hover:text-gray-700 transition-colors"
                >
                  {type === "BLOCKED" ? "Go Back" : "Cancel"}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}