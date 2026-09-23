/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ChevronRight, 
  Utensils, 
  MessageSquare,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { apiService } from "../services/api";
import { Cart as CartType } from "../types";
import { CartSummary } from "../components/CartSummary";
import { VegBadge } from "../components/common/VegBadge";
import { showToast } from "../components/common/Toast";

interface CartProps {
  onBackToExplore: () => void;
  onProceedToCheckout: () => void;
  onChangeTab: (tab: string) => void;
}

export function Cart({ onBackToExplore, onProceedToCheckout, onChangeTab }: CartProps) {
  const [cart, setCart] = useState<CartType | null>(null);
  const [loading, setLoading] = useState(true);
  const [cookingInstructions, setCookingInstructions] = useState("");
  const [noCutlery, setNoCutlery] = useState(false);

  const loadCartData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCart();
      setCart(data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartData();
  }, []);

  const handleUpdateQuantity = async (menuItemId: number, change: number) => {
    try {
      const updated = await apiService.updateCartItemQuantity(menuItemId, change);
      setCart(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveItem = async (menuItemId: number) => {
    try {
      const updated = await apiService.removeCartItem(menuItemId);
      setCart(updated);
      showToast("Item removed from basket", "info");
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearCart = async () => {
    try {
      const empty = await apiService.clearCart();
      setCart(empty);
      showToast("Cart cleared", "info");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#E23744] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 font-bold text-xs">Loading basket items...</p>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div id="cp-cart-page" className="pb-24 animate-fade-in font-sans min-h-screen text-left">
      
      {/* Title Header */}
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#E23744] font-bold block">
              Order Review
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center space-x-2.5">
              <ShoppingBag className="w-7 h-7 text-[#E23744]" />
              <span>Checkout Basket</span>
            </h1>
          </div>

          <button
            onClick={onBackToExplore}
            className="text-xs font-extrabold text-gray-700 hover:text-[#E23744] flex items-center space-x-1.5 border border-gray-200 bg-gray-50 hover:bg-white shadow-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Add More Dishes</span>
          </button>
        </div>
      </section>

      {/* Main Layout */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {isEmpty ? (
          <div className="max-w-md mx-auto text-center py-20 bg-white border border-gray-200 rounded-3xl space-y-5 shadow-xs p-8">
            <div className="w-20 h-20 bg-red-50 text-[#E23744] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-gray-900">Your Basket is Empty</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto font-medium leading-relaxed">
                Good food is always waiting for you! Explore our curated restaurants and add your favorite dishes.
              </p>
            </div>
            <button
              onClick={onBackToExplore}
              className="bg-[#E23744] hover:bg-[#D02B38] text-white text-xs font-black px-6 py-3.5 rounded-2xl transition-all shadow-md shadow-red-500/20 flex items-center space-x-1.5 mx-auto cursor-pointer"
            >
              <span>Explore Restaurants</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Items Column (cols 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Items Card */}
              <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center space-x-2">
                    <Utensils className="w-4 h-4 text-[#E23744]" />
                    <span>Selected Items ({cart.items.reduce((acc, i) => acc + i.quantity, 0)})</span>
                  </h2>

                  <button
                    onClick={handleClearCart}
                    className="text-xs font-bold text-gray-400 hover:text-red-600 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {cart.items.map((item) => (
                    <div key={item.menuItem.id} className="py-4 flex items-center justify-between gap-3 group">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="mt-0.5">
                          <VegBadge isVeg={item.menuItem.isVeg} size="sm" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-gray-900 leading-tight">
                            {item.menuItem.name}
                          </h4>
                          <span className="text-xs font-mono font-bold text-gray-500">
                            ₹{item.menuItem.price} each
                          </span>
                        </div>
                      </div>

                      {/* Quantity buttons & item total */}
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-100 border border-gray-200 rounded-xl flex items-center space-x-2 px-2.5 py-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.menuItem.id, -1)}
                            className="text-gray-600 hover:text-[#E23744] transition-colors p-0.5"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-mono font-black text-gray-900 min-w-[14px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.menuItem.id, 1)}
                            className="text-gray-600 hover:text-[#E23744] transition-colors p-0.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-sm font-mono font-black text-gray-900 min-w-[50px] text-right">
                          ₹{item.menuItem.price * item.quantity}
                        </span>

                        <button
                          onClick={() => handleRemoveItem(item.menuItem.id)}
                          className="text-gray-300 hover:text-red-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cooking Instructions & Cutlery Preferences */}
              <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">
                  Special Instructions
                </h3>

                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    placeholder="e.g. Less spicy, keep extra tissues, leave at gate..."
                    rows={2}
                    className="w-full text-xs pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#E23744] font-medium resize-none text-gray-800"
                    value={cookingInstructions}
                    onChange={(e) => setCookingInstructions(e.target.value)}
                  />
                </div>

                <label className="flex items-center space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={noCutlery}
                    onChange={(e) => setNoCutlery(e.target.checked)}
                    className="w-4 h-4 rounded text-[#E23744] focus:ring-[#E23744] border-gray-300"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-gray-800 block">Opt-out of plastic cutlery</span>
                    <span className="text-gray-400">Help us reduce plastic waste. Thank you for going green!</span>
                  </div>
                </label>
              </div>

            </div>

            {/* Right Summary Column (cols 5) */}
            <div className="lg:col-span-5 sticky top-24">
              <CartSummary
                cart={cart}
                onPlaceOrder={onProceedToCheckout}
                checkoutBtnText="Proceed to Checkout"
              />
            </div>

          </div>
        )}
      </section>

    </div>
  );
}
