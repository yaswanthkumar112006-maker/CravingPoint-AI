/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Receipt, Ticket, ShieldCheck, ArrowRight, Check, X } from "lucide-react";
import { Cart } from "../types";
import { showToast } from "./common/Toast";

interface CartSummaryProps {
  cart: Cart;
  onPlaceOrder?: () => void;
  checkoutBtnText?: string;
  isInteractivePromo?: boolean;
}

export function CartSummary({ 
  cart, 
  onPlaceOrder, 
  checkoutBtnText = "Proceed to Checkout", 
  isInteractivePromo = true 
}: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState("");
  const [discountValue, setDiscountValue] = useState(0);

  const handleApplyPromo = () => {
    setPromoError("");
    const uppercaseCode = promoCode.trim().toUpperCase();
    
    if (uppercaseCode === "CRAVING50") {
      if (cart.subtotal < 159) {
        setPromoError("Minimum item order for CRAVING50 is ₹159.");
        return;
      }
      const discount = Math.min(Math.round(cart.subtotal * 0.5), 100);
      setDiscountValue(discount);
      setAppliedPromo("CRAVING50");
      showToast("Coupon CRAVING50 applied! Saved ₹" + discount, "success");
    } else if (uppercaseCode === "FREE_DEL") {
      if (cart.subtotal < 199) {
        setPromoError("Minimum item order for FREE_DEL is ₹199.");
        return;
      }
      setDiscountValue(cart.deliveryFee);
      setAppliedPromo("FREE_DEL");
      showToast("Coupon FREE_DEL applied! Free Delivery unlocked", "success");
    } else if (uppercaseCode === "EATSTAR") {
      if (cart.subtotal < 499) {
        setPromoError("Minimum item order for EATSTAR is ₹499.");
        return;
      }
      setDiscountValue(100);
      setAppliedPromo("EATSTAR");
      showToast("Coupon EATSTAR applied! Saved ₹100", "success");
    } else {
      setPromoError("Invalid code. Try 'CRAVING50' or 'FREE_DEL'.");
    }
  };

  const clearPromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setDiscountValue(0);
    showToast("Coupon removed", "info");
  };

  const subtotalWithTaxes = cart.subtotal + cart.deliveryFee + cart.tax;
  const finalGrandTotal = Math.max(0, subtotalWithTaxes - discountValue);

  return (
    <div id="cp-cart-summary" className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm divide-y divide-gray-100 space-y-5 select-none text-left">
      
      {/* Header */}
      <div className="pb-1">
        <h3 className="text-base font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
          <Receipt className="w-5 h-5 text-[#E23744]" />
          <span>Bill Details</span>
        </h3>
        <p className="text-xs text-gray-400 mt-0.5 font-medium">Verified transparent billing summary</p>
      </div>

      {/* Promo Code section */}
      {isInteractivePromo && (
        <div className="py-4 space-y-2.5">
          <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider">
            Apply Coupon Voucher
          </label>
          
          {!appliedPromo ? (
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter promo code (e.g. CRAVING50)"
                className="w-full text-xs font-mono uppercase border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50 focus:outline-none focus:border-[#E23744] focus:bg-white transition-all font-semibold placeholder:normal-case placeholder:font-sans placeholder:text-gray-400"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                disabled={!promoCode.trim()}
                className="bg-[#E23744] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#D02B38] transition-all disabled:opacity-40 cursor-pointer shadow-xs active:scale-95 shrink-0"
              >
                Apply
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-800">
              <span className="flex items-center space-x-1.5">
                <Ticket className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Coupon <strong>{appliedPromo}</strong> applied</span>
              </span>
              <button
                type="button"
                onClick={clearPromo}
                className="text-red-600 hover:text-red-700 text-[11px] uppercase font-extrabold p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {promoError && (
            <p className="text-[11px] font-semibold text-red-600 mt-1">{promoError}</p>
          )}

          {!appliedPromo && (
            <div className="flex items-center space-x-2 pt-1">
              <span className="text-[10px] text-gray-400 font-medium">Try codes:</span>
              <button 
                type="button"
                onClick={() => { setPromoCode("CRAVING50"); }}
                className="text-[10px] font-mono font-bold text-[#E23744] bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded border border-red-200"
              >
                CRAVING50
              </button>
              <button 
                type="button"
                onClick={() => { setPromoCode("FREE_DEL"); }}
                className="text-[10px] font-mono font-bold text-[#E23744] bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded border border-red-200"
              >
                FREE_DEL
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bill Breakdowns */}
      <div className="py-4 space-y-2.5 text-xs">
        <div className="flex items-center justify-between text-gray-600 font-medium">
          <span>Item Total</span>
          <span className="font-semibold text-gray-800">₹{cart.subtotal}</span>
        </div>

        <div className="flex items-center justify-between text-gray-600 font-medium">
          <span className="flex items-center space-x-1.5">
            <span>Delivery Fee</span>
            {cart.subtotal > 299 && (
              <span className="bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded">
                FREE
              </span>
            )}
          </span>
          <span className={`font-semibold ${cart.subtotal > 299 ? "line-through text-gray-400" : "text-gray-800"}`}>
            ₹{cart.subtotal > 299 ? 40 : cart.deliveryFee}
          </span>
        </div>

        <div className="flex items-center justify-between text-gray-600 font-medium">
          <span>GST and Restaurant Charges (5%)</span>
          <span className="font-semibold text-gray-800">₹{cart.tax}</span>
        </div>

        {discountValue > 0 && (
          <div className="flex items-center justify-between text-emerald-700 font-bold bg-emerald-50/80 p-2 rounded-xl border border-dashed border-emerald-200">
            <span>Coupon Discount</span>
            <span>- ₹{discountValue}</span>
          </div>
        )}
      </div>

      {/* Total section */}
      <div className="pt-4 space-y-4">
        <div className="flex items-center justify-between text-gray-900 font-black text-base">
          <span>To Pay</span>
          <span className="text-xl sm:text-2xl text-gray-950 font-mono">₹{finalGrandTotal}</span>
        </div>

        {/* Safety Disclaimer */}
        <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl flex items-start space-x-2.5 text-[11px] text-gray-500 leading-snug">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>Sterilized packaging & temperature-verified delivery partners guaranteed.</span>
        </div>

        {onPlaceOrder && (
          <button
            type="button"
            onClick={onPlaceOrder}
            className="w-full bg-[#E23744] hover:bg-[#D02B38] text-white font-extrabold text-sm py-4 rounded-2xl shadow-lg shadow-red-500/25 hover:shadow-red-500/35 transition-all active:scale-98 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{checkoutBtnText}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

    </div>
  );
}
