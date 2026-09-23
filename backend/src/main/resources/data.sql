-- CravingPoint Full-Stack Initial Seed Data
-- 1. Insert Sample Restaurants
INSERT INTO restaurant (id, name, description, cuisine_type, phone_number, email, address, city, state, pincode, latitude, longitude, rating, total_reviews, delivery_time, delivery_fee, minimum_order_amount, is_open, is_active, image_url)
VALUES 
(1, 'Cafe Swarnamukhii Multicuisine', 'Authentic South Indian dosas, tiffins, and spicy Andhra curries crafted with pure ghee.', 'South Indian, Andhra, Tiffins', '9876543210', 'info@swarnamukhii.com', 'Plot 42, Hitech City Main Rd, Madhapur', 'Hyderabad', 'Telangana', '500081', 17.4485, 78.3758, 4.8, 342, 25, 0.0, 100.0, true, true, 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurant (id, name, description, cuisine_type, phone_number, email, address, city, state, pincode, latitude, longitude, rating, total_reviews, delivery_time, delivery_fee, minimum_order_amount, is_open, is_active, image_url)
VALUES 
(2, 'Aroma Multi Cuisine', 'Flavors from around the globe: woodfired Italian pizzas, sizzling Chinese, and North Indian delights.', 'North Indian, Continental, Chinese', '9876543211', 'contact@aroma.com', 'Road No 36, Jubilee Hills', 'Hyderabad', 'Telangana', '500033', 17.4319, 78.4073, 4.6, 218, 35, 40.0, 150.0, true, true, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurant (id, name, description, cuisine_type, phone_number, email, address, city, state, pincode, latitude, longitude, rating, total_reviews, delivery_time, delivery_fee, minimum_order_amount, is_open, is_active, image_url)
VALUES 
(3, 'Biryani Hub', 'Royal Nizami dum biryanis cooked with aromatic spices and tender meats.', 'Biryani, Hyderabadi, Mughlai', '9876543212', 'orders@biryanihub.com', 'Near DLF Cyber City, Gachibowli', 'Hyderabad', 'Telangana', '500032', 17.4401, 78.3489, 4.9, 580, 30, 0.0, 200.0, true, true, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurant (id, name, description, cuisine_type, phone_number, email, address, city, state, pincode, latitude, longitude, rating, total_reviews, delivery_time, delivery_fee, minimum_order_amount, is_open, is_active, image_url)
VALUES 
(4, 'Szechuan Express', 'Authentic Pan-Asian flavors, fiery noodles, dimsums, and aromatic wok bowls.', 'Pan-Asian, Chinese, Dimsums', '9876543213', 'orders@szechuanexpress.com', 'Indiranagar 100ft Road', 'Bangalore', 'Karnataka', '560038', 12.9716, 77.5946, 4.5, 175, 28, 30.0, 120.0, true, true, 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurant (id, name, description, cuisine_type, phone_number, email, address, city, state, pincode, latitude, longitude, rating, total_reviews, delivery_time, delivery_fee, minimum_order_amount, is_open, is_active, image_url)
VALUES 
(5, 'Green Delight Kitchen', 'Farm-to-table organic salads, protein grain bowls, cold-pressed juices, and healthy meal boxes.', 'Healthy, Salads, Vegan, Organic', '9876543214', 'care@greendelight.com', 'Koramangala 5th Block', 'Bangalore', 'Karnataka', '560095', 12.9352, 77.6245, 4.7, 190, 22, 20.0, 100.0, true, true, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Sample Menu Items
INSERT INTO menu_item (id, item_name, description, price, veg, available, category, preparation_time, image_url, restaurant_id)
VALUES
(1, 'Special Swarnamukhii Ghee Roast Dosa', 'Golden crispy rice crepe smeared with aromatic pure desi ghee served with three fresh chutneys and piping hot sambar.', 130.0, true, true, 'Tiffins', 10, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80', 1),
(2, 'Royal Andhra Veg Meals Platter', 'Complete Andhra thali with hot rice, pappu, sambar, rasam, 2 fries, avakaya pickle, curd, and papad.', 210.0, true, true, 'Main Course', 15, 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&auto=format&fit=crop&q=80', 1),
(3, 'Paneer Butter Masala', 'Fresh cottage cheese cubes cooked in a rich, buttery tomato and cashew nut gravy.', 250.0, true, true, 'Curries', 15, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80', 1),
(4, 'Tandoori Garlic Roti (2 Pcs)', 'Whole wheat clay-oven flatbread infused with roasted garlic and coriander butter.', 45.0, true, true, 'Breads', 8, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80', 1),
(5, 'Aroma Margherita Feast Pizza', 'Hand-stretched sourdough crust loaded with San Marzano tomato sauce, fresh mozzarella, and aromatic basil leaves.', 279.0, true, true, 'Italian', 18, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80', 2),
(6, 'Szechuan Spicy Veg Noodles', 'Wok-tossed noodles in house special fiery chili garlic oil, spring onions, and crunch seasonal vegetables.', 189.0, true, true, 'Chinese', 12, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80', 2),
(7, 'Fiery Dragon Chicken Starters', 'Crispy chicken bites glazed in a tangy dragon pepper sauce garnished with sesame seeds.', 240.0, false, true, 'Starters', 15, 'https://images.unsplash.com/photo-1527477378385-e110438cf1f0?w=500&auto=format&fit=crop&q=80', 2),
(8, 'Signature Chicken Dum Biryani', 'Long grain basmati rice layered with succulent marinated chicken, slow dum cooked with saffron and ghee.', 299.0, false, true, 'Biryani', 20, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80', 3),
(9, 'Imperial Paneer Dum Biryani', 'Aromatic dum biryani prepared with spiced soft malai paneer cubes and caramelized onions.', 240.0, true, true, 'Biryani', 18, 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=80', 3),
(10, 'Double Ka Meetha Saffron Pudding', 'Traditional Hyderabadi dessert made with fried bread soaked in thickened saffron cardamom milk.', 110.0, true, true, 'Desserts', 5, 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80', 3),
(11, 'Schezwan Hakka Veg Noodles', 'Classic wok noodles loaded with bell peppers, cabbage, scallions and fiery spices.', 189.0, true, true, 'Noodles', 12, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80', 4),
(12, 'Pan Fried Sizzling Chicken Dimsums (6 pcs)', 'Juicy chicken dumplings pan crisped to golden perfection served with hot chili dip.', 199.0, false, true, 'Dimsums', 14, 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&auto=format&fit=crop&q=80', 4),
(13, 'Avocado & Quinoa Power Bowl', 'Organic quinoa, diced Hass avocado, cherry tomatoes, cucumbers, feta and lemon tahini dressing.', 249.0, true, true, 'Bowls', 10, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80', 5),
(14, 'Paneer Tikka Diet Wrap', 'Whole wheat wrap stuffed with grilled cottage cheese, fresh greens and mint yogurt spread.', 189.0, true, true, 'Wraps', 10, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80', 5)
ON CONFLICT (id) DO NOTHING;
