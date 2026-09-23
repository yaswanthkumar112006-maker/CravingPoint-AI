package com.smartdelivery.smart_delivery_backend.repository;

import com.smartdelivery.smart_delivery_backend.entity.Restaurant;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantRepository
        extends JpaRepository<Restaurant, Long> {

}