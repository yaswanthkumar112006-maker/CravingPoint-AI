/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Star, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Sparkles, 
  ShoppingBag, 
  Award, 
  Check, 
  Search, 
  MessageSquare,
  ThumbsUp,
  Share2,
  Heart
} from "lucide-react";
import { apiService } from "../services/api";
import { Restaurant, MenuItem, Review } from "../types";
import { VegBadge } from "../components/common/VegBadge";
import { SkeletonMenuItem } from "../components/common/SkeletonLoader";
import { showToast } from "../components/common/Toast";

interface RestaurantDetailsProps {
  restaurantId: number;
  onBackToHome: () => void;
  onChangeTab: (tab: string) => void;
}

export function RestaurantDetails({ restaurantId, onBackToHome, onChangeTab }: RestaurantDetailsProps) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cartQuantities, setCartQuantities] = useState<Record<number, number>>({});
  
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<string>("All");
  const [uniqueMenuCategories, setUniqueMenuCategories] = useState<string[]>([]);
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [menuSearch, setMenuSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Review inputs
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmitActive, setIsSubmitActive] = useState(false);

  // Load Restaurant & Menus
  const loadRestaurantData = async () => {
    try {
      setLoading(true);
      const rest = await apiService.getRestaurantById(restaurantId);
      setRestaurant(rest);

      const items = await apiService.getMenuItemsByRestaurant(restaurantId);
      setMenuItems(items);
      setFilteredMenuItems(items);

      const categories = ["All", ...Array.from(new Set(items.map(item => item.category)))];
      setUniqueMenuCategories(categories);

      const revList = await apiService.getReviewsByRestaurant(restaurantId);
      setReviews(revList);

      const cart = await apiService.getCart();
      const quantities: Record<number, number> = {};
      cart.items.forEach(item => {
        quantities[item.menuItem.id] = item.quantity;
      });
      setCartQuantities(quantities);
    } catch (err) {
      console.error("Error loading restaurant details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurantData();
  }, [restaurantId]);

  // Handle filtering
  useEffect(() => {
    let result = [...menuItems];

    if (selectedMenuCategory !== "All") {
      result = result.filter(item => item.category === selectedMenuCategory);
    }

    if (isVegOnly) {
      result = result.filter(item => item.isVeg);
    }

    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q)
      );
    }

    setFilteredMenuItems(result);
  }, [selectedMenuCategory, isVegOnly, menuSearch, menuItems]);

  const handleAddToCart = async (item: MenuItem) => {
    try {
      await apiService.addToCart(item);
      setCartQuantities(prev => ({
        ...prev,
        [item.id]: (prev[item.id] || 0) + 1
      }));
      showToast(`Added ${item.name} to cart!`, "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateQuantity = async (item: MenuItem, change: number) => {
    try {
      const currentQty = cartQuantities[item.id] || 0;
      const nextQty = currentQty + change;
      
      await apiService.updateCartItemQuantity(item.id, change);
      
      setCartQuantities(prev => {
        const copy = { ...prev };
        if (nextQty <= 0) {
          delete copy[item.id];
        } else {
          copy[item.id] = nextQty;
        }
        return copy;
      });

      if (change > 0) {
        showToast(`Increased quantity of ${item.name}`, "info");
      } else if (nextQty === 0) {
        showToast(`Removed ${item.name} from cart`, "info");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitActive(true);
    try {
      await apiService.addReview(restaurantId, newRating, newComment);
      setNewComment("");
      setNewRating(5);
      showToast("Thank you for your review!", "success");
      await loadRestaurantData();
    } catch (err) {
      console.error(err);
      showToast("Failed to submit review", "error");
    } finally {
      setIsSubmitActive(false);
    }
  };

  if (loading || !restaurant) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8 animate-fade-in text-left">
        <div className="h-64 w-full rounded-3xl animate-shimmer" />
        <div className="space-y-4">
          <SkeletonMenuItem />
          <SkeletonMenuItem />
          <SkeletonMenuItem />
        </div>
      </div>
    );
  }

  const totalCartCount = (Object.values(cartQuantities) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div id="cp-restaurant-detail-page" className="pb-28 animate-fade-in font-sans text-left">
      
      {/* 1. RESTAURANT HEADER CARD */}
      <section className="bg-white border-b border-gray-100 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Restaurants</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">
                ID #{restaurant.id}
              </span>
            </div>
          </div>

          {/* Banner & Information */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  {restaurant.name}
                </h1>
                {restaurant.isVeg && (
                  <VegBadge isVeg={true} size="sm" showLabel={true} />
                )}
              </div>

              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                {restaurant.cuisine}
              </p>

              <div className="flex items-center space-x-2 text-xs text-gray-400 font-medium">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{restaurant.address}</span>
              </div>
            </div>

            {/* Quick Metrics Badge Card */}
            <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-4 rounded-2xl shrink-0">
              <div className="text-center px-2">
                <div className="flex items-center justify-center space-x-1 text-emerald-700 font-black text-sm">
                  <Star className="w-4 h-4 fill-emerald-600" />
                  <span>{restaurant.rating}</span>
                </div>
                <div className="text-[10px] text-gray-400 font-bold mt-0.5">{restaurant.reviewCount}+ reviews</div>
              </div>

              <div className="h-8 w-[1px] bg-gray-200" />

              <div className="text-center px-2">
                <div className="flex items-center justify-center space-x-1 text-gray-900 font-black text-sm">
                  <Clock className="w-4 h-4 text-[#E23744]" />
                  <span>{restaurant.deliveryTime} mins</span>
                </div>
                <div className="text-[10px] text-gray-400 font-bold mt-0.5">{restaurant.distance} km away</div>
              </div>

              <div className="h-8 w-[1px] bg-gray-200" />

              <div className="text-center px-2">
                <div className="text-gray-900 font-black text-sm">
                  ₹{restaurant.costForTwo}
                </div>
                <div className="text-[10px] text-gray-400 font-bold mt-0.5">Cost for two</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. MENU SEARCH & CONTROLS */}
      <section className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto scrollbar-hide">
            {uniqueMenuCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedMenuCategory(cat)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedMenuCategory === cat
                    ? "bg-[#E23744] text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search inside menu & Veg switch */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setIsVegOnly(!isVegOnly)}
              className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                isVegOnly
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <VegBadge isVeg={true} size="sm" />
              <span>Veg Only</span>
            </button>

            <div className="relative flex-1 sm:w-48">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search dish..."
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E23744] font-medium"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. MENU ITEMS LIST */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <h2 className="text-lg font-black text-gray-900 tracking-tight">
            Menu Dishes ({filteredMenuItems.length})
          </h2>
          {isVegOnly && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Veg Only Filter Applied
            </span>
          )}
        </div>

        {filteredMenuItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center space-y-2">
            <p className="text-sm font-bold text-gray-700">No dishes found in this category.</p>
            <p className="text-xs text-gray-400">Try switching category or toggling the Veg Only filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMenuItems.map((item) => {
              const qty = cartQuantities[item.id] || 0;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-gray-100 p-4 sm:p-5 card-elevation-hover shadow-xs flex items-start justify-between gap-4 group"
                >
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <VegBadge isVeg={item.isVeg} size="sm" />
                      {item.rating && (
                        <div className="flex items-center space-x-0.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span>{item.rating}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-sm font-black text-gray-900 tracking-tight leading-snug group-hover:text-[#E23744] transition-colors">
                      {item.name}
                    </h3>

                    <div className="text-sm font-mono font-extrabold text-gray-950">
                      ₹{item.price}
                    </div>

                    <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Food Image & Quantity Control */}
                  <div className="relative flex flex-col items-center shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 shadow-xs">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Quantity Pill / ADD button */}
                    <div className="mt-2">
                      {qty === 0 ? (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="bg-white hover:bg-red-50 text-[#E23744] border border-red-200 text-xs font-black px-5 py-1.5 rounded-xl shadow-xs hover:shadow-sm active:scale-95 transition-all flex items-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD</span>
                        </button>
                      ) : (
                        <div className="bg-[#E23744] text-white rounded-xl shadow-sm flex items-center space-x-2 px-2.5 py-1">
                          <button
                            onClick={() => handleUpdateQuantity(item, -1)}
                            className="p-0.5 hover:bg-white/20 rounded transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-xs font-black min-w-[16px] text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item, 1)}
                            className="p-0.5 hover:bg-white/20 rounded transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. REVIEWS & RATINGS SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-6 border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-[#E23744]" />
              <span>Customer Reviews ({reviews.length})</span>
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Verified customer ratings for {restaurant.name}</p>
          </div>
        </div>

        {/* Add Review Form */}
        <form onSubmit={handleReviewSubmit} className="bg-white rounded-3xl border border-gray-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-gray-800">Write a dining review</span>
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
            placeholder="Share details of your food experience, taste notes, and portion sizes..."
            rows={2}
            className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E23744] focus:bg-white font-medium resize-none text-gray-800"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitActive || !newComment.trim()}
              className="bg-[#E23744] hover:bg-[#D02B38] text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-xs disabled:opacity-40"
            >
              {isSubmitActive ? "Submitting..." : "Post Review"}
            </button>
          </div>
        </form>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-gray-400 font-medium italic">No reviews posted yet. Be the first to share your experience!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-red-50 text-[#E23744] font-black text-xs flex items-center justify-center">
                      {rev.username[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-gray-900 block leading-tight">{rev.username}</span>
                      <span className="text-[10px] text-gray-400 font-medium">{rev.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 bg-emerald-50 text-emerald-800 text-[11px] font-black px-2 py-0.5 rounded-md">
                    <Star className="w-3 h-3 fill-emerald-600" />
                    <span>{rev.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 5. STICKY BOTTOM CART FLOATING BAR */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg bg-gray-950 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-fade-in border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#E23744] flex items-center justify-center font-black text-xs">
              {totalCartCount}
            </div>
            <div>
              <div className="text-xs font-bold text-white">Items added to your basket</div>
              <div className="text-[10px] text-gray-400">Extra discounts available at checkout</div>
            </div>
          </div>

          <button
            onClick={() => onChangeTab("Cart")}
            className="bg-[#E23744] hover:bg-[#D02B38] text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center space-x-1"
          >
            <span>View Cart</span>
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
