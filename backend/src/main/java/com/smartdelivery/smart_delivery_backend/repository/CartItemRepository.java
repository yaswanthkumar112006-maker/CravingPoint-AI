package com.smartdelivery.smart_delivery_backend.repository;

import com.smartdelivery.smart_delivery_backend.entity.CartItem;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository
        extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserId(Long userId);
    CartItem findByUserIdAndMenuItemId(
            Long userId,
            Long menuItemId
    );
}