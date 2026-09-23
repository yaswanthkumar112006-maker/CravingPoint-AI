package com.smartdelivery.smart_delivery_backend.repository;

import com.smartdelivery.smart_delivery_backend.entity.Review;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository
        extends JpaRepository<Review, Long> {

    List<Review> findByRestaurantId(
            Long restaurantId
    );
}
