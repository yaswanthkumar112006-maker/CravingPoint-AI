/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id?: number;
  username: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  savedAddresses?: string[];
  role?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  username: string;
  email: string;
  roles: string[];
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  isVeg: boolean;
  rating?: number;
}

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  deliveryTime: number; // in minutes
  distance: number; // in km
  costForTwo: number;
  isVeg: boolean;
  address: string;
  featured: boolean;
}

export interface CartItem {
  id?: number; // DB id
  menuItem: MenuItem;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  grandTotal: number;
}

export enum OrderStatus {
  PLACED = "PLACED",
  CONFIRMED = "CONFIRMED",
  PREPARING = "PREPARING",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

export interface DeliveryPartner {
  id: number;
  name: string;
  phone: string;
  vehicleNo: string;
  rating: number;
}

export interface Order {
  id: number;
  createdAt: string;
  items: {
    menuItem: MenuItem;
    quantity: number;
    priceAtOrder: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  grandTotal: number;
  status: OrderStatus;
  deliveryAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  deliveryPartner?: DeliveryPartner;
}

export interface Review {
  id: number;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Offer {
  id: number;
  code: string;
  discountMessage: string;
  description: string;
  expiryDate: string;
  minOrderValue: number;
  bgImageUrl?: string;
}
