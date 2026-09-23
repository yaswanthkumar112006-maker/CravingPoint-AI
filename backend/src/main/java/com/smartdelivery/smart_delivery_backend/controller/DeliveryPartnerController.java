package com.smartdelivery.smart_delivery_backend.controller;

import com.smartdelivery.smart_delivery_backend.entity.DeliveryPartner;
import com.smartdelivery.smart_delivery_backend.entity.OrderEntity;

import com.smartdelivery.smart_delivery_backend.service.DeliveryPartnerService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryPartnerController {

    private final DeliveryPartnerService deliveryPartnerService;

    public DeliveryPartnerController(
            DeliveryPartnerService deliveryPartnerService
    ) {
        this.deliveryPartnerService = deliveryPartnerService;
    }

    // Add Delivery Partner
    @PostMapping
    public DeliveryPartner addPartner(
            @RequestBody DeliveryPartner partner
    ) {

        return deliveryPartnerService.addPartner(
                partner
        );
    }

    // Get All Delivery Partners
    @GetMapping
    public List<DeliveryPartner> getAllPartners() {

        return deliveryPartnerService.getAllPartners();
    }
    @PutMapping("/{partnerId}/{status}")
    public DeliveryPartner updatePartnerStatus(
            @PathVariable Long partnerId,
            @PathVariable String status
    ) {

        return deliveryPartnerService
                .updatePartnerStatus(
                        partnerId,
                        status
                );
    }
    // Assign Partner To Order
    @PutMapping("/assign/{orderId}/{partnerId}")
    public OrderEntity assignPartner(
            @PathVariable Long orderId,
            @PathVariable Long partnerId
    ) {

        return deliveryPartnerService.assignPartner(
                orderId,
                partnerId
        );
    }
}