package com.smartclassroom.backend.controller;

import com.smartclassroom.backend.dto.AuthDtos.LoginRequest;
import com.smartclassroom.backend.dto.AuthDtos.RegisterRequest;
import com.smartclassroom.backend.dto.AuthDtos.UserResponse;
import com.smartclassroom.backend.service.AuthService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/logout")
    public Map<String, String> logout() {
        return Map.of("message", "Logged out");
    }
}