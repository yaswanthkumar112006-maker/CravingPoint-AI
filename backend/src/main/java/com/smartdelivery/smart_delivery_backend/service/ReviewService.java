package com.smartdelivery.smart_delivery_backend.service;

import com.smartdelivery.smart_delivery_backend.entity.Review;
import com.smartdelivery.smart_delivery_backend.entity.Restaurant;
import com.smartdelivery.smart_delivery_backend.entity.User;

import com.smartdelivery.smart_delivery_backend.repository.ReviewRepository;
import com.smartdelivery.smart_delivery_backend.repository.RestaurantRepository;
import com.smartdelivery.smart_delivery_backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    private final UserRepository userRepository;

    private final RestaurantRepository restaurantRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            UserRepository userRepository,
            RestaurantRepository restaurantRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
    }

    public Review addReview(
            Long userId,
            Long restaurantId,
            Review review
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        Restaurant restaurant =
                restaurantRepository.findById(restaurantId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Restaurant not found"
                                )
                        );

        review.setUser(user);
        review.setRestaurant(restaurant);

        return reviewRepository.save(review);
    }

    public List<Review> getRestaurantReviews(
            Long restaurantId
    ) {

        return reviewRepository.findByRestaurantId(
                restaurantId
        );
    }
}