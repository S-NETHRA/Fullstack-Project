package com.smartclassroom.backend.dto;

import com.smartclassroom.backend.entity.Role;
import java.time.LocalDateTime;

public class AuthDtos {

    public record RegisterRequest(String username, String email, String password, Role role) {
    }

    public record LoginRequest(String username, String password, Role role) {
    }

    public record UserResponse(Long id, String username, String email, Role role, LocalDateTime createdAt) {
    }
}