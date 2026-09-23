package com.smartdelivery.smart_delivery_backend.repository;

import com.smartdelivery.smart_delivery_backend.entity.DeliveryPartner;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryPartnerRepository
        extends JpaRepository<DeliveryPartner, Long> {
}