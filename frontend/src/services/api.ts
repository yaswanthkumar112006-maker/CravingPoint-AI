/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import axios from "axios";
import { 
  User, 
  Restaurant, 
  MenuItem, 
  Cart, 
  Order, 
  Review, 
  OrderStatus 
} from "../types";
import { 
  INITIAL_RESTAURANTS, 
  INITIAL_MENU_ITEMS, 
  INITIAL_REVIEWS, 
  MOCK_PARTNERS 
} from "./mockData";

// Set up the backend URL from environment or fallback to spring boot standard port
const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:8080";

// Create custom Axios instance
const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Configure Axios intercepts to automatically attach JWT header on dynamic requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// VIRTUAL LOCAL DATABASE SETUP (for sandbox preview mode and when spring boot is offline)
function initLocalStorage() {
  if (!localStorage.getItem("cp_restaurants")) {
    localStorage.setItem("cp_restaurants", JSON.stringify(INITIAL_RESTAURANTS));
  }
  if (!localStorage.getItem("cp_menu_items")) {
    localStorage.setItem("cp_menu_items", JSON.stringify(INITIAL_MENU_ITEMS));
  }
  if (!localStorage.getItem("cp_reviews")) {
    localStorage.setItem("cp_reviews", JSON.stringify(INITIAL_REVIEWS));
  }
  if (!localStorage.getItem("cp_cart")) {
    localStorage.setItem("cp_cart", JSON.stringify({ items: [], subtotal: 0, deliveryFee: 0, tax: 0, grandTotal: 0 }));
  }
  if (!localStorage.getItem("cp_orders")) {
    localStorage.setItem("cp_orders", JSON.stringify([]));
  }
  if (!localStorage.getItem("cp_users")) {
    const defaultUser: User = {
      username: "john_doe",
      email: "john@example.com",
      phoneNumber: "9876543210",
      address: "Flat 402, Green Towers, Jubilee Hills, Hyderabad",
      savedAddresses: [
        "Flat 402, Green Towers, Jubilee Hills, Hyderabad",
        "Office Block C, Tech Park, Gachibowli, Hyderabad"
      ]
    };
    localStorage.setItem("cp_users", JSON.stringify([defaultUser]));
    localStorage.setItem("token", "simulated-jwt-token-xyz");
    localStorage.setItem("currentUser", JSON.stringify(defaultUser));
  }
}

// Initialise storage states
initLocalStorage();

// Broadcast event helpers to sync other hooks across threads
const notifyCartUpdate = () => {
  window.dispatchEvent(new Event("cart-updated"));
};

const notifyOrderUpdate = () => {
  window.dispatchEvent(new Event("orders-updated"));
};

