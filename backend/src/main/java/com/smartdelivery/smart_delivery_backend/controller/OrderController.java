package com.smartdelivery.smart_delivery_backend.controller;

import com.smartdelivery.smart_delivery_backend.entity.OrderEntity;

import com.smartdelivery.smart_delivery_backend.service.OrderService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(
            OrderService orderService
    ) {
        this.orderService = orderService;
    }@GetMapping("/status/{status}")
    public List<OrderEntity> getOrdersByStatus(
            @PathVariable String status
    ) {

        return orderService.getOrdersByStatus(
                status
        );
    }
    @PutMapping("/{orderId}/{status}")
    public OrderEntity updateOrderStatus(
            @PathVariable Long orderId,
            @PathVariable String status
    ) {

        return orderService.updateOrderStatus(
                orderId,
                status
        );
    }@PutMapping("/payment/{orderId}/{paymentStatus}")
    public OrderEntity updatePaymentStatus(
            @PathVariable Long orderId,
            @PathVariable String paymentStatus
    ) {

        return orderService.updatePaymentStatus(
                orderId,
                paymentStatus
        );
    }@PutMapping("/cancel/{orderId}")
    public OrderEntity cancelOrder(
            @PathVariable Long orderId
    ) {

        return orderService.cancelOrder(
                orderId
        );
    }
    // Place Order
    @PostMapping("/{userId}")
    public OrderEntity placeOrder(
            @PathVariable Long userId
    ) {

        return orderService.placeOrder(userId);
    }

    // Get User Orders
    @GetMapping("/{userId}")
    public List<OrderEntity> getUserOrders(
            @PathVariable Long userId
    ) {

        return orderService.getUserOrders(userId);
    }
}