package com.smartclassroom.backend.dto;

import com.smartclassroom.backend.entity.BookingStatus;
import java.time.LocalDateTime;

public class BookingDtos {

    public record BookingRequest(Long roomId, String roomNumber, String building, String studentName, String studentId,
            String purpose, LocalDateTime startTime, LocalDateTime endTime) {
    }

    public record BookingStatusRequest(String approverName, String rejectionReason) {
    }

    public record BookingResponse(Long id, Long roomId, String roomNumber, String building, String studentName,
            String studentId, String purpose, LocalDateTime startTime, LocalDateTime endTime, BookingStatus status,
            LocalDateTime requestedAt, String approvedBy, String rejectedBy, String rejectionReason) {
    }
}