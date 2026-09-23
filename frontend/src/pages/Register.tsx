/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Flame, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  AlertCircle,
  KeyRound
} from "lucide-react";
import { apiService } from "../services/api";
import { showToast } from "../components/common/Toast";

interface RegisterProps {
  onRegisterSuccess: () => void;
  onGoToLogin: () => void;
}

export function Register({ onRegisterSuccess, onGoToLogin }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  
  const [errorStatus, setErrorStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !phone.trim() || !address.trim() || !password.trim()) {
      setErrorStatus("Please fill in all registration fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorStatus("");

    try {
      await apiService.register(
        username.trim(), 
        email.trim(), 
        phone.trim(), 
        address.trim()
      );
      showToast(`Account created! Welcome, ${username}!`, "success");
      onRegisterSuccess();
    } catch (err: any) {
      setErrorStatus(err.message || "Failed registering user. Try an alternative username or email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="cp-register-page" className="min-h-screen flex items-center justify-center px-4 py-16 animate-fade-in font-sans select-none text-left">
      
      <div className="w-full max-w-md bg-white border border-gray-200/90 rounded-3xl overflow-hidden shadow-xl flex flex-col">
        
        {/* Banner header */}
        <div className="bg-gradient-to-tr from-gray-950 via-gray-900 to-gray-950 text-white p-7 text-center space-y-2 relative">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#E23744] to-[#FF6838] rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Flame className="w-7 h-7 text-white fill-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Create Account</h2>
          <p className="text-xs text-gray-400 max-w-xs mx-auto font-medium">
            Join CravingPoint to receive discount vouchers and track deliveries live.
          </p>
        </div>

        {/* Input Rows */}
        <form onSubmit={handleSubmit} className="p-7 space-y-3.5">
          
          {errorStatus && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3.5 rounded-xl flex items-start space-x-2 animate-pulse">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorStatus}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Username</label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. foodlover_99"
                className="w-full text-xs py-2.5 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E23744] focus:bg-white font-semibold text-gray-800"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-gray-400" />
              <input
                type="email"
                placeholder="e.g. foodie@example.com"
                className="w-full text-xs py-2.5 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E23744] focus:bg-white font-semibold text-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Phone Number</label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. 9876543210"
                className="w-full text-xs py-2.5 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E23744] focus:bg-white font-semibold text-gray-800"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Default Delivery Address</label>
            <div className="relative flex items-start">
              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <textarea
                placeholder="e.g. Flat 402, Green Towers, Hitech City..."
                rows={2}
                className="w-full text-xs py-2.5 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E23744] focus:bg-white font-semibold text-gray-800 resize-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Password</label>
            <div className="relative flex items-center">
              <KeyRound className="absolute left-3.5 w-4 h-4 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full text-xs py-2.5 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E23744] focus:bg-white font-semibold text-gray-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#E23744] hover:bg-[#D02B38] text-white font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md shadow-red-500/20 active:scale-98 flex items-center justify-center space-x-2 cursor-pointer mt-3"
          >
            <span>{isSubmitting ? "Creating account..." : "Create Account"}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>

        {/* Switch to Login */}
        <div className="p-6 text-center text-xs text-gray-500 font-medium bg-gray-50 border-t border-gray-100">
          <span>Already registered?</span>{" "}
          <button
            onClick={onGoToLogin}
            className="text-[#E23744] font-bold hover:underline"
          >
            Log in here
          </button>
        </div>

      </div>

    </div>
  );
}
