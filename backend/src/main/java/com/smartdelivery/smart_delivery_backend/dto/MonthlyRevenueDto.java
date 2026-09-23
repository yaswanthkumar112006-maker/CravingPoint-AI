package com.smartdelivery.smart_delivery_backend.dto;

public class MonthlyRevenueDto {

    private Integer month;

    private Double revenue;

    public MonthlyRevenueDto(
            Integer month,
            Double revenue
    ) {
        this.month = month;
        this.revenue = revenue;
    }

    public Integer getMonth() {
        return month;
    }

    public Double getRevenue() {
        return revenue;
    }
}