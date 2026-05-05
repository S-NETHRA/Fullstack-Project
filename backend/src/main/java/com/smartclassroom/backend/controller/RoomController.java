package com.smartclassroom.backend.controller;

import com.smartclassroom.backend.dto.RoomDtos.RoomRequest;
import com.smartclassroom.backend.dto.RoomDtos.RoomResponse;
import com.smartclassroom.backend.service.RoomService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public List<RoomResponse> findAll() {
        return roomService.findAll();
    }

    @PostMapping
    public RoomResponse create(@RequestBody RoomRequest request) {
        return roomService.create(request);
    }

    @PutMapping("/{id}/start-class")
    public RoomResponse startClass(
            @PathVariable Long id,
            @RequestParam(required = false) String facultyName,
            @RequestParam(required = false) String className) {
        return roomService.startClass(id, facultyName, className);
    }

    @PutMapping("/{id}/end-class")
    public RoomResponse endClass(@PathVariable Long id) {
        return roomService.endClass(id);
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        List<RoomResponse> rooms = roomService.findAll();
        long occupied = rooms.stream()
                .filter(room -> room.status() == com.smartclassroom.backend.entity.RoomStatus.OCCUPIED).count();
        long free = rooms.size() - occupied;
        double utilization = rooms.isEmpty() ? 0.0 : (occupied * 100.0 / rooms.size());
        return Map.of(
                "total", rooms.size(),
                "free", free,
                "occupied", occupied,
                "utilization", String.format(java.util.Locale.US, "%.1f", utilization));
    }
}