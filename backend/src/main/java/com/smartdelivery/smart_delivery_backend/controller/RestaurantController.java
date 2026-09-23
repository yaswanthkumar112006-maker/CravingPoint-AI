package com.smartdelivery.smart_delivery_backend.controller;

import com.smartdelivery.smart_delivery_backend.entity.Restaurant;
import com.smartdelivery.smart_delivery_backend.service.RestaurantService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(
            RestaurantService restaurantService
    ) {
        this.restaurantService = restaurantService;
    }

    // Add restaurant
    @PostMapping
    public Restaurant addRestaurant(
            @RequestBody Restaurant restaurant
    ) {
        return restaurantService.addRestaurant(
                restaurant
        );
    }

    // Get all restaurants
    @GetMapping
    public List<Restaurant> getAllRestaurants() {

        return restaurantService.getAllRestaurants();
    }

    // Get restaurant by id
    @GetMapping("/{id}")
    public Restaurant getRestaurantById(
            @PathVariable Long id
    ) {
        return restaurantService
                .getRestaurantById(id);
    }
    // Update restaurant
    @PutMapping("/{id}")
    public Restaurant updateRestaurant(
            @PathVariable Long id,
            @RequestBody Restaurant restaurant
    ) {

        return restaurantService.updateRestaurant(
                id,
                restaurant
        );
    }
    // Delete restaurant
    @DeleteMapping("/{id}")
    public String deleteRestaurant(
            @PathVariable Long id
    ) {

        restaurantService.deleteRestaurant(id);

        return "Restaurant deleted successfully";
    }
}