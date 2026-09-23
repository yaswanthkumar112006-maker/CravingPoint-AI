/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  User, 
  MapPin, 
  LogOut, 
  Clock, 
  Search, 
  Menu, 
  X,
  Flame,
  ChevronDown
} from "lucide-react";
import { apiService } from "../services/api";

interface NavbarProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  onSearch?: (query: string) => void;
}

export function Navbar({ currentTab, onChangeTab, onSearch }: NavbarProps) {
  const [cartCount, setCartCount] = useState(0);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [currentUser, setCurrentUser] = useState(apiService.getCurrentUser());
  const [searchVal, setSearchVal] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const updateCartBadge = async () => {
    try {
      const cart = await apiService.getCart();
      const count = cart.items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
      setCartSubtotal(cart.subtotal);
    } catch {
      setCartCount(0);
      setCartSubtotal(0);
    }
  };

  useEffect(() => {
    updateCartBadge();
    const handleCartUpdate = () => {
      updateCartBadge();
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setCurrentUser(apiService.getCurrentUser());
  }, [currentTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchVal);
      onChangeTab("Home");
    }
  };

  const handleLogoutClick = () => {
    apiService.logout();
    setCurrentUser(null);
    onChangeTab("Login");
  };

  return (
    <header 
      id="cp-header" 
      className={`sticky top-0 z-[100] w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100" 
          : "bg-white border-b border-gray-100/80 shadow-xs"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* 1. BRAND LOGO */}
          <div 
            id="cp-logo-container" 
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
            onClick={() => { onChangeTab("Home"); setMobileMenuOpen(false); }}
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-[#E23744] to-[#FF6838] rounded-2xl flex items-center justify-center shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform duration-200">
              <Flame id="logo-icon" className="w-6 h-6 text-white fill-white" />
            </div>
            <div className="text-left font-sans">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 flex items-center">
                Craving<span className="text-[#E23744]">Point</span>
              </span>
              <p className="text-[10px] uppercase font-mono tracking-widest text-gray-400 -mt-1 font-bold">
                Food Delivery
              </p>
            </div>
          </div>

          {/* 2. DELIVERY LOCATION PILL */}
          <div 
            onClick={() => currentUser && onChangeTab("Profile")}
            className="hidden lg:flex items-center space-x-2 text-xs text-gray-600 bg-gray-50/80 hover:bg-gray-100/80 px-3.5 py-2 rounded-2xl border border-gray-200/80 transition-colors cursor-pointer shrink-0 max-w-[260px]"
            title="Click to view delivery address"
          >
            <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5 text-[#E23744]" />
            </div>
            <div className="truncate text-left">
              <div className="flex items-center space-x-1">
                <span className="font-extrabold text-gray-900 text-[11px]">Deliver to</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </div>
              <p className="truncate text-gray-500 text-[11px] font-medium max-w-[180px]">
                {currentUser?.address || "Hitech City, Hyderabad"}
              </p>
            </div>
          </div>

          {/* 3. INLINE SEARCH BAR */}
          {onSearch && (
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative flex-1 max-w-md mx-2">
              <input
                type="text"
                placeholder="Search for restaurants, biryani, pizza, desserts..."
                className="w-full text-xs pl-10 pr-9 py-2.5 bg-gray-50/90 border border-gray-200/80 rounded-2xl focus:outline-none focus:border-[#E23744] focus:ring-2 focus:ring-[#E23744]/10 focus:bg-white transition-all placeholder:text-gray-400 font-medium text-gray-800"
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  onSearch(e.target.value);
                }}
              />
              <Search className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              {searchVal && (
                <button 
                  type="button" 
                  onClick={() => { setSearchVal(""); onSearch(""); }}
                  className="absolute right-3 p-0.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          )}

          {/* 4. NAVIGATION LINKS & ACTIONS */}
          <nav className="hidden md:flex items-center space-x-1.5 lg:space-x-3">
            <button
              onClick={() => onChangeTab("Home")}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${
                currentTab === "Home" 
                  ? "text-[#E23744] bg-red-50/80 font-extrabold" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Explore
            </button>

            {currentUser ? (
              <>
                <button
                  onClick={() => onChangeTab("Orders")}
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
                    currentTab === "Orders" 
                      ? "text-[#E23744] bg-red-50/80 font-extrabold" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Orders</span>
                </button>

                <button
                  onClick={() => onChangeTab("Profile")}
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
                    currentTab === "Profile" 
                      ? "text-[#E23744] bg-red-50/80 font-extrabold" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-700 font-black">
                    {currentUser.username[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="truncate max-w-[90px]">{currentUser.username}</span>
                </button>

                <button
                  onClick={handleLogoutClick}
                  className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2 pl-2">
                <button
                  onClick={() => onChangeTab("Login")}
                  className="text-xs font-bold text-gray-700 hover:text-[#E23744] px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => onChangeTab("Register")}
                  className="bg-[#E23744] hover:bg-[#D02B38] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md hover:shadow-red-500/20 active:scale-95 transition-all"
                >
                  Sign up
                </button>
              </div>
            )}

            {/* Cart Button */}
            <button
              onClick={() => onChangeTab("Cart")}
              className={`relative flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl transition-all font-bold text-xs ${
                currentTab === "Cart"
                  ? "bg-[#E23744] text-white shadow-md shadow-red-500/25"
                  : cartCount > 0
                  ? "bg-gray-900 text-white hover:bg-black shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && currentTab !== "Cart" && (
                  <span className="absolute -top-2 -right-2.5 w-4 h-4 bg-[#E23744] text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white animate-fade-in">
                    {cartCount}
                  </span>
                )}
              </div>
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="opacity-90 font-mono text-[11px] border-l border-white/20 pl-2">
                  ₹{cartSubtotal}
                </span>
              )}
            </button>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => onChangeTab("Cart")}
              className="relative p-2.5 rounded-2xl bg-gray-100 text-gray-700"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E23744] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* MOBILE SEARCH BAR */}
        {onSearch && (
          <div className="pb-3 md:hidden">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search food, restaurants..."
                className="w-full text-xs pl-9 pr-8 py-2.5 bg-gray-100 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#E23744]"
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  onSearch(e.target.value);
                }}
              />
              <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-gray-400" />
              {searchVal && (
                <button 
                  type="button" 
                  onClick={() => { setSearchVal(""); onSearch(""); }}
                  className="absolute right-2.5 top-2.5 p-0.5 text-gray-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>
        )}

      </div>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3 animate-fade-in shadow-xl">
          <div className="py-2 border-b border-gray-100 text-xs text-gray-500 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[#E23744] shrink-0" />
            <span className="truncate">{currentUser?.address || "Hitech City, Hyderabad"}</span>
          </div>

          <button
            onClick={() => { onChangeTab("Home"); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold flex items-center space-x-2 ${
              currentTab === "Home" ? "bg-red-50 text-[#E23744]" : "text-gray-700"
            }`}
          >
            <span>Explore Restaurants</span>
          </button>

          {currentUser ? (
            <>
              <button
                onClick={() => { onChangeTab("Orders"); setMobileMenuOpen(false); }}
                className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold flex items-center space-x-2 ${
                  currentTab === "Orders" ? "bg-red-50 text-[#E23744]" : "text-gray-700"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>My Orders</span>
              </button>

              <button
                onClick={() => { onChangeTab("Profile"); setMobileMenuOpen(false); }}
                className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold flex items-center space-x-2 ${
                  currentTab === "Profile" ? "bg-red-50 text-[#E23744]" : "text-gray-700"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Account Profile ({currentUser.username})</span>
              </button>

              <button
                onClick={() => { handleLogoutClick(); setMobileMenuOpen(false); }}
                className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold text-red-600 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => { onChangeTab("Login"); setMobileMenuOpen(false); }}
                className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700"
              >
                Log In
              </button>
              <button
                onClick={() => { onChangeTab("Register"); setMobileMenuOpen(false); }}
                className="w-full py-2.5 rounded-xl bg-[#E23744] text-white text-sm font-bold shadow-md shadow-red-500/20"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
