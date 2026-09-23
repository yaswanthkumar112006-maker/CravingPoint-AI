package com.smartdelivery.smart_delivery_backend.service;

import com.smartdelivery.smart_delivery_backend.entity.MenuItem;
import com.smartdelivery.smart_delivery_backend.entity.Restaurant;

import com.smartdelivery.smart_delivery_backend.repository.MenuItemRepository;
import com.smartdelivery.smart_delivery_backend.repository.RestaurantRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;

    private final RestaurantRepository restaurantRepository;

    public MenuItemService(
            MenuItemRepository menuItemRepository,
            RestaurantRepository restaurantRepository
    ) {
        this.menuItemRepository = menuItemRepository;
        this.restaurantRepository = restaurantRepository;
    }

    // Add menu item to restaurant
    public MenuItem addMenuItem(
            Long restaurantId,
            MenuItem menuItem
    ) {

        Restaurant restaurant = restaurantRepository
                .findById(restaurantId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Restaurant not found"
                        )
                );

        menuItem.setRestaurant(restaurant);

        return menuItemRepository.save(menuItem);
    }

    // Get all menu items
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    // Get menu item by id
    public MenuItem getMenuItemById(Long id) {

        return menuItemRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Menu item not found"
                        )
                );
    }
    public List<MenuItem> getMenuItemsByRestaurant(
            Long restaurantId
    ) {

        return menuItemRepository
                .findByRestaurantId(restaurantId);
    }
    // Delete menu item
    public void deleteMenuItem(Long id) {
        menuItemRepository.deleteById(id);
    }
}