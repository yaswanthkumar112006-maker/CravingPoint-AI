package com.smartdelivery.smart_delivery_backend.repository;
import org.springframework.data.jpa.repository.Query;
import com.smartdelivery.smart_delivery_backend.entity.OrderEntity;
import java.util.List;
import com.smartdelivery.smart_delivery_backend.dto.MonthlyRevenueDto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository
        extends JpaRepository<OrderEntity, Long> {
    long countByOrderStatus(String orderStatus);
    List<OrderEntity> findByUserId(Long userId);
    List<OrderEntity> findByOrderStatus(
            String orderStatus
    );
    @Query("""
       SELECT COALESCE(SUM(o.totalAmount),0)
       FROM OrderEntity o
       WHERE o.paymentStatus = 'PAID'
       """)
    Double getTotalRevenue();
    @Query("""
       SELECT new com.smartdelivery.smart_delivery_backend.dto.MonthlyRevenueDto(
              MONTH(o.orderTime),
              SUM(o.totalAmount)
       )
       FROM OrderEntity o
       WHERE o.paymentStatus = 'PAID'
       GROUP BY MONTH(o.orderTime)
       ORDER BY MONTH(o.orderTime)
       """)
    List<MonthlyRevenueDto> getMonthlyRevenue();
}