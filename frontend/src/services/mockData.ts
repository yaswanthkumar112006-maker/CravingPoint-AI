/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Restaurant, MenuItem, FoodCategory, Offer, Review } from "../types";

export const FOOD_CATEGORIES: FoodCategory[] = [
  {
    id: "cat_biryani",
    name: "Biryani",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=60"
  },
  {
    id: "cat_pizza",
    name: "Pizza",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=60"
  },
  {
    id: "cat_burgers",
    name: "Burgers",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=60"
  },
  {
    id: "cat_chinese",
    name: "Chinese",
    imageUrl: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=300&auto=format&fit=crop&q=60"
  },
  {
    id: "cat_north_indian",
    name: "North Indian",
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=300&auto=format&fit=crop&q=60"
  },
  {
    id: "cat_south_indian",
    name: "South Indian",
    imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&auto=format&fit=crop&q=60"
  },
  {
    id: "cat_desserts",
    name: "Desserts",
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&auto=format&fit=crop&q=60"
  },
  {
    id: "cat_healthy",
    name: "Healthy",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&auto=format&fit=crop&q=60"
  }
];

export const FEATURED_OFFERS: Offer[] = [
  {
    id: 1,
    code: "CRAVING50",
    discountMessage: "50% OFF UP TO ₹100",
    description: "Use code CRAVING50 | Above ₹159",
    expiryDate: "2026-12-31",
    minOrderValue: 159,
    bgImageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    code: "FREE_DEL",
    discountMessage: "FREE DELIVERY",
    description: "On your first order above ₹199",
    expiryDate: "2026-12-31",
    minOrderValue: 199,
    bgImageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    code: "EATSTAR",
    discountMessage: "GET 20% EXTRA BACK",
    description: "Valid on premium list of fine diners",
    expiryDate: "2026-12-31",
    minOrderValue: 499,
    bgImageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop&q=80"
  }
];

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 101,
    name: "Swarnamukhii Multicuisine Restaurant",
    description: "Authentic Andhra meals, South Indian keynotes, and classic North Indian gourmet recipes",
    imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
    cuisine: "South Indian, Andhra, North Indian",
    rating: 4.6,
    reviewCount: 421,
    deliveryTime: 20,
    distance: 1.2,
    costForTwo: 350,
    isVeg: true,
    address: "Opp. Tech Park Main Gate, HSR Layout, Bangalore",
    featured: true
  },
  {
    id: 102,
    name: "Aroma Multi Cuisine Restaurant",
    description: "Multi-layered Italian crust pizzas, sizzling Chinese woks, and hot continental starters",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80",
    cuisine: "Multicuisine, Italian, Chinese, Fast Food",
    rating: 4.4,
    reviewCount: 289,
    deliveryTime: 25,
    distance: 2.8,
    costForTwo: 450,
    isVeg: false,
    address: "Road No. 12, Banjara Hills, Hyderabad",
    featured: true
  },
  {
    id: 103,
    name: "Biryani Hub",
    description: "Authentic Hyderabadi Slow-cooked Dum Biryani, Mughlai grills and rich dessert platters",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
    cuisine: "Biryani, Mughlai, North Indian",
    rating: 4.8,
    reviewCount: 612,
    deliveryTime: 18,
    distance: 0.9,
    costForTwo: 300,
    isVeg: false,
    address: "Metro Pillar 140, Jubilee Hills Road, Hyderabad",
    featured: true
  },
  {
    id: 104,
    name: "Szechuan Express",
    description: "Spicy noodles, sizzling dimsums, and traditional Chinese preparations",
    imageUrl: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop&q=80",
    cuisine: "Chinese, Asian",
    rating: 4.1,
    reviewCount: 124,
    deliveryTime: 35,
    distance: 4.2,
    costForTwo: 350,
    isVeg: false,
    address: "Chandi Road, Salt Lake Sector 5, Kolkata",
    featured: false
  },
  {
    id: 105,
    name: "Green Delight Kitchen",
    description: "Phulka, pure ghee paneer curries, dal makhani, and macro bowls",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
    cuisine: "North Indian, Healthy, Vegetarian",
    rating: 4.6,
    reviewCount: 180,
    deliveryTime: 28,
    distance: 2.8,
    costForTwo: 350,
    isVeg: true,
    address: "M.G. Road, Vijay Nagar, Indore",
    featured: true
  }
];

