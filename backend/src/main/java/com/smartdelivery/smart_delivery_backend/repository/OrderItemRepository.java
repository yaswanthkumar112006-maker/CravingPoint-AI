package com.smartdelivery.smart_delivery_backend.repository;

import com.smartdelivery.smart_delivery_backend.entity.OrderItem;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import com.smartdelivery.smart_delivery_backend.dto.TopSellingItemDto;
import java.util.List;

public interface OrderItemRepository
        extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);
    @Query("""
       SELECT new com.smartdelivery.smart_delivery_backend.dto.TopSellingItemDto(
              oi.menuItem.itemName,
              SUM(oi.quantity)
       )
       FROM OrderItem oi
       GROUP BY oi.menuItem.itemName
       ORDER BY SUM(oi.quantity) DESC
       """)
    List<TopSellingItemDto> getTopSellingItems();
}