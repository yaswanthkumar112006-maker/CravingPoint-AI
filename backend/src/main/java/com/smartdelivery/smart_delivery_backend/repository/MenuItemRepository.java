package com.smartdelivery.smart_delivery_backend.repository;
import java.util.List;
import com.smartdelivery.smart_delivery_backend.entity.MenuItem;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuItemRepository
        extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByRestaurantId(Long restaurantId);
}