export const INITIAL_MENU_ITEMS: Record<number, MenuItem[]> = {
  101: [
    {
      id: 1001,
      name: "Special Swarnamukhii Ghee Roast Dosa",
      description: "Crispy fermented rice-lentil crepe brushed with real butter ghee, loaded potato stuffing & chutneys",
      price: 130,
      category: "South Indian",
      imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&auto=format&fit=crop&q=80",
      isAvailable: true,
      isVeg: true,
      rating: 4.9
    },
    {
      id: 1002,
      name: "Royal Andhra Veg Meals Platter",
      description: "Steaming hot rice, signature ghee, dry curry, sambar, rasam, freshly ground chutney, curd, and papadum",
      price: 210,
      category: "South Indian",
      imageUrl: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=300&auto=format&fit=crop&q=80",
      isAvailable: true,
      isVeg: true,
      rating: 4.8
    },
    {
      id: 1003,
      name: "Paneer Butter Masala",
      description: "Fresh premium cottage cheese cubes cooked in silk sweet tomato gravy",
      price: 250,
      category: "North Indian",
      imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&auto=format&fit=crop&q=80",
      isAvailable: true,
      isVeg: true,
      rating: 4.7
    },
    {
      id: 1004,
      name: "Tandoori Garlic Roti",
      description: "Organic hot whole wheat bread roasted in clay tandoors topped with minced garlic and melted ghee",
      price: 45,
      category: "North Indian",
      imageUrl: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=300&auto=format&fit=crop&q=80",
      isAvailable: true,
      isVeg: true,
      rating: 4.5
    }
  ],
  102: [
    {
      id: 1101,
      name: "Aroma Margherita Feast Pizza (10\")",
      description: "Rustic Italian thin crust pizza, extra fresh passata spread, premium mozzarella cheese, and fresh basil leaves",
      price: 279,
      category: "Pizza",
      imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&auto=format&fit=crop&q=80",
      isAvailable: true,
      isVeg: true,
      rating: 4.6
    },
    {
      id: 1102,
      name: "Szechuan Spicy Veg Noodles",
      description: "Spicy wok-tossed noodles in rich in-house schezwan glaze, crunchy bell peppers, and scallions",
      price: 189,
      category: "Chinese",
      imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&auto=format&fit=crop&q=80",
      isAvailable: true,
      isVeg: true,
      rating: 4.4
    },
    {
      id: 1103,
      name: "Fiery Dragon Chicken Starters",
      description: "Succulent cubes of chicken tossed in sharp ginger-garlic paste, bell pepper capsicums, and hot chili oil",
      price: 240,
      category: "Chinese",
      imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&auto=format&fit=crop&q=80",
      isAvailable: true,
      isVeg: false,
      rating: 4.8
    }
  ],
  103: [
    {
      id: 1201,
      name: "Signature Chicken Dum Biryani",
      description: "Rich traditional style slow cooked spice-marinated chicken layered under long-grain aged basmati rice",
      price: 299,
      category: "Biryani",
      imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80",
      isAvailable: true,
      isVeg: false,
      rating: 4.9
    },
    {
      id: 1202,
      name: "Imperial Paneer Dum Biryani",
      description: "Gourmet layered basmati rice with fried cottage cheese cubes, whole spices, mint, and saffron milk highlights",
      price: 240,
      category: "Biryani",
      imageUrl: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300&auto=format&fit=crop&q=80",
      isAvailable: true,
      isVeg: true,
      rating: 4.6
    },
    {
      id: 1203,
      name: "Double Ka Meetha Saffron Pudding",
      description: "Mouth-watering sweet fried bread pudding infused in cardamoms, dense condensed milk, and roasted dry fruits",
      price: 110,
      category: "Desserts",
      imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&auto=format&fit=crop&q=80",
      isAvailable: true,
      isVeg: true,
      rating: 4.8
    }
  ],
  104: [
    {
      id: 1301,
      name: "Schezwan Hakka Veg Noodles",
      description: "Thin stir-fried wok noodles tossed in fiery in-house Schezwan red pepper chili paste & julienned veggies",
      price: 189,
      category: "Chinese",
      imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&auto=format&fit=crop&q=80",
      isAvailable: true,
      isVeg: true,
      rating: 4.0
    },
    {
      id: 1302,
      name: "Pan Fried Sizzling Chicken Dimsums",
      description: "6 pieces of steamed pockets packed with minced chicken and spring onions, crispy fried on base",
      price: 199,
      category: "Chinese",
      imageUrl: "https://images.unsplash.com/photo-1496116211227-7c3ccb8f58ce?w=300&auto=format&fit=crop&q=80",
      isAvailable: true,
      isVeg: false,
      rating: 4.4
    },
    {
      id: 1303,
      name: "Cottage Cheese Chili Dry",
      description: "Wok cubed paneer stir-fried with hot green chilies, mixed capsicum, fried garlic flakes & light dark soy sauce",
      price: 219,
      category: "Chinese",
      imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&auto=format&fit=crop&q=80",
      isAvailable: true,
      isVeg: true,
      rating: 4.2
    }
  ],
  105: [
    {
      id: 1401,
      name: "Avocado & Quinoa Power Bowl",
      description: "Poached high-protein quinoa mix with diced Hass avocado, cherry tomatoes, baby spinach & citrus vinaigrette",
      price: 249,
      category: "Healthy",
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=80",
      isAvailable: true,
      isVeg: true,
      rating: 4.5
    },
    {
      id: 1402,
      name: "Paneer Tikka Diet Wrap",
      description: "Whole wheat whole-grain tortilla packed with flame grilled light paneer and raw shredded purple cabbage",
      price: 189,
      category: "Healthy",
      imageUrl: "https://images.unsplash.com/photo-1626700051175-6518c4793f7f?w=300&auto=format&fit=crop&q=80",
      isAvailable: true,
      isVeg: true,
      rating: 4.4
    },
    {
      id: 1403,
      name: "High Fiber Dal Khichdi Bowl",
      description: "Comfort home-cooked moong lentils & brown rice infused with hand-pounded cumin ghee tadka",
      price: 159,
      category: "Healthy",
      imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&auto=format&fit=crop&q=80",
      isAvailable: true,
      isVeg: true,
      rating: 4.8
    }
  ],
  106: [
    {
      id: 1501,
      name: "Ghee Roast Masala Dosa",
      description: "Crispy fermented rice-lentil crepe brushed with real aromatic clarified butter (ghee) and filled with spiced potato mash",
      price: 120,
      category: "South Indian",
      imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&auto=format&fit=crop&q=80",
      isAvailable: true,
      isVeg: true,
      rating: 4.7
    },
    {
      id: 1502,
      name: "Soft Button Ghee Idli (4 Pieces)",
      description: "Feather soft baby steamed cakes doused in pure hot aromatic cow ghee accompanied with sambar & coconut relishes",
      price: 80,
      category: "South Indian",
      imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&auto=format&fit=crop&q=80",
      isAvailable: true,
      isVeg: true,
      rating: 4.6
    }
  ],
  107: [
    {
      id: 1601,
      name: "Death by Chocolate Waffle",
      description: "Triple layered premium warm cocoa waffle doused with liquid milk chocolate & delicious fudge brownie bits",
      price: 199,
      category: "Desserts",
      imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300&auto=format&fit=crop&q=80",
      isAvailable: true,
      isVeg: true,
      rating: 4.9
    },
    {
      id: 1602,
      name: "Gourmet Red Velvet Cupcake",
      description: "Sponge crimson red crumb cake with an ultra-thick crown of whipped vanilla cream cheese icing",
      price: 89,
      category: "Desserts",
      imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&auto=format&fit=crop&q=80",
      isAvailable: true,
      isVeg: true,
      rating: 4.3
    }
  ]
};

