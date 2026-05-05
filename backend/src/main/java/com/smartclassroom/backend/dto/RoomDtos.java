package com.smartclassroom.backend.dto;

import com.smartclassroom.backend.entity.RoomStatus;
import java.util.List;

public class RoomDtos {

    public record RoomRequest(String roomNumber, String building, Integer floor, Integer capacity,
            List<String> equipment, String assignedTo, String currentClass, RoomStatus status) {
    }

    public record RoomResponse(Long id, String roomNumber, String building, Integer floor, Integer capacity,
            RoomStatus status, List<String> equipment, String assignedTo, String currentClass) {
    }
}