package com.smartdelivery.smart_delivery_backend.controller;

import com.smartdelivery.smart_delivery_backend.dto.DashboardDto;
import com.smartdelivery.smart_delivery_backend.dto.TopSellingItemDto;
import com.smartdelivery.smart_delivery_backend.dto.MonthlyRevenueDto;

import com.smartdelivery.smart_delivery_backend.service.DashboardService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService
    ) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardDto getDashboardStats() {

        return dashboardService.getDashboardStats();
    }

    @GetMapping("/top-items")
    public List<TopSellingItemDto> getTopSellingItems() {

        return dashboardService.getTopSellingItems();
    }

    @GetMapping("/monthly-revenue")
    public List<MonthlyRevenueDto> getMonthlyRevenue() {

        return dashboardService.getMonthlyRevenue();
    }
}