export const INITIAL_REVIEWS: Record<number, Review[]> = {
  101: [
    {
      id: 5001,
      username: "Aditya Sharma",
      rating: 5,
      comment: "Absolutely outstanding biryani! The chicken was extremely tender and fell off the bone. Perfect spice level.",
      createdAt: "2026-06-01"
    },
    {
      id: 5002,
      username: "Neha Kapoor",
      rating: 4,
      comment: "A bit spicy, but the flavor is unmatched. Delivery was super fast; came hot in neatly sealed containers.",
      createdAt: "2026-06-04"
    }
  ],
  102: [
    {
      id: 5101,
      username: "Vikram Sen",
      rating: 5,
      comment: "Classic Margherita was perfect! Thin crust, sweet basil, wood fired hints. Highly recommend to Italian lovers.",
      createdAt: "2026-05-28"
    }
  ],
  103: [
    {
      id: 5201,
      username: "Anjali Rao",
      rating: 4,
      comment: "The burgers are huge! BBQ sauce of the chicken burger is marvelous. peri peri fries are okay.",
      createdAt: "2026-06-03"
    },
    {
      id: 5202,
      username: "Rohan Das",
      rating: 5,
      comment: "Oreo shake is top tier. Best food delivery order so far.",
      createdAt: "2026-06-07"
    }
  ],
  105: [
    {
      id: 5301,
      username: "Pooja Hegde",
      rating: 5,
      comment: "Extremely tidy packaging and very clean and healthy meals. Love their high fiber dal khichdi bowl on tough days.",
      createdAt: "2026-06-05"
    }
  ]
};

export const MOCK_PARTNERS = [
  { id: 91, name: "Suresh Kumar", phone: "+91 98765 43210", vehicleNo: "TS-09-EF-4562", rating: 4.8 },
  { id: 92, name: "Ramesh Yadav", phone: "+91 87654 32109", vehicleNo: "MH-12-G-7890", rating: 4.7 },
  { id: 93, name: "Amit Patel", phone: "+91 76543 21098", vehicleNo: "KA-03-HJ-1122", rating: 4.9 }
];
