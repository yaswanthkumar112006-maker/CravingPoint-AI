/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Clock, Instagram, Facebook, Twitter, ShieldCheck, Flame, Heart } from "lucide-react";

interface FooterProps {
  onChangeTab?: (tab: string) => void;
}

export function Footer({ onChangeTab }: FooterProps) {
  return (
    <footer id="cp-footer" className="bg-white text-gray-800 pt-16 pb-12 border-t border-gray-100 select-none text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div 
              className="flex items-center space-x-2.5 cursor-pointer group" 
              onClick={() => onChangeTab?.("Home")}
            >
              <div className="w-8 h-8 bg-gradient-to-tr from-[#E23744] to-[#FF6838] rounded-xl flex items-center justify-center shadow-sm">
                <Flame className="w-4.5 h-4.5 text-white fill-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900">
                Craving<span className="text-[#E23744]">Point</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              Delivering handcrafted dishes, fresh daily regional specials, and hygienic food partnerships with real-time tracking precision.
            </p>
            <div className="flex items-center space-x-2 pt-1">
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 hover:bg-[#E23744] hover:text-white text-gray-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 hover:bg-[#E23744] hover:text-white text-gray-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 hover:bg-[#E23744] hover:text-white text-gray-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900">Discover</h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-600">
              <li>
                <button 
                  onClick={() => onChangeTab?.("Home")} 
                  className="hover:text-[#E23744] cursor-pointer transition-colors"
                >
                  Nearby Restaurants
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onChangeTab?.("Cart")} 
                  className="hover:text-[#E23744] cursor-pointer transition-colors"
                >
                  My Basket
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onChangeTab?.("Orders")} 
                  className="hover:text-[#E23744] cursor-pointer transition-colors"
                >
                  Live Order Tracker
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onChangeTab?.("Profile")} 
                  className="hover:text-[#E23744] cursor-pointer transition-colors"
                >
                  User Account
                </button>
              </li>
            </ul>
          </div>

          {/* Quality & Safety */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900">Food Safety</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-gray-900">100% Certified Hygiene</h5>
                  <p className="text-gray-500 text-[11px] leading-snug">Kitchen audits & tamper-evident safety packaging.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5 text-xs">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-gray-900">Express Delivery</h5>
                  <p className="text-gray-500 text-[11px] leading-snug">Average delivery time under 25 minutes.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900">Join Craving Club</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              Receive special deals, chef highlights, and discount vouchers directly in your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-1.5">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-gray-50 border border-gray-200 text-xs text-gray-800 rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-[#E23744] placeholder:text-gray-400 font-medium"
              />
              <button
                type="submit"
                className="bg-[#E23744] hover:bg-[#D02B38] text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 shadow-xs"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p className="text-center sm:text-left font-medium">
            © 2026 CravingPoint Technologies Pvt. Ltd. Crafted with fresh ingredients.
          </p>
          <div className="flex space-x-5 font-semibold">
            <a href="#" className="hover:text-[#E23744]">Privacy</a>
            <a href="#" className="hover:text-[#E23744]">Terms</a>
            <a href="#" className="hover:text-[#E23744]">Contact</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
