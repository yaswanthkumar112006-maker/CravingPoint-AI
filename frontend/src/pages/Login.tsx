/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Flame, 
  KeyRound, 
  User, 
  ArrowRight, 
  AlertCircle,
  Sparkles
} from "lucide-react";
import { apiService } from "../services/api";
import { showToast } from "../components/common/Toast";

interface LoginProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
}

export function Login({ onLoginSuccess, onGoToRegister }: LoginProps) {
  const [username, setUsername] = useState("john_doe");
  const [password, setPassword] = useState("password123");
  const [errorStatus, setErrorStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorStatus("Please enter your credentials.");
      return;
    }

    setIsSubmitting(true);
    setErrorStatus("");
    try {
      await apiService.login(username, password);
      showToast(`Welcome back, ${username}!`, "success");
      onLoginSuccess();
    } catch (err: any) {
      setErrorStatus(err.message || "Invalid credentials. Try 'john_doe'.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = () => {
    setUsername("john_doe");
    setPassword("password123");
    setErrorStatus("");
  };

  return (
    <div id="cp-login-page" className="min-h-screen flex items-center justify-center px-4 py-16 animate-fade-in font-sans select-none text-left">
      
      <div className="w-full max-w-md bg-white border border-gray-200/90 rounded-3xl overflow-hidden shadow-xl flex flex-col">
        
        {/* Banner header */}
        <div className="bg-gradient-to-tr from-gray-950 via-gray-900 to-gray-950 text-white p-8 text-center space-y-3 relative">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#E23744] to-[#FF6838] rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Flame className="w-7 h-7 text-white fill-white" />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Craving<span className="text-[#E23744]">Point</span>
            </h2>
            <p className="text-xs text-gray-400 max-w-xs mx-auto font-medium mt-1">
              Sign in to your account to order favorite meals and track deliveries.
            </p>
          </div>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} className="p-7 sm:p-8 space-y-4">
          
          {errorStatus && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3.5 rounded-xl flex items-start space-x-2 animate-pulse">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorStatus}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Username</label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. john_doe"
                className="w-full text-xs py-2.5 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E23744] focus:bg-white font-semibold text-gray-800"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
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

          {/* 1-click Demo credentials pill */}
          <div className="bg-red-50/60 p-3 rounded-xl border border-red-100 flex items-center justify-between text-xs">
            <div className="text-[11px] text-gray-600">
              <span className="font-bold text-[#E23744]">Demo Account:</span> john_doe
            </div>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="text-[11px] font-bold text-[#E23744] hover:text-[#D02B38] underline cursor-pointer"
            >
              Autofill
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#E23744] hover:bg-[#D02B38] text-white font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md shadow-red-500/20 active:scale-98 flex items-center justify-center space-x-2 cursor-pointer mt-2"
          >
            <span>{isSubmitting ? "Signing in..." : "Log In"}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>

        {/* Switch to Register */}
        <div className="p-6 text-center text-xs text-gray-500 font-medium bg-gray-50 border-t border-gray-100">
          <span>Don't have an account?</span>{" "}
          <button
            onClick={onGoToRegister}
            className="text-[#E23744] font-bold hover:underline"
          >
            Create one here
          </button>
        </div>

      </div>

    </div>
  );
}
