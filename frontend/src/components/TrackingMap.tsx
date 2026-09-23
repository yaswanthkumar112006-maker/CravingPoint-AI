/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { MapPin, Truck, Store, Compass, Shield, Navigation, Phone, MessageSquare } from "lucide-react";
import { Order, OrderStatus, DeliveryPartner } from "../types";

interface TrackingMapProps {
  order?: Order;
  deliveryPartner?: DeliveryPartner;
  orderStatus?: OrderStatus;
  deliveryAddress?: string;
  restaurantName?: string;
}

export const TrackingMap: React.FC<TrackingMapProps> = ({ 
  order, 
  deliveryPartner: propPartner,
  orderStatus: propStatus,
  restaurantName = "Swarnamukhii Kitchen" 
}) => {
  const [riderProgress, setRiderProgress] = useState(40);
  const [contactResult, setContactResult] = useState<string | null>(null);

  const partner = propPartner || order?.deliveryPartner;
  const status = propStatus || order?.status || OrderStatus.OUT_FOR_DELIVERY;

  const pathPoints = [
    { x: 40, y: 150, label: "Restaurant Kitchen" },
    { x: 120, y: 150, label: "Baker's Junction" },
    { x: 120, y: 50, label: "High Street Overpass" },
    { x: 260, y: 50, label: "Tech Park Circle" },
    { x: 260, y: 140, label: "Green Towers Main Gate" },
    { x: 350, y: 140, label: "Your Doorstep" }
  ];

  const getBaseProgress = (st: OrderStatus) => {
    switch (st) {
      case OrderStatus.PLACED:
      case OrderStatus.CONFIRMED:
        return 0;
      case OrderStatus.PREPARING:
        return 10;
      case OrderStatus.OUT_FOR_DELIVERY:
        return 55;
      case OrderStatus.DELIVERED:
        return 100;
      default:
        return 0;
    }
  };

  useEffect(() => {
    const base = getBaseProgress(status);
    if (status === OrderStatus.OUT_FOR_DELIVERY) {
      setRiderProgress(40);
      const interval = setInterval(() => {
        setRiderProgress((prev) => {
          if (prev >= 95) return 40;
          return prev + 1.2;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setRiderProgress(base);
    }
  }, [status]);

  const getPointAlongPath = (progressPercent: number) => {
    const t = Math.min(Math.max(progressPercent / 100, 0), 1);
    const segmentsCount = pathPoints.length - 1;
    const rawIdx = t * segmentsCount;
    const idx = Math.min(Math.floor(rawIdx), segmentsCount - 1);
    const segmentT = rawIdx - idx;

    const start = pathPoints[idx];
    const end = pathPoints[idx + 1];

    return {
      x: start.x + (end.x - start.x) * segmentT,
      y: start.y + (end.y - start.y) * segmentT
    };
  };

  const riderPos = getPointAlongPath(riderProgress);

  const getTrackingMessage = () => {
    switch (status) {
      case OrderStatus.PLACED:
        return "Waiting for restaurant to confirm your kitchen order...";
      case OrderStatus.CONFIRMED:
        return "Order confirmed. Kitchen chef is assembling fresh ingredients.";
      case OrderStatus.PREPARING:
        return `${partner?.name || "Delivery Valet"} has arrived at the restaurant and is waiting for packing.`;
      case OrderStatus.OUT_FOR_DELIVERY:
        return `${partner?.name || "Delivery Valet"} is on the way with your hot meal!`;
      case OrderStatus.DELIVERED:
        return "Delivered! Your food has arrived. Bon appétit!";
      default:
        return "Connecting to live telemetry...";
    }
  };

  return (
    <div className="bg-gray-50/90 border border-gray-200/90 rounded-3xl p-4 sm:p-5 space-y-4 animate-fade-in font-sans select-none text-left">
      
      {/* Contact modal banner */}
      {contactResult && (
        <div className="bg-gray-900 text-white p-3.5 rounded-2xl animate-fade-in text-xs space-y-1.5 flex flex-col shadow-md">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] text-gray-400 uppercase font-bold">Valet Channel</span>
            <button 
              onClick={() => setContactResult(null)}
              className="text-white hover:text-gray-200 text-[10px] font-bold underline"
            >
              Dismiss
            </button>
          </div>
          <p className="font-medium leading-relaxed">{contactResult}</p>
        </div>
      )}

      {/* Header telemetry info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-gray-200/70">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#E23744]">
            <Compass className="w-3.5 h-3.5 animate-spin" />
            <span>Live Satellite Route</span>
          </div>
          <div className="flex items-center space-x-2">
            <h4 className="text-xs font-black text-gray-900">
              {partner ? `Valet: ${partner.name}` : "Assigning nearby rider..."}
            </h4>
            
            {partner && (
              <div className="flex items-center space-x-1.5 ml-2">
                <button
                  onClick={() => setContactResult(`📞 Connecting secure masked voice call with ${partner.name} (+91 98765-XXXXX)...`)}
                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 transition-colors"
                  title="Call Valet"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setContactResult(`💬 ${partner.name}: "Hello! I have picked up your warm order and will reach in 8 minutes."`)}
                  className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors"
                  title="Message Valet"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[10px] font-mono font-bold bg-white px-2.5 py-1 rounded-xl border border-gray-200 shadow-xs">
          <Shield className="w-3 h-3 text-emerald-600" />
          <span className="text-gray-500">Live GPS: </span>
          <span className="text-emerald-700">ONLINE</span>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative bg-[#E8ECE9] border-2 border-white rounded-2xl overflow-hidden shadow-inner h-[180px] w-full">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
          <defs>
            <pattern id="grid-map" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-map)" />

          {/* Streets */}
          <path d="M 0 40 L 400 40 M 0 110 L 400 110 M 0 170 L 400 170" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="8" />
          <path d="M 90 0 L 90 200 M 200 0 L 200 200 M 310 0 L 310 200" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="8" />

          {/* Base Route */}
          <polyline 
            points={pathPoints.map(p => `${p.x},${p.y}`).join(" ")}
            fill="none" 
            stroke="#16A34A" 
            strokeWidth="4" 
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-30"
          />

          {/* Active animated trail */}
          <polyline 
            points={pathPoints.map(p => `${p.x},${p.y}`).join(" ")}
            fill="none" 
            stroke="#E23744" 
            strokeWidth="3.5" 
            strokeDasharray="8,8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* 1. RESTAURANT PIN */}
        <div 
          className="absolute flex flex-col items-center select-none"
          style={{ left: `${pathPoints[0].x - 14}px`, top: `${pathPoints[0].y - 22}px` }}
        >
          <div className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center shadow-md">
            <Store className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[8px] font-extrabold text-emerald-900 bg-white/95 px-1 py-0.5 rounded shadow-xs mt-0.5 whitespace-nowrap">
            {restaurantName}
          </span>
        </div>

        {/* 2. CUSTOMER PIN */}
        <div 
          className="absolute flex flex-col items-center select-none"
          style={{ left: `${pathPoints[pathPoints.length - 1].x - 14}px`, top: `${pathPoints[pathPoints.length - 1].y - 22}px` }}
        >
          <div className="w-7 h-7 rounded-full bg-[#E23744] border-2 border-white flex items-center justify-center shadow-md animate-bounce">
            <MapPin className="w-3.5 h-3.5 text-white fill-current" />
          </div>
          <span className="text-[8px] font-extrabold text-gray-900 bg-white/95 px-1 py-0.5 rounded shadow-xs mt-0.5 whitespace-nowrap">
            Delivery Spot
          </span>
        </div>

        {/* 3. DYNAMIC RIDER */}
        {status !== OrderStatus.CANCELLED && (
          <div 
            className="absolute transition-all duration-1000 ease-out z-20 flex flex-col items-center pointer-events-none"
            style={{ left: `${riderPos.x - 14}px`, top: `${riderPos.y - 18}px` }}
          >
            <div className="w-7 h-7 rounded-full bg-gray-900 border-2 border-white flex items-center justify-center shadow-lg ring-2 ring-red-500/30">
              <Truck className="w-3.5 h-3.5 text-white animate-pulse" />
            </div>
            <div className="bg-gray-900 text-[8px] text-white font-mono font-bold py-0.5 px-1.5 rounded-full mt-0.5 shadow">
              VALET
            </div>
          </div>
        )}
      </div>

      {/* Progress Message */}
      <div className="bg-white border border-gray-200/80 p-3.5 rounded-2xl flex items-start space-x-3 shadow-xs">
        <div className="p-2 bg-red-50 rounded-xl border border-red-100 shrink-0">
          <Truck className="w-4 h-4 text-[#E23744]" />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-gray-800 leading-snug">
            {getTrackingMessage()}
          </p>
          {status === OrderStatus.OUT_FOR_DELIVERY && (
            <p className="text-[11px] text-gray-500 font-medium">
              ETA: <span className="font-extrabold text-gray-900">~10 mins</span> | Distance: <span className="font-extrabold text-emerald-700">1.2 km away</span>
            </p>
          )}
        </div>
      </div>

    </div>
  );
};
