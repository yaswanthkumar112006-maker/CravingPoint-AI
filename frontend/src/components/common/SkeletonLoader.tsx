import React from "react";

export const SkeletonRestaurantCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex flex-col justify-between">
      <div className="w-full aspect-[4/3] animate-shimmer" />
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-3/5 rounded-lg animate-shimmer" />
          <div className="h-5 w-12 rounded-lg animate-shimmer" />
        </div>
        <div className="h-3.5 w-4/5 rounded-md animate-shimmer" />
        <div className="h-3 w-1/2 rounded-md animate-shimmer" />
        <div className="h-[1px] w-full bg-gray-100 my-2" />
        <div className="flex justify-between">
          <div className="h-3.5 w-1/4 rounded-md animate-shimmer" />
          <div className="h-3.5 w-1/4 rounded-md animate-shimmer" />
          <div className="h-3.5 w-1/4 rounded-md animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonMenuItem: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-start justify-between gap-4">
      <div className="flex-1 space-y-2.5">
        <div className="w-4 h-4 rounded animate-shimmer" />
        <div className="h-5 w-1/2 rounded-lg animate-shimmer" />
        <div className="h-4 w-20 rounded-md animate-shimmer" />
        <div className="h-3.5 w-4/5 rounded-md animate-shimmer" />
      </div>
      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl animate-shimmer shrink-0" />
    </div>
  );
};

export const SkeletonOrderCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1.5">
          <div className="h-3 w-20 rounded animate-shimmer" />
          <div className="h-5 w-40 rounded-lg animate-shimmer" />
        </div>
        <div className="h-7 w-28 rounded-full animate-shimmer" />
      </div>
      <div className="h-16 w-full rounded-2xl animate-shimmer" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-4 w-32 rounded animate-shimmer" />
        <div className="h-9 w-24 rounded-xl animate-shimmer" />
      </div>
    </div>
  );
};
