import React from "react";

interface VegBadgeProps {
  isVeg: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const VegBadge: React.FC<VegBadgeProps> = ({ isVeg, size = "md", showLabel = false }) => {
  const sizeMap = {
    sm: { box: "w-3.5 h-3.5 p-0.5", dot: "w-1.5 h-1.5", text: "text-[10px]" },
    md: { box: "w-4 h-4 p-0.5", dot: "w-2 h-2", text: "text-xs" },
    lg: { box: "w-5 h-5 p-0.5", dot: "w-2.5 h-2.5", text: "text-sm" },
  };

  const { box, dot, text } = sizeMap[size];

  return (
    <div className="inline-flex items-center space-x-1.5 select-none">
      <div
        className={`${box} rounded-[4px] border flex items-center justify-center shrink-0 ${
          isVeg
            ? "border-emerald-600 bg-white"
            : "border-red-700 bg-white"
        }`}
        title={isVeg ? "Pure Veg" : "Non-Veg"}
      >
        <div
          className={`${dot} rounded-full ${
            isVeg ? "bg-emerald-600" : "bg-red-700"
          }`}
        />
      </div>
      {showLabel && (
        <span
          className={`font-semibold ${text} ${
            isVeg ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {isVeg ? "Veg" : "Non-Veg"}
        </span>
      )}
    </div>
  );
};