export const apiService = {
  // ==========================================
  // 1. USER AUTHENTICATION & PROFILE CONTROLLERS
  // ==========================================
  async login(username: string, password: string): Promise<any> {
    try {
      const response = await axiosInstance.post("/api/auth/login", { username, password });
      const res = response.data;
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("currentUser", JSON.stringify(res.user || { username, email: res.email }));
      }
      return res;
    } catch (err: any) {
      console.warn("[CravingPoint Axios Fallback] Login failed, fallback to local storage authentication simulation.", err.message);
      
      const users: User[] = JSON.parse(localStorage.getItem("cp_users") || "[]");
      const user = users.find(u => u.username === username);
      if (user) {
        localStorage.setItem("token", "simulated-jwt-token-" + Date.now());
        localStorage.setItem("currentUser", JSON.stringify(user));
        return { success: true, token: "simulated-jwt-token", username: user.username, email: user.email };
      } else {
        throw new Error("Invalid credentials in offline fallback mode. Use 'john_doe'.");
      }
    }
  },

  async register(username: string, email: string, phoneNumber: string, address: string): Promise<any> {
    try {
      const response = await axiosInstance.post("/api/auth/register", { username, email, phoneNumber, address });
      return response.data;
    } catch (err: any) {
      console.warn("[CravingPoint Axios Fallback] Register failed, fallback to local storage database creation.", err.message);

      const users: User[] = JSON.parse(localStorage.getItem("cp_users") || "[]");
      if (users.some(u => u.username === username || u.email === email)) {
        throw new Error("Username or Email already registered");
      }
      const newUser: User = { 
        username, 
        email, 
        phoneNumber, 
        address,
        savedAddresses: [address]
      };
      users.push(newUser);
      localStorage.setItem("cp_users", JSON.stringify(users));
      localStorage.setItem("token", "simulated-jwt-token-" + Date.now());
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      return { success: true, user: newUser };
    }
  },

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.setItem("cp_cart", JSON.stringify({ items: [], subtotal: 0, deliveryFee: 0, tax: 0, grandTotal: 0 }));
    notifyCartUpdate();
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("currentUser");
    return userStr ? JSON.parse(userStr) : null;
  },

  async updateProfile(user: User): Promise<User> {
    try {
      const response = await axiosInstance.put("/api/users/profile", user);
      localStorage.setItem("currentUser", JSON.stringify(response.data));
      return response.data;
    } catch (err: any) {
      console.warn("[CravingPoint Axios Fallback] Update profile failed, fallback to local storage update", err.message);
      
      localStorage.setItem("currentUser", JSON.stringify(user));
      const users: User[] = JSON.parse(localStorage.getItem("cp_users") || "[]");
      const idx = users.findIndex(u => u.username === user.username);
      if (idx !== -1) {
        users[idx] = user;
        localStorage.setItem("cp_users", JSON.stringify(users));
      }
      return user;
    }
  },

  // ==========================================
  // 2. RESTAURANT CONTROLLER
  // ==========================================
  async getAllRestaurants(): Promise<Restaurant[]> {
    try {
      const response = await axiosInstance.get("/api/restaurants");
      return response.data;
    } catch (err: any) {
      console.warn("[CravingPoint Axios Fallback] Fetching restaurants failed, using local storage cache.", err.message);
      return JSON.parse(localStorage.getItem("cp_restaurants") || "[]");
    }
  },

  async getRestaurantById(id: number): Promise<Restaurant> {
    try {
      const response = await axiosInstance.get(`/api/restaurants/${id}`);
      return response.data;
    } catch (err: any) {
      console.warn(`[CravingPoint Axios Fallback] Fetching restaurant ${id} failed, using local storage cache.`, err.message);
      const list: Restaurant[] = JSON.parse(localStorage.getItem("cp_restaurants") || "[]");
      const found = list.find(r => r.id === id);
      if (!found) throw new Error("Restaurant not found");
      return found;
    }
  },

  // ==========================================
  // 3. MENU ITEM CONTROLLER
  // ==========================================
  async getMenuItemsByRestaurant(restaurantId: number): Promise<MenuItem[]> {
    try {
      const response = await axiosInstance.get(`/api/menu-items/restaurant/${restaurantId}`);
      return response.data;
    } catch (err: any) {
      console.warn(`[CravingPoint Axios Fallback] Fetching menu items for restaurant ${restaurantId} failed, using local storage cache.`, err.message);
      const menuMap: Record<number, MenuItem[]> = JSON.parse(localStorage.getItem("cp_menu_items") || "{}");
      return menuMap[restaurantId] || [];
    }
  },

  // ==========================================
  // 4. REVIEWS CONTROLLER (Fully Integrated)
  // ==========================================
  async getReviewsByRestaurant(restaurantId: number): Promise<Review[]> {
    try {
      const response = await axiosInstance.get(`/api/restaurants/${restaurantId}/reviews`);
      return response.data;
    } catch (err: any) {
      console.warn(`[CravingPoint Axios Fallback] Fetching reviews for restaurant ${restaurantId} failed, using local storage cache.`, err.message);
      const reviewsMap: Record<number, Review[]> = JSON.parse(localStorage.getItem("cp_reviews") || "{}");
      return reviewsMap[restaurantId] || [];
    }
  },

  async addReview(restaurantId: number, rating: number, comment: string): Promise<Review> {
    const user = this.getCurrentUser();
    const reviewData = {
      username: user?.username || "Anonymous Eater",
      rating,
      comment,
      createdAt: new Date().toISOString().split("T")[0]
    };

    try {
      const response = await axiosInstance.post(`/api/restaurants/${restaurantId}/reviews`, reviewData);
      return response.data;
    } catch (err: any) {
      console.warn(`[CravingPoint Axios Fallback] Creating review for restaurant ${restaurantId} failed, fallback to local storage schema updates.`, err.message);

      const reviewsMap: Record<number, Review[]> = JSON.parse(localStorage.getItem("cp_reviews") || "{}");
      if (!reviewsMap[restaurantId]) {
        reviewsMap[restaurantId] = [];
      }
      const newReview: Review = {
        id: Date.now(),
        ...reviewData
      };
      reviewsMap[restaurantId].unshift(newReview);
      localStorage.setItem("cp_reviews", JSON.stringify(reviewsMap));

      // Recalculate restaurant average rating automatically
      const restaurants: Restaurant[] = JSON.parse(localStorage.getItem("cp_restaurants") || "[]");
      const restIdx = restaurants.findIndex(r => r.id === restaurantId);
      if (restIdx !== -1) {
        const restReviews = reviewsMap[restaurantId];
        const sum = restReviews.reduce((acc, r) => acc + r.rating, 0);
        restaurants[restIdx].rating = parseFloat((sum / restReviews.length).toFixed(1));
        restaurants[restIdx].reviewCount = restReviews.length;
        localStorage.setItem("cp_restaurants", JSON.stringify(restaurants));
      }

      return newReview;
    }
  },

  // ==========================================
  // 5. CART CONTROLLER
  // ==========================================
  async getCart(): Promise<Cart> {
    try {
      const response = await axiosInstance.get("/api/cart");
      return response.data;
    } catch (err: any) {
      console.warn("[CravingPoint Axios Fallback] Fetching cart failed, fallback to browser cart.", err.message);
      const cart: Cart = JSON.parse(localStorage.getItem("cp_cart") || '{"items":[]}');
      this.recalculateCart(cart);
      return cart;
    }
  },

  async addToCart(menuItem: MenuItem): Promise<Cart> {
    let currentCart: Cart;
    try {
      const response = await axiosInstance.post("/api/cart/add", { menuItemId: menuItem.id, quantity: 1 });
      currentCart = response.data;
    } catch (err: any) {
      console.warn("[CravingPoint Axios Fallback] Add to cart failed, appending to local storage cart.", err.message);
      currentCart = JSON.parse(localStorage.getItem("cp_cart") || '{"items":[]}');
      const existing = currentCart.items.find(item => item.menuItem.id === menuItem.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        currentCart.items.push({ menuItem, quantity: 1 });
      }
      this.recalculateCart(currentCart);
      localStorage.setItem("cp_cart", JSON.stringify(currentCart));
    }
    notifyCartUpdate();
    return currentCart;
  },

  async updateCartItemQuantity(menuItemId: number, change: number): Promise<Cart> {
    let currentCart: Cart;
    try {
      const response = await axiosInstance.put("/api/cart/update", { menuItemId, change });
      currentCart = response.data;
    } catch (err: any) {
      console.warn("[CravingPoint Axios Fallback] Update cart quality failed, doing math in local storage.", err.message);
      currentCart = JSON.parse(localStorage.getItem("cp_cart") || '{"items":[]}');
      const idx = currentCart.items.findIndex(item => item.menuItem.id === menuItemId);
      if (idx !== -1) {
        currentCart.items[idx].quantity += change;
        if (currentCart.items[idx].quantity <= 0) {
          currentCart.items.splice(idx, 1);
        }
      }
      this.recalculateCart(currentCart);
      localStorage.setItem("cp_cart", JSON.stringify(currentCart));
    }
    notifyCartUpdate();
    return currentCart;
  },

  async removeCartItem(menuItemId: number): Promise<Cart> {
    let currentCart: Cart;
    try {
      const response = await axiosInstance.delete(`/api/cart/items/${menuItemId}`);
      currentCart = response.data;
    } catch (err: any) {
      console.warn("[CravingPoint Axios Fallback] Remove cart item failed, purifying local storage cart.", err.message);
      currentCart = JSON.parse(localStorage.getItem("cp_cart") || '{"items":[]}');
      currentCart.items = currentCart.items.filter(item => item.menuItem.id !== menuItemId);
      this.recalculateCart(currentCart);
      localStorage.setItem("cp_cart", JSON.stringify(currentCart));
    }
    notifyCartUpdate();
    return currentCart;
  },

  async clearCart(): Promise<Cart> {
    const emptyCart = { items: [], subtotal: 0, deliveryFee: 0, tax: 0, grandTotal: 0 };
    try {
      await axiosInstance.delete("/api/cart/clear");
    } catch (err: any) {
      console.warn("[CravingPoint Axios Fallback] Clear cart failed, flushing local storage cart.", err.message);
      localStorage.setItem("cp_cart", JSON.stringify(emptyCart));
    }
    notifyCartUpdate();
    return emptyCart;
  },

  recalculateCart(cart: Cart): void {
    const subtotal = cart.items.reduce((acc, item) => acc + (item.menuItem.price * item.quantity), 0);
    cart.subtotal = subtotal;
    cart.deliveryFee = subtotal > 0 ? (subtotal > 299 ? 0 : 40) : 0;
    cart.tax = Math.round(subtotal * 0.05); // 5% GST
    cart.grandTotal = cart.subtotal + cart.deliveryFee + cart.tax;
  },

  // ==========================================
  // 6. ORDER CONTROLLER & TIMELINES
  // ==========================================
  async placeOrder(deliveryAddress: string, paymentMethod: string): Promise<Order> {
    const cart = await this.getCart();
    if (cart.items.length === 0) {
      throw new Error("Cannot place an order with an empty cart");
    }

    const orderItems = cart.items.map(item => ({
      menuItem: item.menuItem,
      quantity: item.quantity,
      priceAtOrder: item.menuItem.price
    }));

    const orderPayload = {
      items: orderItems,
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      tax: cart.tax,
      grandTotal: cart.grandTotal,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
      status: OrderStatus.PLACED
    };

    try {
      const response = await axiosInstance.post("/api/orders", orderPayload);
      await this.clearCart();
      return response.data;
    } catch (err: any) {
      console.warn("[CravingPoint Axios Fallback] Placing order failed, dispatching locally tracked route simulated order.", err.message);
      
      const orders: Order[] = JSON.parse(localStorage.getItem("cp_orders") || "[]");
      const randomPartnerIdx = Math.floor(Math.random() * MOCK_PARTNERS.length);
      const deliveryPartner = MOCK_PARTNERS[randomPartnerIdx];

      const newOrder: Order = {
        id: Math.floor(100000 + Math.random() * 900000), // Random 6 digit order ID
        createdAt: new Date().toISOString(),
        items: orderItems,
        subtotal: cart.subtotal,
        deliveryFee: cart.deliveryFee,
        tax: cart.tax,
        grandTotal: cart.grandTotal,
        status: OrderStatus.PLACED,
        deliveryAddress,
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "PENDING" : "SUCCESSFUL",
        deliveryPartner
      };

      orders.unshift(newOrder);
      localStorage.setItem("cp_orders", JSON.stringify(orders));
      await this.clearCart();

      // Trigger standard order status simulation ticks for immersive UX!
      this.simulateOrderStatusTimeline(newOrder.id);

      notifyOrderUpdate();
      return newOrder;
    }
  },

  async getUserOrders(): Promise<Order[]> {
    try {
      const response = await axiosInstance.get("/api/orders");
      return response.data;
    } catch (err: any) {
      console.warn("[CravingPoint Axios Fallback] Fetching user orders failed, reading local storage orders.", err.message);
      return JSON.parse(localStorage.getItem("cp_orders") || "[]");
    }
  },

  async getOrderById(orderId: number): Promise<Order> {
    try {
      const response = await axiosInstance.get(`/api/orders/${orderId}`);
      return response.data;
    } catch (err: any) {
      console.warn(`[CravingPoint Axios Fallback] Fetching order ${orderId} failed, reading local storage order.`, err.message);
      const list: Order[] = JSON.parse(localStorage.getItem("cp_orders") || "[]");
      const found = list.find(o => o.id === orderId);
      if (!found) throw new Error("Order not found");
      return found;
    }
  },

  // Simulates ordering progression so user has a realistic dashboard timeline in preview
  simulateOrderStatusTimeline(orderId: number) {
    const statuses = [
      OrderStatus.CONFIRMED,
      OrderStatus.PREPARING,
      OrderStatus.OUT_FOR_DELIVERY,
      OrderStatus.DELIVERED
    ];

    let checkIndex = 0;
    const interval = setInterval(() => {
      const orders: Order[] = JSON.parse(localStorage.getItem("cp_orders") || "[]");
      const idx = orders.findIndex(o => o.id === orderId);
      if (idx !== -1 && checkIndex < statuses.length) {
        orders[idx].status = statuses[checkIndex];
        if (statuses[checkIndex] === OrderStatus.DELIVERED) {
          orders[idx].paymentStatus = "SUCCESSFUL";
        }
        localStorage.setItem("cp_orders", JSON.stringify(orders));
        notifyOrderUpdate();
        checkIndex++;
      } else {
        clearInterval(interval);
      }
    }, 12000); // Progresses status every 12 seconds in preview!
  }
};
