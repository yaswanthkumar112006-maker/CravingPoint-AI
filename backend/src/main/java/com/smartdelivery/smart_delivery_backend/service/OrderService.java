package com.smartdelivery.smart_delivery_backend.service;

import com.smartdelivery.smart_delivery_backend.entity.CartItem;
import com.smartdelivery.smart_delivery_backend.entity.OrderEntity;
import com.smartdelivery.smart_delivery_backend.entity.OrderItem;
import com.smartdelivery.smart_delivery_backend.entity.User;

import com.smartdelivery.smart_delivery_backend.repository.CartItemRepository;
import com.smartdelivery.smart_delivery_backend.repository.OrderItemRepository;
import com.smartdelivery.smart_delivery_backend.repository.OrderRepository;
import com.smartdelivery.smart_delivery_backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    private final OrderItemRepository orderItemRepository;

    private final CartItemRepository cartItemRepository;

    private final UserRepository userRepository;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartItemRepository cartItemRepository,
            UserRepository userRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
    }
    public OrderEntity updateOrderStatus(
            Long orderId,
            String status
    ) {

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );

        order.setOrderStatus(status);

        // If order delivered, free the delivery partner
        if (status.equals("DELIVERED")
                && order.getDeliveryPartner() != null) {

            order.getDeliveryPartner()
                    .setStatus("AVAILABLE");
        }

        return orderRepository.save(order);
    }public List<OrderEntity> getOrdersByStatus(
            String status
    ) {

        return orderRepository.findByOrderStatus(
                status
        );
    }
    // Place Order
    public OrderEntity placeOrder(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        List<CartItem> cartItems =
                cartItemRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException(
                    "Cart is empty"
            );
        }

        double totalAmount = 0.0;

        for (CartItem cartItem : cartItems) {

            totalAmount +=
                    cartItem.getMenuItem().getPrice()
                            * cartItem.getQuantity();
        }

        OrderEntity order = new OrderEntity();

        order.setUser(user);

        order.setTotalAmount(totalAmount);

        order.setOrderStatus("PLACED");

        order.setPaymentStatus("PENDING");

        order.setOrderTime(LocalDateTime.now());

        OrderEntity savedOrder =
                orderRepository.save(order);

        for (CartItem cartItem : cartItems) {

            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(savedOrder);

            orderItem.setMenuItem(
                    cartItem.getMenuItem()
            );

            orderItem.setQuantity(
                    cartItem.getQuantity()
            );

            orderItem.setPrice(
                    cartItem.getMenuItem().getPrice()
            );

            orderItemRepository.save(orderItem);
        }

        // Clear cart after placing order
        cartItemRepository.deleteAll(cartItems);

        return savedOrder;
    }public OrderEntity updatePaymentStatus(
            Long orderId,
            String paymentStatus
    ) {

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );

        order.setPaymentStatus(paymentStatus);

        return orderRepository.save(order);
    }public OrderEntity cancelOrder(
            Long orderId
    ) {

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );

        order.setOrderStatus("CANCELLED");

        return orderRepository.save(order);
    }

    // Get user orders
    public List<OrderEntity> getUserOrders(
            Long userId
    ) {

        return orderRepository.findByUserId(userId);
    }
}