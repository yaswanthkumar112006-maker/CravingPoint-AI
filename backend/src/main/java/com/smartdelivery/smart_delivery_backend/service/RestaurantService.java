package com.smartdelivery.smart_delivery_backend.service;

import com.smartdelivery.smart_delivery_backend.entity.Restaurant;
import com.smartdelivery.smart_delivery_backend.repository.RestaurantRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public RestaurantService(
            RestaurantRepository restaurantRepository
    ) {
        this.restaurantRepository = restaurantRepository;
    }

    // Add restaurant
    public Restaurant addRestaurant(
            Restaurant restaurant
    ) {
        return restaurantRepository.save(restaurant);
    }

    // Get all restaurants
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    // Get restaurant by id
    public Restaurant getRestaurantById(Long id) {

        return restaurantRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Restaurant not found"
                        )
                );
    }

    // Delete restaurant
    public void deleteRestaurant(Long id) {
        restaurantRepository.deleteById(id);
    }

    // Update restaurant
    public Restaurant updateRestaurant(
            Long id,
            Restaurant updatedRestaurant
    ) {

        Restaurant restaurant = restaurantRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Restaurant not found"
                        )
                );

        restaurant.setName(updatedRestaurant.getName());
        restaurant.setDescription(updatedRestaurant.getDescription());
        restaurant.setCuisineType(updatedRestaurant.getCuisineType());
        restaurant.setPhoneNumber(updatedRestaurant.getPhoneNumber());
        restaurant.setEmail(updatedRestaurant.getEmail());
        restaurant.setAddress(updatedRestaurant.getAddress());
        restaurant.setCity(updatedRestaurant.getCity());
        restaurant.setState(updatedRestaurant.getState());
        restaurant.setPincode(updatedRestaurant.getPincode());
        restaurant.setLatitude(updatedRestaurant.getLatitude());
        restaurant.setLongitude(updatedRestaurant.getLongitude());
        restaurant.setRating(updatedRestaurant.getRating());
        restaurant.setTotalReviews(updatedRestaurant.getTotalReviews());
        restaurant.setDeliveryTime(updatedRestaurant.getDeliveryTime());
        restaurant.setDeliveryFee(updatedRestaurant.getDeliveryFee());
        restaurant.setMinimumOrderAmount(updatedRestaurant.getMinimumOrderAmount());
        restaurant.setIsOpen(updatedRestaurant.getIsOpen());
        restaurant.setIsActive(updatedRestaurant.getIsActive());
        restaurant.setImageUrl(updatedRestaurant.getImageUrl());

        return restaurantRepository.save(restaurant);
    }
}