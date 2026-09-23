/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Search, 
  ChevronRight, 
  Clock, 
  Star, 
  Flame, 
  SlidersHorizontal,
  UtensilsCrossed,
  Check,
  Plus,
  ArrowRight,
  TrendingUp,
  Percent
} from "lucide-react";
import { apiService } from "../services/api";
import { Restaurant, MenuItem } from "../types";
import { FOOD_CATEGORIES, FEATURED_OFFERS } from "../services/mockData";
import { RestaurantCard } from "../components/RestaurantCard";
import { FoodCategoryCard } from "../components/FoodCategoryCard";
import { OfferBanner } from "../components/OfferBanner";
import { SearchBar } from "../components/SearchBar";
import { SkeletonRestaurantCard } from "../components/common/SkeletonLoader";
import { VegBadge } from "../components/common/VegBadge";
import { showToast } from "../components/common/Toast";

interface HomeProps {
  onSelectRestaurant: (restaurantId: number) => void;
  onChangeTab: (tab: string) => void;
  searchQuery: string;
  onSetSearchQuery: (query: string) => void;
}

export function Home({ onSelectRestaurant, onChangeTab, searchQuery, onSetSearchQuery }: HomeProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [recommendedDishes, setRecommendedDishes] = useState<MenuItem[]>([]);
  const [justAddedToCart, setJustAddedToCart] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "rating" | "speed" | "veg">("all");
  const [loading, setLoading] = useState<boolean>(true);

  // Suggested search suggestions from AI backend
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [smartCombo, setSmartCombo] = useState<{title: string; description: string; items: string[]} | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const list = await apiService.getAllRestaurants();
        setRestaurants(list);
        setFilteredRestaurants(list);

        // Load recommended items
        const itemsList: MenuItem[] = [];
        const menuItemsMap = await Promise.all(
          list.slice(0, 3).map(async (r) => {
            const menu = await apiService.getMenuItemsByRestaurant(r.id);
            return menu.slice(0, 4);
          })
        );
        menuItemsMap.forEach(m => itemsList.push(...m));
        setRecommendedDishes(itemsList);
      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // AI search suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const getAiSuggestions = async () => {
        try {
          const res = await fetch("/api/ai/suggestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: searchQuery })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.suggestions) setSearchSuggestions(data.suggestions);
            if (data.smartCombo) setSmartCombo(data.smartCombo);
          }
        } catch {
          // Fallback silent
        }
      };
      
      const delayDebounce = setTimeout(() => {
        getAiSuggestions();
      }, 400);

      return () => clearTimeout(delayDebounce);
    } else {
      setSearchSuggestions([]);
      setSmartCombo(null);
    }
  }, [searchQuery]);

  // Filtering
  useEffect(() => {
    let result = [...restaurants];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        r => r.name.toLowerCase().includes(q) || 
             r.cuisine.toLowerCase().includes(q) ||
             r.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      const catObj = FOOD_CATEGORIES.find(c => c.id === selectedCategory);
      if (catObj) {
        const catName = catObj.name.toLowerCase();
        result = result.filter(r => 
          r.cuisine.toLowerCase().includes(catName) || 
          r.description.toLowerCase().includes(catName)
        );
      }
    }

    if (activeFilter === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (activeFilter === "speed") {
      result.sort((a, b) => a.deliveryTime - b.deliveryTime);
    } else if (activeFilter === "veg") {
      result = result.filter(r => r.isVeg);
    }

    setFilteredRestaurants(result);
  }, [searchQuery, selectedCategory, restaurants, activeFilter]);

  const handleRecommendAddToCart = async (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await apiService.addToCart(item);
      setJustAddedToCart(item.id);
      showToast(`Added ${item.name} to cart!`, "success");
      setTimeout(() => setJustAddedToCart(null), 2000);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  return (
    <div id="cp-home-page" className="pb-20 space-y-10 animate-fade-in font-sans text-left">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        {/* Background glow & subtle patterns */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#E23744]/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-bold text-amber-300">
            <Flame className="w-4 h-4 text-[#FF6838] fill-[#FF6838]" />
            <span>Fast, Fresh & Contactless Delivery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Craving something <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E23744] via-[#FF6838] to-amber-400">delicious?</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto font-medium leading-relaxed">
            Order from the highest-rated local kitchens, signature biryani spots, and artisanal bakeries delivered hot to your doorstep.
          </p>

          {/* Search Box in Hero */}
          <div className="max-w-2xl mx-auto pt-2">
            <SearchBar 
              placeholder="Search for restaurants, biryani, pizzas, rolls..." 
              onSearch={onSetSearchQuery}
              initialValue={searchQuery}
            />
          </div>

          {/* AI Suggestions Pill list */}
          {searchSuggestions.length > 0 && (
            <div className="flex items-center justify-center flex-wrap gap-2 pt-2 animate-fade-in">
              <span className="text-xs text-gray-400 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Suggestions:</span>
              </span>
              {searchSuggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => onSetSearchQuery(sug)}
                  className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full border border-white/10 transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* 2. CUISINE CATEGORIES ("What's on your mind?") */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Inspiration for your order
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Explore by popular cuisines & flavors</p>
            </div>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-bold text-[#E23744] hover:text-[#D02B38] underline cursor-pointer"
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="flex items-center space-x-6 sm:space-x-8 overflow-x-auto pb-4 pt-1 scrollbar-hide">
            {FOOD_CATEGORIES.map((cat) => (
              <FoodCategoryCard
                key={cat.id}
                category={cat}
                isSelected={selectedCategory === cat.id}
                onClick={() => handleCategorySelect(cat.id)}
              />
            ))}
          </div>
        </section>

        {/* 3. PROMO OFFERS CAROUSEL */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center space-x-2">
                <Percent className="w-6 h-6 text-[#E23744]" />
                <span>Deals & Vouchers</span>
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Apply coupons at checkout for massive savings</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {FEATURED_OFFERS.map((offer) => (
              <OfferBanner
                key={offer.id}
                offer={offer}
                onApply={(code) => {
                  onChangeTab("Cart");
                }}
              />
            ))}
          </div>
        </section>

        {/* 4. FILTER TOOLBAR & RESTAURANTS LISTING */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center space-x-2">
                <span>Top Restaurant Chains</span>
                <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
                  {filteredRestaurants.length}
                </span>
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {selectedCategory ? `Filtered by ${FOOD_CATEGORIES.find(c => c.id === selectedCategory)?.name}` : "Curated for taste, speed, and safety"}
              </p>
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all ${
                  activeFilter === "all"
                    ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("rating")}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all flex items-center space-x-1 ${
                  activeFilter === "rating"
                    ? "bg-[#E23744] text-white border-[#E23744] shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Ratings 4.5+</span>
              </button>
              <button
                onClick={() => setActiveFilter("speed")}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all flex items-center space-x-1 ${
                  activeFilter === "speed"
                    ? "bg-[#E23744] text-white border-[#E23744] shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Fast Delivery</span>
              </button>
              <button
                onClick={() => setActiveFilter("veg")}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all flex items-center space-x-1 ${
                  activeFilter === "veg"
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
              >
                <VegBadge isVeg={true} size="sm" />
                <span>Pure Veg</span>
              </button>
            </div>
          </div>

          {/* Restaurant Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <SkeletonRestaurantCard />
              <SkeletonRestaurantCard />
              <SkeletonRestaurantCard />
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4 max-w-lg mx-auto shadow-sm">
              <div className="w-16 h-16 bg-red-50 text-[#E23744] rounded-full flex items-center justify-center mx-auto">
                <UtensilsCrossed className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-gray-900">No matching restaurants found</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto font-medium">
                  Try clearing your search query or removing filters to see available diners.
                </p>
              </div>
              <button
                onClick={() => {
                  onSetSearchQuery("");
                  setSelectedCategory(null);
                  setActiveFilter("all");
                }}
                className="bg-[#E23744] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#D02B38] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={() => onSelectRestaurant(restaurant.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* 5. RECOMMENDED GOURMET DISHES SECTION */}
        {recommendedDishes.length > 0 && (
          <section className="space-y-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-[#E23744]" />
                  <span>Popular Dishes Right Now</span>
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Top culinary picks ordered by food lovers</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommendedDishes.slice(0, 8).map((dish) => (
                <div
                  key={dish.id}
                  className="bg-white rounded-3xl border border-gray-100 p-4 card-elevation-hover shadow-sm flex flex-col justify-between space-y-3 group select-none"
                >
                  <div className="space-y-3">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 relative">
                      <img
                        src={dish.imageUrl}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-lg shadow-xs">
                        <VegBadge isVeg={dish.isVeg} size="sm" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-extrabold text-gray-900 tracking-tight line-clamp-1 group-hover:text-[#E23744] transition-colors">
                        {dish.name}
                      </h4>
                      <p className="text-[11px] text-gray-400 font-medium line-clamp-2 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-sm font-black font-mono text-gray-900">
                      ₹{dish.price}
                    </span>

                    <button
                      onClick={(e) => handleRecommendAddToCart(dish, e)}
                      className={`text-xs font-black px-4 py-1.5 rounded-xl transition-all flex items-center space-x-1 ${
                        justAddedToCart === dish.id
                          ? "bg-emerald-600 text-white"
                          : "bg-red-50 text-[#E23744] hover:bg-[#E23744] hover:text-white"
                      }`}
                    >
                      {justAddedToCart === dish.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

    </div>
  );
}
