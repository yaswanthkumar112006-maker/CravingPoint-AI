/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  User as UserIcon, 
  ShoppingBag, 
  Flame, 
  Compass, 
  Award,
  Sparkles,
  Heart,
  TrendingUp
} from "lucide-react";
import { apiService } from "../services/api";
import { User, Order } from "../types";
import { ProfileCard } from "../components/ProfileCard";

interface ProfileProps {
  onBackToHome: () => void;
  onChangeTab: (tab: string) => void;
}

export function Profile({ onBackToHome, onChangeTab }: ProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalDishes, setTotalDishes] = useState(0);

  const loadUserData = async () => {
    const usr = apiService.getCurrentUser();
    setUser(usr);

    try {
      const ords = await apiService.getUserOrders();
      setOrders(ords);

      const count = ords.reduce((acc, o) => {
        return acc + o.items.reduce((sum, item) => sum + item.quantity, 0);
      }, 0);
      setTotalDishes(count);
    } catch (err) {
      console.error("Failed to load user statistics:", err);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleUpdateProfile = async (updatedUser: User) => {
    try {
      const res = await apiService.updateProfile(updatedUser);
      setUser(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    onChangeTab("Login");
  };

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#E23744] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 font-bold text-xs">Loading profile metrics...</p>
      </div>
    );
  }

  return (
    <div id="cp-profile-page" className="pb-24 animate-fade-in font-sans min-h-screen text-left">
      
      {/* Title Header */}
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#E23744] font-bold block">
              User Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center space-x-2.5">
              <UserIcon className="w-7 h-7 text-[#E23744]" />
              <span>Account & Settings</span>
            </h1>
          </div>

          <button
            onClick={onBackToHome}
            className="text-xs font-bold text-gray-700 hover:text-[#E23744] flex items-center space-x-1.5 border border-gray-200 bg-gray-50 hover:bg-white px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Restaurants</span>
          </button>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Profile Card (cols 5) */}
          <div className="lg:col-span-5">
            <ProfileCard
              user={user}
              onUpdate={handleUpdateProfile}
              onLogout={handleLogout}
            />
          </div>

          {/* Right Column: Bento Statistics & Badges (cols 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Bento statistics tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="bg-white border border-gray-100 p-5 rounded-3xl space-y-2 shadow-xs">
                <div className="w-9 h-9 bg-red-50 text-[#E23744] rounded-2xl flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Orders</span>
                  <span className="text-2xl font-black text-gray-950 font-mono">{orders.length}</span>
                  <span className="text-[11px] text-gray-500 font-medium block">Completed orders</span>
                </div>
              </div>

              <div className="bg-white border border-gray-100 p-5 rounded-3xl space-y-2 shadow-xs">
                <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Dishes Tasted</span>
                  <span className="text-2xl font-black text-gray-950 font-mono">{totalDishes}</span>
                  <span className="text-[11px] text-gray-500 font-medium block">Total food items</span>
                </div>
              </div>

              <div className="bg-white border border-gray-100 p-5 rounded-3xl space-y-2 shadow-xs">
                <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Membership</span>
                  <span className="text-lg font-black text-emerald-700">Gold Foodie</span>
                  <span className="text-[11px] text-gray-500 font-medium block">Priority delivery</span>
                </div>
              </div>

            </div>

            {/* Quick Actions & Preferences Card */}
            <div className="bg-white border border-gray-100 p-6 rounded-3xl space-y-4 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">
                Quick Shortcuts
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => onChangeTab("Orders")}
                  className="p-4 rounded-2xl bg-gray-50 hover:bg-red-50 hover:border-red-200 border border-gray-200 transition-all text-left space-y-1 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 group-hover:text-[#E23744]">Track Active Orders</span>
                    <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-[#E23744]" />
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium">View live satellite progress and courier contact</p>
                </button>

                <button
                  onClick={() => onChangeTab("Cart")}
                  className="p-4 rounded-2xl bg-gray-50 hover:bg-red-50 hover:border-red-200 border border-gray-200 transition-all text-left space-y-1 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 group-hover:text-[#E23744]">View Current Basket</span>
                    <ShoppingBag className="w-4 h-4 text-gray-400 group-hover:text-[#E23744]" />
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium">Apply promo vouchers and review items</p>
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
