package com.smartdelivery.smart_delivery_backend.controller;

import com.smartdelivery.smart_delivery_backend.entity.Review;

import com.smartdelivery.smart_delivery_backend.service.ReviewService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(
            ReviewService reviewService
    ) {
        this.reviewService = reviewService;
    }

    // Add Review
    @PostMapping("/{userId}/{restaurantId}")
    public Review addReview(
            @PathVariable Long userId,
            @PathVariable Long restaurantId,
            @RequestBody Review review
    ) {

        return reviewService.addReview(
                userId,
                restaurantId,
                review
        );
    }

    // Get Restaurant Reviews
    @GetMapping("/{restaurantId}")
    public List<Review> getRestaurantReviews(
            @PathVariable Long restaurantId
    ) {

        return reviewService.getRestaurantReviews(
                restaurantId
        );
    }
}