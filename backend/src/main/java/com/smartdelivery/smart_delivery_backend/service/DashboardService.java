package com.smartdelivery.smart_delivery_backend.service;

import com.smartdelivery.smart_delivery_backend.dto.DashboardDto;
import com.smartdelivery.smart_delivery_backend.dto.TopSellingItemDto;
import com.smartdelivery.smart_delivery_backend.dto.MonthlyRevenueDto;

import com.smartdelivery.smart_delivery_backend.repository.UserRepository;
import com.smartdelivery.smart_delivery_backend.repository.RestaurantRepository;
import com.smartdelivery.smart_delivery_backend.repository.OrderRepository;
import com.smartdelivery.smart_delivery_backend.repository.DeliveryPartnerRepository;
import com.smartdelivery.smart_delivery_backend.repository.OrderItemRepository;
import com.smartdelivery.smart_delivery_backend.repository.ReviewRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final UserRepository userRepository;

    private final RestaurantRepository restaurantRepository;

    private final OrderRepository orderRepository;

    private final DeliveryPartnerRepository deliveryPartnerRepository;

    private final OrderItemRepository orderItemRepository;

    private final ReviewRepository reviewRepository;

    public DashboardService(
            UserRepository userRepository,
            RestaurantRepository restaurantRepository,
            OrderRepository orderRepository,
            DeliveryPartnerRepository deliveryPartnerRepository,
            OrderItemRepository orderItemRepository,
            ReviewRepository reviewRepository
    ) {
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.orderRepository = orderRepository;
        this.deliveryPartnerRepository = deliveryPartnerRepository;
        this.orderItemRepository = orderItemRepository;
        this.reviewRepository = reviewRepository;
    }

    public DashboardDto getDashboardStats() {

        DashboardDto dashboard = new DashboardDto();

        dashboard.setTotalUsers(
                userRepository.count()
        );

        dashboard.setTotalRestaurants(
                restaurantRepository.count()
        );

        dashboard.setTotalOrders(
                orderRepository.count()
        );

        dashboard.setTotalRevenue(
                orderRepository.getTotalRevenue()
        );

        dashboard.setPlacedOrders(
                orderRepository.countByOrderStatus("PLACED")
        );

        dashboard.setDeliveredOrders(
                orderRepository.countByOrderStatus("DELIVERED")
        );

        dashboard.setCancelledOrders(
                orderRepository.countByOrderStatus("CANCELLED")
        );

        dashboard.setTotalDeliveryPartners(
                deliveryPartnerRepository.count()
        );

        dashboard.setTotalReviews(
                reviewRepository.count()
        );

        return dashboard;
    }

    public List<MonthlyRevenueDto> getMonthlyRevenue() {

        return orderRepository.getMonthlyRevenue();
    }

    public List<TopSellingItemDto> getTopSellingItems() {

        return orderItemRepository.getTopSellingItems();
    }
}