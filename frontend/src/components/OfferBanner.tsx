/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Tag, Copy, Check, Sparkles } from "lucide-react";
import { Offer } from "../types";
import { showToast } from "./common/Toast";

interface OfferBannerProps {
  offer: Offer;
  onApply?: (offerCode: string) => void;
}

export const OfferBanner: React.FC<OfferBannerProps> = ({ offer, onApply }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(offer.code);
    setCopied(true);
    showToast(`Coupon code ${offer.code} copied!`, "success");
    setTimeout(() => setCopied(false), 2000);
    if (onApply) {
      onApply(offer.code);
    }
  };

  return (
    <div 
      className="relative flex-shrink-0 w-80 sm:w-96 rounded-3xl overflow-hidden card-elevation-hover shadow-sm border border-gray-100 flex flex-col justify-between p-5 text-white select-none group cursor-pointer"
      onClick={handleCopy}
    >
      {/* Background image & gradient */}
      <img
        src={offer.bgImageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80"}
        alt={offer.code}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        referrerPolicy="no-referrer"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-900/80 to-transparent" />

      {/* Content */}
      <div className="relative z-10 space-y-2">
        <div className="inline-flex items-center space-x-1.5 bg-[#E23744] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          <span>Special Offer</span>
        </div>
        <h4 className="text-xl font-black tracking-tight leading-tight drop-shadow-sm">
          {offer.discountMessage}
        </h4>
        <p className="text-xs text-gray-300 font-medium leading-relaxed line-clamp-2 max-w-[220px]">
          {offer.description}
        </p>
      </div>

      {/* Code & CTA pill */}
      <div className="relative z-10 mt-6 flex items-center justify-between gap-3">
        <div className="bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl flex items-center space-x-2">
          <Tag className="w-3.5 h-3.5 text-amber-300" />
          <span className="font-mono text-xs font-black tracking-wider uppercase">
            {offer.code}
          </span>
        </div>

        <button 
          type="button" 
          onClick={handleCopy}
          className="text-xs font-extrabold bg-white text-gray-900 hover:bg-gray-100 px-3.5 py-1.5 rounded-xl transition-all shadow-sm flex items-center space-x-1"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-gray-500" />
              <span>Tap to Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
