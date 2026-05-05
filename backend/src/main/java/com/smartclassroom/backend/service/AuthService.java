package com.smartclassroom.backend.service;

import com.smartclassroom.backend.dto.AuthDtos.LoginRequest;
import com.smartclassroom.backend.dto.AuthDtos.RegisterRequest;
import com.smartclassroom.backend.dto.AuthDtos.UserResponse;
import com.smartclassroom.backend.entity.Role;
import com.smartclassroom.backend.entity.User;
import com.smartclassroom.backend.exception.NotFoundException;
import com.smartclassroom.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse register(RegisterRequest request) {
        userRepository.findByUsername(request.username()).ifPresent(user -> {
            throw new IllegalArgumentException("Username already exists");
        });
        userRepository.findByEmail(request.email()).ifPresent(user -> {
            throw new IllegalArgumentException("Email already registered");
        });

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role() == null ? Role.STUDENT : request.role());

        User savedUser = userRepository.save(user);
        return toResponse(savedUser);
    }

    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (request.role() != null && user.getRole() != request.role()) {
            throw new IllegalArgumentException("Role does not match this account");
        }

        if (request.password() != null && !request.password().isBlank()) {
            if (!passwordEncoder.matches(request.password(), user.getPassword())) {
                throw new IllegalArgumentException("Invalid password");
            }
        }

        return toResponse(user);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole(), user.getCreatedAt());
    }
}