package com.smartdelivery.smart_delivery_backend.dto;

public class DashboardDto {
    private Double totalRevenue;
    private Long totalUsers;
    private Long placedOrders;
    private Long deliveredOrders;
    private Long cancelledOrders;
    private Long totalRestaurants;
    private Long totalReviews;
    private Long totalOrders;

    private Long totalDeliveryPartners;

    public DashboardDto() {
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalRestaurants() {
        return totalRestaurants;
    }

    public void setTotalRestaurants(Long totalRestaurants) {
        this.totalRestaurants = totalRestaurants;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Long getTotalDeliveryPartners() {
        return totalDeliveryPartners;
    }
    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
    public void setTotalDeliveryPartners(Long totalDeliveryPartners) {
        this.totalDeliveryPartners = totalDeliveryPartners;
    }public Long getPlacedOrders() {
        return placedOrders;
    }
    public Long getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(Long totalReviews) {
        this.totalReviews = totalReviews;
    }

    public void setPlacedOrders(Long placedOrders) {
        this.placedOrders = placedOrders;
    }

    public Long getDeliveredOrders() {
        return deliveredOrders;
    }

    public void setDeliveredOrders(Long deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }

    public Long getCancelledOrders() {
        return cancelledOrders;
    }

    public void setCancelledOrders(Long cancelledOrders) {
        this.cancelledOrders = cancelledOrders;
    }
}