package com.smartdelivery.smart_delivery_backend.service;

import com.smartdelivery.smart_delivery_backend.dto.ApiResponseDto;
import com.smartdelivery.smart_delivery_backend.dto.LoginRequestDto;
import com.smartdelivery.smart_delivery_backend.dto.UserRequestDto;
import com.smartdelivery.smart_delivery_backend.entity.User;
import com.smartdelivery.smart_delivery_backend.exception.UserAlreadyExistsException;
import com.smartdelivery.smart_delivery_backend.repository.UserRepository;
import com.smartdelivery.smart_delivery_backend.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    public UserService(UserRepository userRepository,
                       BCryptPasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }
    public User saveUser(UserRequestDto userRequestDto) {

        if (userRepository.findByEmail(userRequestDto.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        User user = new User();

        user.setFullName(userRequestDto.getFullName());
        user.setEmail(userRequestDto.getEmail());

        // Password hashing
        user.setPassword(
                passwordEncoder.encode(userRequestDto.getPassword())

        );

        user.setPhoneNumber(userRequestDto.getPhoneNumber());

        return userRepository.save(user);
    }

    public ApiResponseDto loginUser(LoginRequestDto loginRequestDto) {

        User user = userRepository.findByEmail(loginRequestDto.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        // Compare raw password with hashed password
        if (!passwordEncoder.matches(
                loginRequestDto.getPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException("Invalid email or password");
        }
        String token = jwtUtil.generateToken(user.getEmail());
        return new ApiResponseDto(
                "Login successful",
                token
        );
    }
    }
