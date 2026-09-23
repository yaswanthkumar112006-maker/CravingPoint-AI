package com.smartdelivery.smart_delivery_backend.service;

import com.smartdelivery.smart_delivery_backend.entity.DeliveryPartner;
import com.smartdelivery.smart_delivery_backend.entity.OrderEntity;

import com.smartdelivery.smart_delivery_backend.repository.DeliveryPartnerRepository;
import com.smartdelivery.smart_delivery_backend.repository.OrderRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeliveryPartnerService {

    private final DeliveryPartnerRepository deliveryPartnerRepository;

    private final OrderRepository orderRepository;

    public DeliveryPartnerService(
            DeliveryPartnerRepository deliveryPartnerRepository,
            OrderRepository orderRepository
    ) {
        this.deliveryPartnerRepository = deliveryPartnerRepository;
        this.orderRepository = orderRepository;
    }

    // Add Delivery Partner
    public DeliveryPartner addPartner(
            DeliveryPartner partner
    ) {
        partner.setStatus("AVAILABLE");
        return deliveryPartnerRepository.save(partner);
    }
    public DeliveryPartner updatePartnerStatus(
            Long partnerId,
            String status
    ) {

        DeliveryPartner partner =
                deliveryPartnerRepository.findById(partnerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Partner not found"
                                )
                        );

        partner.setStatus(status);

        return deliveryPartnerRepository.save(partner);
    }
    // Get All Partners
    public List<DeliveryPartner> getAllPartners() {
        return deliveryPartnerRepository.findAll();
    }

    // Assign Partner To Order
    public OrderEntity assignPartner(
            Long orderId,
            Long partnerId
    ) {

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );

        DeliveryPartner partner =
                deliveryPartnerRepository.findById(partnerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Partner not found"
                                )
                        );

        order.setDeliveryPartner(partner);

        partner.setStatus("BUSY");

        deliveryPartnerRepository.save(partner);

        return orderRepository.save(order);
    }
}