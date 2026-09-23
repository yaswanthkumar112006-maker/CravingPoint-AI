package com.smartdelivery.smart_delivery_backend.controller;

import com.smartdelivery.smart_delivery_backend.dto.ApiResponseDto;
import com.smartdelivery.smart_delivery_backend.dto.LoginRequestDto;
import com.smartdelivery.smart_delivery_backend.dto.UserRequestDto;
import com.smartdelivery.smart_delivery_backend.entity.User;
import com.smartdelivery.smart_delivery_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ApiResponseDto login(@Valid @RequestBody LoginRequestDto loginRequestDto) {
        return userService.loginUser(loginRequestDto);
    }

    @PostMapping("/register")
    public User register(@Valid @RequestBody UserRequestDto userRequestDto) {
        return userService.saveUser(userRequestDto);
    }
}
