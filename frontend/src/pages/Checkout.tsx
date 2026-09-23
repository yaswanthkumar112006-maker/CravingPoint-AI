/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  MapPin, 
  CheckCircle2, 
  Truck, 
  ArrowLeft, 
  Wallet, 
  Lock, 
  ShieldCheck, 
  Plus, 
  QrCode,
  Banknote
} from "lucide-react";
import { apiService } from "../services/api";
import { User, Cart, Order } from "../types";
import { CartSummary } from "../components/CartSummary";
import { showToast } from "../components/common/Toast";

interface CheckoutProps {
  onBackToCart: () => void;
  onOrderPlacedSuccessfully: () => void;
  onChangeTab: (tab: string) => void;
}

export function Checkout({ onBackToCart, onOrderPlacedSuccessfully, onChangeTab }: CheckoutProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(apiService.getCurrentUser());
  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<string[]>([]);
  
  // Checkout States
  const [selectedAddress, setSelectedAddress] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState("COD"); // COD, UPI, CARD
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function loadData() {
      const user = apiService.getCurrentUser();
      setCurrentUser(user);
      
      const cartData = await apiService.getCart();
      setCart(cartData);

      if (user) {
        const saved = user.savedAddresses || [];
        setAddresses(saved);
        if (user.address) {
          setSelectedAddress(user.address);
        } else if (saved.length > 0) {
          setSelectedAddress(saved[0]);
        }
      }
    }
    loadData();
  }, []);

  const handlePlaceOrderSubmit = async () => {
    const finalAddress = useCustomAddress ? customAddress : selectedAddress;
    
    if (!finalAddress.trim()) {
      showToast("Please provide a valid delivery address", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await apiService.placeOrder(finalAddress.trim(), paymentMethod);
      setPlacedOrder(order);
      showToast("Order placed successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed placing the order", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessAcknowledge = () => {
    onOrderPlacedSuccessfully();
  };

  // 1. SUCCESS VIEW
  if (placedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in font-sans select-none min-h-screen flex flex-col justify-center">
        
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md border border-emerald-200">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#E23744] font-black">
            Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-none">
            Your Meal is Cooking!
          </h1>
          <p className="text-xs text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
            Order Reference code is <span className="font-mono text-gray-900 font-extrabold">#CP-{placedOrder.id}</span>. We've dispatched notifications to the kitchen.
          </p>
        </div>

        {/* Invoice snippet */}
        <div className="bg-white border border-gray-200 p-5 rounded-3xl space-y-3 shadow-xs text-left max-w-md mx-auto text-xs text-gray-800">
          <div className="flex justify-between font-bold border-b border-gray-100 pb-2.5">
            <span className="text-gray-500">Invoice Amount</span>
            <span className="text-[#E23744] font-black font-mono">₹{placedOrder.grandTotal}</span>
          </div>
          <div className="flex justify-between font-bold pb-2.5 border-b border-gray-100">
            <span className="text-gray-500">Payment Method</span>
            <span className="text-emerald-700 font-bold uppercase">{placedOrder.paymentMethod}</span>
          </div>
          <div className="font-bold pt-1">
            <span className="text-gray-400 font-bold block mb-1 text-[10px] uppercase tracking-wider">Delivery Destination:</span>
            <span className="text-gray-800 font-medium leading-relaxed">{placedOrder.deliveryAddress}</span>
          </div>
        </div>

        <button
          onClick={handleSuccessAcknowledge}
          className="bg-[#E23744] hover:bg-[#D02B38] text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl transition-all shadow-md shadow-red-500/25 flex items-center justify-center space-x-2 mx-auto active:scale-95 cursor-pointer"
        >
          <Truck className="w-4 h-4 text-white animate-bounce" />
          <span>Track Live Delivery</span>
        </button>

      </div>
    );
  }

  // 2. CHECKOUT VIEW
  return (
    <div id="cp-checkout-page" className="pb-24 animate-fade-in font-sans min-h-screen text-left">
      
      {/* Title Header */}
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#E23744] font-bold block">
              Final Step
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center space-x-2.5">
              <Lock className="w-6 h-6 text-[#E23744]" />
              <span>Secure Checkout</span>
            </h1>
          </div>

          <button
            onClick={onBackToCart}
            className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center space-x-1.5 border border-gray-200 bg-gray-50 hover:bg-white px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Basket</span>
          </button>
        </div>
      </section>

      {/* Main Checkout Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Details (cols 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Address Selection */}
            <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#E23744]" />
                  <span>1. Select Delivery Address</span>
                </h3>
              </div>

              {/* Saved addresses list */}
              <div className="space-y-3">
                {addresses.map((addr, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start space-x-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      !useCustomAddress && selectedAddress === addr
                        ? "border-[#E23744] bg-red-50/40 ring-2 ring-[#E23744]/10"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryAddress"
                      checked={!useCustomAddress && selectedAddress === addr}
                      onChange={() => {
                        setSelectedAddress(addr);
                        setUseCustomAddress(false);
                      }}
                      className="mt-1 text-[#E23744] focus:ring-[#E23744]"
                    />
                    <div className="text-xs space-y-0.5">
                      <span className="font-extrabold text-gray-900 block">
                        Address {idx + 1}
                      </span>
                      <span className="text-gray-600 font-medium leading-relaxed block">
                        {addr}
                      </span>
                    </div>
                  </label>
                ))}

                {/* Custom Address Option */}
                <label
                  className={`flex items-start space-x-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    useCustomAddress
                      ? "border-[#E23744] bg-red-50/40 ring-2 ring-[#E23744]/10"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryAddress"
                    checked={useCustomAddress}
                    onChange={() => setUseCustomAddress(true)}
                    className="mt-1 text-[#E23744] focus:ring-[#E23744]"
                  />
                  <div className="text-xs flex-1 space-y-1.5">
                    <span className="font-extrabold text-gray-900 block">
                      Deliver to a new location
                    </span>
                    {useCustomAddress && (
                      <textarea
                        placeholder="Enter full flat number, street name, landmarks..."
                        rows={2}
                        className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#E23744] font-medium resize-none text-gray-800"
                        value={customAddress}
                        onChange={(e) => setCustomAddress(e.target.value)}
                      />
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* 2. Payment Method Selection */}
            <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center space-x-2">
                  <Wallet className="w-4 h-4 text-[#E23744]" />
                  <span>2. Select Payment Method</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* COD */}
                <label
                  className={`flex flex-col p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    paymentMethod === "COD"
                      ? "border-[#E23744] bg-red-50/40 ring-2 ring-[#E23744]/10"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="text-[#E23744] focus:ring-[#E23744]"
                    />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-gray-900 block">Cash on Delivery</span>
                    <span className="text-[10px] text-gray-400 font-medium">Pay on doorstep delivery</span>
                  </div>
                </label>

                {/* UPI */}
                <label
                  className={`flex flex-col p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    paymentMethod === "UPI"
                      ? "border-[#E23744] bg-red-50/40 ring-2 ring-[#E23744]/10"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <QrCode className="w-5 h-5 text-indigo-600" />
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === "UPI"}
                      onChange={() => setPaymentMethod("UPI")}
                      className="text-[#E23744] focus:ring-[#E23744]"
                    />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-gray-900 block">UPI / QR Code</span>
                    <span className="text-[10px] text-gray-400 font-medium">Google Pay, PhonePe, Paytm</span>
                  </div>
                </label>

                {/* Cards */}
                <label
                  className={`flex flex-col p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    paymentMethod === "CARD"
                      ? "border-[#E23744] bg-red-50/40 ring-2 ring-[#E23744]/10"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <CreditCard className="w-5 h-5 text-amber-600" />
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CARD"
                      checked={paymentMethod === "CARD"}
                      onChange={() => setPaymentMethod("CARD")}
                      className="text-[#E23744] focus:ring-[#E23744]"
                    />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-gray-900 block">Credit / Debit Card</span>
                    <span className="text-[10px] text-gray-400 font-medium">Visa, Mastercard, RuPay</span>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* Right Summary (cols 5) */}
          <div className="lg:col-span-5 sticky top-24">
            {cart && (
              <CartSummary
                cart={cart}
                onPlaceOrder={handlePlaceOrderSubmit}
                checkoutBtnText={isSubmitting ? "Placing Order..." : "Place Order & Pay"}
              />
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
