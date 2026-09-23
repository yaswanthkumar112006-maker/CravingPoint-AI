package com.smartdelivery.smart_delivery_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiResponseDto {

    private String message;
    private String token;
}