/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Clock, 
  Inbox, 
  Compass, 
  Flame, 
  History, 
  CheckCircle2, 
  Package
} from "lucide-react";
import { apiService } from "../services/api";
import { Order, OrderStatus } from "../types";
import { OrderCard } from "../components/OrderCard";
import { SkeletonOrderCard } from "../components/common/SkeletonLoader";

interface OrdersProps {
  onExploreMoreRestaurants: () => void;
  onChangeTab: (tab: string) => void;
}

export function Orders({ onExploreMoreRestaurants, onChangeTab }: OrdersProps) {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const orders = await apiService.getUserOrders();
      
      const active = orders.filter(
        o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED
      );
      const past = orders.filter(
        o => o.status === OrderStatus.DELIVERED || o.status === OrderStatus.CANCELLED
      );

      setActiveOrders(active);
      setPastOrders(past);
    } catch (err) {
      console.error("Failed fetching orders list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const handleOrderUpdate = () => {
      fetchOrders();
    };

    window.addEventListener("orders-updated", handleOrderUpdate);
    return () => {
      window.removeEventListener("orders-updated", handleOrderUpdate);
    };
  }, []);

  const handleRepeatOrder = async (order: Order) => {
    try {
      for (const item of order.items) {
        await apiService.addToCart(item.menuItem);
      }
      onChangeTab("Cart");
    } catch (err) {
      console.error("Failed repeating order", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <SkeletonOrderCard />
        <SkeletonOrderCard />
      </div>
    );
  }

  const hasNoOrders = activeOrders.length === 0 && pastOrders.length === 0;

  return (
    <div id="cp-orders-page" className="pb-24 animate-fade-in font-sans min-h-screen text-left">
      
      {/* Title Header */}
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#E23744] font-bold block">
              Order Activity
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center space-x-2.5">
              <Clock className="w-7 h-7 text-[#E23744]" />
              <span>My Orders</span>
            </h1>
          </div>

          <button
            onClick={onExploreMoreRestaurants}
            className="text-xs font-bold text-gray-700 hover:text-[#E23744] flex items-center space-x-1.5 border border-gray-200 bg-gray-50 hover:bg-white px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Food</span>
          </button>
        </div>
      </section>

      {/* Main Body */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {hasNoOrders ? (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-3xl space-y-5 max-w-md mx-auto shadow-xs p-8">
            <div className="w-20 h-20 bg-red-50 text-[#E23744] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Package className="w-10 h-10" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-gray-900">No Orders Placed Yet</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto font-medium leading-relaxed">
                You haven't ordered any delicious food yet. Check out top rated restaurants near you!
              </p>
            </div>
            <button
              onClick={onExploreMoreRestaurants}
              className="bg-[#E23744] hover:bg-[#D02B38] text-white text-xs font-black px-6 py-3 rounded-2xl transition-all shadow-md shadow-red-500/20 flex items-center space-x-1.5 mx-auto cursor-pointer"
            >
              <Compass className="w-4 h-4 text-white" />
              <span>Explore Restaurants</span>
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            
            {/* Active Live Tracking Orders */}
            {activeOrders.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E23744] animate-ping" />
                  <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                    Live Active Delivery ({activeOrders.length})
                  </h2>
                </div>

                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onRepeatOrder={handleRepeatOrder}
                      onReviewSubmitted={fetchOrders}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past Orders History */}
            {pastOrders.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
                  <History className="w-4 h-4 text-gray-500" />
                  <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                    Past Completed Orders ({pastOrders.length})
                  </h2>
                </div>

                <div className="space-y-4">
                  {pastOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onRepeatOrder={handleRepeatOrder}
                      onReviewSubmitted={fetchOrders}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </section>

    </div>
  );
}
