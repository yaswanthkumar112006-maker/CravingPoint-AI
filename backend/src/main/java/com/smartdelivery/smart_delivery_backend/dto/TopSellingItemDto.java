package com.smartdelivery.smart_delivery_backend.dto;

public class TopSellingItemDto {

    private String itemName;

    private Long totalQuantity;

    public TopSellingItemDto(
            String itemName,
            Long totalQuantity
    ) {
        this.itemName = itemName;
        this.totalQuantity = totalQuantity;
    }

    public String getItemName() {
        return itemName;
    }

    public Long getTotalQuantity() {
        return totalQuantity;
    }
}