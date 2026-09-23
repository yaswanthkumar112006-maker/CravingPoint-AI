/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Clock, 
  CheckCircle2, 
  Truck, 
  Utensils, 
  RefreshCw, 
  Star, 
  Map, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  Receipt,
  User
} from "lucide-react";
import { Order, OrderStatus } from "../types";
import { apiService } from "../services/api";
import { TrackingMap } from "./TrackingMap";
import { VegBadge } from "./common/VegBadge";
import { showToast } from "./common/Toast";

interface OrderCardProps {
  order: Order;
  onRepeatOrder?: (order: Order) => void;
  onReviewSubmitted?: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onRepeatOrder, onReviewSubmitted }) => {
  const [showMap, setShowMap] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  // Status color badges
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PLACED:
        return { bg: "bg-blue-50 border-blue-200 text-blue-700", label: "Order Placed" };
      case OrderStatus.CONFIRMED:
        return { bg: "bg-indigo-50 border-indigo-200 text-indigo-700", label: "Confirmed" };
      case OrderStatus.PREPARING:
        return { bg: "bg-amber-50 border-amber-200 text-amber-800", label: "Cooking in Kitchen" };
      case OrderStatus.OUT_FOR_DELIVERY:
        return { bg: "bg-orange-50 border-orange-200 text-orange-800", label: "Out for Delivery" };
      case OrderStatus.DELIVERED:
        return { bg: "bg-emerald-50 border-emerald-200 text-emerald-800", label: "Delivered" };
      case OrderStatus.CANCELLED:
        return { bg: "bg-red-50 border-red-200 text-red-700", label: "Cancelled" };
      default:
        return { bg: "bg-gray-100 border-gray-200 text-gray-700", label: status };
    }
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PLACED: return 1;
      case OrderStatus.CONFIRMED: return 2;
      case OrderStatus.PREPARING: return 3;
      case OrderStatus.OUT_FOR_DELIVERY: return 4;
      case OrderStatus.DELIVERED: return 5;
      default: return 0;
    }
  };

  const steps = [
    { label: "Placed", icon: CheckCircle2 },
    { label: "Confirmed", icon: CheckCircle2 },
    { label: "Cooking", icon: Utensils },
    { label: "Delivering", icon: Truck },
    { label: "Delivered", icon: CheckCircle2 }
  ];

  const stepIndex = getStatusStepIndex(order.status);
  const isLive = order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.CANCELLED;

  // Resolve restaurant name for order
  const getRestaurantInfo = () => {
    if (!order.items || order.items.length === 0) return { id: 101, name: "CravingPoint Partner" };
    
    const targetItemId = order.items[0].menuItem.id;
    const menuMapStr = localStorage.getItem("cp_menu_items");
    const restListStr = localStorage.getItem("cp_restaurants");
    
    if (menuMapStr && restListStr) {
      try {
        const menuMap = JSON.parse(menuMapStr);
        const restList = JSON.parse(restListStr);
        
        for (const [restIdStr, items] of Object.entries(menuMap)) {
          if (Array.isArray(items) && items.some((item: any) => item.id === targetItemId)) {
            const restId = parseInt(restIdStr, 10);
            const foundRest = restList.find((r: any) => r.id === restId);
            return {
              id: restId,
              name: foundRest ? foundRest.name : "CravingPoint Partner"
            };
          }
        }
      } catch (err) {
        console.error("Failed parsing metadata", err);
      }
    }
    
    return { id: 101, name: "Swarnamukhii Multicuisine" };
  };

  const restaurantInfo = getRestaurantInfo();

  // Check if reviewed
  const reviewedOrders: number[] = JSON.parse(localStorage.getItem("cp_reviewed_orders") || "[]");
  const isReviewed = reviewedOrders.includes(order.id);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !restaurantInfo.id) return;

    setIsSubmittingReview(true);
    try {
      await apiService.addReview(restaurantInfo.id, newRating, newComment.trim());
      
      const updatedList = [...reviewedOrders, order.id];
      localStorage.setItem("cp_reviewed_orders", JSON.stringify(updatedList));
      
      setReviewSuccess(true);
      setNewComment("");
      showToast("Thank you for your rating & feedback!", "success");
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to submit review", "error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleReorderClick = async () => {
    setIsRepeating(true);
    try {
      if (onRepeatOrder) {
        await onRepeatOrder(order);
      }
      showToast(`Items from Order #${order.id} added to cart!`, "success");
    } catch (err) {
      console.error(err);
    } finally {
      setIsRepeating(false);
    }
  };

  const badge = getStatusBadge(order.status);
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 card-elevation-1 space-y-5 select-none text-left">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
              {restaurantInfo.name}
            </h4>
            <span className="text-xs font-mono font-bold text-gray-400">
              #CP-{order.id}
            </span>
          </div>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Placed on {formattedDate}
          </p>
        </div>

        {/* Status Badge */}
        <div className={`px-3 py-1 rounded-full text-xs font-black border flex items-center space-x-1.5 ${badge.bg}`}>
          {isLive && <span className="w-2 h-2 rounded-full bg-current animate-pulse" />}
          <span>{badge.label}</span>
        </div>
      </div>

      {/* Progress timeline for live orders */}
      {isLive && (
        <div className="bg-gray-50/80 p-4 sm:p-5 rounded-2xl border border-gray-100 space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-gray-600">
            <span>Live Order Progress</span>
            <span className="text-[#E23744] font-mono">Estimated delivery: ~20 mins</span>
          </div>

          <div className="grid grid-cols-5 gap-1 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isPassed = stepIndex >= idx + 1;
              const isCurrent = stepIndex === idx + 1;

              return (
                <div key={idx} className="flex flex-col items-center space-y-1 text-center">
                  <div 
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                      isPassed 
                        ? "bg-[#E23744] text-white shadow-sm" 
                        : "bg-gray-200 text-gray-400"
                    } ${isCurrent ? "ring-4 ring-red-100 scale-110" : ""}`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className={`text-[10px] sm:text-xs font-bold ${
                    isPassed ? "text-gray-900 font-extrabold" : "text-gray-400 font-medium"
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Delivery Partner snippet */}
          {order.deliveryPartner && (
            <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-gray-900">{order.deliveryPartner.name}</div>
                  <div className="text-[11px] text-gray-500 font-medium">Valet Partner ({order.deliveryPartner.vehicleNo})</div>
                </div>
              </div>
              <button
                onClick={() => setShowMap(!showMap)}
                className="text-xs font-bold text-[#E23744] hover:text-[#D02B38] flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
              >
                <Map className="w-3.5 h-3.5" />
                <span>{showMap ? "Hide Map" : "Live Map"}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Live tracking map drawer */}
      {showMap && order.deliveryPartner && (
        <div className="animate-fade-in">
          <TrackingMap 
            deliveryPartner={order.deliveryPartner}
            orderStatus={order.status}
            deliveryAddress={order.deliveryAddress}
          />
        </div>
      )}

      {/* Items list */}
      <div className="space-y-2.5">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">
          Items Ordered ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
        </span>
        <div className="space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <VegBadge isVeg={item.menuItem.isVeg} size="sm" />
                <span className="font-semibold text-gray-800">{item.menuItem.name}</span>
                <span className="text-gray-400 font-bold">× {item.quantity}</span>
              </div>
              <span className="font-mono font-bold text-gray-900">₹{item.priceAtOrder * item.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Footer & Actions */}
      <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-xs text-gray-500">
            Total Paid: <span className="text-base font-black text-gray-950 font-mono">₹{order.grandTotal}</span>
          </div>
          <div className="text-[11px] text-gray-400 font-medium">
            via {order.paymentMethod} • <span className="text-emerald-600 font-bold">{order.paymentStatus}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 w-full sm:w-auto">
          {/* Review button for delivered orders */}
          {order.status === OrderStatus.DELIVERED && !isReviewed && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="flex-1 sm:flex-none text-xs font-bold text-gray-700 hover:text-gray-900 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1.5"
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{showReviewForm ? "Close Review" : "Rate Food"}</span>
            </button>
          )}

          {isReviewed && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Reviewed</span>
            </span>
          )}

          {/* Reorder Button */}
          {onRepeatOrder && (
            <button
              onClick={handleReorderClick}
              disabled={isRepeating}
              className="flex-1 sm:flex-none bg-[#E23744] hover:bg-[#D02B38] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-red-500/20 active:scale-95 flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRepeating ? "animate-spin" : ""}`} />
              <span>Reorder</span>
            </button>
          )}
        </div>
      </div>

      {/* Inline Review Drawer */}
      {showReviewForm && (
        <form onSubmit={handleReviewSubmit} className="pt-4 border-t border-gray-100 space-y-3 bg-gray-50 p-4 rounded-2xl animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-900">Rate your experience</span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= newRating ? "text-amber-500 fill-amber-500" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <textarea
            placeholder="Share your thoughts on the taste, packaging, and portion size..."
            rows={2}
            className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#E23744] font-medium resize-none text-gray-800"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="text-xs font-bold text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingReview || !newComment.trim()}
              className="bg-[#E23744] text-white text-xs font-bold px-4 py-1.5 rounded-xl hover:bg-[#D02B38] disabled:opacity-40"
            >
              {isSubmittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
