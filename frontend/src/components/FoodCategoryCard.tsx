/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { FoodCategory } from "../types";

interface FoodCategoryCardProps {
  category: FoodCategory;
  isSelected?: boolean;
  onClick?: () => void;
}

export const FoodCategoryCard: React.FC<FoodCategoryCardProps> = ({ 
  category, 
  isSelected = false, 
  onClick 
}) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center space-y-2 cursor-pointer group select-none shrink-0"
    >
      <div 
        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden transition-all duration-300 transform group-hover:scale-105 group-active:scale-95 flex items-center justify-center p-0.5 ${
          isSelected 
            ? "ring-4 ring-[#E23744] shadow-md scale-105" 
            : "ring-2 ring-transparent group-hover:ring-gray-300 shadow-sm"
        }`}
      >
        <img
          src={category.imageUrl}
          alt={category.name}
          className="w-full h-full object-cover rounded-full"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </div>
      <span 
        className={`text-xs font-bold tracking-tight transition-colors ${
          isSelected 
            ? "text-[#E23744]" 
            : "text-gray-700 group-hover:text-gray-900"
        }`}
      >
        {category.name}
      </span>
    </div>
  );
};
