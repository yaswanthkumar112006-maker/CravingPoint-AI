package com.smartdelivery.smart_delivery_backend.controller;

import com.smartdelivery.smart_delivery_backend.entity.MenuItem;

import com.smartdelivery.smart_delivery_backend.service.MenuItemService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-items")
public class MenuItemController {

    private final MenuItemService menuItemService;

    public MenuItemController(
            MenuItemService menuItemService
    ) {
        this.menuItemService = menuItemService;
    }

    // Add menu item to restaurant
    @PostMapping("/{restaurantId}")
    public MenuItem addMenuItem(
            @PathVariable Long restaurantId,
            @RequestBody MenuItem menuItem
    ) {

        return menuItemService.addMenuItem(
                restaurantId,
                menuItem
        );
    }

    // Get all menu items
    @GetMapping
    public List<MenuItem> getAllMenuItems() {

        return menuItemService.getAllMenuItems();
    }

    // Get menu item by id
    @GetMapping("/{id}")
    public MenuItem getMenuItemById(
            @PathVariable Long id
    ) {

        return menuItemService.getMenuItemById(id);
    }
    @GetMapping("/restaurant/{restaurantId}")
    public List<MenuItem> getMenuItemsByRestaurant(
            @PathVariable Long restaurantId
    ) {

        return menuItemService
                .getMenuItemsByRestaurant(restaurantId);
    }
    // Delete menu item
    @DeleteMapping("/{id}")
    public String deleteMenuItem(
            @PathVariable Long id
    ) {

        menuItemService.deleteMenuItem(id);

        return "Menu item deleted successfully";
    }
}