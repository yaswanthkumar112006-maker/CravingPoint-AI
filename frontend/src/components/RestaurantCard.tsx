/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Star, Clock, Heart, Award } from "lucide-react";
import { Restaurant } from "../types";
import { VegBadge } from "./common/VegBadge";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  // Determine rating badge color
  const getRatingBgColor = (rating: number) => {
    if (rating >= 4.5) return "bg-emerald-700 text-white";
    if (rating >= 4.0) return "bg-emerald-600 text-white";
    if (rating >= 3.5) return "bg-amber-600 text-white";
    return "bg-gray-600 text-white";
  };

  const getOfferText = (id: number) => {
    switch (id) {
      case 101: return "50% OFF UP TO ₹100";
      case 102: return "FREE DELIVERY ON 1ST ORDER";
      case 103: return "FLAT ₹125 OFF ABOVE ₹399";
      case 104: return "20% EXTRA CASHBACK";
      case 105: return "HEALTHY MEALS 15% OFF";
      default: return "SPECIAL CRAVING DEALS";
    }
  };

  return (
    <div 
      id={`restaurant-card-${restaurant.id}`}
      onClick={onClick}
      className="group bg-white rounded-3xl border border-gray-100/90 overflow-hidden card-elevation-hover shadow-sm flex flex-col justify-between cursor-pointer select-none relative"
    >
      {/* Top badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {restaurant.featured ? (
          <span className="bg-white/95 backdrop-blur-md shadow-sm text-gray-900 text-[10px] uppercase font-mono font-extrabold px-2.5 py-1 rounded-full flex items-center space-x-1 border border-gray-200">
            <Award className="w-3 h-3 text-[#E23744]" />
            <span>Featured</span>
          </span>
        ) : <span />}

        {restaurant.isVeg && (
          <div className="bg-white/95 backdrop-blur-md px-2 py-1 rounded-full shadow-sm border border-emerald-100">
            <VegBadge isVeg={true} size="sm" showLabel={true} />
          </div>
        )}
      </div>

      {/* Image Container */}
      <div className="w-full aspect-[16/10] overflow-hidden bg-gray-100 relative">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {/* Soft bottom shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Swiggy/Zomato style discount ribbon */}
        <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-end justify-between">
          <div className="text-white font-extrabold text-xs sm:text-sm tracking-tight drop-shadow-md flex flex-col">
            <span className="text-amber-400 font-mono text-[9px] uppercase font-black tracking-wider">Offer</span>
            <span className="truncate max-w-[200px]">{getOfferText(restaurant.id)}</span>
          </div>

          <div className="bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg shrink-0">
            {restaurant.distance} km
          </div>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-extrabold text-gray-900 tracking-tight leading-snug group-hover:text-[#E23744] transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            
            {/* Rating Badge */}
            <div className={`shrink-0 flex items-center space-x-1 text-xs font-black px-2 py-0.5 rounded-lg shadow-xs ${getRatingBgColor(restaurant.rating)}`}>
              <Star className="w-3 h-3 fill-current" />
              <span>{restaurant.rating}</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 font-medium line-clamp-1">
            {restaurant.cuisine}
          </p>

          <p className="text-[11px] text-gray-400 font-medium line-clamp-1">
            {restaurant.address}
          </p>
        </div>

        {/* Separator line */}
        <div className="h-[1px] w-full bg-gray-100" />

        {/* Metadata Footer */}
        <div className="flex items-center justify-between text-xs text-gray-600 font-semibold pt-0.5">
          <div className="flex items-center space-x-1.5 text-gray-800">
            <Clock className="w-3.5 h-3.5 text-[#E23744]" />
            <span>{restaurant.deliveryTime} mins</span>
          </div>

          <span className="text-gray-300">•</span>

          <div>
            <span>₹{restaurant.costForTwo} for two</span>
          </div>

          <span className="text-gray-300">•</span>

          <div className="text-[11px] text-gray-400">
            {restaurant.reviewCount}+ ratings
          </div>
        </div>
      </div>
    </div>
  );
};
